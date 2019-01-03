import { generateConfigMap } from '../src/cons/generators';
import { ConfigMap } from '../src/kubernetes';
import { fs } from './mock';

test('empty configmap', () => {
  expect.assertions(1);
  const gen = generateConfigMap((f, { encoding }) => {
    throw new Error('unexpected read of ${f}');
  });
  return gen({name: 'foo-conf'}).then((v) => {
    expect(v).toEqual(new ConfigMap(undefined, 'foo-conf', {}));
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
    expect(v).toEqual(new ConfigMap(undefined, 'foo-conf', {
      'foo.yaml': 'foo: bar',
      'some.property': 'some.value',
    }));
  });
});
