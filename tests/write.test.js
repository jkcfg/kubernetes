import { writeResources } from '../src/write';
import { core, apps } from '../src/api';

test('writeResources', () => {
  const output = {};
  const write = (object, filename) => {
    output[filename] = object;
  };

  // I'm mostly checking whether it gets the paths and so on correct.
  const resources = [
    new core.v1.Namespace('foo', {}),
    new apps.v1.Deployment('bar', {
      metadata: { namespace: 'foo' },
    }),
    new core.v1.Service('foosrv', {
      metadata: { namespace: 'foo' },
    }),
  ];

  writeResources(write)(resources);
  expect(output).toEqual(expect.objectContaining({
    'foo-namespace.yaml': expect.any(core.v1.Namespace),
    'foo/bar-deployment.yaml': expect.any(apps.v1.Deployment),
    'foo/foosrv-service.yaml': expect.any(core.v1.Service),
  }));
});
