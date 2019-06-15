const isTemplateFile = info => (!info.isDir && info.name.endsWith('.yaml'));

// { readString, compile } -> filename -> Promise (values -> resource)
const loadTemplate = ({ readString, compile }) => async function load(path) {
  const file = await readString(path);
  const template = compile(file);
  return values => template({ values });
};

// { readString, compile, dir } -> values -> Promise [string]
const loadDir = ({ readString, compile, dir }) => async function templates(values) {
  const load = loadTemplate({ readString, compile });
  const d = dir('templates');
  const loadTempl = info => load(info.path);
  const allTempl = await Promise.all(d.files.filter(isTemplateFile).map(loadTempl));
  return allTempl.map(t => t(values));
};

export { loadDir, loadTemplate };
