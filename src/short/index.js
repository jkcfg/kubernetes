// "Short" forms for API objects.
//
// This is the inspiration and target format: https://docs.koki.io/short/

import { apps, core } from '../api';
import { transform, valueMap } from './transform';

// Take a constructor (e.g., from the API) and return a transformer
// that will construct the API resource given a API resource "shape".
function makeResource(Ctor, spec) {
  return (v) => {
    const shape = transform(spec, v);
    return new Ctor(shape.metadata.name, shape);
  };
}

const objectMeta = {
  // not strictly metadata, but common to everything
  apiVersion: 'version',
  // `kind` is not transformed here, rather used as the dispatch
  // mechanism, and supplied by the specific API resource constructor

  // ObjectMeta
  name: 'metadata.name',
  namespace: 'metadata.namespace',
  labels: 'metadata.labels',
  annotations: 'metadata.annotations',
};

const workloadSpec = {
  ...objectMeta,
};

const serviceSpec = {
  ...objectMeta,
  cname: 'spec.externalName',
  type: valueMap('spec.type', {
    'cluster-ip': 'ClusterIP',
    'load-balancer': 'LoadBalancer',
    'node-port': 'NodePort',
  }),
  selector: 'spec.selector',
};

const transforms = {
  deployment: makeResource(apps.v1.Deployment, workloadSpec),
  service: makeResource(core.v1.Service, serviceSpec),
};

// TODO all the other ones.
// TODO register new transforms (e.g., for custom resources).

// long takes a short description and turns it into a full API object.
function long(obj) {
  const [kind] = Object.keys(obj);
  const tx = transforms[kind];
  if (tx === undefined) {
    throw new Error(`unknown kind: ${kind}`);
  }
  return tx(obj[kind]);
}

export { long };
