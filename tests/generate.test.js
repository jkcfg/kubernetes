import { valuesForGenerate } from '../src/generate';
import { core, apps } from '../src/api';

test('valuesForGenerate', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
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

  expect.assertions(1);
  return valuesForGenerate(resources).then(files => {
    files.forEach(write);
    expect(output).toEqual(expect.objectContaining({
      'foo-namespace.yaml': expect.any(core.v1.Namespace),
      'foo/bar-deployment.yaml': expect.any(apps.v1.Deployment),
      'foo/foosrv-service.yaml': expect.any(core.v1.Service),
    }));
  });
});

test('valuesForGenerate (flatten)', () => {
  const output = {};
  const write = ({ file, value }) => {
    output[file] = value;
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

  expect.assertions(1);
  return valuesForGenerate(resources, { namespaceDirs: false }).then(files => {
    files.forEach(write);
    expect(output).toEqual(expect.objectContaining({
      'foo-namespace.yaml': expect.any(core.v1.Namespace),
      'bar-deployment.yaml': expect.any(apps.v1.Deployment),
      'foosrv-service.yaml': expect.any(core.v1.Service),
    }));
  });
});
