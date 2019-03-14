import handlebars from 'handlebars/lib/handlebars.js';
import std from '@jkcfg/std';

const isTemplateFile = info => (!info.isDir && info.name.endsWith('.yaml'));

// read x filename -> Promise (values -> resource)
async function loadTemplate(read, { path }) {
  const file = await read(path, { encoding: std.Encoding.String });
  const template = handlebars.compile(file);
  return values => template({ values });
}

// { read, dir } -> values -> Promise [resource]
const load = ({ read, dir }) => async function resources(values) {
  const d = dir('templates');
  const loadTempl = path => loadTemplate(read, path);
  const templates = await Promise.all(d.files.filter(isTemplateFile).map(loadTempl));
  return templates.map(t => t(values));
}

export { load };
