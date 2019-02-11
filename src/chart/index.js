import std from '@jkcfg/std';
import { writeStream } from '../write';
import { values } from './values';

const writeString = s => std.write(s, '');
const writeYAML = s => std.write(s, '', { format: std.Format.YAML });
const output = writeStream(writeString, writeYAML);

function chart(resourcesFn, defaults, param) {
  const vals = values(param);
  const resources = resourcesFn(vals(defaults));
  // lift a value into a Promise if necessary
  Promise.resolve(resources).then(output);
}

export { chart };
