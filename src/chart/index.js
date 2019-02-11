import std from '@jkcfg/std';
import { writeStream } from '../write';
import { values } from './values';

const readValues = f => std.read(f, std.Encoding.JSON);
const writeString = s => std.write(s, '');
const writeYAML = s => std.write(s, '', { format: std.Format.YAML });
const output = writeStream(writeString, writeYAML);

function chart(resourcesFn, defaults, param) {
  const vals = values(param, readValues);
  const resources = vals(defaults).then(resourcesFn);
  resources.then(output);
}

export { chart };
