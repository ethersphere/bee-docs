---
title: Node Types
id: node-types
---

Bee nodes can operate in different modes depending on the user's needs, ranging from full-featured nodes that contribute to the network and earn incentives to lightweight modes that allow for basic interaction without significant resource requirements. This guide outlines the three primary node types—Full, Light, and Ultra-Light—along with their configurations, capabilities, and limitations. Choosing the right node type depends on your goals, whether it's participating in the Swarm network, developing applications, or simply exploring the technology with minimal setup.


## Full Node

:::warning
Full nodes require significant system resources, including storage and bandwidth. Additionally, they must be connected to the blockchain to participate in incentives.

Recommended minimum specs for a full node:

- **Processor**: Recent 2 GHz dual-core.
- **RAM**: 8 GB.
- **Storage**: 30 GB SSD (HDD not recommended).
- **Internet**: High-speed and stable connection.
:::

### Configuration

To run Bee as a full node, `full-node` must be set to `true`, and `swap-enable` should also be set to `true`. The `blockchain-rpc-endpoint` value should be set to a valid Gnosis Chain RPC URL in the [configuration](/docs/bee/working-with-bee/configuration).

### Mode of Operation

Full nodes are the most feature-complete type of Bee node. They provide full upload and download capabilities, support the network by storing and serving data, and can participate in storage and bandwidth incentives.

**Key characteristics of full nodes:**

- Can download and upload data.
- Can store chunks and participate in storage incentives.
- Require a Gnosis Chain RPC endpoint for transactions.
- Can earn xBZZ by offering storage and bandwidth services.
- Fully supports PSS messaging.
- Fully supports GSOC.

Since full nodes store data and participate in incentives:

- They can stake xBZZ for storage rewards.
- They contribute to the stability and resilience of the Swarm network.
- They require more disk space, bandwidth, and CPU power than light or ultra-light nodes.

Full nodes are best suited for users who want to actively contribute to the Swarm network and earn incentives while running a robust infrastructure, as well as developers who wish to fully access all of Bee’s features.


## Light Node

:::info
Light nodes do not benefit from plausible deniability when requesting data from the network. Since they do not forward data for other nodes, they are always the originator of requests.

Has very minimal CPU, RAM and network requirements and can run on practically any commercially available computer from recent years.
:::

### Configuration

To run Bee as a light node, `full-node` must be set to `false`, `swap-enable` must be set to `true`, and a stable Gnosis Chain RPC endpoint URL must be specified using `blockchain-rpc-endpoint` in the [configuration](/docs/bee/working-with-bee/configuration).

### Mode of Operation

Light mode provides a pragmatic and efficient way to enhance network stability, reliability, and resilience. Light nodes do not participate in chunk forwarding or storage for other nodes; instead, they strictly consume services, paying xBZZ for data retrieval from full nodes.

**Key characteristics of light nodes:**

- Participate in pull syncing but do not serve stored chunks to peers.
- Do not forward chunks to peers closer to the destination address.
- Require a blockchain connection for SWAP settlements and downloads beyond the free tier.
- Can upload and download data, unlike ultra-light nodes.

**Limitations of light nodes:**

- Supports sending PSS messages but cannot receive.
- Supports outgoing GSOC updates but cannot receive GSOC updates.

Light nodes strike a balance between functionality and resource efficiency, making them ideal for users who want to interact with Swarm without the overhead of running a full node.



## Ultra Light Mode

:::info

The same as with light nodes, ultra light nodes do not benefit from plausible deniability when requesting data from the network. Since they do not forward data for other nodes, they are always the originator of requests.

Has very minimal CPU, RAM and network requirements and can run on practically any commercially available computer from recent years.

When running without a blockchain connection, bandwidth incentive payments (SWAP) cannot be made, so there is a risk of getting blocklisted by other peers for unpaid services through excessive downloads.
:::

### Configuration

To run an ultra-light node, use the same configuration as for the [light node](/docs/bee/working-with-bee/light-nodes), but set the `blockchain-rpc-endpoint` parameter to an empty value (or comment it out).

:::caution
Ensure that `swap-enable` is set to `false`, otherwise Bee will return an error.
:::

### Mode of Operation

Ultra-light nodes are designed for users who want to try running a node without the complexity of blockchain onboarding. These nodes can download data as long as their consumption does not exceed the payment threshold (`payment-threshold` in [configuration](/docs/bee/working-with-bee/configuration)) set by their peers.


**Key characteristics of light nodes:**

 - Can download small amounts of data.

**Limitations of light nodes:**

- Cannot perform overlay verification.
- Cannot participate in SWAP settlements.
- They cannot send PSS messages.
- They cannot upload data to the network.



