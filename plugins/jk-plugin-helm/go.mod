module github.com/jkcfg/kubernetes/plugins/jk-plugin-helm

go 1.12

require (
	github.com/hashicorp/go-hclog v0.10.0
	github.com/hashicorp/go-plugin v1.0.1
	github.com/jkcfg/jk v0.0.0-00010101000000-000000000000
	github.com/pkg/errors v0.8.1
	helm.sh/helm/v3 v3.0.0
	sigs.k8s.io/yaml v1.1.0
)

replace (
	github.com/docker/docker => github.com/moby/moby v0.7.3-0.20190826074503-38ab9da00309
	github.com/jkcfg/jk => ../../../jk
	k8s.io/client-go => k8s.io/client-go v0.0.0-20191016111102-bec269661e48

)
