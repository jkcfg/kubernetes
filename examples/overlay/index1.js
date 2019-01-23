import overlay from '@jkcfg/kubernetes/overlay';
import { writeResources } from '../../dist/write';
import std from '@jkcfg/std';

async function generate() {
  // this will just load the kustomization at the give file, and
  // evaluate it.
  var kustomize = overlay(std);
  // we could read the file as an object, then run that through
  // `overlay`; this is another way to do it, by constructing an
  // object that refers to the file in question, and evaluating
  // that. This latter way is useful as a shortcut, but also if you
  // want to calculate the bases (or any other part of the object).
  return kustomize('.', { bases: ['.'] });
}

generate().then(writeResources(r => std.log(r)));
