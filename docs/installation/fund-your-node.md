---
title: Fund Your Node
id: fund-your-node
---

In order to start your Bee node on the _mainnet_, its Ethereum wallet must be
funded with:

- 1 [xBZZ](/docs/introduction/terminology#xbzz-token), for traffic
  accounting (this is optional, [see below](#basic-deployment))

- some [xDAI](/docs/introduction/terminology#xdai-token), to pay the gas fees of
  a couple of transactions on the [Gnosis
  Chain](/docs/introduction/terminology#gnosis-chain).

The reason BZZ must be [bridged](/docs/introduction/terminology#bridging-tokens)
to the Gnosis Chain is that the transaction fees are currently too high on the
Ethereum mainnet for Swarm's purposes.

### A node's wallet

When your Bee node is installed, an Ethereum wallet is also created. This wallet
is used by Bee to interact with the blockchain (e.g. for sending and receiving
cheques, or for making purchases of postage stamps, etc.).

### Chequebook

When your node has downloaded enough content to exceed the free tier threshold,
then _cheques_ are sent to peers to provide payment in return for their
services.

In order to send these cheques, a _chequebook_ must be deployed on the
blockchain for your node, and for full speed operation it can be funded with
BZZ. This deployment happens when a node initialises for the first time. Your
Bee node will warn you in its log if there aren't enough funds in its wallet for
deploying the chequebook.

You can [configure](/docs/working-with-bee/configuration) the amount of BZZ to
be sent from the node's wallet. It is 1 BZZ by default, but it can be set to
zero.

## Joining the swarm (mainnet)

### Basic deployment

If you want to get your Bee node up and running as easily as possible, then you
can set its
[`--swap-initial-deposit`](/docs/working-with-bee/configuration#--swap-initial-deposit)
value to zero. This means that your node's chequebook will not get funded with
BZZ, meaning that other nodes will only serve it within the free tier bandwidth
threshold.

Since gas fees on the [Gnosis Chain](https://www.xdaichain.com/) are very low,
you won't need much xDAI either to get started. You may acquire a small amount
of it for free by using the [official xDAI faucet for
Gnosis Chain](https://gnosisfaucet.com). The required amount is a
function of the current transaction fee on the chain, but 0.01 xDAI should be
more than enough to start up your node.

You can use the [Blockscout](https://blockscout.com/xdai/mainnet/) block
explorer to inspect what's going on with your wallet by searching for its
Ethereum address.

### Full performance node

If you want to run a full node, or upload a lot of content, then you may need
more xDAI for gas. To acquire this, you may convert DAI on the main Ethereum
network to xDAI using the
[xDAI bridge](https://www.xdaichain.com/for-users/bridges/converting-xdai-via-bridge),
or buy xDAI
[directly using fiat](https://www.xdaichain.com/for-users/get-xdai-tokens/buying-xdai-with-fiat).

You will also need to fund your node with more BZZ for full speed access, or to
purchase postage stamps to upload content. To bridge BZZ from the Ethereum
mainet to the [Gnosis Chain](https://www.xdaichain.com/), you may use
[OmniBridge](https://omni.xdaichain.com/bridge).

To find out what your node's Ethereum address is, please consult your relevant
installation guide or check your logs!

# Configure Your Wallet App

To interact with the BZZ ecosystem, you will need to make a couple of small
configuration additions to your wallet software. In the case of e.g. MetaMask,
you'll need to
[add the Gnosis Chain network](https://www.xdaichain.com/for-users/wallets/metamask),
and then
[add a custom token](https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-add-unlisted-tokens-custom-tokens-in-MetaMask).

The canoncial addresses for the BZZ token on the various blockchains are as
follows:

| Blockchain             | Contract address                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum, BZZ          | [`0x19062190b1925b5b6689d7073fdfc8c2976ef8cb`](https://ethplorer.io/address/0x19062190b1925b5b6689d7073fdfc8c2976ef8cb)                |
| Gnosis Chain, xBZZ     | [`0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da`](https://blockscout.com/xdai/mainnet/tokens/0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da/) |
| Goerli (testnet), gBZZ | [`0x2ac3c1d3e24b45c6c310534bc2dd84b5ed576335`](https://goerli.etherscan.io/address/0x2ac3c1d3e24b45c6c310534bc2dd84b5ed576335)         |

# Accessing Your Node's Wallet

When your Bee node is installed, an Ethereum wallet is created. This wallet is
used by Bee to interact with the blockchain (e.g. for sending and receiving
cheques, or for making purchases of postage stamps, etc.).

If you wish to interact with the node's wallet directly (e.g. by importing it
into a wallet app like [MetaMask](https://metamask.io/)), then you can access
the wallet file as follows.

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

Your key can be found within the `keys/` folder of your datadir. For instance,
on a normal Ubuntu/Debian install you will find it at:

```sh
sudo cat /var/lib/bee/keys/libp2p.key
```

Once you have acquired your wallet file and its password, you may use any
Ethereum wallet software such as [MetaMask](https://metamask.io/) to interact
with your wallet.

# Testnet

Your Bee node needs gETH and gBZZ to be able to properly interact with the test network. In order to receive these, you will need to sign into our Discord and request your gETH and gBZZ test tokens from the [#faucet](https://discord.gg/TVgKhsGEbc) channel, using your node's Ethereum address.

To work out what your node's Ethereum address is, please consult your relevant installation guide or check your logs!

Once you have determined your Ethereum address, join our [Discord
server](https://discord.gg/wdghaQsGq5) and navigate to the
[#faucet](https://discord.gg/TVgKhsGEbc) channel. After you have [verified your
username](https://discord.gg/tXGPdzZQaV) (and say hi! 👋), use our Faucet Bot
to get your test tokens.

Here you must **type** (not copy paste) the following, replacing the address with your own:

```
/faucet sprinkle 0xabeeecdef123452a40f6ea9f598596ca8556bd57
```

If you have problems, please let us know by making a post in the [#faucet](https://discord.gg/TVgKhsGEbc) channel, we will do our best to provide tokens to everyone.

Note that you should use a Chromium-based client (e.g., Chrome, native Discord client) to type the faucet command, as support for other browsers is spotty. It's reported to not work on Firefox, for example.

Transactions may take a while to complete, please be patient. We're also keen for you to join us in the swarm, and indeed you soon will! 🐝 &nbsp 🐝 &nbsp 🐝
