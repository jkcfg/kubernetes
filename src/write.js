// Write all the individual resources out in directories and files
// according to their namespace, kind and name.
const writeResources = write => function(resources) {
  resources.forEach((r) => {
    const filename = `${r.metadata.name}-${r.kind.toLowerCase()}.yaml`;
    let path = filename;
    if (r.metadata.namespace) {
      path = `${r.metadata.namespace}/${filename}`;
    }
    write(r, path);
  });
};

export { writeResources };
