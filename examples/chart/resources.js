import { apps } from '@jkcfg/kubernetes/api';

function resources(Values) {
  return [new apps.v1.Deployment(Values.name, {
    spec: {
      template: {
        labels: {app: Values.app },
        spec: {
          containers: {
            'hello': {
              image: `${Values.image.repository}:${Values.image.tag}`
            }
          }
        }
      }
    }
  })];
}

export default resources;
