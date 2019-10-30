/**
 * The schema module gives access to Kubernetes JSON Schema definitions.
 */

import { withModuleRef } from '@jkcfg/std/resource';
import { validateWithResource } from '@jkcfg/std/schema';

function resourcePath(k8sVersion, apiVersion, kind) {
  const groupVersion = apiVersion.split('/');
  groupVersion.unshift(kind);
  return `schemas/${k8sVersion}-local/${groupVersion.join('-').toLowerCase()}.json`;
}

export function validateSchema(k8sVersion, value) {
  const path = resourcePath(k8sVersion, value.apiVersion, value.kind);
  return withModuleRef(ref => validateWithResource(value, path, ref));
}
