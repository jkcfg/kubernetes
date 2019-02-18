import std from '@jkcfg/std';
import { writeStream } from '../write';
import { values } from './values';

const printString = s => std.write(s, '');
const printYAML = s => std.write(s, '', { format: std.Format.YAML });

function printValue(val) {
  switch (typeof val) {
  case 'string':
    return printString(val);
  case 'object':
  default:
    return printYAML(val);
  }
}

const output = writeStream(printString, printValue);

function chart(resourcesFn, defaults, param) {
  // lift defaults into Promise, since it may or may not be one
  const vals = Promise.resolve(defaults).then(values(param));
  const resources = vals.then(resourcesFn);
  resources.then(output);
}

export { chart };
