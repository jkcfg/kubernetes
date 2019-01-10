import overlay from '../src/overlay';
import { fs, Encoding } from './mock';
import { core } from '../src/api';

test('trivial overlay: no bases, resources, patches', () => {
  const { read } = fs({}, {});
  const o = overlay({ read, Encoding });
  expect.assertions(1);
  return o('config', {}).then((v) => {
    expect(v).toEqual([]);
  });
});


const deployment = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'deploy1',
    namespace: 'test-ns',
  },
};
const service = {
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: 'service1',
    namespace: 'test-ns',
  },
};


test('load resources', () => {
  const kustomize = {
    resources: ['deployment.yaml', 'service.yaml'],
  };
  const files = {
    './deployment.yaml': { json: deployment },
    './service.yaml': { json: service },
  };
  const o = overlay(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([deployment, service]);
  });
});

test('compose bases', () => {
  const subkustomize = {
    resources: ['deployment.yaml'],
  };
  const kustomize = {
    bases: ['sub'],
    resources: ['service.yaml'],
  }
  const files = {
    './service.yaml': { json: service },
    './sub/kustomize.yaml': { json: subkustomize },
    './sub/deployment.yaml': { json: deployment },
  };

  const o = overlay(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([deployment, service]);
  });
});

test('patch resource', () => {
  const commonLabels = { app: 'foobar' };
  const commonAnnotations = { awesome: 'true' };

  const patch = {
    apiVersion: deployment.apiVersion,
    kind: deployment.kind,
    metadata: deployment.metadata,
    spec: {
      replicas: 10,
    },
  };

  const patchedDeployment = {
    ...deployment,
    metadata: {
      ...deployment.metadata,
      labels: commonLabels,
      annotations: commonAnnotations,
    },
    spec: {
      ...deployment.spec,
      replicas: 10,
    },
  };
  const patchedService = {
    ...service,
    metadata: {
      ...service.metadata,
      labels: commonLabels,
      annotations: commonAnnotations,
    }
  };

  const files = {
    './service.yaml': { json: service },
    './deployment.yaml': { json: deployment },
    './patch.yaml': { json: patch },
  };

  const kustomize = {
    commonLabels,
    commonAnnotations,
    resources: ['service.yaml', 'deployment.yaml'],
    patches: ['patch.yaml'],
  };

  const o = overlay(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([patchedService, patchedDeployment]);
  });
});

test('generate resources', () => {
  const kustomize = {
    configMapGenerator: [
      {
        name: 'foobar',
        literals: ['foo=bar'],
        files: ['bar'],
      },
    ],
    secretGenerator: [
      {
        name: 'ssshh',
        literals: ['foo=foobar'],
      }
    ],
  };
  const files = {
    './bar': { string: 'foo' },
  };

  const configmap = new core.v1.ConfigMap('foobar', {
    data: {
      'foo': 'bar',
      'bar': 'foo',
    }
  });
  const secret = new core.v1.Secret('ssshh', {
    data: {
      'foo': 'Zm9vYmFy',
    }
  });

  const o = overlay(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([configmap, secret]);
  });
});
