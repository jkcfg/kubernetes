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

class ConfigMap {
  constructor(ns, name, data) {
    this.apiVersion = "v1";
    this.kind = "ConfigMap";
    this.metadata = new Meta(ns, name);
    this.data = data;
  }
}

export {
  Container, Meta, Deployment,
};
