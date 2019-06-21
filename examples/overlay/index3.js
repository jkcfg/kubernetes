import { overlay } from '@jkcfg/kubernetes/overlay';
import { core } from '@jkcfg/kubernetes/api';
import { valuesForGenerate } from '@jkcfg/kubernetes/generate';

// The generate function is parameterised by the name of an
// environment -- it's just a string -- which we'll use to specialise
// the generated resources.
async function generateEnv(env) {
  const ns = `${env}-env`;
  // this is the same technique as used in the other overlay examples;
  // except that it uses the parameter `env` to put all resources in a
  // namespace, so we can stamp out a set of resources for each
  // environment.
  const resources = await overlay('.', {
    namespace: ns,
    commonLabels: { env },
    bases: ['.'],
    resources: ['service.yaml'],
    patches: ['service-selector.json']
  });
  // make a namespace resource, to hold all the resources
  resources.push(new core.v1.Namespace(ns, {}));
  return resources;
}

async function generate() {
  let all = []
  for (const env of ['dev', 'staging', 'prod']) {
    all.push(...await valuesForGenerate(generateEnv(env), { prefix: env }));
  }
  return all;
}

export default generate();
