import { chart } from '@jkcfg/kubernetes/chart';
import * as param from '@jkcfg/std/param';

import resources from './resources';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1'
  }
};

const output = resources => std.log(resources, { format: std.Format.YAMLStream });

chart(resources, defaults, param).then(output);
