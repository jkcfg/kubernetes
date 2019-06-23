// An example of using shortened forms to represent resources.

import { valuesForGenerate } from '@jkcfg/kubernetes/generate';
import { long } from '@jkcfg/kubernetes/short';

const deployment = {
  deployment: {
    name: 'foo-dep',
    namespace: 'foo-ns',
    labels: { app: 'hello' },
    pod_meta: {
      labels: { name: 'foo-pod' },
    },
    containers: [
      {
        name: 'hello',
        image: 'helloworld',
      },
    ],
  }
};

const service = {
  service: {
    name: 'foo-svc',
    namespace: 'foo-ns',
    selector: { app: 'hello' },
  },
};

export default valuesForGenerate([deployment, service].map(long));
