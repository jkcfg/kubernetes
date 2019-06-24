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

chart(templates, defaults, std.param).then(val => std.log(val, { format: std.Format.YAMLStream }));
