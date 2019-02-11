import { patch } from '@jkcfg/mixins/src/mixins';

function mergePath(values, path, value) {
  const pathElems = path.split('.');
  let obj = values;
  for (const elem of pathElems.slice(0, pathElems.length - 1)) {
    if (!Object.hasOwnProperty.call(obj, elem)) {
      obj[elem] = {};
    }
    obj = obj[elem];
  }
  obj[pathElems[pathElems.length - 1]] = value;
}

function parseCommandLine(str) {
  const vals = {};
  if (str === '') {
    return vals;
  }

  const terms = str.split(',');
  for (const term of terms) {
    const [path, value] = term.split('=');
    mergePath(vals, path, value);
  }
  return vals;
}

// Given a means of getting parameters, and a specification of the
// Values (including their defaults), compile a struct of values for
// instantiating a chart.
const values = (param, readValues) => async function compile(defaults) {
  let vals = defaults;
  const file = param.String('file', undefined);
  if (file !== undefined) {
    const fileValues = await readValues(file);
    vals = patch(vals, fileValues);
  }
  const commandLine = parseCommandLine(param.String('value', ''));
  vals = patch(vals, commandLine);
  return vals;
};

export { values };
