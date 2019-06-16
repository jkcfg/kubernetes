// Example of a Helm chart analogue, using handlebars

import { chart } from '@jkcfg/kubernetes/chart';
import { loadDir } from '@jkcfg/kubernetes/chart/template';
import { writeYAMLStream } from '@jkcfg/kubernetes/write';
import * as resource from '@jkcfg/std/resource';
import std from '@jkcfg/std';
import handlebars from 'handlebars/lib/handlebars';

const defaults = {
  name: 'helloworld',
  app: 'hello',
  image: {
    repository: 'weaveworks/helloworld',
    tag: 'v1'
  }
};

const readString = path => resource.read(path, { encoding: std.Encoding.String });
const templates = loadDir({ readString, compile: handlebars.compile, ...resource });

// Because we get strings out of the templates, rather than objects,
// we don't need to serialise them; so, use writeYAMLStream, which we
// can specialise so that it just splats strings to stdout.
const output = writeYAMLStream(std.log, std.log);

chart(templates, defaults, std.param).then(output);
