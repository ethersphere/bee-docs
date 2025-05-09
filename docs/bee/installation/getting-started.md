---
title: Getting Started
id: getting-started
---

*If you want to get a Bee node up and running ASAP, check out the [Quick Start](/docs/bee/installation/quick-start) guide.* 

## Overview

This guide provides the essential background information to help you start running a Bee node, including:

- [Types of Bee nodes and their features](/docs/bee/installation/getting-started#node-types)
- [Choosing the right node type](/docs/bee/installation/getting-started#choosing-a-node-type)
- [Software requirements](/docs/bee/installation/getting-started#software-requirements)
- [Hardware requirements](/docs/bee/installation/getting-started#hardware-requirements)
- [Network requirements](/docs/bee/installation/getting-started#network-requirements)
- [Installation methods](/docs/bee/installation/getting-started#installation-methods)


:::caution[New Bee Users: Read This Guide in Full]
For new Bee users, it is strongly recommended to read through this ***entire guide page*** before proceeding with installation and setup.
:::

## Node Types

Bee nodes can be run in three different modes, ***full***, ***light***, or ***ultra-light***. Full nodes provide complete access to all of Swarm's features including downloads, uploads, full participation in Swarm's incentives systems, and advanced messaging features such as PSS and GSOC. Light nodes are primarily for downloading and uploading only. Ultra-light nodes are the most limited, and only allow users to download a small amount of data with the free-tier limits set by full node operators.

The [Node Types](/docs/bee/working-with-bee/node-types) page provides you with an in-depth look into the features and limitations of each node type along with instructions for how to set node options for all three types. 

## Choosing a Node Type
The node type you need to run will differ depending on your use-case:

| Use Case                     | Recommended Node Type(s) | Details |
|------------------------------|-------------------------|---------|
| **Basic Interaction with Swarm** | Ultra-Light, Light | Ultra-light nodes allow limited free-tier downloads. Light nodes support both uploads and downloads and run efficiently in the background. [Swarm Desktop](https://www.ethswarm.org/build/desktop) provides an easy way to set up either type. |
| **DApp Development**          | Light, Full           | Light nodes are sufficient for many DApp use cases. Full nodes are required for advanced features like GSOC and PSS. |
| **Earning xBZZ & Supporting the Network** | Full | Full nodes are necessary for storage incentives and long-term xBZZ earnings. Running multiple nodes? Consider using [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), or [Kubernetes](https://kubernetes.io/) for easier management. |

Refer to the [Node Types](/docs/bee/working-with-bee/node-types) page for deep dive into each node type, their features and limitations, and configuration instructions.

##  Software Requirements

### Recommended Operating Systems
- Officially supported systems are listed in the [Bee releases](https://github.com/ethersphere/bee/releases).
- You can [build from source](/docs/bee/installation/build-from-source) if your OS is unsupported.
- **Swarm Desktop users** can use macOS, Windows, or Linux.
- **Linux/macOS recommended**: Most tools and documentation are designed for Unix-based systems.
- **Windows users**: While a Window release of Bee is available, you may also consider using [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and using a Linux version of Bee.

### Essential Tools

While not strictly required, these tools will *greatly* simplify your experience working with Bee nodes:

- **[`jq`](https://jqlang.github.io/jq/)**: Formats JSON responses (recommended for API users).
- **[`curl`](https://curl.se/)**: Used for sending API requests (required for API interactions).
- **[Swarm CLI](/docs/bee/working-with-bee/swarm-cli/)**: Terminal-based Bee node management.
- **[Bee JS](/docs/develop/tools-and-features/bee-js)**: JavaScript library for programmatic API access.

## Hardware Requirements

### Light and Ultra-Light

Light and ultra-light nodes can be run with practically any commercially available modern computer hardware and internet provider, and have very minimal CPU, RAM and network requirements. 

### Full Node

Requires significant storage and processing power:
- **Processor**: Recent 2 GHz dual-core.
- **RAM**: 8 GB.
- **Storage**: 30 GB SSD (HDD not recommended).
- **Internet**: High-speed and stable connection.

For staking and storage incentives, test node performance with [`/rchash`](https://docs.ethswarm.org/docs/bee/working-with-bee/bee-api/#rchash).

## Network Requirements

A reliable, high-speed internet connection is recommended when running a full node, while ultra-light and light nodes require less bandwidth. The actual amount of bandwidth consumption depends on the node type and use-case:

- **Full Node**: High bandwidth usage due to constant chunk syncing, and even greater utilization if also used for uploads / downloads.
- **Light Node**: Moderate usage, based on data transfer volume.
- **Ultra-Light Node**: Minimal usage, bandwidth utilization restricted based on free-tier download limits.

### RPC Endpoint  

:::warning
***Free public RPC endpoints are discouraged*** since they may enforce rate limiting or may not store the historical smart contract data required by Bee nodes. [Read more](/docs/bee/working-with-bee/configuration#setting-blockchain-rpc-endpoint).
:::

An [RPC (Remote Procedure Call) endpoint](/docs/references/glossary#rpc-endpoint) is required to allow your node to interact with **Gnosis Chain**, which is required for transactions like purchasing postage stamps, staking xBZZ, and storage incentives related transactions.  

Bee nodes use the **`--blockchain-rpc-endpoint`** configuration option to specify which Gnosis Chain RPC service to connect to. 

This can be:  

- A [self-hosted Gnosis Chain node](https://docs.gnosischain.com/node), giving full control over blockchain interactions but requiring additional setup and maintenance (recommended).   
- A **private and paid endpoint** from a third-party service provider.  
- A **public and free endpoint**, such as this free one from the Fair Data Society: `https://xdai.fairdatasociety.org` 

:::info
A well-maintained list of both free and paid RPC endpoint providers can be found in the [Gnosis Chain documentation](https://docs.gnosischain.com/tools/RPC%20Providers/).
:::

Without a properly configured RPC endpoint, a Bee node cannot interact with the blockchain, meaning it will be ***unable*** to:
* Buy postage stamps
* Stake tokens
* Make blockchain transactions

### NAT and Port Forwarding

If running Bee on a home network, there is a good chance it is behind NAT by default. Often simply [enabling port forwarding](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide) will be enough to allow your node to start communicating smoothly with the rest of the network.

See [this page](/docs/bee/installation/connectivity/) for more information on how to make sure your node can communicate with the network.

For VPS/cloud-based setups, connectivity is typically unrestricted.

If your home network happens to be using [CGNAT (Carrier-Grade NAT)](https://en.wikipedia.org/wiki/Carrier-grade_NAT), you may face significant difficulty with setting up your node so it can connect with the rest of the network. Contacting your IP provider may be required. 

## Installation Methods

### [Swarm Desktop](/docs/desktop/introduction)
- Best for beginners.
- GUI-based interface.

### [Shell Script Install](/docs/bee/installation/shell-script-install)
- Quick setup using a minimal script.
- Requires manual configuration for background operation.

### [Docker Install](/docs/bee/installation/docker)
- Suitable for running multiple nodes.
- Offers easy container management.

### [Package Manager Install](/docs/bee/installation/package-manager-install)
- Uses APT, RPM, or Homebrew.
- Runs Bee as a background service.

### [Building from Source](/docs/bee/installation/build-from-source)
- Most flexible, but requires advanced setup.

