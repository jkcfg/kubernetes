import { patch } from '@jkcfg/mixins/src/mixins';

// "Field transformer" functions take a _value_ and return an object
// with _one or more fields_.
//
// In `transform`, the `spec` argument defines how to transform an
// object with a map of field name to field transformer; the result of
// applying a transformer is merged into the result.

// relocate makes a field transformer function that will relocate a
// value to the path given. The trivial case is a single element,
// which effectively renames a field.
function relocate(path) {
  if (path === '') return v => v;

  const elems = path.split('.').reverse();
  return (v) => {
    let obj = v;
    for (const p of elems) {
      obj = { [p]: obj };
    }
    return obj;
  };
}

// transformer returns a field transformer given:
//
//  - a string, which relocates the field (possibly to a nested path);
//  - a function, which is used as-is;
//  - an object, which will be treated as the spec for transforming
//    the (assumed object) value to get a new value.
function transformer(field) {
  switch (typeof field) {
  case 'string': return relocate(field);
  case 'function': return field;
  case 'object': return v => transform(field, v);
  default: return v => v;
  }
}

// thread takes a varying number of individual field transformers, and
// returns a function that will apply each transformer to the result
// of the previous.
function thread(...transformers) {
  return initial => transformers.reduce((a, fn) => transformer(fn)(a), initial);
}

// valueMap creates a field transformer that maps the possible values
// to other values, then relocates the field. This is useful, for
// example, when the format has shorthands or aliases for enum values
// (like service.type='cluster-ip').
function valueMap(field, map) {
  return thread(v => map[v], field);
}

// transform generates a new value from `v0` based on the
// specification given. Each field in `spec` contains a field
// transformer, which is used to generate a new field or fields to
// merge into the result.
function transform(spec, v0) {
  let v1 = {};
  for (const [field, value] of Object.entries(v0)) {
    const tx = spec[field];
    if (tx !== undefined) {
      const fn = transformer(tx);
      v1 = patch(v1, fn(value));
    }
  }
  return v1;
}

export {
  transform, relocate, valueMap, thread,
};
