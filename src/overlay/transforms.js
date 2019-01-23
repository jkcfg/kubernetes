import { patch, patches } from '@jkcfg/mixins/src/mixins';
import { iterateContainers } from '../resources';

// resourceMatch returns a predicate which gives true if the given
// object represents the same resource as `template`, false otherwise.
function resourceMatch(target) {
  // NaN is used for mandatory fields; if these are not present in the
  // template, nothing will match it (since NaN does not equal
  // anything, even itself).
  const { apiVersion = NaN, kind = NaN, metadata = {} } = target;
  const { name = NaN, namespace } = metadata;
  return (obj) => {
    const { apiVersion: v, kind: k, metadata: m } = obj;
    if (v !== apiVersion || k !== kind) return false;
    const { name: n, namespace: ns } = m;
    if (n !== name || ns !== namespace) return false;
    return true;
  };
}

// patchResource returns a function that will patch the given object
// if it refers to the same resource, and otherwise leave it
// untouched.
function patchResource(p) {
  const match = resourceMatch(p);
  return v => (match(v) ? patch(v, p) : v);
}

// commonMetadata returns a tranformation that will indiscriminately
// add the given labels and annotations to every resource.
function commonMetadata({ commonLabels = null, commonAnnotations = null, namespace = null }) {
  // This isn't quite as cute as it could be; naively, just assembling a patch
  //     { metadata: { labels: commonLabels, annotations: commonAnnotations }
  // doesn't work, as it will assign null (or empty) values where they are not
  // present.
  const metaPatches = [];
  if (commonLabels !== null) {
    metaPatches.push({ metadata: { labels: commonLabels } });
  }
  if (commonAnnotations !== null) {
    metaPatches.push({ metadata: { annotations: commonAnnotations } });
  }
  if (namespace !== null) {
    metaPatches.push({ metadata: { namespace: namespace } });
  }
  return patches(...metaPatches);
}

// rewriteImageRefs applies the given rewrite function to each image
// ref used in a resource. TBD(michael): should this use a zipper, so
// as to not mutate?
const rewriteImageRefs = fn => function(resource) {
  for (const container of iterateContainers(resource)) {
    container['image'] = fn(container['image']);
  }
  return resource;
}

export { patchResource, commonMetadata, rewriteImageRefs };
