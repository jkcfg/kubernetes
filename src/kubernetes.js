class Container {
  constructor(name, image) {
    this.name = name;
    this.image = image;
  }
}

class Meta {
  constructor(ns, name) {
    this.namespace = ns;
    this.name = name;
  }
}

class Deployment {
  constructor(ns, name, containers) {
    this.apiVersion = 'apps/v1';
    this.kind = 'Deployment';
    this.metadata = new Meta(ns, name);
    this.spec = {
      selector: {
        matchLabels: {
          app: name,
        },
      },
      template: {
        metadata: {
          labels: {
            app: name,
          },
        },
        containers,
      },
    };
  }
}

export {
  Container, Meta, Deployment,
};
