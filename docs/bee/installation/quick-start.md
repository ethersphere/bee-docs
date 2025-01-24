---
title: Getting Started
id: quick-start
---

To get started working with Swarm, first you need to learn about the different types of Bee nodes, the requirements for running each type, and then choose which type is right for you. 

## Node Types

Bee is a versatile piece of software that caters to a diverse array of use cases. It can be run in several different modes which each offer different features which are best suited for different users. There are three main categories of nodes: full nodes, light nodes, and ultra-light nodes.

### Ultra-Light Node

The ultra-light configuration allows for limited access to the Swarm network and allows for a node to download only small amounts of data from the Swarm network. It does not allow for uploads. Ultra-light nodes may not earn any type of incentives.

### Light Node 

A light node can both download and upload data over the Swarm network. Light nodes may also earn bandwidth incentives. 

### Full Node

A full node can upload and download data over the Swarm network. Additionally, a full node can also share its disk space with the Swarm network where it will be employed by Swarm uploaders. Full nodes can earn storage incentives for sharing their disk space with the network, and can also earn bandwidth incentives just as light nodes can.

## Features Comparison Chart

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

## Node Requirements by Type

:::info
A note on RPC endpoints:

Light and full Bee nodes require an RPC endpoint. An RPC endpoint is a "remote procedure call" endpoint that for blockchains like Ethereum or Gnosis Chain typically takes the form of an http or Websocket (wss) address. You will be able to use your own RPC endpoint if you are running your own Gnosis Chain node, however for many node operators it may be more convenient to use a third party provider such as [Infura](https://www.infura.io/).
:::


### Ultra-Light Node

A light node has very minimal requirements, it will run on essentially any modern hardware or VPS with baseline specs. It can even run even on small single-board computers like Raspberry Pi's. 

Your upload and download speeds will be limited by your internet connection speed of course, and exceedingly low RAM or processing power may also slow down your node - however this should not be an issue for practically any modern hardware. 

An RPC endpoint is not required.

### Light Node

A light node's requirements will be similar to that of an ultra-light node, however since it can be used for uploading as well as downloading and in typical use cases will be consuming greater bandwidth, internet connections speeds will be a greater consideration. If you intend to use your light node for large amounts of uploads and downloads, you should make sure your internet connection is sufficiently fast and stable. Again, as with an ultra-light node, any modern commercially available hardware should be sufficient.

A light node also has the additional requirement of an RPC endpoint so that it can purchase stamps to pay for uploads and so that it can participate in bandwidth incentives to earn xBZZ for data it forwards.

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


## Which type of node is the right choice?
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

### Swarm Desktop

If you are looking to get started with exploring Swarm and interacting with the network in as simple and easy a way as possible, then [Swarm Desktop](/docs/desktop/introduction) is the way to go.

Swarm Desktop offers an easy and convenient to use graphical user interface so that users can easily upload and download from the Swarm, host their websites, and access a variety of Swarm DAPPs which come pre-bundled with Swarm Desktop.

### Shell Script Install

If you're ready to go beyond the GUI based Swarm Desktop, then [the shell script install](/docs/bee/installation/shell-script-install) method may be right for you. This method uses a simple shell script to detect your operating system and environment and install the correct version of Bee for your machine. It's a convenient and minimalistic way of getting started with Swarm.

Because the shell script install is so minimalistic, it may require some additional tinkering to get it working the way you want it to. For example, it will not come set up to run in the background as a service out of the box, and logs will not be automatically saved. 

### Docker Install

While the [Docker based installation](/docs/bee/installation/docker) method requires additional tooling not needed with the shell script install method, it also comes with several advantages which make it easier to operate your node across multiple different types of environments and also makes it easier to spin up multiple nodes at once. Combining it with tools like [Docker Compose](https://docs.docker.com/compose/) can open up even more options.

Unlike the shell script install method, Docker already comes with easy to use tools for running your containerized Bee node as a background process and for dealing with logs from your node.

### Package Manager Install

The Bee client can be [installed through a variety of package managers](/docs/bee/installation/package-manager-install) including [APT](https://en.wikipedia.org/wiki/APT_(software)), [RPM](https://en.wikipedia.org/wiki/RPM_Package_Manager), and [Homebrew](https://en.wikipedia.org/wiki/Homebrew_(package_manager)). 

In comparison with the shell script install, this installation method comes with the advantage of setting up Bee to run as a service in the background, and also sets up some basic log management with `journalctl` (APT / RPM) or with `launchd` for Homebrew. 

One of the disadvantages is that it can be less flexible than either the Docker or shell script install methods.

### Building From Source

For the more advanced of users, you may wish to build from source. You can find instructions for doing so [here](/docs/bee/installation/build-from-source). While this may be the most flexible of all methods, it's also the most difficult and requires the most hands-on setup and so is recommended for more advanced users / use cases.