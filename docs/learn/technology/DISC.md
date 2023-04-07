---
title: DISC
id: disc
---

DISC (Distributed Immutable Storage Cluster) is a storage solution developed by Swarm that shares many similarities with distributed hash tables (DHTs). However, the most significant difference between DISC and DHTs is that DISC does not keep a list of where files are to be found. Instead, it stores pieces of the file itself directly with the closest node(s). This approach allows for faster and more efficient retrieval of data as nodes can retrieve data from their nearest neighbours rather than having to search through a list of locations.

DISC is designed to be immutable, meaning that once data is stored on the network, it cannot be changed or deleted. This feature ensures that data remains secure and tamper-proof, making it ideal for applications where data integrity is critical.

DISC uses a content-addressed storage model, which means that data is identified by its content rather than its location. This approach allows for efficient distribution of data across the network as nodes can store and retrieve data based on its content rather than its location.

DISC also provides strong privacy guarantees by encrypting all stored data and ensuring that only authorised users have access to it. The platform offers solutions for data storage, transfer, access, and authentication with strong privacy guarantees and without borders or external restrictions.

Overall, DISC provides a fast, efficient, secure, and decentralised storage solution for applications that require immutable and tamper-proof data storage.

