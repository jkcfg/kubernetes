import { values } from './values';

function chart(resourcesFn, defaults, param) {
  // lift defaults into Promise, since it may or may not be one
  const vals = Promise.resolve(defaults).then(values(param));
  return vals.then(resourcesFn);
}

export { chart };
