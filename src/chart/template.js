import handlebars from 'handlebars/lib/handlebars';

const isTemplateFile = info => (!info.isDir && info.name.endsWith('.yaml'));

// readString x filename -> Promise (values -> resource)
async function loadTemplate(readString, path) {
  const file = await readString(path);
  const template = handlebars.compile(file);
  return values => template({ values });
}

// { readString, dir } -> values -> Promise [string]
const load = ({ readString, dir }) => async function resources(values) {
  const d = dir('templates');
  const loadTempl = info => loadTemplate(readString, info.path);
  const templates = await Promise.all(d.files.filter(isTemplateFile).map(loadTempl));
  return templates.map(t => t(values));
};

export { load };
