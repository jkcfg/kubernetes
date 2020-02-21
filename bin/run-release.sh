#!/bin/bash

set -e
set -x

# Assumes `make dist build-image` has been run, meaning the package
# code is all in ./@jkcfg/kubernetes and the image is in local docker.

tag=$1
user=jkcfg
repo=kubernetes
pkg=github.com/$user/$repo

## If needed, get from jkcfg/jk
# function docker_run() { ... }

## if needed again, get from jkcfg/jk
# function upload() { ... }

echo "==> Checking package.json is up to date"
version=$(node ./version.js)
if [ "$version" != "$tag" ]; then
    echo "error: releasing $tag but package.json references $version"
    exit 1
fi

echo "==> Pushing Docker image"
if [ -z "$DOCKER_TOKEN" ]; then
    echo "error: DOCKER_TOKEN needs to be defined for pushing a Docker image"
    exit 1
fi
docker tag jkcfg/kubernetes "jkcfg/kubernetes:$tag"
echo "$DOCKER_TOKEN" | docker login -u jkcfgbot --password-stdin
docker push "jkcfg/kubernetes:$tag"

echo "==> Uploading npm module"
if [ -z "$NPM_TOKEN" ]; then
    echo "error: NPM_TOKEN needs to be defined for pushing npm modules"
    exit 1
fi
echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > @jkcfg/kubernetes/.npmrc
npm publish @jkcfg/kubernetes
