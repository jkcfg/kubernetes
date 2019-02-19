// Example of a Helm chart analogue, using handlebars

import handlebars from 'handlebars/lib/handlebars.js';
import { chart } from '@jkcfg/kubernetes/chart';
import std from '@jkcfg/std';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1'
  }
};

const isTemplateFile = info => (!info.isDir && info.name.endsWith('.yaml'));

// filename -> Promise (values -> resource)
async function loadTemplate({ path }) {
  const file = await std.read(path, { encoding: std.Encoding.String });
  const template = handlebars.compile(file);
  return values => template({ values });
}

async function resources(values) /* Promise [resource] */ {
  const dir = std.dir('templates');
  const templates = await Promise.all(dir.files.filter(isTemplateFile).map(loadTemplate));
  return templates.map(t => t(values));
}

chart(resources, defaults, std.param);
