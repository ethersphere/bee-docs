---
title: What is Swarm?
id: what-is-swarm
---

The complete vision of Swarm is described in detail in [The Book of Swarm](https://www.ethswarm.org/The-Book-of-Swarm.pdf) written by Swarm founder Viktor Tron. This section contains a brief overview of Swarm as described in The Book of Swarm. 

Swarm is a decentralised storage and communication infrastructure that provides a secure, reliable, and scalable platform for hosting, moving, and processing data in a peer-to-peer network.

Swarm can be divided into four main parts:

1. Underlay Network - A peer-to-peer network protocol to serve as underlay transport. 
2. Overlay Network - An overlay network with protocols powering a distributed immutable storage of chunks (fixed size data blocks).
3. Data Acccess Layer - A component providing high-level data access and defining APIs for base-layer features.
4. Application Layer - An application layer defining standards and outlining best practices for more elaborate use-cases.


## 1. Underlay Network

The first part of Swarm is a peer-to-peer network protocol that serves as the underlay transport. The underlay transport layer is responsible for establishing connections between nodes in the network and routing data between them. It provides a low-level communication channel that enables nodes to communicate with each other directly, without relying on any centralised infrastructure.

Swarm is designed to be agnostic of the particular underlay transport used, as long as it satisfies certain requirements.  

1. Addressing – Nodes are identified by their underlay address.
2. Dialling – Nodes can initiate a direct connection to a peer by dialing them on
their underlay address.
3. Listening – Nodes can listen to other peers dialing them and can accept incoming
connections. Nodes that do not accept incoming connections are called light
nodes.
4. Live connection – A node connection establishes a channel of communication which
is kept alive until explicit disconnection, so that the existence of a connection
means the remote peer is online and accepting messages.
5. Channel security – The channel provides identity verification and implements
encrypted and authenticated transport resisting man in the middle attacks.
6. Protocol multiplexing – The underlay network service can accommodate several
protocols running on the same connection. 
7. Delivery guarantees – Protocol messages have guaranteed delivery, i.e. delivery
failures due to network problems result in direct error response. Order of delivery
of messages within each protocol is guaranteed. 
8. Serialisation – The protocol message construction supports arbitrary data structure
serialisation conventions.

As the [libp2p](https://libp2p.io/) library meets all these requirements it has been used to build the Swarm underlay network.


## 2. Overlay Network

The second part of Swarm is an overlay network with protocols powering a [distributed immutable storage of chunks (DISC)](/docs/learn/technology/DISC/). This layer is responsible for storing and retrieving data in a decentralised and secure manner.

Swarm's overlay network is built on top of the underlay transport layer and uses [Kademlia](/docs/learn/technology/kademlia/) overlay routing to enable efficient and scalable communication between nodes. Kademlia is a distributed hash table (DHT) algorithm that allows nodes to locate each other in the network based on their unique identifier or hash.

Swarm's DISC is an implementation a Kademlia DHT designed optimized for storage. While the use of DHTs in distributed data storage protocols is common, for many implementations DHTs are used only for indexing of specific file locations. Swarm's DISC distinguishes itself from other implementations by instead breaking files into chunks and storing the chunks themselves directly within a Kademlia DHT.

Each chunk has a fixed size of 4kb and is distributed across the network using the DISC model. Each chunk has a unique address taken from the same namespace as the network node addresses that allows it to be located and retrieved by other nodes in the network.

Swarm's distributed immutable storage provides several benefits, including data redundancy, tamper-proofing, and fault tolerance. Because data is stored across multiple nodes in the network, it can be retrieved even if some nodes fail or go offline.

## 3. Data Access Layer

The third part of Swarm is a component that provides high-level data access and defines APIs for base-layer features. This layer is responsible for providing an easy-to-use interface for developers to interact with Swarm's underlying storage and communication infrastructure.

Swarm's high-level data access component provides several APIs that allow developers to perform various operations on the network, including uploading and downloading data and searching for content. These APIs are designed to be simple and intuitive, making it easy for developers to build decentralised applications on top of Swarm.

One of the key features of Swarm's high-level data access component is its support for content addressing. Content addressing allows developers to retrieve data based on its content rather than its location in the network. This makes it possible to build applications that are more resilient to node failures and network disruptions.

Swarm's high-level data access component also supports smart contracts, which are self-executing contracts with the terms of the agreement between buyer and seller being directly written into lines of code. Smart contracts can be used to automate various aspects of application development, such as managing user identities or enforcing payment terms.

Overall, Swarm's high-level data access component provides a powerful set of tools for building decentralised applications on top of Swarm's underlying infrastructure. By abstracting away many of the complexities of working with a peer-to-peer network, this layer makes it easier for developers to build secure, reliable, and scalable applications that can run without relying on any centralised infrastructure.

## 4. Application Layer 

The fourth part of Swarm is an application layer that defines standards and outlines best practices for more elaborate use-cases. This layer is responsible for providing guidance to developers on how to build complex applications on top of Swarm's underlying infrastructure.

Swarm's application layer provides a set of standards and best practices that developers can follow when building decentralised applications. These standards cover a wide range of topics, including data storage, communication protocols, security, and user experience.

One of the key features of Swarm's application layer is its support for interoperability with other decentralised technologies. This allows developers to build applications that can interact with other decentralised platforms and services, such as blockchain networks or identity providers.

Swarm's application layer also provides guidance on how to build applications that are resilient to various types of attacks, such as denial-of-service attacks or Sybil attacks. By following these best practices, developers can ensure that their applications are secure and reliable even in the face of malicious actors.

