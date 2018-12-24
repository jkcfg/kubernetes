import { dataFromFiles } from './data';
import { ConfigMap } from '../kubernetes';

const generateConfigMap = readStr => async function generate(config) {
  const {
    name,
    files = [],
    literals = [],
  } = config;

  const data = {};
  literals.forEach((s) => {
    const [k, v] = s.split('=');
    data[k] = v;
  });
  const fileContents = dataFromFiles(readStr, files);
  return fileContents.then((d) => {
    d.forEach((v, k) => {
      data[k] = v
    });
    return new ConfigMap(undefined, name, data);
  });
};

export { generateConfigMap };
