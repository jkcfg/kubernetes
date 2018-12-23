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

// overlay constructs an interpreter which takes an overlay object (as
// would be parsed from a `kustomize.yaml`) and constructs a set of
// resources to write out.
const overlay = ({ read, Encoding }) => async function assemble(path, config) {
  const readObj = f => read(`${path}/${f}`, { encoding: Encoding.JSON });
  const {
    resources: resourceFiles = [],
    bases: baseFiles = [],
    // patches: patchFiles = [],
  } = config;

  // TODO: implement interpretPatch and uncomment ..
  // const transforms = [];
  // patchFiles.forEach((f) => {
  //   transforms.append(readObj(f).then(interpretPatch));
  // });
  // TODO: add the other kinds of transformation: imageTags,
  // globalAnnotations, etc.

  let resources = [];
  baseFiles.forEach((f) => {
    const obj = readObj(`${path}/${f}/kustomize.yaml`);
    resources = resources.concat(obj.then(o => assemble(`${path}/${f}`, o)));
  });

  resourceFiles.forEach(f => resources.append(readObj(f)));
  return Promise.all(resources);
};

export default overlay;
