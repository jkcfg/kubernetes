import { relocate, valueMap, transform, thread, mapper, drop } from '../src/short/transform';

test.each([
  {path: '', result: 'value'},
  {path: 'foo', result: { foo: 'value' } },
  {path: 'foo.bar.baz', result: { foo: { bar: { baz: 'value' } } } },
])('relocate', ({ path, result }) => {
  const rel = relocate(path);
  expect(rel('value')).toEqual(result);
});

test.each([
  {field: 'foo', map: {value: 'eulav'}, result: { 'foo': 'eulav'}},
])('valueMap', ({ field, map, result }) => {
  const vmap = valueMap(field, map);
  expect(vmap('value')).toEqual(result);
});

test('transform function', () => {
  const fn = _ => ({ always: 'replaced' });
  const spec = { top: fn };
  const value = { top: { value: 'discarded' } };
  expect(transform(spec, value)).toEqual(
    { always: 'replaced' }
  );
});

test('transform relocate', () => {
  const spec = { top: 'to.the.bottom' };
  const value = { top: 'value' };
  expect(transform(spec, value)).toEqual(
    { to: { the: { bottom: 'value' } } }
  );
});

test('transform recurse', () => {
  const spec = { top: { sub: 'renamed' } };
  const value = { top: { sub: 'value' } };
  expect(transform(spec, value)).toEqual(
    { renamed: 'value' }
  );
});

test('transform thread', () => {
  const spec = {
    field: thread(valueMap('other', { 'value': 'eulav' }),
                  'nested.down.here')
  };
  const value = { field: 'value' };

  expect(transform(spec, value)).toEqual(
    {
      nested: {
        down: {
          here: {
            other: 'eulav',
          }
        }
      }
    }
  );
});

test ('transform drop', () => {
  const partPodSpec = {
    containers: [mapper({ name: 'name', image: 'image'}), 'spec.containers'],
    node: 'spec.nodeName',
    restart_policy: valueMap('spec.restartPolicy', {
      'always': 'Always',
      'on-failure': 'OnFailure',
      'never': 'Never',
    }),
  };
  const partDeploymentSpec = {
    name: 'metadata.name',
    ...drop('spec.template', partPodSpec),
  };

  const shortVal = {
    name: 'hellodep',
    node: 'barnode',
    restart_policy: 'never',
    containers: [
      { name: 'hello', image: 'helloworld' },
    ],
  };

  expect(transform(partDeploymentSpec, shortVal)).toEqual({
    metadata: { name: shortVal.name },
    spec: {
      template: {
        spec: {
          nodeName: shortVal.node,
          restartPolicy: 'Never',
          containers: [
            { name: 'hello', image: 'helloworld' },
          ],
        },
      },
    },
  });
});

test('transform all', () => {
  const spec = {
    version: 'apiVersion',
    name: 'metadata.name',
    labels: 'metadata.labels',
    recreate: thread(v => (v) ? 'Recreate' : 'RollingUpdate', 'spec.strategy.type'),
  };

  const value = {
    version: 'apps/v1',
    name: 'foo-dep',
    labels: { app: 'foo' },
    recreate: false,
  };

  expect(transform(spec, value)).toEqual(
    {
      apiVersion: 'apps/v1',
      spec: {
        strategy: {
          type: 'RollingUpdate',
        }
      },
      metadata: {
        name: 'foo-dep',
        labels: { app: 'foo' },
      },
    }
  );
});
