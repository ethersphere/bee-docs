---
title: Fund Your Node
id: fund-your-node
---

In order to upload content, or to pay for downloading more content than is allowed by the free tier threshold, your node must be loaded with BZZ.

## Wallet

Your node is equipped with an Ethereum wallet. This will hold the native currency of the blockchain which will be used to pay gas fees for the network. In the case of Swarm mainnet, this is xDAI, for Swarm testnet, it will be Goerli Eth (gETH).

## Chequebook

When your node has downloaded content which exceeds the free tier threshold, _cheques_ are sent to peers to provide payment in return for the services they have provided. In order to send these cheques, your chequebook must also be funded with BZZ. As your node initialises for the first time, a chequebook is deployed, and some BZZ is sent from your node's wallet to your newly deployed chequebook. You may alter the amount that is sent using your node's [configuration](/docs/working-with-bee/configuration). It is 1 BZZ by default.

# Accessing Your Node's Wallet

When your Bee node is created for the first time, an Ethereum wallet is created which is used by Bee to interact with the blockchain: for sending and receiving cheques and for making purchase of postage stamps amoungst other things.

Sometimes, it might be useful to interact with your wallet directly, such as when you want to top up or withdrawal the chain's native currency, or to initally load your node up with BZZ. In this case, you can access the wallet file as follows.

## Debian/Ubuntu Installation

### With Bee-Clef

Your encrypted wallet file can be found as in this example:

```sh
sudo ls /var/lib/bee-clef/keystore
sudo cat /var/lib/bee-clef/keystore/UTC--2021-10-08T11-23-20.885085712Z--8789eb182fb94741ef65e29e0879d5a8bb721b9b
```

And decrypted using the automatically generated password found at:

```sh
sudo cat /var/lib/bee-clef/password
```

### Without Bee-Clef

Your key can be found within the keys folder of your datadir. For instance, on a normal Ubuntu/Debian install you will find it at:

```sh
sudo cat /var/lib/bee/keys/libp2p.key
```

Once you have acquired your wallet file and it's password, you may use any
Ethereum wallet software such as [MetaMask](https://metamask.io/) to interact
with your wallet.

# Configure Your Wallet

To interact with the BZZ ecosystem, you will need to make a couple of small
configuration additions to your wallet software. In the case of MetaMask, you
will need to [add the xDAI
network](https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup)
then [add a custom
token](https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-add-unlisted-tokens-custom-tokens-in-MetaMask).

The canoncial addresses for the BZZ token are as follows:

## Mainnet

`0x19062190b1925b5b6689d7073fdfc8c2976ef8cb`

## xDAI Network Bridged from Mainnet

`0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da`

## Goerli Testnet

`0x2ac3c1d3e24b45c6c310534bc2dd84b5ed576335`

# Acquiring and Sending Funds

## Mainnet

In order to interact with the [xDAI](https://www.xdaichain.com/for-users/getting-started-with-xdai) blockchain, you must pay gas costs in xDAI for each transaction.

### Getting Started

If you are just trying Bee out on mainnet, since gas costs on the xDAI network are very low, you won't need much to get started. You may acquire a small amount of xDAI for free by using the [BAO Community xDai Faucet](https://xdai-app.herokuapp.com/faucet). You can use the [Blockscout](https://blockscout.com/xdai/mainnet/) block explorer to get visibility of what's going on with your wallet by searching for your Ethereum address.

### Full Node

If you want to run a full node or upload a lot of content, you may need more xDAI for gas. To acquire this, you may convert Dai on the main Ethereum network to xDai using the [xDai bridge](https://www.xdaichain.com/for-users/bridges/converting-xdai-via-bridge), or buy xDAI [directly using fiat]https://www.xdaichain.com/for-users/get-xdai-tokens/buying-xdai-with-fiat.

To bridge your BZZ from the Ethereum mainet to xDai, you may use [omni bridge](https://omni.xdaichain.com/bridge). Please note that the address of the BZZ token contract on xDai chain ([`0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da`](https://blockscout.com/xdai/mainnet/tokens/0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da/)) is different from that on the Ethereum chain.

To work out what your node's Ethereum address is, please consult your relevant installation guide or check your logs!

## Testnet

Your Bee node needs gETH and gBZZ to be able to properly interact with the test network. In order to receive these, you will need to sign into our Discord and request your gETH and gBZZ test tokens from the [#faucet](https://discord.gg/TVgKhsGEbc) channel, using your node's Ethereum address.

To work out what your node's Ethereum address is, please consult your relevant installation guide or check your logs!

Once you have determined your Ethereum address, join our [Discord server](https://discord.gg/wdghaQsGq5) and navigate to the [#faucet](https://discord.gg/TVgKhsGEbc) channel. After you have [verified your username](https://discord.gg/tXGPdzZQaV) (and said hi! 👋 ), use our Faucet Bot to get your test tokens.

Here you must **type** (not copy paste) the following, replacing the address with your own:

```
/faucet sprinkle 0xabeeecdef123452a40f6ea9f598596ca8556bd57
```

If you have problems, please let us know by making a post in the [#faucet](https://discord.gg/TVgKhsGEbc) channel, we will do our best to provide tokens to everyone.

Note that you should use a Chromium-based client (e.g., Chrome, native Discord client) to type the faucet command, as support for other browsers is spotty. It's reported to not work on Firefox, for example.

Transactions may take a while to complete, please be patient. We're also keen for you to join us in the swarm, and indeed you soon will! 🐝 &nbsp 🐝 &nbsp 🐝
