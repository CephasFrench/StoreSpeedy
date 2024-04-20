export class TSPSolver {
    constructor(storeMap) {
        this.storeMap = storeMap;
    }

    // Helper function to calculate the distance between two nodes
    distance(node1, node2) {
        // Assuming all edges have equal weight for simplicity
        return 1;
    }

    // Helper function to calculate the total distance of a path
    calculatePathDistance(path) {
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            totalDistance += this.distance(path[i], path[i + 1]);
        }
        // Add distance from last node back to the starting node
        totalDistance += this.distance(path[path.length - 1], path[0]);
        return totalDistance;
    }

    // Helper function to generate all permutations of a given array
    generatePermutations(array) {
        const permutations = [];

        const permute = (arr, m = []) => {
            if (arr.length === 0) {
                permutations.push(m);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    const curr = arr.slice();
                    const next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        };

        permute(array);
        return permutations;
    }

    // Brute-force solution to TSP
    solveBruteForce() {
        const nodes = this.storeMap.itemNodes;
        const numNodes = nodes.length;

        // Generate all possible permutations of nodes
        const permutations = this.generatePermutations(nodes);

        let shortestPath = null;
        let shortestDistance = Infinity;

        // Iterate through all permutations and calculate their distances
        for (const permutation of permutations) {
            const distance = this.calculatePathDistance(permutation);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                shortestPath = permutation;
            }
        }

        return shortestPath;
    }
}