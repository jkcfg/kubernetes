// An example of using shortened forms to represent resources.

import { long } from '@jkcfg/kubernetes/short';
import std from '@jkcfg/std';

const deployment = {
  deployment: {
    name: 'foo-dep',
    namespace: 'foo-ns',
    labels: { app: 'hello' },
    containers: [
    ],
  }
};

const service = {
  service: {
    name: 'foo-svc',
    namespace: 'foo-ns',
    selector: { app: 'hello' },
  },
};

std.log('---\n', { format: std.Format.Raw });
std.log(long(deployment), { format: std.Format.YAML });
std.log('---\n', { format: std.Format.Raw });
std.log(long(service), { format: std.Format.YAML });
