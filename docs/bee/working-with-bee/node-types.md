---
title: Node Types
id: node-types
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Bee nodes can operate in three different modes depending on the user's needs, ranging from full-featured nodes that contribute to the network and earn incentives to lightweight modes that allow for basic interaction with minimal resource requirements. This guide outlines the three primary node types — **_Full_**, **_Light_**, and **_Ultra-Light_** — along with their configurations, capabilities, and limitations.

Choosing the right node type depends on your goals, whether it's participating in the Swarm network as a storage provider, developing applications which make use of Swarm's decentralized storage, or simply exploring the technology with minimal setup.


## Node Types Overview

Bee can operate in different modes, each tailored to specific use cases:

| Feature                                                                 | Full Node | Light Node | Ultra-Light Node |
| ----------------------------------------------------------------------- | --------- | ---------- | ---------------- |
| Free tier [downloads](/docs/develop/access-the-swarm/upload-and-download)                                                     | ✅        | ✅         | ✅               |
| [Uploading](/docs/develop/access-the-swarm/upload-and-download) (Can purchase [postage stamp batches](/docs/develop/access-the-swarm/buy-a-stamp-batch))                          | ✅        | ✅         | ❌               |
| Can exceed free tier downloads                                          | ✅        | ✅         | ❌               |
| Storage sharing                                                         | ✅        | ❌         | ❌               |
| [Storage incentives](/docs/bee/working-with-bee/staking/)               | ✅        | ❌         | ❌               |
| [Bandwidth incentives](/docs/concepts/incentives/bandwidth-incentives/) | ✅        | ❌         | ❌               |
| [PSS messaging](/docs/develop/tools-and-features/pss)                   | ✅        | ❌         | ❌               |
| Gnosis Chain RPC                                                        | ✅        | ✅         | ❌               |

## Full Node

Full nodes are the most feature-rich nodes in the Swarm network. They provide full upload and download capabilities, store and serve data, and participate in storage and bandwidth incentives. Running a full node requires more system resources, but it allows users to fully engage with and support the network.

Full nodes are ideal for users who want to contribute to the Swarm network and earn incentives, as well as developers who require access to all Bee features including messaging features such as PSS and GSOC.


### Recommended Specifications

:::warning
Full nodes require significant system resources, including storage and bandwidth. Additionally, they must be connected to the blockchain to participate in incentives. 

If you intend to participate in the redistribution game to earn storage incentives, you should test your setup using [the `/rchash` endpoint](/docs/bee/working-with-bee/bee-api/#rchash) in order to ensure that your hardware is sufficient. Participation in the redistribution game requires process with high computational and memory requirements along with significant bandwidth usage.
:::

Requires significant storage and processing power compared to other node types:

- **Processor**: Recent 2 GHz dual-core.
- **RAM**: 8 GB.
- **Storage**: 30 GB SSD (HDD not recommended).
- **Internet**: High-speed and stable connection.

### Configuration

To run Bee as a full node, set:

- `full-node: true`
- `swap-enable: true`
- `blockchain-rpc-endpoint` to a valid Gnosis Chain RPC URL

**Key characteristics:**

- Can upload and download data.
- Can purchase and manage postage stamp batches in order to pay for uploading data.
- Can share disk space with the network and store chunks from Swarm uploaders.
- Can earn xBZZ by staking xBZZ and participating in the storage incentive system.
- Can earn xBZZ by participating in the bandwidth incentives system.
- Requires a Gnosis Chain RPC endpoint for blockchain connectivity.
- Supports full PSS messaging and GSOC.


## Light Node

Light nodes provide a balance between functionality and resource efficiency. They can upload and download data but do not participate in chunk forwarding or storage for other nodes.

Light nodes are suited for users who want to interact with Swarm without the overhead of running a full node. They can serve the needs of developers who need to access Swarm's download / upload features but do not need advanced messaging features such as PSS and GSOC which are available only in full nodes.

Light node operators cannot earn xBZZ by participating in Swarm's incentives systems as they do not participate in chunk forwarding or storage but only consume services, paying xBZZ for downloading data from full nodes and buying postage stamp batches for uploading data.

:::info
Light nodes do not benefit from plausible deniability when requesting data from the network. They are always the originator of requests.
:::

### Recommended Specifications

No specific hardware is required to run a light node. It can run well on practically any commercially available computer released in recent years, including lightweight single-board computers such as [Raspberry Pi](https://en.wikipedia.org/wiki/Raspberry_Pi). Your downloads / uploads may be limited by your network speed, however, so if you plan on interacting extensively with the Swarm network, you should take your connection speed into consideration.

### Configuration

To run Bee as a light node, set:

- `full-node: false`
- `swap-enable: true`
- `blockchain-rpc-endpoint` to a valid Gnosis Chain RPC URL

**Key characteristics:**

- Can upload and download data.
- Can purchase and manage postage stamp batches in order to pay for uploading data.
- Requires a Gnosis Chain RPC endpoint for blockchain connectivity.


**Limitations:**

- Cannot share disk space with the network and store chunks from Swarm uploaders.
- Cannot earn xBZZ by staking xBZZ and participating in the storage incentive system.
- Cannot earn xBZZ by participating in the bandwidth incentives system.
- Can send PSS messages but ***cannot*** receive.
- Can send outgoing GSOC updates but ***cannot*** receive.


## Ultra-Light Node

Ultra-light nodes allow users to try running a node without requiring a blockchain RPC endpoint. These nodes can download data within the free consumption threshold set by full nodes (this threshold may vary since it is [configurable](/docs/bee/working-with-bee/configuration) by full node operators using the `payment-tolerance-percent` and `payment-threshold` options).

Ultra-light nodes are designed for users who want to access the Swarm network with minimal resource requirements. These nodes can download data within the free consumption threshold but do not support uploads and cannot earn xBZZ by participating in Swarm's incentives systems. 

As with light nodes, your node's download speed will be limited by your network speed (however this may be less important of a consideration given that an ultra-light node is restricted to downloading within free tier limits anyway).

:::warning
As with light nodes, ultra-light nodes do not benefit from plausible deniability when requesting data from the network.

When running without a blockchain connection, bandwidth incentive payments (SWAP) cannot be made, so there is a risk of getting blocklisted by other peers for exceeding their free tier download limits.
:::

### Recommended Specifications

As with the light node, there are no specific requirements to run an ultra-light node, and it will run on practically any commercially available hardware from recent years.   

### Configuration

Bee will start in ultra-light mode by default, but in order to explicitly configure your node to run as an ultra-light node, use the following options:

- Set `full-node: false`
- Set `blockchain-rpc-endpoint` to an empty string "" (or comment it out / remove it).
- Set `swap-enable: false`

**Key characteristics:**

- Can download small amounts of data.

**Limitations:**
- Cannot upload data.
- Cannot purchase postage stamps.
- Cannot share disk space with the network and store chunks from Swarm uploaders.
- Cannot earn xBZZ by staking xBZZ and participating in the storage incentive system.
- Cannot earn xBZZ by participating in the bandwidth incentives system.
- Cannot use PSS or GSOC, either for sending or receiving.

