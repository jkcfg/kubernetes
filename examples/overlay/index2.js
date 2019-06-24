import { overlay } from '@jkcfg/kubernetes/overlay';
import { valuesForGenerate } from '@jkcfg/kubernetes/generate';

// This is similar to the first example, but uses an object rather
// than going straight to the filesystem, and overlays further
// changes.
//
// The `bases` part loads and interprets a kustomization file, so
// another way to do the first example would be:
//
//     overlay({ bases: ['.'] });
//
function generate() {
  return overlay('.', {
    bases: ['.'],
    resources: ['service.yaml'],
    commonLabels: {
      team: 'foo',
    },
    patches: ['service-selector.json'],
  });
}

export default valuesForGenerate(generate());
