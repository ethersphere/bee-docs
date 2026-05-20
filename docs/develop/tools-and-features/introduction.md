---
title: Introduction
id: introduction
description: Overview of advanced tools and features available for Swarm development.
---

# Hosting Your Dapps & Storing Their Data

Swarm is hugely versatile, but at a very basic level you can think of
it as storage for your dapps data that is too big for blockchain, but
still needs to live in our totally decentralised universe. Swarm is
perfect for storing your NFT meta-data and images in a web3 way that
won't break the bank and can live forever!

## Tools and Features

Swarm is designed with decentralised applications in mind, and much time has been devoted to designing tools and features to support their prototyping and development. 

### Bee JS

Our maverick JavaScript team, the Bee-Gees (🕺), have been working hard in the last few months to build some impressive tools for all you budding dapp developer Bees to get stuck into! Find out how to use the [bee-js](./bee-js.md) JavaScript library to start creating your own that live and work on Swarm!

### Chunk Types

Swarm contains 3 types of chunks which enable us to build novel
structures of how data can be stored in the swarm - in a completely
decentralised way. Learn more about
[chunk types](./chunk-types.md)
to change the way you deal with data in your dapps forever!

### Feeds

Swarm's single owner chunks have been cleverly combined to create user
generated [feeds](./feeds.md) in the swarm, see this
example of how chunks are combined into a useful data structure you
can use to build amazing applications.

### PSS

Hey there! Pss! 🤫 Swarm's trojan chunks are implemented in Bee to
deliver [Postal Service on Swarm](./pss.md) - a
pub-sub system that provides a totally leak-proof messaging system
over the swarm.


### Gateway Proxy

If you want your users to be able to access Swarm without running
their own Bee node, for the time being you will need to make use of the [Gateway Proxy tool](https://github.com/ethersphere/gateway-proxy). Join us in the
[#builders](https://discord.gg/8SMCfvm3kw) room in our
[Discord Server](https://discord.gg/kHRyMNpw7t) for more information on how to make your Swarm based applications accessible to everyone. 



### Local Development with bee-factory

If you want to test Swarm-based applications without spending real xBZZ, [bee-factory](./dev-mode.md) is the recommended tool. It starts a full local stack — 5 Bee nodes plus a local Anvil blockchain — with a single command. The older `bee dev` mode has been sunset in favour of bee-factory.


### Starting a Test Network

While bee-factory already runs multiple nodes locally, setting up a [test network](./starting-a-test-network.md) gives you even greater control over simulating interactions between nodes in a more customised environment.

