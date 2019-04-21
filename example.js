import * as k8s from './src/kubernetes';
import * as std from '@jkcfg/std';

const nginx = new k8s.Deployment('example', 'nginx', [
  new k8s.Container('nginx', 'nginx:1.15.4'),
]);

std.write(nginx, '', { format: std.Format.YAML });
