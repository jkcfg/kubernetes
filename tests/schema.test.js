import { schemaPath } from '../src/schema';

const k8s = 'v1.16.0'; // just for the sake of supplying something

test('service v1', () => {
  expect(schemaPath(k8s, 'v1', 'Service')).toEqual(`${k8s}-local/service-v1.json`);
});

test('deployment apps/v1', () => {
  expect(schemaPath(k8s, 'apps/v1', 'Deployment')).toEqual(`${k8s}-local/deployment-apps-v1.json`);
});

test('customresourcedefinition apiextensions.k8s.io/v1beta1', () => {
  expect(schemaPath(k8s, 'apiextensions.k8s.io/v1beta1', 'CustomResourceDefinition')).toEqual(`${k8s}-local/customresourcedefinition-apiextensions-v1beta1.json`);
});
