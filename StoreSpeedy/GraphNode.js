export class GraphNode {
    constructor(name) {
        this.name = name;
        this.neighbors = [];
    }

    addNeighbor(node, distance) {
        this.neighbors.push({ node, distance });
    }

    getDistanceTo(neighborNode) {
        for (const neighbor of this.neighbors) {
            if (neighbor.node === neighborNode) {
                return neighbor.distance;
            }
        }
        // If neighborNode is not found among neighbors, return Infinity
        return Infinity;
    }
}
