# Kubernetes module for [jk][]

This is a module for [jk][] that helps generate [Kubernetes][] configuration.

[![Build Status](https://travis-ci.org/jkcfg/kubernetes.svg?branch=master)][build-status]

There are four sets of modules, which give different, but compatible,
ways of constructing Kubernetes objects. In addition, there are a
handful of modules for making use of Kubernetes objects, adapting them
to be output via `jk generate`, transforming them in various ways, and
so on.

| Module      | purpose                                        | examples              |
|-------------|------------------------------------------------|-----------------------|
| `api`       | Class definitions for Kubernetes API objects   | none                  |
| `chart`     | Analogue of Helm charts, defined in JavaScript | in the [jk repo][]    |
| `overlay`   | Patch and transform objects                    | in the [jk repo][]    |
| `short`     | Shorthands for Kubernetes API objects          | none at present       |
| ----------- | ---------------------------------------------- | --------------------- |
| `generate`  | Prepare Kubernetes objects for `jk generate`   | used in other modules |
| `transform` | Transformations used in overlays               | used in overlays      |
|

## Kubernetes API classes

The module `@jkcfg/kubernetes/api` contains class definitions for
Kubernetes API objects, nested in their API groups.

```js
import * as k8s from '@jkcfg/kubernetes/api';
import { valuesForGenerate } from '@jkcfg/kubernetes/generate';

export default valusForGenerate([new k8s.core.v1.Namespace('hello')]);
```

## Chart module

The module `@jkcfg/`

[jk]: https://github.com/jkcfg/jk
[Kubernetes]: https://kubernetes.io/
[build-status]: https://travis-ci.org/jkcfg/kubernetes
