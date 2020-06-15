---
title: 'Introduction'
weight: 1
summary: "Background and basic information about the project."
---

**"Storage and communication infrastructure for a sovereign digital society."**

# Compatibility
<!-- https://raw.githubusercontent.com/ethersphere/bee/master/README.md -->

Ethereum Swarm Bee is the second official Ethereum Swarm implementation. This project is in very early stage and under active development.
No compatibility with the first Ethereum Swarm implementation is provided, mainly because the change in underlying protocol from devp2p to libp2p. A Bee node cannot join first Swarm network and vice versa.

API compatibility will be guaranteed when version 1.0 is released, but not before that.

## Development status
Uploaded **content is not guaranteed to persist on the network** until storage insurance is implemented. All participating nodes should consider participation a voluntary service with no formal obligation whatsoever and should be expected to delete content at their will. Therefore, users should under no circumstances regard Swarm as safe storage until the incentive system is functional.

## Background
They say the Web is broken. Web 3.0 technologies offer a solution that allows for better connection between content providers and content consumer in a decentralized way, fairly compensating involved parties. Swarm addresses aspects that have not yet been addressed by peer-to-peer technologies, aiming to be the storage and communication layer for sovereign societies.  

## Basics
The design principles guiding Swarm are to be:
- stable,
- scalable,
- secure,
- self-sustaining.

Swarm has an overlay layer on top of an existing underlay p2p network. The overlay network has protocols powering a distributed immutable storage of chunks. Above that are components providing high level data access and defining APIs for base-layer features. These two layers are considered core Swarm. On top of these, applications can be built.

A detailed description of design and architecture of Swarm can be found in the [Book of Swarm](https://swarm-gateways.net/bzz:/latest.bookofswarm.eth/the-book-of-swarm-viktor-tron-v0.1-pre-release.pdf).


## Community

- [Swarm Website](http://swarm.ethereum.org) : The Swarm Website is served from Swarm itself (using the Swarm gateway https://swarm-gateways.net/bzz:/theswarm.eth/).
- [Community Chat on Mattermost](https://beehive.ethswarm.org/)
- [Twitter @ethswarm](https://twitter.com/ethswarm)
- [reddit channel](https://www.reddit.com/r/ethswarm/)
- [Research Forum](https://swarmresear.ch/) : Structured discussions about research and development.

## Reporting a bug and contributing
To report a bug, please use the projects [issue tracking](https://github.com/ethersphere/bee/issues).

For contributing, please read the [coding guidelines](https://github.com/ethersphere/bee/blob/master/CODING.md).
