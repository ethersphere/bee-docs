---
id: terminology
title: Terminology
---

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

## Bee

The Bee, also referred to as a 'node' or 'client' is the heart and work-horse of the swarm. This is the service that you will run on your devices, and once running it will join with other nodes over a Peer-to-peer (p2p) network to form the 'swarm'.

The Bee becomes the broker of data, storing and supplying blocks of data in a give-and-take exchange for BZZ tokens.

* [Install Bee](/docs/installation/quick-start#install-bee)

## Clef & Bee-Clef

Clef, by itself, is a tool built for the Ethereum blockchain. It is used to sign the transaction before they are placed (permanently) onto the blockchain. Think of this as a notary which has the power to make transactions binding and 'official'. Bee includes a specific version of Clef "Bee-clef" that is tailored and configured specific to Bee's needs. Therefor, if you are running a Bee node, you'll also want to run a Bee-clef instance.

:::info
Currently, as of version 0.5.2, you must run one instance of Bee-clef for every instance of Bee.
:::

* [Install Bee-clef](/docs/installation/bee-clef)

## Swarm

Swarm is the collective term for all of the Bee nodes within the network. It is the system that, together, provides the distributed and decentralised storage and communication system accomplishing the overarching goal.

Swarm is also the name of the core organization that oversees the development and success of the Bee Swarm as a whole. You can find them at [swarm.ethereum.org](https://swarm.ethereum.org/).

## Ethereum / Blockchain

Ethereum is most commonly known by its traded coin, ETH, but in actuality, the Ethereum blockchain framework provides other foundational services upon which makes the higher-level goals of Bee possible.

Ethereum provides a service known as "smart contracts" which, in basic terms, is essentially the ability to publish rules or a binding digital code-of-conduct that establish the proper flow and exchange of data. Bee uses these contracts for two main purposes: To establish the Swarm incentivization token "BZZ", and to establish the concepts of Cheques and ChequeBooks.

With these two core concepts found, you have created the proper economic tools to build a strong distributed system (via BZZ) and to make it fast, efficient, and cheap (via Cheques).

### BZZ Token

The BZZ Token is built out of a smart contract that is specifically designed to be the token of cost and reward that provides the incentive to provide computing, storage and network resources to the Swarm.

### SWAP

SWAP is the name of the system/rules applied to the exchange of data that results in the reward (or cost) of BZZ. As you contribute service to the swarm, you are awarded through the SWAP system with BZZ; but as you consume the service of the swarm, it costs you BZZ.

### Cheques & ChequeBook

Settling transactions on the Ethereum network can be expensive and time-consuming, especially when there is a high-volume of transactions. If Bee nodes are transferring many blocks of files back-and-forth to feed the Swarm network demand, the amount of transactions can add up quickly.

To speed up this process cheques were created. They are an off-chain method of payment where issuer signs a cheque specifying a beneficiary, a date and an amount, gives it to the recipient as a token of promise to pay at a later date. The nice thing about this is that Cheques can 'stack-up' so that when you settle the exchange, by 'committing' the exchange of BZZ on the blockchain, many small cheques can be counted as one large payout.

The ChequeBook is the smart contract that allows the beneficiary to choose when payments are to be processed. Which essentially means it's the address and logic mechanism that allows you to cash-out the cheques that you've received.

### Goerli

Goerli is a Testnet, meaning that this is a safe environment to develop and test Bee until it is mature enough to run in production. It's currently also being used as the community-building platform that will migrate to Mainnet once live. Tokens on this network are often prefixed with a lower-case 'g', example: 'gBZZ' and 'gETH' and because this is a test network, they carry no monetary value.

#### Faucet

It takes BZZ tokens to seed your node so it can join the Swarm. Before it can start providing storage/network as a resource, it needs to receive data that the Swarm holds which costs BZZ. Since Goerli is a test network, there aren't marketplaces that you can "buy" BZZ, so a faucet is a pool of BZZ (and gEth) that will "sprinkle" (freely share/send) some of it to the address that you request. There is a #faucet-requset channel on the [Swarm Discord](https://discord.gg/wdghaQsGq5) which you may join and request.
