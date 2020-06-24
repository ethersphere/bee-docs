---
title: 'Introduction'
weight: 1
summary: "Background and basic information about the project."
alias: "/bee-docs/introduction.html"
---

Dear user, we are happy that you are here. Welcome to the Swarm! Whether you are hear to get all detailed intricacies of how Bee works under the hood, you just want to get to know how to start up your node or interact with other nodes; this is the place to start!
We hope that you find what you seek. If not, please reach out to us (see contact details in section bellow).

## Architecture and background
They say the Web is broken. Web 3.0 technologies offer a solution that allows for better connection between content providers and content consumers in a decentralized way, fairly compensating involved parties. Swarm addresses aspects that have not yet been addressed by other peer-to-peer technologies, aiming to be the storage and communication layer for sovereign societies.  

Swarm has an overlay layer on top of an existing underlay p2p network. The overlay network has protocols powering a distributed immutable storage of chunks. Above that are components providing high level data access and defining APIs for base-layer features. These two layers are considered core Swarm. On top of these, applications can be built.

The design principles guiding Swarm are to be:
- stable,
- scalable,
- secure,
- self-sustaining.

A detailed description of design and architecture of Swarm can be found in the [Book of Swarm](https://swarm-gateways.net/bzz:/latest.bookofswarm.eth/the-book-of-swarm.pdf) and on our [architecture](/bee-docs/architecture.html) page.

## Installation
Don't have Bee installed yet? Head over to the [installation](/bee-docs/installation.html/) section to dive into the world of Swarm!

## Usage
Do you want to know how you can use your own Bee node, or interact with the Swarm without running your own node? Please head over to the [tutorial](/bee-docs/tutorial.html) chapter.

## Development
Definitely read the [development](/bee-docs/development.html/) section if you plan to develop on top of the Swarm network, want to contribute code to Bee or if you just want to experiment with the code and your node.

## Compatiblity with the first Swarm
Ethereum Swarm Bee is the second official Ethereum Swarm implementation. No compatibility on the network layer with the first Ethereum Swarm implementation can be provided, mainly because the change in underlying network protocol from devp2p to [libp2p](https://docs.libp2p.io/). This means that a Bee node cannot join first Swarm network and vice versa. Migrating data is possible possible; the easiest way is to download your files or chunks from the old Swarm and re-upload them to your Bee node. Currently, Bee Bee provides the functionality to upload individual chunks and files.

## Community
- [Swarm Website](http://swarm.ethereum.org).
- The Swarm Website is also hosted on Swarm [https://swarm-gateways.net/bzz:/theswarm.eth/](https://swarm-gateways.net/bzz:/theswarm.eth/).
- [Community Chat on Mattermost](https://beehive.ethswarm.org/).
- [Twitter @ethswarm](https://twitter.com/ethswarm).
- [reddit channel](https://www.reddit.com/r/ethswarm/).
- [Research Forum](https://swarmresear.ch/) : Structured discussions about research and development.

## Reporting a bug and contributing
To report a bug, please use the projects [issue tracking](https://github.com/ethersphere/bee/issues).

For contributing, please read the [coding guidelines](https://github.com/ethersphere/bee/blob/master/CODING.md).
