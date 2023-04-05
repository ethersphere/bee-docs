---
title: Terminology
id: terminology
---


### Swarm

The Swarm network consists of a collection of [Bee nodes](terminology#bee) which work together to enable decentralised data storage for the next generation of censorship-resistant, unstoppable, serverless dapps. 

Swarm is also the name of the core organization that oversees the development and success of the Bee Swarm as a whole. They can be found at [ethswarm.org](https://www.ethswarm.org/).

### Gnosis Chain

[Gnosis Chain](https://www.gnosis.io/) (previously known as xDai chain) is a [PoS](https://www.gnosis.io/validators), [EVM](https://ethereum.org/en/developers/docs/evm/) compatible Ethereum [sidechain](https://ethereum.org/en/developers/docs/scaling/sidechains/) which uses the same addressing scheme as Ethereum. Swarm's smart contracts have been issued on Gnosis Chain.

### Smart Contracts

Smart contracts are automatically executable code which can be published on a blockchain to ensure immutability. Swarm uses smart contracts on Gnosis Chain for a variety of key aspects of the network including [incentivization](terminology#xbzz-token), [inter-node accounting](terminology#swap), and [payments for storage](terminology#postage-stamps).

### Bee

Swarm nodes are referred to as "Bee" nodes. Bee nodes can run on a wide variety of computer types including desktop computers, hobbyist computers like Raspberry Pi 4, remotely hosted virtual machines, and much more. When running, Bee nodes interact with Swarm smart contracts on Gnosis Chain and connect with other Bee nodes to form the Swarm network.

Bee nodes can act as both client and service provider, or solely as client or service provider, depending on the needs of the node operator. Bee nodes pay each other for services on the Swarm network with the xBZZ token.

### Overlay and Underlay

An overlay network is a virtual or logical network built on top of some lower level "underlay" network. Examples include the Internet as an overlay network built on top of the telephone network, and the p2p Bittorent network built on top of the Internet. 

With Swarm, the overlay network is a [Kademlia DHT](https://en.wikipedia.org/wiki/Kademlia) with overlay addresses derived from each node's [Gnosis](terminology#gnosis-chain) address. Swarm's overlay network addresses are permanent identifiers for each node and do not change over time.

An underlay network is the low level network on which an overlay network is built. It allows nodes to find each other, communicate, and transfer data. Swarm's underlay network is a p2p network built with [libp2p](https://libp2p.io/). Underlay address are not permanent and may change over time. 

### Swap

Swap is the p2p accounting protocol used for Bee nodes. It allows for the automated accounting and settlement of services between Bee nodes in the Swarm network. In the case that services exchanged between nodes is balanced equally, no settlement is necessary. In the case that one node is unequally indebted to another, settlement is made to clear the node's debts. Two key elements of the Swap protocol are [cheques and the chequebook contract](terminology#cheques--chequebook).    

### Cheques & Chequebook

Cheques are the off-chain method of accounting used by the Swap protocol where the issuing node signs a cheque specifying a beneficiary, a date, and an amount, and gives it to the recipient node as a token of promise to pay at a later date. 

The chequebook is the smart contract where the cheque issuer's funds are stored and where the beneficiary can cash the cheque received. 

The cheque and chequebook system reduces the number of required on-chain transactions by allowing multiple cheques to accumulate and be settled together as a group, and in the case that the balance of cheques between nodes is equal, no settlement transaction is required at all. 

### Postage Stamps

Postage stamps can be purchased with [xBZZ](terminology#xbzz-token) and represent the right to store data on the Swarm network. In order to upload data to Swarm, a user must purchase a batch of stamps which they can then use to upload an equivalent amount of data to the network. 

### Clef & Bee Clef

:::info
Bee Clef is deprecated and is no longer under active development. It is not required for running a Bee node.
:::

Clef is a tool for signing transactions and data in a secure local environment. It was originally developed for Ethereum.

"Bee Clef" is a version of Clef that is tailored to Bee's needs and can be used together with a Bee node.

### PLUR

PLUR (name inspired by the [PLUR principles](https://en.wikipedia.org/wiki/PLUR)) is the smallest denomination of BZZ. 1 PLUR is equal to 1e16 BZZ, and 1 BZZ is equal to 10000000000000000 PLUR. 

### Bridged Tokens

Bridged tokens are tokens from one blockchain which have been _bridged_ to another chain through a smart contract powered bridge. For example, xDAI and xBZZ on Gnosis Chain are the bridged version of DAI and BZZ on Ethereum. 

### BZZ Token

BZZ is Swarm's [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) token issued on Ethereum.   

| Blockchain             | Contract address                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum, BZZ          | [`0x19062190b1925b5b6689d7073fdfc8c2976ef8cb`](https://ethplorer.io/address/0x19062190b1925b5b6689d7073fdfc8c2976ef8cb)                |
| Gnosis Chain, xBZZ     | [`0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da`](https://blockscout.com/xdai/mainnet/tokens/0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da/) |
| Goerli (testnet), gBZZ | [`0x2ac3c1d3e24b45c6c310534bc2dd84b5ed576335`](https://goerli.etherscan.io/address/0x2ac3c1d3e24b45c6c310534bc2dd84b5ed576335)         |

### xBZZ Token

xBZZ is BZZ bridged to to the [Gnosis Chain](https://www.gnosis.io/) using [OmniBridge](https://omni.gnosischain.com/bridge).

It is used as payment for [postage stamps](terminology#postage-stamps) and as the unit of accounting between the nodes. It is used to incentivize nodes to provide resources to the Swarm.

### DAI Token

[DAI](https://developer.makerdao.com/dai/1/) is an [ERC-20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) stable token issued on the Ethereum blockchain, tracking USD.

### xDai Token

xDai is [DAI](https://developer.makerdao.com/dai/1/) [bridged](#bridged-tokens) to the [Gnosis Chain](https://www.xdaichain.com/) using [xDai Bridge](https://bridge.gnosischain.com/). It is also the native token of the Gnosis Chain, i.e. transaction fees are paid in xDai.

### Goerli

Goerli is an Ethereum testnet. It is an environment where smart contracts can be developed and tested without spending cryptocurrency with real value, and without putting valuable assets at risk. Tokens on Goerli are often prefixed with a lower-case 'g', example: 'gBZZ' and 'gETH,' and because this is a test network carry no monetary value. It is an environment where Bee smart contracts can be tested and interacted with without any risk of monetary loss.

### Faucet

A cryptocurrency faucet supplies small amounts of cryptocurrency to requestors (typically for testing purposes).

It supplies small amounts of gBZZ and gETH for anyone who submits a request at the [Swarm Discord](https://discord.gg/wdghaQsGq5) server by using the `/faucet` command in the #develop-on-swarm channel.
