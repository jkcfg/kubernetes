import { loadDir } from '../src/chart/template';
import handlebars from 'handlebars/lib/handlebars';

const compile = handlebars.compile;

const dir = (path) => {
  if (path === 'templates') {
    return {
      path,
      files: [
        { path: `templates/foo.yaml`, isDir: false, name: 'foo.yaml' },
        { path: `templates/bar.yaml`, isDir: false, name: 'bar.yaml' },
      ],
    };
  }
  throw new Error(`dir ${path} does not exist`);
};

const fooYAML = `
This is just some text.
`;

const barYAML = `
This is some text with a {{ values.variable }} reference.
`;

const readString = (path) => {
  switch (path) {
  case 'templates/foo.yaml':
    return fooYAML;
  case 'templates/bar.yaml':
    return barYAML;
  }
  throw new Error(`file ${path} not found`);
};

test('load a dir of templates', () => {
  const templates = loadDir({ dir, readString, compile, parse: s => s });
  const out = templates({ variable: 'handlebars' });
  expect.assertions(2);
  return out.then(([foo, bar]) => {
    expect(foo).toEqual(fooYAML);
    expect(bar.trim()).toEqual('This is some text with a handlebars reference.');
  });
});
