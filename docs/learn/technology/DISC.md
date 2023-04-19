---
title: DISC
id: disc
---

DISC (Distributed Immutable Storage Cluster) is a storage solution developed by Swarm that shares many similarities with distributed hash tables (DHTs). However, the most significant difference between DISC and DHTs is that DISC does not keep a list of where files are to be found. Instead, it stores pieces of the file itself directly with the closest node(s). This approach allows for faster and more efficient retrieval of data as nodes can retrieve data from their nearest neighbours rather than having to search through a list of locations.

DISC is designed to be immutable, meaning that once data is stored on the network, it cannot be changed or deleted. This feature ensures that data remains secure and tamper-proof, making it ideal for applications where data integrity is critical.

DISC uses a content-addressed storage model, which means that data is identified by its content rather than its location. This approach allows for efficient distribution of data across the network as nodes can store and retrieve data based on its content rather than its location.

DISC also provides strong privacy guarantees by encrypting all stored data and ensuring that only authorised users have access to it. The platform offers solutions for data storage, transfer, access, and authentication with strong privacy guarantees and without borders or external restrictions.

Overall, DISC provides a fast, efficient, secure, and decentralised storage solution for applications that require immutable and tamper-proof data storage.

## Chunks 

In the DISC model, chunks are the canonical unit of data. There are two fundamental chunk types: content-addressed chunks and single-owner chunks. For both types of chunks, they share the same address space with that of the overlay addresses of nodes in the Swarm network.

Content-addressed chunks are chunks whose address is based on the hash digest of their data. Using a hash as the chunk address makes it possible to verify the integrity of chunk data. Swarm uses the BMT hash function based on a binary Merkle tree over small segments of the chunk data. A content-addressed chunk has an at most 4KB payload, and its address is calculated as the hash of the span and the Binary Merkle Tree hash of the payload.

Single-owner chunks, on the other hand, are owned by a single user and can be updated only by that user. The content of a single-owner chunk is composed of headers followed by an at most 4KB payload. The last header field is an 8-byte span prepended just like in content addressed chunks. The first two header fields provide single owner attestation of integrity: an identifier and a signature signing off on the identifier and the BMT hash of span and payload. The address is calculated as the hash of the id and signer account.

The main difference between content-addressed chunks and single-owner chunks lies in their ownership model. Content-addressed chunks can be owned by anyone who has access to them, while single-owner chunks can be updated only by their owner.

Content-addressed chunks are useful for storing immutable data such as public documents or media files that do not need to be updated frequently. They are also useful for verifying the integrity of data, as the hash of the data can be used to verify that it has not been tampered with.

Single-owner chunks, on the other hand, are useful for storing data that needs to be updated frequently or that needs to be kept private. They are owned by a single user and can be updated only by that user, which makes them ideal for storing private documents or personal data.

## Neighborhoods and Areas of Responsibility




