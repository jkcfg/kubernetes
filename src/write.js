// Write all the individual resources out in directories and files
// according to their namespace, kind and name.
const writeResources = writeFile => (resources) => {
  resources.forEach((r) => {
    const filename = `${r.metadata.name}-${r.kind.toLowerCase()}.yaml`;
    let path = filename;
    if (r.metadata.namespace) {
      path = `${r.metadata.namespace}/${filename}`;
    }
    writeFile(r, path);
  });
};

// writeStream gives a little more flexibility for writing out a list
// of resources than std.write. This is useful if you generated
// strings instead of objects for your resources, for example.
const writeYAMLStream = (writeString, writeResource) => (resources) => {
  resources.forEach((r) => {
    writeString('---');
    writeResource(r);
  });
};

export { writeResources, writeYAMLStream };
