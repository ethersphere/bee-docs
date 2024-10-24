---
title: Fund Your Node
id: fund-your-node
---

In order to start your Bee node on the _mainnet_, its Ethereum wallet must be
funded with:

- 1 [xBZZ](/docs/learn/glossary#xbzz-token), for traffic
  accounting (this is optional, [see below](#basic-deployment))

- some [xDAI](/docs/learn/glossary#xdai-token), to pay the gas fees of
  a couple of transactions on the [Gnosis
  Chain](/docs/learn/glossary#gnosis-chain).

Take note that xBZZ is the [bridged](/docs/learn/glossary#bridged-tokens) version of BZZ from Ethereum to the Gnosis Chain.

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

You can [configure](/docs/bee/working-with-bee/configuration) the amount of xBZZ to
be sent from the node's wallet. It is 1 xBZZ by default, but it can be set to
zero.

## Joining the swarm (mainnet)

### Basic deployment

If you want to get your Bee node up and running as easily as possible, then you
can set its
[`--swap-initial-deposit`](/docs/bee/working-with-bee/configuration)
value to zero. This means that your node's chequebook will not get funded with
xBZZ, meaning that other nodes will only serve it within the free tier bandwidth
threshold.

Since gas fees on the [Gnosis Chain](https://www.gnosis.io/) are very low,
you won't need much xDAI either to get started. You may acquire a small amount
for free by using the official Gnosis Chain xDAI faucet [xDAI Faucet](https://gnosisfaucet.com/). The required amount is a function of the current transaction fee on chain, but 0.01 xDAI should be
more than enough to start up your node.

You can use the [Blockscout](https://blockscout.com/xdai/mainnet/) block
explorer to inspect what's going on with your wallet by searching for its
Ethereum address.

### Full performance node

If you want to run a full node, or upload a lot of content, then you may need
more xDAI for gas. To acquire this, you may convert DAI on the main Ethereum
network to xDAI using the
[Gnosis Chain bridge](https://bridge.gnosischain.com/),
or buy xDAI
[directly using fiat](https://buyxdai.com/).

You will also need to fund your node with more xBZZ for full speed access, or to
purchase postage stamps to upload content. To bridge BZZ from the Ethereum
mainet to the [Gnosis Chain](https://www.gnosis.io/), you may use the [Gnosis Chain Bridge](https://bridge.gnosischain.com/).

To find out what your node's Ethereum address is, please consult your relevant
installation guide or check your logs!

# Configure Your Wallet App

To interact with the BZZ ecosystem, you will need to make a couple of small
configuration additions to your wallet software. In the case of e.g. MetaMask,
you'll need to
[add the Gnosis Chain network](https://docs.gnosischain.com/tools/wallets/metamask/),
and then
[add a custom token](https://metamask.zendesk.com/hc/en-us/articles/360015489031-How-to-add-unlisted-tokens-custom-tokens-in-MetaMask).

The canonical addresses for the BZZ token on the various blockchains are as
follows:

| Blockchain             | Contract address                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum, BZZ          | [`0x19062190b1925b5b6689d7073fdfc8c2976ef8cb`](https://ethplorer.io/address/0x19062190b1925b5b6689d7073fdfc8c2976ef8cb)                |
| Gnosis Chain, xBZZ     | [`0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da`](https://blockscout.com/xdai/mainnet/tokens/0xdBF3Ea6F5beE45c02255B2c26a16F300502F68da/) |
| Sepolia (testnet), sBZZ | [`0x543dDb01Ba47acB11de34891cD86B675F04840db`](https://sepolia.etherscan.io/address/0x543dDb01Ba47acB11de34891cD86B675F04840db)         |

# Accessing Your Node's Wallet

If you wish to interact with the node's wallet directly then you can
import it into a wallet app like [MetaMask](https://metamask.io/). To
do that you will need the wallet file and its password. A Bee node's
wallet key is stored within the `keys/` folder in its datadir, in JSON
format, and its password should be in a file nearby it.

For example on Debian or Ubuntu:

```sh
sudo cat /var/lib/bee/keys/swarm.key
sudo cat /var/lib/bee/password
```

# Testnet

A Bee node needs Sepolia ETH and sBZZ in its wallet to be able to properly
interact with the test network. One way to acquire these funds is to
sign into our Discord and request Sepolia ETH and sBZZ test tokens from the
*faucet bot* to your node's Ethereum address.

To find out what your node's Ethereum address is, please consult the
installation guide or check the logs!

Once you have the address:

1. join our [Discord server](https://discord.gg/wdghaQsGq5)
2. navigate to the [#faucet](https://discord.gg/TVgKhsGEbc) channel
3. [verify your username](https://discord.gg/tXGPdzZQaV)
4. request test tokens from the *faucet bot*

To request the tokens you must **type** (not copy paste) the following, replacing the address with your own:

```
/faucet sprinkle 0xabeeecdef123452a40f6ea9f598596ca8556bd57
```

If you have problems, please let us know by making a post in the [#faucet](https://discord.gg/TVgKhsGEbc) channel, we will do our best to provide tokens to everyone.

Note that you should use a Chromium-based client (e.g., Chrome, native Discord client) to type the faucet command, as support for other browsers is spotty. It's reported to not work on Firefox, for example.

Transactions may take a while to complete, please be patient. We're also keen for you to join us in the swarm, and indeed you soon will! 🐝 &nbsp 🐝 &nbsp 🐝
