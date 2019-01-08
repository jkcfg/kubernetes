import { generateConfigMap, generateSecret } from '../dist/overlay/generators';
import { core } from '../dist/api';
import { fs } from './mock';

test('empty configmap', () => {
  expect.assertions(1);
  const gen = generateConfigMap((f, { encoding }) => {
    throw new Error('unexpected read of ${f}');
  });
  return gen({name: 'foo-conf'}).then((v) => {
    expect(v).toEqual(new core.v1.ConfigMap('foo-conf', { data: {} }));
  })
});

test('files and literals', () => {
  const { read } = fs({}, {
    'config/foo.yaml': { string: 'foo: bar' },
  });
  const readStr = f => read(f, { encoding: 'string' });
  const gen = generateConfigMap(readStr);
  const conf = {
    name: 'foo-conf',
    files: ['config/foo.yaml'],
    literals: ['some.property=some.value'],
  };
  expect.assertions(1);
  return gen(conf).then((v) => {
    expect(v).toEqual(new core.v1.ConfigMap('foo-conf', {
      data: {
        'foo.yaml': 'foo: bar',
        'some.property': 'some.value',
      }
    }));
  });
});

test('secret from literal', () => {
  // this relies on a known base64 encoding:
  // 'foobar' -> 'Zm9vYmFy' (NB no trailing newline)
  const foobar = 'foobar';
  const foobarEncoded = 'Zm9vYmFy';
  const read = () => {
    return Promise.resolve(new Uint8Array([ 102, 111, 111, 98, 97, 114 ]));
  };
  const gen = generateSecret(read);
  const conf = {
    name: 'foo-secret',
    files: ['foo.bin'],
    literals: ['foo.literal=foobar'],
  };

  expect.assertions(1);
  return gen(conf).then((v) => {
    expect(v).toEqual(new core.v1.Secret('foo-secret', {
      data: {
        'foo.bin': foobarEncoded,
        'foo.literal': foobarEncoded,
      }
    }));
  });
});
