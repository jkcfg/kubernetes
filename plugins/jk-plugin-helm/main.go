package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"

	"github.com/pkg/errors"

	"github.com/hashicorp/go-hclog"
	"github.com/hashicorp/go-plugin"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chartutil"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/kube/fake"
	"helm.sh/helm/v3/pkg/releaseutil"
	"helm.sh/helm/v3/pkg/storage"
	"helm.sh/helm/v3/pkg/storage/driver"

	"sigs.k8s.io/yaml"

	"github.com/jkcfg/jk/pkg/plugin/renderer"
)

var log hclog.Logger = hclog.New(&hclog.LoggerOptions{
	Level:  hclog.Debug,
	Output: os.Stderr,
})

func debug(format string, v ...interface{}) {
	log.Debug(fmt.Sprintf(format, v...))
}

// Helm renders helm charts.
type Helm struct {
}

var settings = cli.New()

// Input is the input parameters given to the plugin.
type Input struct {
	Release struct {
		Name      string `json:"name"`
		Namespace string `json:"namespace"`
	} `json:"release"`
	Chart  string                 `json:"chart"`
	Values map[string]interface{} `json:"values"`
}

// OutputFile is one file in the render output.
type OutputFile struct {
	Source string                 `json:"source"`
	Object map[string]interface{} `json:"object"`
}

// Output is the output of the render function.
type Output struct {
	Files []OutputFile `json:"files"`
}

func (i *Input) validate() error {
	if i.Chart == "" {
		return errors.New("missing chart name: provide 'chart' input parameter")
	}

	if i.Release.Name == "" {
		return errors.New("missing release name: provide a 'release.name' input parameter")
	}

	if i.Release.Namespace == "" {
		i.Release.Namespace = "default"
	}

	return nil
}

// Render implements renderer.Renderer.
func (h *Helm) Render(input []byte) ([]byte, error) {
	var params Input
	if err := json.Unmarshal(input, &params); err != nil {
		return nil, errors.New("unable to unmarshal input parameters")
	}
	if err := params.validate(); err != nil {
		return nil, err
	}

	cfg := action.Configuration{
		Releases:     storage.Init(driver.NewMemory()),
		KubeClient:   &fake.PrintingKubeClient{Out: ioutil.Discard},
		Capabilities: chartutil.DefaultCapabilities,
		Log:          func(format string, v ...interface{}) {},
	}

	client := action.NewInstall(&cfg)
	rel, err := runInstall(client, &params, os.Stdout)
	if err != nil {
		return nil, err
	}

	// Prepare the Output.
	splitManifests := releaseutil.SplitManifests(rel.Manifest)
	manifestNameRegex := regexp.MustCompile("# Source: [^/]+/(.+)")
	var output Output
	for _, manifest := range splitManifests {
		var file OutputFile

		// Retrieve the manifest name.
		submatch := manifestNameRegex.FindStringSubmatch(manifest)
		if len(submatch) != 0 {
			file.Source = submatch[1]
		}

		if err := yaml.Unmarshal([]byte(manifest), &file.Object); err != nil {
			return nil, errors.Wrapf(err, "unable to parse YAML ('%s')", file.Source)
		}

		output.Files = append(output.Files, file)
	}

	data, err := json.Marshal(output)
	if err != nil {
		return nil, errors.Wrap(err, "unable to serialize output")
	}

	return data, nil
}

func main() {
	r := &Helm{}

	// pluginMap is the map of plugins we can dispense.
	var pluginMap = map[string]plugin.Plugin{
		"renderer": &renderer.Plugin{Impl: r},
	}

	plugin.Serve(&plugin.ServeConfig{
		HandshakeConfig: renderer.RendererV1,
		Plugins:         pluginMap,
	})
}
