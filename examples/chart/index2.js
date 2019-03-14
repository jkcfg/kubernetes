// Example of a Helm chart analogue, using handlebars

import { chart } from '@jkcfg/kubernetes/chart';
import { load } from '@jkcfg/kubernetes/chart/template';
import * as resource from '@jkcfg/std/resource';
import std from '@jkcfg/std';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1'
  }
};

const templates = load(resource);

chart(templates, defaults, std.param);
