import * as std from '@jkcfg/std';
import { valuesForGenerate } from '../generate';
import { compile } from './compile';

// overlay is compile, specialised with the std lib functions.
function overlay(path, config, opts = {}) {
  const compileStd = compile(std, opts);
  return compileStd(path, config);
}

function kustomization(path) {
  return overlay(path, { bases: [path] }, { file: 'kustomization.yaml' });
}

function generateKustomization(path) {
  const resources = kustomization(path);
  return valuesForGenerate(resources);
}

export { overlay, kustomization, generateKustomization };
