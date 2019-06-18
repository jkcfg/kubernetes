// Example of a Helm chart analogue, using handlebars

import { chart, loadModuleTemplates } from '@jkcfg/kubernetes/chart';
import { writeYAMLStream } from '@jkcfg/kubernetes/write';
import * as resource from '@jkcfg/std/resource';
import std from '@jkcfg/std';
import handlebars from 'handlebars/lib/handlebars';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1'
  }
};

const templates = loadModuleTemplates(handlebars.compile, resource);

// Because we get strings out of the templates, rather than objects,
// we don't need to serialise them; so, use writeYAMLStream, which we
// can specialise so that it just splats strings to stdout.
const output = writeYAMLStream(std.log, std.log);

chart(templates, defaults, std.param).then(output);
