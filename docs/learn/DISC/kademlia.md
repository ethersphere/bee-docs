---
title: Kademlia
id: kademlia
---

Kademlia is a distributed hash table (DHT) algorithm used for decentralized peer-to-peer networks. It enables efficient storage and retrieval of data by using an overlay network which enforces a specific connectivity pattern. Kademlia is based on a binary tree structure that provides a way for nodes in the network to organize themselves and locate data or other nodes efficiently without relying on a centralized authority.

Swarm employs a modified version of Kademlia to manage the routing of data between nodes in the network. 

Key features of Kademlia include:

1. **XOR Distance Metric**: Kademlia uses a unique distance metric based on the XOR (exclusive OR) between any addresses. This allows nodes to calculate "distance" from each other. Lookups are made by recursively querying nodes that are progressively closer to the target. Swarm also introduces the related concept of proximity order (PO), which is a measure of relatedness of any two addresses on a discrete scale.   

2. **Routing Table**: Each node in a Kademlia network maintains a routing table containing information about other nodes, organized by the XOR distance between node IDs. In Swarm, these nodes are divided into PO buckets, each containing a list of nodes at different PO levels.

3. **Efficient Lookup**: Efficient Lookup: To retrieve a specific chunk, a node uses Kademlia's lookup process to find and fetch the chunk from a node in the neighborhood where it is stored.

:::info
Kademlia comes in two flavors, iterative and forwarding. In iterative Kademlia, the requesting node directly queries each node it contacts for nodes that are progressively closer to the target until the node with the requested chunk is found. The chunk is then sent directly from the storer node to the node which initiated the request.

In contrast, Swarm makes use of forwarding Kademlia. Here each node forwards the query to the next closest node in the network, and this process continues until a node with the requested chunk is found. Once the chunk is found, it is sent back along the same chain of nodes rather than sent directly to the initiator of the request.

The main advantage of forwarding Kademlia is that it maintains the anonymity of the node which initiated the request.
:::

4. **Fault Tolerance**: Kademlia is resilient to node failures. Because nodes are regularly refreshed through lookups and interactions, the network remains functional even when individual nodes leave or fail.

5. **Scalability**: Kademlia's design allows it to scale to large networks, as each node only needs to keep track of a small subset of the total nodes in the network. The required set of connected peers grows logarithmically with the number of nodes, making it efficient even in large networks.


:::info
For a more in depth understanding of Swarm's specific implementation of Kademlia, refer to the second chapter of [The Book of Swarm](https://www.ethswarm.org/the-book-of-swarm-2.pdf).
:::