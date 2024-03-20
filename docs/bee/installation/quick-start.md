---
title: Quick Start
id: quick-start
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Bee is a versatile piece of software that caters to a diverse array of use cases. It can be run in several different modes which each offer different features which are best suited for different users. There are three main categories of nodes: full nodes, light nodes, and ultra-light nodes.

### Comparison of Node Types
| Feature      | Full Node | Light Node |Ultra-light Node|
|--------------|-----------|------------|------------|
| Downloading  | ✅        |   ✅      |✅         |        |
| Uploading     | ✅       |   ✅      |  ❌  |
| Can exceed free download limits by paying xBZZ  | ✅       |   ✅      |❌ 
|Storing & sharing data|✅|    ❌      |❌|
|Storage incentives|✅|        ❌      |❌|
|SWAP incentives|✅|           ✅      |❌|
|PSS messaging|✅|             ✅      |✅ |
|Gnosis Chain Connection|✅|             ✅      |❌  |


:::info 
The Swarm network includes two incentives protocols which each give Bee nodes incentives to participate in maintaining the network in a healthy way.
### Storage incentives:**
  By participating in the storage incentives protocol, full nodes which store and share data chunks with the network have a chance to earn xBZZ. Staked xBZZ is required to earn storage incentives. Learn more in the [staking section](/docs/bee/working-with-bee/staking).
### SWAP incentives:**
  The SWAP incentives protocol encourages full or light (but not ultra-light) nodes to share bandwidth with other nodes in exchange for payments from other nodes either [in-kind](https://www.investopedia.com/terms/p/paymentinkind.asp) or as a cheque to be settled at a future date. SWAP requires a chequebook contract to be set up on Gnosis Chain for each participating node. 
:::






## Which type of node is the right choice?
Different node types best suit different use cases:

### Interact with the Swarm network

If you want to interact with the Bee ecosystem in a decentralised way,
but not earn xBZZ by storing or forwarding chunks, simply run a Bee
[light node](/docs/bee/working-with-bee/light-nodes) in the background on
your laptop or desktop computer. This will enable direct access to the
Swarm network from your web browser and other applications.

If you only need to download a small amount of data from the Swarm network an [ultra light node](/docs/develop/access-the-swarm/ultra-light-nodes) could be the right choice for you. This will allow you to download a limited amount of data but does not support uploading data.

To run a light or ultra-light node [install Bee](/docs/bee/installation/install) with the recommended configuration settings for your chosen node type.

:::info
The [Swarm Desktop app](https://www.ethswarm.org/build/desktop) offers an easy way to automatically set up a light or ultra-light node and interact with it through a graphical user interface.
:::

### Support the Network and Earn xBZZ by Running a Full Node

Earn [xBZZ](/docs/bee/working-with-bee/cashing-out) and help keep the swarm
strong by running your own **full node**. It's easy to set up your own
Bee on a small computer like a Raspberry Pi 4, cloud
host, or any home computer that's connected to the internet.

To run a full node [install Bee](/docs/bee/installation/install) with the recommended configuration settings for a full node.

:::info
Staking is not required to run a full node, but is necessary to earn storage incentives.  An altruistic person may want to run a full node without putting up any stake, and in fact, could possibly earn enough xBZZ from bandwidth (swap/cheque) compensation to be able to stake at some point in the future. Learn more in the [staking section](/docs/bee/working-with-bee/staking)
:::
### Run Your Own Hive of Nodes

Take it to the next level by keeping a whole hive of Bees! We provide
tooling and monitoring to help you manage large deployments of
multiple Bee nodes: [Bee Hives](/docs/bee/installation/hive).

