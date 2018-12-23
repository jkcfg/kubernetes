import { dataFromFiles, dataFromDir } from '../src/cons/data';

const foo = `---
conf:
  config1: 1
  config2: 2
`;

const bar = `---
stuff:
  - 1
  - 2
  - 3
`;

import { fs, Encoding } from './mock';

const { dir, read } = fs({
  'config': {
    files: [
      {name: 'foo.yaml', isdir: false},
      {name: 'bar.yaml', isdir: false},
      {name: 'baz', isdir: true}
    ]
  },
}, {
  'config/foo.yaml': { string: foo },
  'config/bar.yaml': { string: bar },
});

test('data from files', () => {
  const files = ['config/foo.yaml', 'config/bar.yaml']
  const readFile = f => read(f, { encoding: Encoding.String });
  expect.assertions(1);
  dataFromFiles(readFile, files).then(v => {
    expect(v).toEqual(new Map([
      ['config/foo.yaml', foo],
      ['config/bar.yaml', bar],
    ]));
  });
});

test('generate data from dir', () => {
  expect.assertions(1);
  const data = dataFromDir({ dir, read, Encoding });
  return data('config').then(d => expect(d).toEqual(new Map([
    ['foo.yaml', foo],
    ['bar.yaml', bar],
  ])));
});
