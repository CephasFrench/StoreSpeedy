import { StatusBar } from 'expo-status-bar';
import {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StoreMap} from "./StoreMap";
import {TSPSolver} from "./TSPSolver";
import axios, {Axios} from "axios";
import {GraphNode} from "./GraphNode";
import {Graph} from "./Graph";

export default function App() {

  useEffect(() =>{
// Example graph nodes
    const nodeA = new GraphNode("A");
    const nodeB = new GraphNode("B");
    const nodeC = new GraphNode("C");
    const nodeD = new GraphNode("D");

// Define neighbors and distances
    nodeA.neighbors = [{ node: nodeB, distance: 1 }, { node: nodeC, distance: 4 }];
    nodeB.neighbors = [{ node: nodeC, distance: 2 }, { node: nodeD, distance: 5 }];
    nodeC.neighbors = [{ node: nodeD, distance: 1 }];

// Create the graph
    const graph = new Graph([nodeA, nodeB, nodeC, nodeD]);

// Find shortest distances from nodeA using Dijkstra's algorithm
    const distances = graph.dijkstra(nodeA);

// Output the distances
    for (const node in distances) {
      console.log(`Distance from node A to ${node.name}: ${distances[node]}`);
    }

  });

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
