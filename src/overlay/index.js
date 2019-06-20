import { read, Encoding } from '@jkcfg/std';

import { valuesForGenerate } from '../generate';
import { compile } from './compile';

async function kustomization(path, opts = {}) {
  const { file = 'kustomization.yaml' } = opts;

  const config = await read(`${path}/${file}`, { encoding: Encoding.YAML });
  const kustomizeOverlay = compile({ read, Encoding }, opts);
  return kustomizeOverlay(path, config);
}

function generateKustomization(path, opts = {}) {
  const resources = kustomization(path, opts);
  return valuesForGenerate(resources);
}

export { kustomization, generateKustomization };
