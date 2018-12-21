const obj = (name, value) => {
  const o = {};
  o[name] = value;
  return o;
};

// Given `dir` and `read` procedures, construct a map of filename to
// file contents (as strings).
const dataFromDir = ({ dir, read, Encoding }) => async function data(path) {
  const d = dir(path);
  const files = d.files.filter(({ isdir }) => !isdir);
  const data0 = files.map(
    ({ name }) => read(`${path}/${name}`, { encoding: Encoding.String })
      .then(str => obj(name, str)),
  );
  const data1 = await Promise.all(data0);
  return data1.reduce((a, b) => Object.assign(a, b), {});
};

export default dataFromDir;
