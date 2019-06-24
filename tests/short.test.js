import { long } from '../src/short';
import { apps, core } from '../src/api';

// Add to this as the spec gets more complete ...
test('deployment', () => {
  const dep = {
    deployment: {
      name: 'foo-dep',
      namespace: 'foo-ns',
      labels: { app: 'foo' },
    }
  };
  expect(long(dep)).toEqual(new apps.v1.Deployment('foo-dep', {
    metadata: {
      namespace: 'foo-ns',
      labels: { app: 'foo' },
    },
  }));
});

test('service', () => {
  const svc = {
    service: {
      name: 'bar-svc',
      namespace: 'bar-ns',
      type: 'node-port',
      selector: { app: 'bar' },
    }
  };
  expect(long(svc)).toEqual(new core.v1.Service('bar-svc', {
    metadata: {
      namespace: 'bar-ns',
      name: 'bar-svc',
    },
    spec: {
      type: 'NodePort',
      selector: { app: 'bar' }
    }
  }));
});
