/**
 * The validate module exports a function for use with `jk validate`
 */

import * as param from '@jkcfg/std/param';
import { validateSchema } from './schema';

const defaultK8sVersion = 'v1.16.0';

export default function validate(value) {
  const k8sVersion = param.String('k8s-version', defaultK8sVersion);
  return validateSchema(k8sVersion, value);
}
