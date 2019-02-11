import { values } from '../src/chart/values';

const doNotRead = () => { throw new Error('unexpected call to read') };

function params(obj = {}) {
  return { String: (k, d) => (obj.hasOwnProperty(k)) ? obj[k] : d };
}

test('empty values', () => {
  const vals = values(params({value: ''}), doNotRead);
  expect.assertions(1);
  return vals({}).then(v => expect(v).toEqual({}));
});

test('single simple path', () => {
  const vals = values(params({ value: 'foo=bar' }), doNotRead);
  expect.assertions(1);
  return vals({}).then(v => expect(v).toEqual({
    foo: 'bar'
  }));
});

test('>1 dotted path', () => {
  const vals = values(params({ value: 'foo.bar.baz=boo,foo.a.b.c=abc' }), doNotRead);
  expect.assertions(1);
  return vals({}).then(v => expect(v).toEqual({
    foo: {
      a: { b: { c: 'abc' }},
      bar: {baz: 'boo'}
    }
  }));
});

test('defaults and values', () => {
  const vals = values(params({ value: 'foo.boo=baz' }), doNotRead);
  const defaults = {
    foo: {
      bar: 1,
    }
  };
  expect.assertions(1);
  return vals(defaults).then(v => expect(v).toEqual({
    foo: {
      bar: 1,
      boo: 'baz'
    }
  }));
});

test('values from file', () => {
  const readFile = (f) => {
    switch (f) {
    case 'values.yaml':
      return { image: { tag: 'v2' }};
    default:
      throw new Error(`unexpected read of ${f}`)
    }
  };
  const vals = values(params({ file: 'values.yaml' }), readFile);
  const defaults = {
    image: {
      repository: 'helloworld',
      tag: 'v1'
    }
  };

  expect.assertions(1);
  return vals(defaults).then(v => expect(v).toEqual({
    image: {
      repository: 'helloworld',
      tag: 'v2'
    }
  }));
});

test('command-line values take precedence', () => {
  const readFile = (f) => {
    switch (f) {
    case 'values.yaml':
      return { image: { tag: 'v2' }};
    default:
      throw new Error(`unexpected read of ${f}`)
    }
  };
  const vals = values(params({ value: 'image.tag=v3', file: 'values.yaml' }), readFile);
  const defaults = {
    image: {
      repository: 'helloworld',
      tag: 'v1'
    }
  };

  expect.assertions(1);
  return vals(defaults).then(v => expect(v).toEqual({
    image: {
      repository: 'helloworld',
      tag: 'v3'
    }
  }));
});
