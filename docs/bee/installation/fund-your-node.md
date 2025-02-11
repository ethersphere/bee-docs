---
title: Fund Your Node
id: fund-your-node
---



## **Fund Your Node**

Bee nodes require varying amounts of either [xDAI](/docs/references/tokens#xdai) or [xBZZ](/docs/references/tokens#xbzz) funds, depending on the node type and use case. The amount and type of tokens required depend on the following factors:

- Whether the node is an [ultra-light, light, or full node](/docs/bee/installation/getting-started#node-types).
- Whether the node operator wishes to [download](/docs/develop/access-the-swarm/upload-and-download/#download-a-file) or [upload data](/docs/develop/access-the-swarm/buy-a-stamp-batch) and how much data they intend to handle.
- Whether the node operator wishes to participate in the [storage incentives system](/docs/bee/working-with-bee/staking/) and/or the [bandwidth incentives system](/docs/concepts/incentives/bandwidth-incentives/).


## **xDAI Requirements**

xDAI is required to pay for gas fees on the Gnosis Chain. There are ***four categories of transactions*** that require xDAI for on-chain interactions:
  

### **1. [Buying Postage Stamp Batches](/docs/concepts/incentives/postage-stamps) (Light / Full Nodes)**  

Postage stamp batches must be purchased to upload data to Swarm. The fees for issuing stamp batches are minimal. For example, [this stamp batch creation transaction](https://gnosisscan.io/tx/0xdc350c059b7bfc10de3d71be71774dda395e2ff770ed6dc83a63c14a418d2be8) cost only **0.00050416 xDAI**.  

Additionally, xBZZ is required based on the volume of storage purchased—see [the xBZZ section below](/docs/bee/installation/fund-your-node#xbzz-requirements) for details.

### **2. [Stake Management Transactions](/docs/bee/working-with-bee/staking/#maximize-rewards) (Full Nodes Only)**  

Stake management transactions include:

- [Adding stake](/docs/bee/working-with-bee/staking/#add-stake).
- [Partial stake withdrawals](/docs/bee/working-with-bee/staking/#partial-stake-withdrawals).
- [Stake migration](/api/#tag/Staking/paths/~1stake/delete) when a new staking contract is deployed.

Each of these transactions requires a small amount of xDAI to pay for Gnosis Chain gas fees. For example, this [staking transaction](https://gnosisscan.io/tx/0x3a3a5119e54c59f76b60c05bf434ef3d5ec1a3ec47875c3bf1da66dafccf5f72) added **10 xBZZ** in stake (denominated in [PLUR](/docs/references/glossary/#plur) as 1e16 PLUR (100,000,000,000,000,000 PLUR). The xDAI cost for the transaction was minimal—only **0.00026872 xDAI**.  

See the section below for details on required xBZZ stake amounts.

### **3. [Storage Incentives Transactions](/docs/concepts/incentives/overview) (Full Nodes Only)**  

Full nodes with at least **10 xBZZ** in stake are eligible to earn storage incentives. They may choose to [double their reserve size and stake a total of 20 xBZZ](/docs/bee/working-with-bee/staking/#reserve-doubling) to maximize earning potential.  

Participating in storage incentives requires nodes to wait for their neighborhood to be selected and then send on-chain transactions for a chance to earn xBZZ.  

There are three types of storage incentive transactions: **commit, reveal, and claim** ([details here](/docs/concepts/incentives/redistribution-game/#redistribution-game-details)). Each requires only a small amount of xDAI and typically occurs a few times per month. However, over time, xDAI may need to be replenished if depleted.  

As an example reference, the gas costs from several months ago were:

- [Claim](https://gnosisscan.io/tx/0x88f83b0267539c663461e449f87118864ff9b801eaf6ea0fedadc1d824685181): **0.0009953 xDAI**
- [Commit](https://gnosisscan.io/tx/0x91bdf7363535fb405547c50742d6070cd249dd4c2fc00d494c79b3dbf516b1f3): **0.0002918 xDAI**
- [Reveal](https://gnosisscan.io/tx/0x625dd6cd3cf8f9c1dfe27335884994b43519b0a59e0bb3968bd663d200d1772b): **0.0002918 xDAI**

*Note that while the gas costs today are roughly similar to the examples above, gas fees may change over time due to potential network congestion and a variety of other factors.*


### **4. [Bandwidth Incentives Transactions](/docs/concepts/incentives/bandwidth-incentives) (Light and Full Nodes)**  

When initializing a new light or full node, deploying a bandwidth incentives contract (also called a **SWAP contract**) is required. The xDAI gas fees for this are minimal.  

For example, [this SWAP contract deployment transaction](https://gnosisscan.io/tx/0xc17b023ba22a9b2c2c27a40ce88d68caf95eb02e17ae57e9c56810b7b33a6ebc) cost only **0.00058154 xDAI**.


## **xBZZ Requirements**  

xBZZ is used to pay for storing and retrieving data on Swarm. It is required for ***three categories of transactions***:

### **1. [Buying Postage Stamp Batches](/docs/concepts/incentives/postage-stamps) (Light / Full Nodes)**  

To upload data, postage stamp batches must be purchased. The required xBZZ amount varies based on:

- **Storage volume** needed.
- **Storage duration** required.

Stamp batches use two parameters: **depth** (determines data capacity) and **amount** (determines storage duration). See [this page](/docs/develop/access-the-swarm/buy-a-stamp-batch) for details on selecting appropriate values.

### **2. [Staking](/docs/bee/working-with-bee/staking/) (Full Nodes Only)**  

A **minimum stake of 10 xBZZ** is required to participate in storage incentives. Nodes opting for [reserve doubling](/docs/bee/working-with-bee/staking/#reserve-doubling) may stake **20 xBZZ** to optimize earnings.

### **3. [Bandwidth (SWAP) Payments](/docs/concepts/incentives/bandwidth-incentives) (Light / Full Nodes)**  

Bandwidth payments are required for downloading and uploading data.  

- **Ultra-light nodes**: Free-tier downloads only; no uploads.
- **Light and full nodes**: Must deploy a [SWAP contract](/docs/concepts/incentives/bandwidth-incentives) before making bandwidth payments.

The **SWAP contract deployment fee** is minimal—for example, [this transaction](https://gnosisscan.io/tx/0x09438217f75516df1319eb772d503126ab38ecf52e6d9fd626411a238e0d687a) cost **0.00018542 xDAI**.  


:::info
**Cost Estimates for Bandwidth Payments**  

- **Downloading 1GB**: ~**0.5 xBZZ** in SWAP payments.  
- **Uploading**: Requires a funded SWAP contract.  

Running a **full/light node** with `swap-enable` turned on allows nodes to **earn bandwidth incentives** by providing bandwidth to others. Actual xBZZ costs depend on network activity and should be actively monitored.
:::

## Token Requirements Based on Node Type and Use Case  

The amount of **xDAI** and **xBZZ** required to run a Bee node depends on the node type and intended use case. While **no tokens** are required to run an **ultra-light node**, both **light and full nodes** require some **xDAI** for gas fees and **xBZZ** for data transactions.  

### **Token Requirement Table**  


| **Use Case**                         | **Supported Node Type**       | **Amount of xDAI Required**                                   | **Amount of xBZZ Required**                                   |  
|--------------------------------------|------------------------------|-----------------------------------------------------|-----------------------------------------------------|  
| **Free tier downloads (no uploads)**    | Ultra-Light, Light, Full      | None                                                | None                                                |  
| **Downloading  beyond free tier**       | Light, Full                   |  A small amount such as **~0.1 xDAI**  is more than enough to deploy the [SWAP/chequebook contract](/docs/concepts/incentives/bandwidth-incentives)      | **~0.1 xBZZ** is enough to get started uploading smaller amounts of data, but more will be required once entering the GB range    |  
| **Uploading Data**                    | Light, Full                   | **~0.1 xDAI** is more than enough for both the initial SWAP/chequebook deployment transaction and the postage stamp batch purchase gas fees | **~0.1 xBZZ** will be enough to upload and store a small amount of data for a short period, but [considerably more xBZZ is required](/docs/develop/access-the-swarm/buy-a-stamp-batch#setting-stamp-batch-parameters-and-options) to store larger amounts of data for a longer time(scales with uploaded volume)        |  
| **Staking**                            | Full                           | **0.1 xDAI** is a reasonable minimum for getting started, more is recommended for long term operation. Staking related transactions occur several times a month and can cost up to around 0.001 xBZZ per transaction.     | **10 xBZZ** (minimum required stake, **20 xBZZ** is required for staking with a [doubled reserve](/docs/bee/working-with-bee/staking/#reserve-doubling)). Stake is generally speaking not withdrawable.    |  
| **Participating in storage incentives** | Full                           | **Small amount of xDAI** (for commit, reveal, claim transactions) | **10 xBZZ** (minimum required stake)               |  
| **Bandwidth (SWAP) payments**          | Light, Full                   | **~0.0005 xDAI** (for initial SWAP contract deployment) | **Scales with bandwidth usage** (~0.5 xBZZ per GB downloaded) |           |  

This table provides a general guideline, but actual xDAI and xBZZ usage will depend on individual node activity and transaction fees at the time.

### A Node's Wallet

When your Bee node is installed, a Gnosis Chain wallet is also created. This wallet
is used by Bee to interact with the blockchain (e.g. for sending and receiving
cheques, or for making purchases of postage stamps, etc.).

### Chequebook

When your node has downloaded enough content to exceed the free tier threshold,
then _cheques_ are sent to peers to provide payment in return for their
services.

In order to send these cheques, a [_chequebook_](/docs/concepts/incentives/bandwidth-incentives#chequebook-contract) must be deployed on the
blockchain for your node, and for full speed operation it can be funded with
BZZ. This deployment happens when a node initialises for the first time. Your
Bee node will warn you in its log if there aren't enough funds in its wallet for
deploying the chequebook.

You can [configure](/docs/bee/working-with-bee/configuration) the amount of xBZZ to
be sent from the node's wallet using the `swap-initial-deposit` option. It is 0 xBZZ by default, but it is recommended to deposit more xBZZ it you intend to download / upload any significant amount of data, as your node will exceed its free bandwidth threshold otherwise.

## Joining the Swarm (mainnet)

### Basic Deployment

If you want to get your Bee node up and running as easily as possible, then you
can set its [`swap-initial-deposit`](/docs/bee/working-with-bee/configuration)
value to zero. This means that your node's chequebook will not get funded with
xBZZ, meaning that other nodes will only serve it within the free tier bandwidth
threshold.

Since gas fees on the [Gnosis Chain](https://www.gnosis.io/) are very low,
you won't need much xDAI either to get started. You may acquire a small amount
for free by using the official Gnosis Chain xDAI faucet [xDAI Faucet](https://gnosisfaucet.com/). The required amount is a function of the current transaction fee on chain, but 0.01 xDAI should be more than enough to start up your node.

You can use the [Blockscout](https://blockscout.com/xdai/mainnet/) block
explorer to inspect what's going on with your wallet by searching for its
Gnosis Chain address.

### Full node

If you want to run a full node, or upload a lot of content, then you may need
more xDAI for gas. To acquire this, you may convert DAI on the main Ethereum
network to xDAI using the [Gnosis Chain bridge](https://bridge.gnosischain.com/),
or buy xDAI [directly using fiat](https://buyxdai.com/).

To find out what your node's Gnosis Chain address is, you can use the `/addresses` endpoint (the [jq](https://jqlang.github.io/jq/) part of the command is and optional but recommended tool to make it easier to read json output):

```bash
curl -s localhost:1633/addresses | jq
```

```json
{
  "overlay": "46275b02b644a81c8776e2459531be2b2f34a94d47947feb03bc1e209678176c",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq",
    "/ip4/192.168.0.10/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq",
    "/ip6/::1/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq"
  ],
  "ethereum": "0x0b546f2817d0d889bd70e244c1227f331f2edf74",
  "public_key": "03660e8dbcf3fda791e8e2e50bce658a96d766e68eb6caa00ce2bb87c1937f02a5"
}
```

The value in the `ethereum` field is your Gnosis Chain address (the `ethereum` keyname is used as Gnosis Chain is an Ethereum sidechain and shares the same address format).

# Configure Your Wallet App

To interact with the BZZ ecosystem, you will need to make a couple of small
configuration additions to your wallet software. In the case of e.g. MetaMask,
you'll need to [add the Gnosis Chain network](https://docs.gnosischain.com/tools/wallets/metamask/), and then [add a custom token](https://support.metamask.io/manage-crypto/portfolio/how-to-import-a-token-in-metamask-portfolio/).

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
