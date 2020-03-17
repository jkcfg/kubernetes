/**
 * The validate module exports a default value for use with `jk
 * validate`.
 */

import * as param from '@jkcfg/std/param';
import { withModuleRef } from '@jkcfg/std/resource';
import { validateWithResource } from '@jkcfg/std/schema';
import { schemaPath } from './schema';

const defaultK8sVersion = 'v1.16.0';

export function validateSchema(k8sVersion, value) {
  const path = schemaPath(k8sVersion, value.apiVersion, value.kind);
  return withModuleRef(ref => validateWithResource(value, `schemas/${path}`, ref));
}

export default function validate(value) {
  const k8sVersion = param.String('k8s-version', defaultK8sVersion);
  return validateSchema(k8sVersion, value);
}
