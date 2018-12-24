// This module provides procedures for applying Kustomize-like
// [overlays](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/kustomization.yaml).

// In Kustomize, a configuration is given in a `kustomize.yaml` file;
// here we'll interpret an object (which can of course be loaded from
// a file). In a `kustomize.yaml` you refer to files from which to
// load or generate resource manifests, and transformations to apply
// to all or some resources.
//
// The mechanism for composing configurations is to name `bases` in
// the `kustomize.yaml` file; these are evaluated and included in the
// resources.
//
//     Promise [Resource]
//
// There are different kinds of transformations, but they amount to
//
//     Resource -> Resource
//
// The approach taken here is
//   0. load the file
//   1. assemble all the transformations mentioned in various ways in the kustomize object;
//   2. assemble all the resources, mentioned in various ways, in the kustomize object;
//   2. run each resource through the transformations.
//
// Easy peasy!

import { patchResource } from './transforms';
import { generateConfigMap } from './generators';

const flatten = array => [].concat(...array);
const pipeline = (...fns) => v => fns.reduce((acc, val) => val(acc), v);

// overlay constructs an interpreter which takes an overlay object (as
// would be parsed from a `kustomize.yaml`) and constructs a set of
// resources to write out.
const overlay = ({ read, Encoding }) => async function assemble(path, config) {
  const readObj = f => read(`${path}/${f}`, { encoding: Encoding.JSON });
  const readStr = f => read(`${path}/${f}`, { encoding: Encoding.String });
  const {
    resources: resourceFiles = [],
    bases: baseFiles = [],
    patches: patchFiles = [],
    configMapGenerator = [],
  } = config;

  const patches = [];
  patchFiles.forEach((f) => {
    patches.push(readObj(f).then(patchResource));
  });

  // TODO: add the other kinds of transformation: imageTags,
  // globalAnnotations, etc.

  const resources = []; // :: [Promise [Resource]]
  baseFiles.forEach((f) => {
    const obj = readObj(`${f}/kustomize.yaml`);
    resources.push(obj.then(o => assemble(`${path}/${f}`, o)));
  });

  resources.push(Promise.all(resourceFiles.map(readObj)));
  resources.push(Promise.all(configMapGenerator.map(generateConfigMap(readStr))));

  const transform = pipeline(...await Promise.all(patches));
  return Promise.all(resources).then(flatten).then(rs => rs.map(transform));
};

export default overlay;
