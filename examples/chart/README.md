# Analogue to a Helm chart

This examples shows a Helm chart analogue for `jk`. The aim is to have
a template to which you can supply values upon
instantiation. Secondarily, the "chart" can be published, and reused
in another configuration. It's not a goal here to reproduce the
runtime bits of Helm -- that is, keeping track of which charts have
been released to the cluster.

## To run the example

(in this directory)

```js
npm install '@jkcfg/kubernetes'
# or: make -C ../.. dist && npm install ../../dist

# run the chart with defaults
jk run ./index.js

# run the chart with some value parameter overrides
jk run ./index.js -p values.app=goodbye -f ./values.json
```

## Explanation

A Helm chart is a directory of files, including:

 - `Chart.yaml`, which contains metadata used for packaging;
 - `values.yaml`, which enumerates the parameters to the chart,
   including default values;
 - files in `templates/`, which are textual templates for the
   resources to be created when instantiating the chart.

To instantiate a chart, the Helm tooling gathers together the values
it is called with, fills in the defaults, then runs those through the
template (and sends them off to be applied to the cluster).

The `chart(...)` library procedure used here does the same work. It
takes a "template" function that generates resources as JavaScript
values, given the instantiation values; it gathers the values given on
the command line, fills in the defaults, and runs the template
function to generate the resources, which it prints to stdout as YAML
docs.

Taking these bits one by one ..

**Generating resources**

The template function (in `resources.js`) is in large part an object
literal, with a sprinkling of variable references and interpolated
strings using the values passed to it. This may seem like a cheat,
since Helm's templating involves a bunch of files, with special syntax
(`gotpl`) for control flow and injecting values. Or, you could
consider it as an indication of how much simpler things are when you
can just write a program!

If you did prefer to have separate files, you could put each resource
definition (as a function) in its own file as a module, and import
them all to instantiate them.

**Collecting values**

The `chart(...)` procedure uses the parameter-passing mechanism of
`jk` to obtain values from the command-line or from files. To keep
those separate from parameters intended for other purposes, it assumes
the `values` prefix (arbitrarily, and because it's the prefix used
with Helm charts).

Since `jk` merges the parameters for us, there's little work to do
other than merging the supplied values with the defaults as given in
code. The defaults could also be loaded from a file; `chart` copes
with getting a promise of defaults.

**Printing the result**

The chart procedure chooses how to print each resource depending on
its representation -- either an object (as produced by resources.js),
or a string (as a templating library would yield).
