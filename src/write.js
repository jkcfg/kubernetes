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

const writeStream = (writeString, writeYAML) => (resources) => {
  resources.forEach((r) => {
    writeString('---');
    writeYAML(r);
  });
};

export { writeResources, writeStream };
