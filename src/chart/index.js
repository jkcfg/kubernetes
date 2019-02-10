import std from '@jkcfg/std';
import { writeResources } from '../write';

function chart(resourcesFn, defaults, param) {
  const values = defaults;
  const resources = Promise.resolve(resourcesFn(values));
  resources.then(writeResources(std.write));
}

export { chart };
