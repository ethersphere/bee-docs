---
title: DISC
id: disc
---

DISC (Distributed Immutable Storage of Chunks) is a storage solution developed by Swarm based on a modified implementation of a Kademlia DHT which has been specialized for data storage. DHTs are commonly used by decentralized p2p networks to store content ids mapped to a list of seeders who are able to serve that content. Swarm's implementation of a DHT differs significantly in that it stores the content in the DHT directly, rather than just storing a list of seeders who are able to serve the content. This approach allows for much faster and more efficient retrieval of data.

### Chunks 

In the DISC model, chunks are the canonical unit of data. There are two fundamental chunk types: content-addressed chunks and single-owner chunks. 

### Content-Addressed Chunks and Single-Owner Chunks

Content-addressed chunks are chunks whose address is based on the hash digest of their data. Using a hash as the chunk address makes it possible to verify the integrity of chunk data. Swarm uses the BMT hash function based on a binary Merkle tree over small segments of the chunk data. A content-addressed chunk has an at most 4KB payload, and its address is calculated as the hash of the span (chunk metadata) and the Binary Merkle Tree hash of the payload.

Single-owner chunks, on the other hand, are owned by a single owner and can be updated only by that owner. The address is calculated as the hash of a unique id and the owner's overlay address. The content consists of an arbitrary data payload along with required headers.

The main difference between content-addressed chunks and single-owner chunks lies in their ownership model. Content-addressed chunks are immutable and cannot be updated even by their original uploader, while single-owner chunks can be updated by their owner.

Content-addressed chunks are useful for storing immutable data such as public documents or media files that do not need to be updated frequently. They are also useful for verifying the integrity of data, as the hash of the data can be used to verify that it has not been tampered with.

Single-owner chunks, on the other hand, are useful for storing data that needs to be updated frequently or that needs to be kept private. They are owned by a single user and can be updated only by that user.







