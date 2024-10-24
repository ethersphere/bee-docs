---
title: Incentives Overview
id: overview
---

One of the key challenges in a decentralised data network is incentivizing users to store data and provide bandwidth. Swarm addresses this challenge with two incentives systems, one which rewards nodes for sharing their storage space and another which rewards them for sharing bandwidth. The incentives system consists of multiple elements which work together to build a self sustaining economic system where nodes are rewarded for honestly providing their resources to the network.

:::info
Swarm's storage incentives protocols are defined in depth in the [Future Proof Storage](https://www.ethswarm.org/swarm-storage-incentives.pdf) paper published by the Swarm team, and are also discussed in [The Book of Swarm](https://papers.ethswarm.org/p/book-of-swarm/).
:::

## Storage Incentives

Storage incentives are used to reward node operators for providing their disk space to the network and storing the data they are responsible for storing over time. The storage incentives system is composed of three smart contracts which work together to enact a self regulating economic system. The postage stamp contract manages payments for uploading data, the redistribution contract manages the redistribution of those payments to storer nodes, and the price oracle contract uses data from the redistribution contract to set the price for postage stamps in the postage stamp contract.

### Postage Stamps

Postage stamps are used to pre-purchase the right to upload data on storm, much in the same way that real life postage stamps are used to pre-pay for use of the postal service. Postage stamps are purchased in batches rather than one by one, and are consumed when uploading data to Swarm. Postage stamp batches are purchased using xBZZ through the [postage stamp smart contract](https://gnosisscan.io/address/0x45a1502382541Cd610CC9068e88727426b696293#code). the xBZZ used to pay for postage stamp batches serve as the funds which are redistributed as storage incentives in the redistribution game. The price of postage stamps is set by the price oracle. Read more [here](/docs/learn/incentives/postage-stamps).

### Redistribution Game 

The redistribution game is used to redistribute the xBZZ paid into the postage stamp contract to full staking nodes which contribute their disk space to the network. The game is designed in such a way that the most profitable way to participate is to honestly store all the data for which a node is responsible. The game's rules are determined by the [redistribution smart contract](https://gnosisscan.io/address/0xFfF73fd14537277B3F3807e1AB0F85E17c0ABea5#code). The results of the game also supply the utilization signal which is used by the price oracle to set the price for postage stamps. Read more [here](/docs/learn/incentives/postage-stamps).

### Price Oracle

The price oracle contract uses a utilization signal derived from the redistribution contract to set the price for postage stamps through the postage stamp contract. The utilization signal is based on a measure of data redundancy in the network. The postage stamp price is increased or decreased in order to maintain a healthy degree of redundancy. Read more [here](/docs/learn/incentives/price-oracle).


## Bandwidth Incentives

In addition to storing data over time, nodes must also serve the data they store and must also relay data and messages to other nodes in the network. 
Bandwidth incentives are used to reward nodes for relaying data across the network, both by serving up the data they store themselves and by serving as an intermediary relayer of data between other peers. The Swarm Accounting Protocol (SWAP) defines how bandwidth incentives work. At the core of SWAP is the concept of cheques along with the chequebook contract. Read more [here](/docs/learn/incentives/bandwidth-incentives).