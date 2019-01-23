import overlay from '@jkcfg/kubernetes/overlay';
import { writeResources } from '../../dist/write';
import std from '@jkcfg/std';
import { core } from '@jkcfg/kubernetes/api';

// The generate function is parameterised by the name of an
// environment -- it's just a string -- which we'll use to specialise
// the generated resources.
async function generate(env) {
  const ns = `${env}-env`;
  var kustomize = overlay(std);
  // this is the same technique as used in the other overlay examples;
  // except that it uses the parameter `env` to put all resources in a
  // namespace, so we can stamp out a set of resources for each
  // environment.
  const resources = await kustomize('.', {
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

for (const env of ['dev', 'staging', 'prod']) {
  generate(env).then((resources) => {
    // specialise `writeResources` so that it will put the config for
    // each environment in its own directory.
    const writeEnvironment = writeResources((r, path) => std.write(r, `${env}/${path}`));
    writeEnvironment(resources);
  });
}
