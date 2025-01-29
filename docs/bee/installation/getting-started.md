---
title: Getting Started
id: getting-started
---


In this guide we cover the basic background information you need to know to get started running a Bee node:

#### [A list of Bee node types and their various features.](/docs/bee/installation/getting-started#node-types)
#### [General requirements for running Bee nodes.](/docs/bee/installation/getting-started#general-node-requirements)
#### [Specific requirements base on node type.](/docs/bee/installation/getting-started#node-requirements-by-node-type)
#### [How to choose the right node type.](/docs/bee/installation/getting-started#choosing-node-type-based-on-use-case)
#### [How to choose the appropriate installation method.](/docs/bee/installation/getting-started#choosing-installation-method)

## Node Types

Bee is a versatile piece of software that caters to a diverse array of use cases. It can be run in several different modes which each offer different features which are best suited for different users. There are three main categories of nodes: full nodes, light nodes, and ultra-light nodes. Node type is set by modifying the appropriate configuration options during the setup process. For the details of how to configure each node type, refer to the [node installation guides](/docs/bee/installation/getting-started#choosing-installation-method).

### Ultra-Light Node

The ultra-light configuration allows for limited access to the Swarm network and allows for a node to download only small amounts of data from the Swarm network. It does not allow for uploads. Ultra-light nodes may not earn any type of incentives.

### Light Node 

A light node can both download and upload data over the Swarm network. Light nodes may also earn bandwidth incentives. 

### Full Node

A full node can upload and download data over the Swarm network. Additionally, a full node can also share its disk space with the Swarm network where it will be employed by Swarm uploaders. Full nodes can earn storage incentives for sharing their disk space with the network, and can also earn bandwidth incentives just as light nodes can.

### Features Comparison Chart

| Feature      | Full Node | Light Node |Ultra-Light Node|
|--------------|-----------|------------|------------|
| Downloading  | ✅        |   ✅      |✅         |        |
| Uploading     | ✅       |   ✅      |  ❌  |
| Can exceed free download limits by paying xBZZ  | ✅       |   ✅      |❌ 
|Sharing disk space with network|✅|    ❌      |❌|
|Storage incentives|✅|        ❌      |❌|
|SWAP incentives|✅|           ✅      |❌|
|PSS messaging|✅|             ✅      |✅ |
|Gnosis Chain Connection|✅|             ✅      |❌  |


:::info 
#### **Swarm Incentives Types**
In Swarm, there are two types of incentives for node operators, **storage incentives** which reward nodes for storing data chunks over time, and **bandwidth incentives** which reward nodes for transmitting data chunks across the network.

**Storage incentives**

By participating in the storage incentives protocol, full nodes which store data chunks with the network may join in the redistribution game for a chance to earn xBZZ. Staked xBZZ is required to earn storage incentives. Learn more in the [staking section](/docs/bee/working-with-bee/staking).

**Bandwidth incentives (SWAP):**

Bandwidth incentives (also referred to as the SWAP protocol) encourage full or light (but not ultra-light) nodes to share bandwidth with other nodes in exchange for payments from other nodes either [in-kind](https://www.investopedia.com/terms/p/paymentinkind.asp) or as a cheque to be settled at a future date. SWAP requires a chequebook contract to be set up on Gnosis Chain for each participating node. 
:::


## General Node Requirements

### Software

* [jq utility](https://jqlang.github.io/jq/) for formatting JSON API output (optional)

:::info
The [`jq` utility](https://jqlang.github.io/jq/) is widely used throughout the documentation to automatically format the output from calls to the Bee API. It can help make API output much more readable, however its usage is optional. 
:::

### Tokens

* A small amount of xDAI to pay for Gnosis Chain transactions, 0.1 xDAI should be enough
* 10 xBZZ (BZZ on Gnosis Chain) is required for staking
* A small amount of xBZZ for downloading and uploading from Swarm. You can start with 1 xBZZ and add more according to your usage needs.

### Network Considerations

#### RPC Endpoints

Both full and light nodes require a Gnosis Chain RPC endpoint which can be obtained either by running your own node or from an RPC endpoint 3rd party provider such as [Infura](https://www.infura.io). You can also find some free RPC endpoints such as [this one](https://xdai.fairdatasociety.org) offered by the Fair Data Society, or from one of the other free options available at the [Gnosis Chain docs](https://docs.gnosischain.com/tools/RPC%20Providers/). 


#### NAT and Port Forwarding

If you are running on a home network you may need to configure your router to use [port forwarding](https://www.noip.com/support/knowledgebase/general-port-forwarding-guide) or take other steps to ensure your node is reachable by other nodes on the network. See [here](https://docs.ethswarm.org/docs/bee/installation/connectivity/#navigating-through-the-nat) for more guidance. If you are running on a VPS or cloud based server you will likely have no issues.

## Node Requirements By Node Type


### Ultra-Light Node
An ultra-light node has very minimal hardware requirements and can operate on practically any modern computer or VPS, including devices with baseline specs. It can even run on single-board computers like Raspberry Pi.

**Average Specs for Ultra-Light Node:**
- **Processor**: Single-core or dual-core processor, 1 GHz or higher (e.g., Intel Atom, ARM Cortex-A series).
- **RAM**: 1 GB or higher.
- **Storage**: 8 GB HDD or SSD.
- **Internet Connection**: A stable internet connection with at least 1 Mbps download/upload speed.

No RPC endpoint is required for ultra-light nodes.


### Light Node
A light node has slightly higher requirements than an ultra-light node due to the ability to upload and download data over the network. It consumes more bandwidth and requires a Gnosis Chain RPC endpoint for purchasing stamps and participating in bandwidth incentives.

**Average Specs for Light Node:**
- **Processor**: Dual-core processor, 1.5 GHz or higher (e.g., Intel Celeron, AMD Athlon, or similar).
- **RAM**: 2 GB or higher.
- **Storage**: 16 GB SSD or HDD.
- **Internet Connection**: A stable internet connection with at least 5 Mbps download/upload speed.

These specs are achievable with most commercially available laptops, desktops, or low-cost servers. For users planning to handle high amounts of data transfers, faster internet connections and slightly more RAM (e.g., 4 GB) are recommended for optimal performance.


These recommendations reflect the typical capabilities of affordable, readily available hardware suitable for running light and ultra-light nodes without significant bottlenecks.

### Full Node

A full node has significantly greater requirements since it is responsible for storing and syncing data from the Swarm network, and the requirements will be even higher in case that it is staking xBZZ and participating in the redistribution system for a chance to win xBZZ rewards.

The minimum recommended specifications for a full staking node are:

* Dual core, recent generation, 2ghz processor
* 8gb RAM
* 30gb SSD
* Stable internet connection
* HDD drives are discouraged for full nodes due to their low speeds.

Since there can be considerable variability in the performance of processors and RAM from different years and brands even with nominally similar specifications, it's recommended to [test your node's performance using the `/rchash` endpoint](https://docs.ethswarm.org/docs/bee/working-with-bee/bee-api/#rchash) to make sure that it is performant enough to participate in the redistribution game. 

Note that there are additional hardware requirements if you choose to [run your own Gnosis Chain node](https://docs.gnosischain.com/node/#environment-and-hardware) in order to provide your Bee node(s) with the required RPC endpoint. 

:::info
Staking is not required to run a full node, but is necessary to earn storage incentives. An altruistic person may want to run a full node without putting up any stake, and in fact, could possibly earn enough xBZZ from bandwidth (swap/cheque) compensation to be able to stake at some point in the future. Learn more in the [staking section](/docs/bee/working-with-bee/staking)
:::

:::caution
While it is possible to run multiple Bee nodes on a single machine, due to the high rate of I/O operations required by a full Bee node in operation, it is not recommended to run more than a handful of Bee nodes on the same physical disk (depending on the disk speed). 
:::


## Choosing Node Type Based on Use Case

Different node types best suit different use cases:

### Basic Interactions with the Swarm network

If you only need to download a small amount of data from the Swarm network an ***ultra light node*** could be the right choice for you. This will allow you to download a limited amount of data but does not support uploading data.

If you want upload and download from Swarm and perhaps earn a small amount of bandwidth incentives, then running a ***light node*** in the background on your laptop or desktop computer could be the right choice for you. This will enable direct access to the Swarm network from your web browser and other applications.

:::info
The [Swarm Desktop app](https://www.ethswarm.org/build/desktop) offers an easy way to automatically set up a light or ultra-light node and interact with it through a graphical user interface.
:::

### Developing a DAPP on Swarm

In order to develop a DAPP on Swarm, you will likely want to run either a ***light node*** or a ***full node***. For many use cases, a light node will be sufficient. However if you need to access certain features such as GSOC, then running a full node will be required.

### Support the Network and Earn xBZZ by Running a Full Node

If you wish to earn [xBZZ](/docs/bee/working-with-bee/cashing-out) storage and bandwidth incentives and contribute to the strength of the Swarm network, running a **full node** is the right choice for you. It's easy to set up on a VPS, colocation, or any home computer that's connected to the internet.

Since each full Bee node shares up to 2^22 chunks (~16gb of data), and due to the economics of running a Bee node, serious node operators will likely wish to scale up their operations to run multiple Bee nodes together in a hive so that they can take advantage of all the available disk space they have to share and maximize their earnings. While there are many possible approaches to doing so, and there is no one officially recommended method, you may consider tools such as [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), or [Kubernetes](https://kubernetes.io/) in order to orchestrate the deployment of a larger number of Bee nodes.


## Choosing Installation Method

You can interact with the Swarm network by installing the Bee client through a variety of different methods. Below is a (non-exhaustive) list of some of the most common methods for installing a Bee client.

### [Swarm Desktop](/docs/desktop/introduction)

If you are looking to get started with exploring Swarm and interacting with the network in as simple and easy a way as possible, then [Swarm Desktop](/docs/desktop/introduction) is the way to go.

Swarm Desktop offers an easy and convenient to use graphical user interface so that users can easily upload and download from the Swarm, host their websites, and access a variety of Swarm DAPPs which come pre-bundled with Swarm Desktop.

### [Shell Script Install](/docs/bee/installation/shell-script-install)

If you're ready to go beyond the GUI based Swarm Desktop, then [the shell script install](/docs/bee/installation/shell-script-install) method may be right for you. This method uses a simple shell script to detect your operating system and environment and install the correct version of Bee for your machine. It's a convenient and minimalistic way of getting started with Swarm.

Because the shell script install is so minimalistic, it may require some additional tinkering to get it working the way you want it to. For example, it will not come set up to run in the background as a service out of the box, and logs will not be automatically saved. 

### [Docker Install](/docs/bee/installation/docker)

While the [Docker based installation](/docs/bee/installation/docker) method requires additional tooling not needed with the shell script install method, it also comes with several advantages which make it easier to operate your node across multiple different types of environments and also makes it easier to spin up multiple nodes at once. Combining it with tools like [Docker Compose](https://docs.docker.com/compose/) can open up even more options.

Unlike the shell script install method, Docker already comes with easy to use tools for running your containerized Bee node as a background process and for dealing with logs from your node.

### [Package Manager Install](/docs/bee/installation/package-manager-install)

The Bee client can be [installed through a variety of package managers](/docs/bee/installation/package-manager-install) including [APT](https://en.wikipedia.org/wiki/APT_(software)), [RPM](https://en.wikipedia.org/wiki/RPM_Package_Manager), and [Homebrew](https://en.wikipedia.org/wiki/Homebrew_(package_manager)). 

In comparison with the shell script install, this installation method comes with the advantage of setting up Bee to run as a service in the background, and also sets up some basic log management with `journalctl` (APT / RPM) or with `launchd` for Homebrew. 

One of the disadvantages is that it can be less flexible than either the Docker or shell script install methods.

### [Building From Source](/docs/bee/installation/build-from-source)

For the more advanced of users, you may wish to build from source. You can find instructions for doing so [here](/docs/bee/installation/build-from-source). While this may be the most flexible of all methods, it's also the most difficult and requires the most hands-on setup and so is recommended for more advanced users / use cases.