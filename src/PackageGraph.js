import semver from "semver";

/**
 * Represents a node in a PackageGraph.
 * @constructor
 * @param {!<Package>} pkg - A Package object to build the node from.
 */
export class PackageGraphNode {
  constructor(pkg) {
    this.package = pkg;
    this.dependencies = [];
  }
}

/**
 * Represents a node in a PackageGraph.
 * @constructor
 * @param {!Array.<Package>} packages An array of Packages to build the graph out of.
 */
export default class PackageGraph {
  constructor(packages) {
    this.nodes = [];
    this.nodesByName = {};

    for (let p = 0; p < packages.length; p++) {
      const pkg = packages[p];
      const node = new PackageGraphNode(pkg);
      this.nodes.push(node);
      this.nodesByName[pkg.name] = node;
    }

    for (let n = 0; n < this.nodes.length; n++) {
      const node = this.nodes[n];
      const dependencies = node.package.allDependencies;
      const depNames = Object.keys(dependencies);

      for (let d = 0; d < depNames.length; d++) {
        const depName = depNames[d];
        const depVersion = dependencies[depName];
        const packageNode = this.nodesByName[depName];

        if (packageNode && semver.satisfies(packageNode.package.version, depVersion)) {
          node.dependencies.push(depName);
        }
      }
    }
  }

  get(packageName) {
    return this.nodesByName[packageName];
  }
}
