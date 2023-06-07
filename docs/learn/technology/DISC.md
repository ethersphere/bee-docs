---
title: DISC
id: disc
---

DISC (Distributed Immutable Storage of Chunks) is a storage solution developed by Swarm based on a modified implementation of a [Kademlia DHT](/docs/learn/glossary#kademlia  ) which has been specialized for data storage. DHTs are commonly used by decentralized p2p networks to store content ids mapped to a list of seeders who are able to serve that content. Swarm's implementation of a DHT differs significantly in that it stores the content in the DHT directly, rather than just storing a list of seeders who are able to serve the content. This approach allows for much faster and more efficient retrieval of data.

### Chunks 

In the DISC model, chunks are the canonical unit of data. When a file is uploaded to Swarm, it gets broken down into 4kb pieces with attached metadata. The pieces then get distributed amongst nodes in the Swarm network based on their [overlay addresses](/docs/learn/glossary#overlay). There are two fundamental chunk types: content-addressed chunks and single-owner chunks. 

### Content-Addressed Chunks and Single-Owner Chunks

Content-addressed chunks are chunks whose address is based on the hash digest of their data. Using a hash as the chunk address makes it possible to verify the integrity of chunk data. Swarm uses the BMT hash function based on a binary Merkle tree over small segments of the chunk data. A content-addressed chunk has an at most 4KB payload, and its address is calculated as the hash of the span (chunk metadata) and the Binary Merkle Tree hash of the payload.

For single-owner chunks on the other hand, the address is calculated as the hash of a unique id and the owner's overlay address. The content consists of an arbitrary data payload along with required headers. Unlike a content-addressed chunk, the contents of a single-owner chunk may be updated while the address remains unchanged. Single owner chunks form the basis for feeds, which are data structures that allow for mutable content with a static address.