import dataFromDir from '../src/cons/data';

function dir(path) {
  if (path !== 'config') {
    throw new Error(`asked for dir of ${path}`);
  }
  return {
    files: [
      {name: 'foo.yaml', isdir: false},
      {name: 'bar.yaml', isdir: false},
      {name: 'baz', isdir: true}
    ]
  };
}

const Encoding = { 'String': "string" };

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

async function read(path, { encoding }) {
  if (encoding != 'string') {
    throw new Error(`asked for wrong encoding ${encoding}`);
  }
  switch (path) {
  case 'config/foo.yaml':
    return foo;
  case 'config/bar.yaml':
    return bar;
  default:
    throw new Error(`asked for not-a-file ${path}`);
  }
}

test('generate data from dir', () => {
  expect.assertions(1);
  const data = dataFromDir({ dir, read, Encoding });
  return data('config').then(d => expect(d).toEqual({
    'foo.yaml': foo,
    'bar.yaml': bar
  }));
});
