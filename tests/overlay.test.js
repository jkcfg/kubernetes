import { compile } from '../src/overlay/compile';
import { fs, Encoding } from './mock';
import { core } from '../src/api';
import { merge } from '@jkcfg/std/merge';

test('trivial overlay: no bases, resources, patches', () => {
  const { read } = fs({}, {});
  const o = compile({ read, Encoding });
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
  spec: {
    template: {
      spec: {
        containers: [
          { name: 'test', image: 'tester:v1' },
        ],
      },
    },
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
  const o = compile(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([deployment, service]);
  });
});

test('load resources with generatedResources', () => {
  const files = {
    './deployment.yaml': { json: deployment },
  };
  const o = compile(fs({}, files));

  const kustomize = {
    resources: ['deployment.yaml'],
    generatedResources: [Promise.resolve([service])],
  };

  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([service, deployment]);
  });
});

test('user-provided transformation', () => {
  const files = {
    './service.yaml': { json: service },
  };
  const o = compile(fs({}, files));

  const insertSidecar = (v) => {
    if (v.kind === 'Deployment') {
      return merge(v, {
        'spec+': {
          'template+': {
            'spec+': {
              'containers+': [{ name: 'sidecar', image: 'side:v1' }],
            },
          },
        },
      });
    }
    return v;
  };

  const kustom = {
    resources: ['service.yaml'],
    generatedResources: [Promise.resolve([deployment])],
    transformations: [insertSidecar],
  };

  expect.assertions(3);
  return o('.', kustom).then((v) => {
    expect(v).toEqual([insertSidecar(deployment), service]);
    const [d, ] = v;
    // transformed deployment has extra container
    expect(d.spec.template.spec.containers.length).toEqual(2);
    // original deployment has no extra container
    expect(deployment.spec.template.spec.containers.length).toEqual(1);
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
    './sub/kustomization.yaml': { json: subkustomize },
    './sub/deployment.yaml': { json: deployment },
  };

  const o = compile(fs({}, files));
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

  const o = compile(fs({}, files));
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

  const o = compile(fs({}, files));
  expect.assertions(1);
  return o('.', kustomize).then((v) => {
    expect(v).toEqual([configmap, secret]);
  });
});
