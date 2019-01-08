function basename(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}

function dirname(path) {
  return path.substring(0, path.lastIndexOf('/'));
}

export { basename, dirname };
