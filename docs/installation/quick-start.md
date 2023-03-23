---
title: Quick Start
id: quick-start
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Bee is a versatile piece of software that caters to a diverse array of use cases. It can be run in several different modes which each offer different features:

1. **Ultra-light Node:** 
  Ultra-light nodes may download only within the free limits allowed by other nodes. They have no blockchain connection, so cannot use xBZZ to pay for downloads over the thresholds set by full nodes they connect to. Supports PSS messaging. May be turned on and off without affecting node state.
2. **Light Node:** Light nodes can download and upload from Swarm. They have a blockchain connection so can exceed the free limit by paying for services with xBZZ. May be turned on and off without affecting node state.
3. **Full Node:** In addition to supporting all the features of light nodes, full nodes can earn xBZZ by staking xBZZ and providing services to other nodes in the Swarm network.  


### Ultra-light and Light Nodes

If you want to interact with the Bee ecosystem in a decentralised way,
but not earn xBZZ by storing or forwarding chunks, simply run a Bee
[light node](/docs/access-the-swarm/light-nodes) in the background on
your laptop or desktop computer. This will enable direct access to the
Swarm network from your web browser and other applications.

If you only need to download a small amount of data from the Swarm network an [ultra light node](/docs/access-the-swarm/ultra-light-nodes) could be the right choice for you. This will allow you to download a limited amount of data but does not support uploading data.

To run a light or ultra-light node [install Bee](/docs/installation/install) with the recommended configuration settings for your chosen node type.

:::info
The [Swarm Desktop app](https://www.ethswarm.org/build/desktop) offers an easy way to automatically set up a light or ultra-light node and interact with it through a graphical user interface.
:::

### Support the Network and Earn xBZZ by Running a Full Node

Earn [BZZ](/docs/working-with-bee/cashing-out) and help keep the swarm
strong by running your own **full node**. It's easy to set up your own
Bee on a small computer like a Raspberry Pi 4, cloud
host, or any home computer that's connected to the internet.

To run a full node [install Bee](/docs/installation/install) with the recommended configuration settings for a full node.

### Run Your Own Hive of Nodes

Take it to the next level by keeping a whole hive of Bees! We provide
tooling and monitoring to help you manage large deployments of
multiple Bee nodes: [Bee Hives](/docs/installation/hive).

