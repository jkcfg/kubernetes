import { patchResource, rewriteImageRefs } from '../src/transform';
import { apps } from '../src/api';

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

test('naive rewriteImageRefs', () => {
  const dep = new apps.v1.Deployment('foo', {
    metadata: {
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            {
              name: 'c1',
              image: 'foo:v1',
            }
          ],
        },
      },
    },
  });
  const dep2 = rewriteImageRefs(_ => 'bar:v1')(dep);
  expect(dep2.spec.template.spec.initContainers[0].image).toEqual('bar:v1');
});
