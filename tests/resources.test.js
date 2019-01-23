import { iterateContainers } from '../src/resources';
import { apps, core, meta, batch } from '../src/api';

test('find all containers in a Deployment', () => {
  const dep = new apps.v1.Deployment('foo', {
    metadata: {
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            { name: 'container1' },
          ],
          containers: [
            { name: 'container2' },
          ],
          otherContainers: [
            { name: 'container3' }
          ],
        },
      },
    }
  });
  const names = Array.from(iterateContainers(dep)).map(({ name }) => name);
  expect(names).toEqual(['container1', 'container2']);
});

test('find all containers in a Job', () => {
  const dep = new batch.v1.Job('job', {
    metadata: {
      namespace: 'foons',
    },
    spec: {
      template: {
        spec: {
          initContainers: [
            { name: 'container1' },
          ],
          containers: [
            { name: 'container2' },
          ],
          otherContainers: [
            { name: 'container3' }
          ],
        },
      },
    }
  });
  const names = Array.from(iterateContainers(dep)).map(({ name }) => name);
  expect(names).toEqual(['container1', 'container2']);
});

test('find all containers in a CronJob', () => {
  const job = new batch.v1beta1.CronJob('foo', {
    metadata: {
      namespace: 'foons',
    },
    spec: {
      jobTemplate: {
        spec: {
          template: {
            spec: {
              initContainers: [
                { name: 'container1' },
              ],
              containers: [
            { name: 'container2' },
              ],
              otherContainers: [
                { name: 'container3' }
              ],
            },
          },
        },
      },
    }
  });
  const names = Array.from(iterateContainers(job)).map(({ name }) => name);
  expect(names).toEqual(['container1', 'container2']);
});
