---
title: Core Concepts
id: core-concepts
---

The following is a list of key concepts and terms and explanations along with examples.  



### Kademlia

Kademlia is a distributed hash table (DHT) which is commonly used in distributed peer-to-peer networks. A hash table is a commonly used data structure where unique keys are mapped to values. A distributed hash table is a type of hash table which is designed to be stored across a decentralized group of nodes in order to be persistent and fault tolerant. It is designed so that each node is only required to store a subset of the total set of key / value pairs. One of the unique features of the Kademlia DHT design is a distance metric based on the XOR bitwise operation. It is referred to as “Kademlia distance” or just “distance. Swarm’s DISC uses a modified version of Kademlia which has been specialized for storage purposes, and understanding the concepts behind Kademlia is necessary for understanding Swarm.

### Kademlia distance
Within Kademlia, nodes have numeric ids with the same length and format taken from the same namespace as the keys of the key/value pairs. Kademlia distance between node ids and keys is calculated through the XOR bitwise operation done over any ids or keys. 


Note: For a Kademlia DHT, any standardized numerical format can be used for ids. However, within Swarm, ids are derived from a Keccak256 digest and are represented as 256 bit hexadecimal numbers. They are referred to as addresses or hashes.

Example:   We have a Kademlia DHT consisting of only ten nodes with ids of 1 - 10. We want to find the distance between node 4 and 7. In order to do that, we perform the XOR bitwise operation:

4 | 0100   
7 | 0111  
————XOR  
3 | 0011  

And we find that the distance between the two nodes is 3. 

### Overlay Network

Swarm’s overlay network is the logical network which forms a Kademlia topology.  

### Underlay Network

Swarm’s underlay network is the physical network through which nodes communicate. It’s based on the popular libp2p library for peer-to-peer networks.

### Overlay Address

Overlay addresses are a Keccak256 hash of a node’s Gnosis Chain address and the Swarm network ID (the Swarm network ID is included to prevent address collisions). The overlay address for a node does not change over time and is a permanent identifier for the node. If not otherwise specified, when referring to a “node address”, it typically is referring to the overlay address, not the underlay address. The overlay address is the address used to determine which nodes connect to each other and which chunks nodes are responsible for.

### Chunk

When data is uploaded to Swarm, it is broken down into 4kb sized pieces which are each assigned an address in the same format as node’s overlay addresses. Chunk addresses are formed by taking the BMT hash of the chunk content along with an 8 byte measure of the number of the chunk’s child chunks, the `span`. The BMT hashing algorithm is based on the Keccac256 hashing algorithm, so it produces an address with the same format as that for the node overlay addresses.

### Proximity Order (PO)

Proximity Order is a concept defined in The Book of Swarm and is closely related to Kademlia distance. Proximity order is defined as the number of shared prefix bits of any two addresses. It is found by performing the XOR bitwise operation on the two addresses and counting how many leading 0 there are before the first 1. In other words, PO is equal to the number of shared binary prefix bits.

Taking the previous example used in the Kademlia distance definition:

4 | 0100   
7 | 0111  
————XOR  
3 | 0011  

In the result we find that the distance is 3, and that there are two leading zeros. Therefore for the PO of these two nodes is 2.


Both Proximity Order and distance are measures of the relatedness of ids, however Kademlia distance is a more exact measurement. 


Taking the previous example used in the Kademlia distance definition:  

5 | 0101   
7 | 0111  
————XOR  
2 | 0010  

Here we find that the distance between 5 and 7 is 2, and the PO is also two. Although 5 is closer to 7 than 4 is to 7, they both fall within the same PO, since PO is only concerned with the shared leading bits. PO is a fundamental concept to Swarm’s design and is used as the basic unit of relatedness when discussing the addresses of chunks and nodes. PO is also closely related to the concept of depth.   

### Depth types

There are three fundamental categories of depth:
 
### Topology related depth

This depth is defined in relation to the connection topology of a single node as the subject in relation to all the other nodes it is connected to. It is referred to using several different terms which all refer to the same concept (Connectivity depth / Kademlia depth / neighbourhood depth / physical depth)
 
### Area of responsibility related depths

Area of responsibility refers to which chunks a node is responsible for storing. There are 2 concepts of depth related to a node’s area of responsibility - storage depth and reserve depth. They are defined in relation to a node and postage stamps - described more fully below. 
 
### Postage stamp batch and chunk related depths

There are several concepts of depth defined in relation to a postage stamp batch and its chunks - batch depth, bucket depth, and collision depth - see more below.

### Connectivity depth 
Connectivity depth (aka Kademlia depth / neighbourhood depth / physical depth) - The saturation level of the node’s topology - the level to which the topology of a node’s connections has Kademlia connectivity. Defined as one level deeper than the deepest fully saturated level. A PO is defined as saturated if it has at least the minimum required level of connected nodes, which is set at 8 nodes in the current implementation of Swarm.  

The output from the Bee debug API's `topology` endpoint:


![](/img/depths1.png)

Here we can see the depth is 8, meaning that PO bin 7 is the deepest fully saturated PO bin:

![](/img/depths2.png) 

Here we can confirm that at least 8 nodes are connected in bin 7.

Connectivity depth is defined from the point of view of individual nodes, it is not defined as characteristic of the entire network. However, given a uniform distribution of node ids within the namespace and given enough nodes, all nodes should converge towards the same connectivity depth. 

While this is sometimes referred to as Kademlia depth, the term “Kademlia depth” is not defined within the original Kademlia paper, rather it refers to the depth at which the network in question (Swarms) has the characteristics which fulfill the requirements described in the Kademlia paper.

### Batch depth
Batch depth is the value `d` which is defined in relation to the size of a postage stamp batch. The size of a batch is defined as the number of chunks which can be stamped by that batch (also referred to as the number of slots per batch, with one chunk per slot). The size is calculated by:

* $$2^{d}$$
* $$d$$ is a value selected by the batch issuer which determines how much data can be stamped with the batch



