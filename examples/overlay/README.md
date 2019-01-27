## Examples of using the overlay module

This directory contains some examples of using the module
`@jkcfg/kubernetes/overlay`, which is a toolbox for composing bits of
Kubernetes config from different places and in various forms.

In part, the overlay module can be used to mimic
[`kustomize`](https://github.com/kubernetes-sigs/kustomize); it can be
pointed at a `kustomization.yaml` file (or a directory containing one)
and output the resources there defined[*](#kustomize-compatibility).

But it's also possible, since this is just JavaScript, to mix and
match static configuration with computation -- for example, to quickly
specialize a given kustomization with some variations; or, to
post-process generated resources in a way kustomize doesn't have built
in.

### How to run an example

The examples are in the files `index*.js`. To run them, change to this
directory `examples/overlay`, and run (for instance)

    jk run ./index1.js

### Description of the examples

 - `index1.js` -- this evaluates the simple overlay in
   `kustomization.yaml` and prints the output to stdout.

 - `index2.js` -- this adds some more customisation to the overlay
   given in `kustomization.yaml`, including another resource from a
   file, and prints the output to stdout.

 - `index3.js` -- this example customises the overlay as in the second
   example, adds a resource constructed in code, then replicates it
   across three sets of output configuration files, for different
   environments.

### kustomize compatibility

Here are the bits of kustomize that are implemented in this module.

| Feature           | Notes                              |
|-------------------|------------------------------------|
| `.bases`          | Works as for kustomize -- `kustomization.yaml` in the given directory is used to generate resources for further kustomization |
| `.resources`      | Works as for kustomize -- each file is loaded as a resource |
| `.namespace`      | `overlay` will give every resource the given namespace indiscriminately (i.e., even if it's not a namespaced resource) |
| `.commonLabels` and `.commonAnnotations` | Works as for kustomize -- the given labels and annotations are given to each resource |
| `.patches`        | Works as for kustomize -- the files are loaded and each is treated as a patch for the resource it names. |
| `.configMapGenerator` | Both files and literals are supported |
| `.secretGenerator` | Works like `.configMapGenerator` (files and literals), rather than as in kustomize, which lets you run arbitrary commands to construct secrets. It's recommended that secrets are provided out of band (e.g., by creating [sealed secrets](https://github.com/bitnami-labs/sealed-secrets)) |

