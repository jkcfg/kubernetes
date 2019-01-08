import { patchResource } from '../src/overlay/transforms';

// for the match predicate
const template = {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'dep1',
    namespace: 'foo-ns',
  },
};

const resource = {
  ...template,
  spec: {
    replicas: 1,
    containers: [
      {name: 'foo', image: 'foo:v1'},
    ],
  }
};

test('matches nothing', () => {
  const p = patchResource({});
  expect(p(resource)).toEqual(resource);
});

test('patch something', () => {
  // to make a patch, use the template so it matches, then add a field
  // to be changed.
  const templ = {...template};
  templ.spec = {replicas: 6};
  const p = patchResource(templ);

  // the expected result will be the resource, but with the
  // spec.replicas field changed. NB we have to be careful to clone
  // the spec, rather than assigning into it.
  const expected = {...resource};
  expected.spec = {...resource.spec, replicas: 6};
  
  expect(p(resource)).toEqual(expected);
});
