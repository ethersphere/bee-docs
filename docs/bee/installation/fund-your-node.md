---
title: Fund Your Node
id: fund-your-node
---

Bee nodes require varying amounts of either [xDAI](/docs/references/tokens#xdai) or [xBZZ](/docs/references/tokens#xbzz) funds depending on the node type and use case. The amount and type of tokens required depend on these factors:
  * Whether the node is an ultra-light, light, or full node
  * Whether the node operator wishes to download or upload data, and how much data they wish to download or upload
  * Whether the node operator wishes to participate in the storage incentives system and/or bandwidth incentives system 

### **xDAI Requirements**  
  

xDAI is required to pay for gas fees on the Gnosis Chain. There are ***four categories of transactions*** which require xDAI for on-chain transactions:
  
  1.  **Buying postage stamp batches (light / full nodes):** 
    
      Postage stamp batches must be purchased in order to upload data to Swarm. Fees for issuing stamp batches are very low. For example, [this stamp batch creation transaction](https://gnosisscan.io/tx/0xdc350c059b7bfc10de3d71be71774dda395e2ff770ed6dc83a63c14a418d2be8) cost was only 0.00050416 xDAI. There will be an additional cost in xBZZ which will depend on the volume of storage purchased - see section below for details.

  1. **Stake management related transactions (full nodes only):** 

      Transactions to manage stake require small amounts of xDAI. These types of transactions include adding stake, migrating stake, and withdrawing stake (partial stake withdrawal is only allowed [under certain conditions](/docs/bee/working-with-bee/staking/#partial-stake-withdrawals)). For example, this [staking transaction](https://gnosisscan.io/tx/0x3a3a5119e54c59f76b60c05bf434ef3d5ec1a3ec47875c3bf1da66dafccf5f72) was used to add 10 xBZZ stake (denominated in [PLUR](/docs/references/glossary/#plur) as 100000000000000000 PLUR). The xDAI cost for the transaction was very minimal, only 0.00026872 xDAI was spent. See section below which describes how much xBZZ stake is required. 

  1. **Storage incentives related transactions (full nodes only):** 

      Full nodes which have staked the minimum required 10 xBZZ stake are eligible to earn [storage incentives](/docs/concepts/incentives/overview). They may even choose to [double their reserve size and stake a total of 20 xBZZ](/docs/bee/working-with-bee/staking/#reserve-doubling) in order to maximize their node's earning potential. Participating in storage incentives requires that nodes wait for their neighborhood to be chosen, and then send the required on-chain transactions for a chance to win some xBZZ. There are three types of storage incentives related transactions, [commit, reveal, and claim](/docs/concepts/incentives/redistribution-game/#redistribution-game-details). Each of these transactions require only a small amount of xDAI and typically are required only several times per month based on the current network situation, however over time they may add up, and xDAI may need to be topped up if it runs out. These [claim](https://gnosisscan.io/tx/0x88f83b0267539c663461e449f87118864ff9b801eaf6ea0fedadc1d824685181), [commit](https://gnosisscan.io/tx/0x91bdf7363535fb405547c50742d6070cd249dd4c2fc00d494c79b3dbf516b1f3), and [reveal](https://gnosisscan.io/tx/0x625dd6cd3cf8f9c1dfe27335884994b43519b0a59e0bb3968bd663d200d1772b) transactions each require 0.0009953, 0.0002918, and 0.0002918 xDAI respectively. 

  1. Bandwidth incentives related transactions (light and full nodes):

      When a new light or full node is initialized, the deployment of a bandwidth incentives contract (AKA SWAP contract) is required. Again, the xDAI fees are very small. For example, [this SWAP contract deployment transaction](https://gnosisscan.io/tx/0xc17b023ba22a9b2c2c27a40ce88d68caf95eb02e17ae57e9c56810b7b33a6ebc) cost only 0.00058154 xDAI.

### **xBZZ Requirements**  
  

xBZZ is required to purchase storage space on the Swarm network in the form of [postage stamps](/docs/concepts/incentives/postage-stamps).  
  
  1.  **Buying postage stamp batches (light / full nodes):** 
    
      Postage stamp batches must be purchased in order to upload data to Swarm. The amount of xBZZ required can vary widely depending on the amount storage volume required, as well as the required duration of storage time. Stamp batches have two inputs, `depth` and `amount`. The `depth` parameter determines how much data the batch can be used to upload while the `amount` parameter determines the duration of storage time. For example. 

      :::info
      The storage volume and duration are both non-deterministic. Volume is non-deterministic due to the details of how [postage stamp batch utilization](/docs/concepts/incentives/postage-stamps#batch-utilisation) works. While duration is non-deterministic due to price changes made by the [price oracle contract](/docs/concepts/incentives/price-oracle).

      **Storage volume and `depth`:**

      When purchasing stamp batches for larger volumes of data (by increasing the `depth` value), the amount of data which can be stored becomes increasingly more predictable. For example, at `depth` 22 a batch can store between 4.93 GB and 17.18 GB, while at `depth` 28, a batch can store between 1.0 and 1.1 TB of data, and at higher depths the difference between the minimum and maximum storage volumes approach the same value.

      **Storage duration and `amount`:** 

      The duration of time for which a batch can store data is also non-deterministic since the price of storage is automatically adjusted over time by the [price oracle contract](/docs/concepts/incentives/price-oracle). However, limits have been placed on how swiftly the price of storage can change, so there is no danger of a rapid change in price causing postage batches to unexpectedly expire due to a rapid increase in price.
      :::

  1. **Stake management related transactions (full nodes only):** 

      Transactions to manage stake require small amounts of xDAI. These types of transactions include adding stake, migrating stake, and withdrawing stake (partial stake withdrawal is only allowed [under certain conditions](/docs/bee/working-with-bee/staking/#partial-stake-withdrawals)). For example, this [staking transaction](https://gnosisscan.io/tx/0x3a3a5119e54c59f76b60c05bf434ef3d5ec1a3ec47875c3bf1da66dafccf5f72) was used to add 10 xBZZ stake (denominated in [PLUR](/docs/references/glossary/#plur) as 100000000000000000 PLUR). The xDAI cost for the transaction was very minimal, only 0.00026872 xDAI was spent. See section below which describes how much xBZZ stake is required. 

  1. **Storage incentives related transactions (full nodes only):** 

      Full nodes which have staked the minimum required 10 xBZZ stake are eligible to earn [storage incentives](/docs/concepts/incentives/overview). They may even choose to [double their reserve size and stake a total of 20 xBZZ](/docs/bee/working-with-bee/staking/#reserve-doubling) in order to maximize their node's earning potential. Participating in storage incentives requires that nodes wait for their neighborhood to be chosen, and then send the required on-chain transactions for a chance to win some xBZZ. There are three types of storage incentives related transactions, [commit, reveal, and claim](/docs/concepts/incentives/redistribution-game/#redistribution-game-details). Each of these transactions require only a small amount of xDAI and typically are required only several times per month based on the current network situation, however over time they may add up, and xDAI may need to be topped up if it runs out. These [claim](https://gnosisscan.io/tx/0x88f83b0267539c663461e449f87118864ff9b801eaf6ea0fedadc1d824685181), [commit](https://gnosisscan.io/tx/0x91bdf7363535fb405547c50742d6070cd249dd4c2fc00d494c79b3dbf516b1f3), and [reveal](https://gnosisscan.io/tx/0x625dd6cd3cf8f9c1dfe27335884994b43519b0a59e0bb3968bd663d200d1772b) transactions each require 0.0009953, 0.0002918, and 0.0002918 xDAI respectively. 

  1. Bandwidth incentives related transactions (light and full nodes):

      When a new light or full node is initialized, the deployment of a bandwidth incentives contract (AKA SWAP contract) is required. Again, the xDAI fees are very small. For example, [this SWAP contract deployment transaction](https://gnosisscan.io/tx/0xc17b023ba22a9b2c2c27a40ce88d68caf95eb02e17ae57e9c56810b7b33a6ebc) cost only 0.00058154 xDAI.


You can check exactly how much is required to get started from the `/redistributionstate` endpoint:

```bash
root@noah-bee:~#  curl localhost:1633/redistributionstate | jq
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   304  100   304    0     0  15258      0 --:--:-- --:--:-- --:--:-- 16000
{
  "minimumGasFunds": "3750000030000000",
  "hasSufficientFunds": true,
  "isFrozen": false,
  "isFullySynced": false,
  "phase": "reveal",
  "round": 253280,
  "lastWonRound": 0,
  "lastPlayedRound": 0,
  "lastFrozenRound": 0,
  "lastSelectedRound": 0,
  "lastSampleDurationSeconds": 0,
  "block": 38498620,
  "reward": "0",
  "fees": "0",
  "isHealthy": true
}
```
The `3750000030000000` value listed for `minimumGasFunds` is the minimum required amount of xDAI denominated in Wei ($1 \text{xDAI} = 10^{18} \text{ Wei}$
)  required for staking

- **For uploading/downloading**: Light and full nodes require xDAI for various transactions, such as issuing a chequebook contract and purchasing postage stamps. The required amount depends on usage.  

### **xBZZ Requirements**  
xBZZ is required for Swarm storage and bandwidth incentives.  
- **For staking**: A minimum of **10 xBZZ** is required as a stake for a **full node** participating in storage incentives.  
- **For basic uploads**: **0.1 xBZZ** is a reasonable minimum to get started, though it is possible to begin with even less. However, significantly more will be needed for frequent or large uploads.  
- **For downloading**: Some xBZZ is required to exceed the free download limits.  



## Token Requirements Based on Node Type and Use Case  

The amount of **xDAI** and **xBZZ** required to run a Bee node depends on the node type and intended use case. While **no tokens** are required to run an **ultra-light node**, both **light and full nodes** require some **xDAI** for gas fees and **xBZZ** for data transactions.  

### **Token Requirement Table**  

| **Use Case**                         | **Supported Node Type**       | **xDAI Required**         | **xBZZ Required**          |  
|--------------------------------------|--------------------|--------------------------|----------------------------|  
| Free tier downloads (no uploads)    | All       | None                     | None                        |  
| Downloading past free tier           | Light / Full      | None  | ~0.1 xBZZ to get started, amount scales up with amount of downloaded data.        |  
| Basic uploading                      | Light / Full      | ~0.1 xDAI is plenty to get started. For example, this     | **~0.1 xBZZ**, [amount scales up with volume of uploaded data](/docs/develop/access-the-swarm/buy-a-stamp-batch).     |  
| Frequent/Large uploads               | Light / Full      | More xDAI recommended    | **More xBZZ required**      |  
| Staking                              | Full              | **0.1 xDAI** (minimum)   | **10 xBZZ** (required)      |  
| Long-term staking                    | Full              | More xDAI recommended    | **10 xBZZ+**                |  

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
