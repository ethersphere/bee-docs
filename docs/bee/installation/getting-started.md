---
title: Getting Started
id: getting-started
---

## Overview

This guide provides the essential background information to help you start running a Bee node, including:

- [Types of Bee nodes and their features.](/docs/bee/installation/getting-started#node-types)
- [General system requirements.](/docs/bee/installation/getting-started#general-node-requirements)
- [Requirements based on node type.](/docs/bee/installation/getting-started#node-requirements-by-node-type)
- [Choosing the right node type.](/docs/bee/installation/getting-started#choosing-node-type-based-on-use-case)
- [Selecting an installation method.](/docs/bee/installation/getting-started#choosing-installation-method)


:::caution[New Bee Users: Read This Guide in Full]
For new Bee users, it is very strongly recommended to read through this ***entire guide page*** before proceeding with installation and setup.
:::


## Node Types

Bee can operate in different modes, each tailored to specific use cases. There are three main node types. Each node type is briefly outlined below, for a deeper dive, refer to the [Node Types](/docs/bee/working-with-bee/node-types/) page, and refer to the [Configuration](/docs/bee/working-with-bee/configuration#set-bee-node-type) page for instructions on how to configure each node type.


### Ultra-Light Node
- Provides limited access to the Swarm network.
- Can only download small amounts of data (no uploads).
- Does not earn incentives.

### Light Node
- Can download and upload data.
- Requires a [Gnosis Chain](https://docs.gnosischain.com/node/) RPC endpoint.
- Does not earn incentives.

### Full Node
- Offers full upload and download functionality.
- Can earn xBZZ incentives through storage and bandwidth contributions.
- Requires disk space for chunk storage and a Gnosis Chain RPC endpoint.

### Feature Comparison

| Feature | Full Node | Light Node | Ultra-Light Node |
|---------|----------|------------|-----------------|
| Downloading | ✅ | ✅ | ✅ |
| Uploading | ✅ | ✅ | ❌ |
| Exceed free download limits (xBZZ) | ✅ | ✅ | ❌ |
| Storage sharing | ✅ | ❌ | ❌ |
| Storage incentives | ✅ | ❌ | ❌ |
| Bandwidth incentives | ✅ | ❌ | ❌ |
| PSS messaging | ✅ | ❌ | ❌ |
| Gnosis Chain connection | ✅ | ✅ | ❌ |


## General Node Requirements

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

### Token Requirements
Details on obtaining tokens are available [here](/docs/bee/installation/fund-your-node#getting-mainnet-tokens).

The amount and type of tokens required depend on your specific use case:

| Use Case                         | Node Type           | Requires xBZZ | Requires xDAI  | Details |
|-----------------------------------|--------------------|--------------------------------|--------------------------------|---------|
| **Free Tier Downloads**           | All Node Types     | ❌                              | ❌                              | Limited free downloads, no tokens required. |
| **Downloading Beyond Free Tier**  | Light & Full      | ✅ (~0.1 xBZZ)                 | ✅ (~0.01 xDAI)                | Needed for downloads beyond the free limit. Start with ~0.1 xBZZ and increase as needed. A small amount of xDAI (~0.01) is required to set up [SWAP contract](/docs/concepts/incentives/bandwidth-incentives). |
| **Uploading**                     | Light & Full      | ✅ (Varies)                    | ✅ (~0.1 xDAI)                 | Uploads require the purchase of [postage stamps](/docs/develop/access-the-swarm/buy-a-stamp-batch/) with xBZZ, and xDAI to cover fees. Start with ~0.1 xBZZ for small uploads. The amount you need can [vary greatly](/docs/develop/access-the-swarm/buy-a-stamp-batch/#time--volume-to-depth--amount-calculator). ~0.1 xDAI is enough for initial transactions. |
| **Staking & Storage Incentives**   | Full              | ✅ (10 xBZZ minimum)                  | ✅ (~0.1 xDAI) | A minimum 10 xBZZ deposit is required. Additional xBZZ is needed if using [the doubling feature](/docs/bee/working-with-bee/staking/#reserve-doubling). xDAI is needed for staking and [ongoing storage incentives](/docs/bee/working-with-bee/staking ) related transactions. Start with ~0.1 xDAI and add more as required. |


## Network Requirements

A reliable, high-speed internet connection is recommended when running a full node, while ultra-light and light nodes will have lower requirements. The actual amount of bandwidth consumption depends on the node type and use-case:

- **Ultra-Light Node**: Minimal usage, bandwidth utilization restricted based on free-tier download limits.
- **Light Node**: Moderate usage, based on data transfer volume.
- **Full Node**: High bandwidth usage due to constant chunk syncing, and even greater utilization if also used for uploads / downloads.

### RPC Endpoint  

An [RPC (Remote Procedure Call) endpoint](/docs/references/glossary#rpc-endpoint) is required to allow your node to interact with **Gnosis Chain**, which is required for transactions like purchasing postage stamps, staking xBZZ, and storage incentives related transactions.  

Bee nodes use the **`--blockchain-rpc-endpoint`** configuration option to specify which Gnosis Chain RPC service to connect to. 

This can be:  

- A **public and free endpoint**, such as those offered by [Fair Data Society](https://xdai.fairdatasociety.org) or other free RPC providers listed in the [Gnosis Chain documentation](https://docs.gnosischain.com/tools/RPC%20Providers/).  
- A **private and paid endpoint** provided by third-party services typically offers higher reliability and better performance.  
- A [self-hosted Gnosis Chain node](https://docs.gnosischain.com/node), giving full control over blockchain interactions but requiring additional setup and maintenance.  

:::info
A well maintained list of both free and paid RPC endpoint providers can be found in the [Gnosis Chain documentation](https://docs.gnosischain.com/tools/RPC%20Providers/).
:::

Without a properly configured RPC endpoint, a Bee node cannot interact with the blockchain, meaning it will be unable to buy postage stamps, stake tokens, or make blockchain transactions.

### NAT and Port Forwarding

If running Bee on a home network, there is a good chance it is behind NAT by default. Often simply [enabling port forwarding](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide) will be enough to allow your node to start communicating smoothly with the rest of the network.

See [here](/docs/bee/installation/connectivity/) for more information on how to make sure your node can communicate with the network.

For VPS/cloud-based setups, connectivity is typically unrestricted.

If your home network happens to be using [CGNAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT), you may face significant difficulty with setting up your node so it can connect with the rest of the network. Contacting your IP provider may be required. 

## System Requirements

### Light and Ultra-Light

Light and ultra-light nodes can be run with practically any modern commercially available computer hardware and internet provider and have very minimal CPU, RAM and network requirements. 

### Full Node

Requires significant storage and processing power:
- **Processor**: Recent 2 GHz dual-core.
- **RAM**: 8 GB.
- **Storage**: 30 GB SSD (HDD not recommended).
- **Internet**: High-speed and stable connection.

For staking and storage incentives, test node performance with [`/rchash`](https://docs.ethswarm.org/docs/bee/working-with-bee/bee-api/#rchash).


## Choosing a Node Type
The type of node type you need to run will differ depending on your use-case:


| Use Case                     | Recommended Node Type(s) | Details |
|------------------------------|-------------------------|---------|
| **Basic Interaction with Swarm** | Ultra-Light, Light | Ultra-light nodes allow limited free-tier downloads. Light nodes support both uploads and downloads and run efficiently in the background. [Swarm Desktop](https://www.ethswarm.org/build/desktop) provides an easy way to set up either type. |
| **DApp Development**          | Light, Full           | Light nodes are sufficient for many DApp use cases. Full nodes are required for advanced features like GSOC and PSS. |
| **Earning xBZZ & Supporting the Network** | Full | Full nodes are necessary for storage incentives and long-term xBZZ earnings. Running multiple nodes? Consider using [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), or [Kubernetes](https://kubernetes.io/) for easier management. |



## Choosing an Installation Method

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

