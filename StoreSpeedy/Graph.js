import { GraphNode } from "./GraphNode";

export class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }

    import { GraphNode } from "./GraphNode";

export class Graph {
    constructor(nodes) {
        this.nodes = nodes;
    }

    dijkstra(startNode) {
        // Initialize distances with Infinity for all nodes except startNode
        const distances = {};
        for (const node of this.nodes) {
            distances[node] = node === startNode ? 0 : Infinity;
        }

        // Set of unvisited nodes
        const unvisited = new Set(this.nodes);

        while (unvisited.size > 0) {
            // Find the unvisited node with the smallest distance
            const minNode = Array.from(unvisited).reduce((min, node) => distances[node] < distances[min] ? node : min);

            // Remove the minNode from unvisited set
            unvisited.delete(minNode);

            // Iterate over neighbors of minNode
            for (const neighbor of minNode.neighbors) {
                // Calculate the distance to neighbor through minNode
                const distanceToNeighbor = distances[minNode] + minNode.getDistanceTo(neighbor);

                // If the distance is shorter, update it
                if (distanceToNeighbor < distances[neighbor]) {
                    distances[neighbor] = distanceToNeighbor;
                }
            }
        }
        return distances;
    }
}
