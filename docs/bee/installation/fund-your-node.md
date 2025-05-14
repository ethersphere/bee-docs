---
title: Fund Your Node
id: fund-your-node
---

## Overview
Bee nodes require **xDAI** (for gas fees) and **xBZZ** (for storage and bandwidth) to function properly. The amount needed depends on your node type and use case.

### xDAI is Required For:
- **Buying Postage Stamps** ([Uploading Data](/docs/develop/access-the-swarm/buy-a-stamp-batch))
- **Stake Management Transactions** ([Staking](/docs/bee/working-with-bee/staking/))
- **Storage Incentives Transactions** ([Redistribution Game](/docs/concepts/incentives/redistribution-game/) )
- **Chequebook Deployment** ([Bandwidth Payments](/docs/concepts/incentives/bandwidth-incentives/))

### xBZZ is Required For:
- **Buying Postage Stamps** (scales with data size and duration)
- **Staking** (Minimum **10 xBZZ**, **20 xBZZ** for reserve doubling)
- **Bandwidth Payments** (~**0.5 xBZZ per GB downloaded**)

## Token Amounts by Use Case

| **Use Case** | **Node Type** | **xDAI Required** | **xBZZ Required** |
|-------------|--------------|------------------|------------------|
| Free tier downloads | Ultra-Light, Light, Full | None | None |
| Downloading beyond free tier | Light, Full | None |Scales with volume—start with ~0.1 xBZZ, increase as needed  |
| Uploading | Light, Full | None | Scales with volume—start with ~0.1 xBZZ, increase as needed |
| Purchasing Postage Stamp Batches| Light, Full | < 0.01 xDAI / tx  | Scales with volume & duration. Can start with ~0.2 xBZZ for small uploads. |
| Staking | Full | < 0.01 xDAI / tx | 10 xBZZ (minimum) |
| Storage Incentives Transactions | Full | < 0.01 xDAI / tx - needs topups over time since these are reoccurring transactions | None |
| Bandwidth Payments | Light, Full | None | Scales with bandwidth (~0.5 xBZZ/GB downloaded) |
| Chequebook Deployment | Light, Full | < 0.001 xDAI  | None |


## Getting Tokens

### How to Get xDAI
- **Free xDAI Faucets**: You may try one of the [Gnosis Chain faucets](https://docs.gnosischain.com/tools/Faucets) listed in the official Gnosis Chain documentation, however the amount offered may not meet your needs.
- **Purchasing xDAI**: You can also purchase xDAI from [various exchanges](https://docs.gnosischain.com/about/tokens/xdai) listed in the Gnosis Chain documentation. xDAI is also widely available on most major cryptocurrency exchanges. 
:::warning
Make sure that you are withdrawing the Gnosis Chain version of xDAI, as xDAI has been bridged to several other chains as well.
:::
- **Bridging From Ethereum**: If you already have xDAI on Ethereum, you can also consider using the [Gnosis Chain bridge](https://bridge.gnosischain.com/) to transfer it over to Gnosis Chain.



### How to Get xBZZ
- **Buying xBZZ**: xBZZ can be purchased from a variety of [centralized and decentralized exchanges](https://www.ethswarm.org/get-bzz#how-to-get-bzz) listed on the official Ethswarm.org website.


### Getting Testnet Tokens (Sepolia ETH & sBZZ)
- **Sepolia ETH**: Try [these faucets](https://faucetlink.to/sepolia).
- **sBZZ**: Buy on [Uniswap](https://app.uniswap.org/swap?outputCurrency=0x543dDb01Ba47acB11de34891cD86B675F04840db&inputCurrency=ETH) (ensure **Sepolia testnet** is selected in MetaMask and **Testnet mode** is enabled in the Uniswap web app settings).


## Node Wallet & Chequebook
- **Wallet Creation**: A Gnosis Chain wallet is auto-created when you install Bee.
- **Chequebook Deployment**: A chequebook contract will be automatically deployed when a Bee node is configured to run as a light or full node and has been funded with sufficient xDAI to pay for the chequebook deployment transaction. Required for bandwidth payments.
- **Wallet Access**: Located in `keys/` in Bee's `data-dir` (importable to MetaMask). Also requires a password which is specified through your node's configuration (either passed directly with the `password` option or as a password file specified with the `password-file` option).

## Funding Your Wallet

In order to fund your wallet, first you need to identify your wallet address. The easiest way to do so is to first start your Bee node in ultra-light mode (Bee will start in ultra-light mode when started with the default settings) and then use `swarm-cli` to find your address:

```bash
swarm-cli addresses
```

The value for the `Ethereum` entry is your node's Ethereum address on Gnosis Chain:

```bash
Node Addresses
---------------------------------------------------------------------------------------------------------------------
Ethereum: 9a73f283cd9211b96b5ec63f7a81a0ddc847cd93
Overlay: 1e2054bec3e681aeb0b365a1f9a574a03782176bd3ec0bcf810ebcaf551e4070
PSS Public Key: 035ade58d20be7e04ee8f875eabeebf9c53375a8fc73917683155c7c0b572f47ef
Public Key: 027d0c4759f689ea3dd3eb79222870671c492cb99f3fade275bcbf0ea39cd0ef6e
Underlay: /ip4/127.0.0.1/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j /ip4/172.17.0.2/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j /ip6/::1/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j

Chequebook Address
---------------------------------------------------------------------------------------------------------------------
0x9953f4F6aA3A4A52eC021Dd8E3b2924b298b3cb5
```

Fund your node with the appropriate amount of xDAI and xBZZ based on the recommended amounts specified in [the chart above](/docs/bee/installation/fund-your-node#token-amounts-by-use-case). 

*For support, ask in the [Develop on Swarm](https://discord.com/channels/799027393297514537/811574542069137449) Discord channel.*

