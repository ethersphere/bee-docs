---
title: Kademlia
id: kademlia
---

### What is Kademlia?

Kademlia is a distributed hash table (DHT) for decentralized peer-to-peer computer networks, which is designed to provide a more efficient and scalable means for node lookup and data storage across a distributed system. It was introduced by Petar Maymounkov and David Mazières in 2002 in a paper titled "Kademlia: A Peer-to-peer Information System Based on the XOR Metric." A version of Kademlia which has been specialized for data storage forms the basis of Swarm's [DISC storage model](/docs/learn/technology/DISC).

### Kademlia Distance

Kademlia distance is a metric used to measure the "closeness" between nodes in a peer-to-peer network. Note Kademlia distance has no relation to geographical distance. Nodes which have a very small Kademlia distance may be very far from each other geographically. The distance is calculated using the bitwise exclusive or (XOR) operation on the node identifiers (IDs) and is crucial for organizing and searching the network efficiently.

Node IDs are typically generated using a cryptographic hash function, resulting in a large fixed-size bit string (e.g., 160 bits for the original Kademlia implementation). To calculate the Kademlia distance between two nodes, their IDs are XOR'd bitwise, and the resulting bit string is treated as an integer. The integer value represents the distance between the nodes in the Kademlia DHT.

By using this distance metric, Kademlia can quickly and efficiently locate nodes or data within the distributed network. When searching for a node or a piece of data, the algorithm proceeds iteratively, querying the closest known nodes to the target ID and refining the search with each iteration until the target is found.

Kademlia relies on a unique distance metric based on the XOR operation (exclusive or) to organize nodes and data within the network. This metric provides several benefits, such as:

  * Deterministic and symmetric: The distance between any two nodes remains the same, regardless of which node is measuring it.
  * Unidirectional: The distance between two nodes doesn't change based on their position in the network.
  * High probability of unique distances: The XOR metric ensures a low probability of collisions, resulting in a more even distribution of nodes.

In Kademlia, each node has a unique identifier (ID), typically generated from a cryptographic hash function. Nodes are organized into a binary tree-like structure called a "k-bucket" system, where each bucket contains nodes with a certain range of distances from the node. As the distance from the node increases, the size of the range covered by each bucket grows.

Kademlia uses an iterative lookup algorithm for node and data lookups. When a node wants to find another node or data, it starts by querying the closest known nodes to the target ID. These nodes, in turn, respond with information about the closest nodes they know, and the process continues until the target node or data is found.

Kademlia has been used as the basis for various peer-to-peer applications, including the BitTorrent protocol's Distributed Hash Table (DHT) and the Ethereum network's node discovery protocol.

## How Swarm Uses Kademlia

While Kadamlia and other DHTs are commonly used by decentralized data storage networks, they typically are used only for storing references to where the data is stored. Swarm's implementation differs in that the data is broken into chunks and stored in the Kademlia DHT itself. Swarm uses Kademlia as a key building block of its DISC storage model. For more details, see the [DISC](/docs/learn/technology/DISC) section.

