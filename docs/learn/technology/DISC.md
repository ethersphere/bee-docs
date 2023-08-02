---
title: DISC
id: disc
---

DISC (Distributed Immutable Storage of Chunks) is a storage solution developed by Swarm based on a modified implementation of a [Kademlia DHT](/docs/learn/glossary#kademlia  ) which has been specialized for data storage. Swarm's implementation of a DHT differs significantly in that it stores the content in the DHT directly, rather than just storing a list of seeders who are able to serve the content. This approach allows for much faster and more efficient retrieval of data.

### Kademlia Topology and Routing

Each node within Swarm connects to a certain number of its peers. When a chunk is first inserted into the network, the uploading node will send it to the peer which is closest (as measured by [proximity order](/docs/learn/glossary#proximity-order-po), which is based on a measure of [Kademlia distance](/docs/learn/glossary#kademlia-distance)) to the destination of the chunk, and then the recipient node will then forward the chunk on to its peer which is closest to the destination of the chunk, and so on until the chunk arrives at its destination. 

One of the advantages of using Kademlia as a model for network topology is that both the number of forwarding "hops" required to route a chunk to its destination and the number of peer connections required to maintain Kademlia topology are logarithmic to the size of the network (a minimum of two connections is required in order to maintain Kademlia topology in case of network churn - nodes dropping in and out of the network). This makes Swarm a highly scalable system which is efficient even at very large scales. 

### Neighborhoods

Neighborhoods are groups of nodes which are responsible for sharing the same chunks. The chunks which each neighborhood is responsible for storing are defined by the proximity order of the nodes and the chunks. In other words, each node is responsible for storing chunks with which their overlay addresses share a certain number of prefix bits, and together with other nodes which share the same prefix bits, make up neighborhoods which share the responsibility for storing the same chunks. 


### Chunks 

In the DISC model, chunks are the canonical unit of data. When a file is uploaded to Swarm, it gets broken down into 4kb pieces with attached metadata. The pieces then get distributed amongst nodes in the Swarm network based on their [overlay addresses](/docs/learn/glossary#overlay). There are two fundamental chunk types: content-addressed chunks and single-owner chunks. 

### Content-Addressed Chunks and Single-Owner Chunks

Content-addressed chunks are chunks whose address is based on the hash digest of their data. Using a hash as the chunk address makes it possible to verify the integrity of chunk data. Swarm uses the BMT hash function based on a binary Merkle tree over small segments of the chunk data. A content-addressed chunk has an at most 4KB payload, and its address is calculated as the hash of the span (chunk metadata) and the Binary Merkle Tree hash of the payload.

For single-owner chunks on the other hand, the address is calculated as the hash of a unique id and the owner's overlay address. The content consists of an arbitrary data payload along with required headers. Unlike a content-addressed chunk, the contents of a single-owner chunk may be updated while the address remains unchanged. Single owner chunks form the basis for feeds, which are data structures that allow for mutable content with a static address.

### Push-Sync, Pull-Sync, and Retrieval Protocols

When a file is first uploaded to Swarm, it gets broken down by the uploading Bee node chunks which are then distributed amongst other Bee nodes in the Swarm network. Chunks get distributed to the target neighborhood by the ***push-sync*** protocol. Once a chunk reaches its destination, it will then be duplicated and synced to other nodes in order to achieve data redundancy through the ***pull-sync*** protocol. The pull-sync protocol operates continuously as nodes enter or exit the network – ensuring that data redundancy is always maintained. When a client node requests a file for download, its request gets forwarded by the ***retrieval-protocol*** to all the nodes storing the relevant chunks, and then those chunks get returned to the requesting node and the file gets reconstructed from its constituent chunks.  


