# Analogue to Helm charts

This example shows a Helm chart analogue for `jk`. The aim is to have
a template to which you can supply values upon
instantiation. Secondarily, the "chart" can be published, and reused
in another configuration.

It's not a goal here to reproduce the runtime bits of Helm -- that is,
keeping track of which charts have been released to the cluster.

## To run the examples

(in this directory)

```js
# run the chart with defaults
jk run ./index.js # or ./index2.js

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

### Generating resources

**index.js**

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

**index2.js**

This example demonstrates the use of
`@jkcfg/kubernetes/chart/template` to load templates from files (the
files are in `templates/`). The templates are close to Helm's `gotpl`,
in their mode of use and syntax.

### Collecting values

The `chart(...)` procedure uses the parameter-passing mechanism of
`jk` to obtain values from the command-line or from files. To keep
those separate from parameters intended for other purposes, it assumes
the `values` prefix (because it's the prefix used with Helm charts).

Since `jk` merges the parameters for us, there's little work to do
other than merging the supplied values with the defaults as given in
code. The defaults can also be loaded from a file; `chart` copes with
getting a promise of defaults.

### Printing results

The two examples have slightly different ways of outputting their
results. `index.js` can simply print a YAML stream using `std.write`,
because it has objects representing the resources (and that's what
`std.write` expects).

If the resources need to be specialised in some way unanticipated by
the chart, you can do further transformations on the objects before
printing them; e.g,. using parts of the overlay module.

`index2.js` gets string values from running the templates, so it
effectively just prints each string with the YAML document delimiter
in between.

Useful transformations on the strings are tricky; this is a
consequence of using textual templates. But it should be possible in
the future to feed strings to the `jk` runtime to get back objects,
and unlock that possibility.
