// Given an array (or a promise of an array) of Kubernetes resources,
// return a list of values suitable for use with `jk generate`
async function valuesForGenerate(resources) {
  const all = await Promise.resolve(resources);
  return all.map((r) => {
    const filename = `${r.metadata.name}-${r.kind.toLowerCase()}.yaml`;
    let path = filename;
    if (r.metadata.namespace) {
      path = `${r.metadata.namespace}/${filename}`;
    }
    return { file: path, value: r };
  });
}

export { valuesForGenerate };
