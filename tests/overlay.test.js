import overlay from '../src/cons/overlay';
import { fs, Encoding } from './mock';

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
};
const service = {
  apiVersion: 'v1',
  kind: 'Service',
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
