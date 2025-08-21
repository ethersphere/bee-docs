---
title: Quickstart
id: quick-start
---

This guide will help you install and run a Bee [light node](/docs/bee/working-with-bee/node-types) using the [shell script](/docs/bee/installation/shell-script-install) install method. After explaining how to install and start the node, the guide then explains how to use the [`swarm-cli` command line tool](/docs/bee/working-with-bee/swarm-cli) to find your node's address, fund your node, and buy a batch of postage stamps. Finally it explains how to upload data using a postage stamp batch and how to download that data.

:::tip
A "light" node can download and upload data from Swarm but does not share its disk space with the network and does not earn rewards. [Learn more](/docs/bee/working-with-bee/node-types). 
:::


## Requirements  

- **Linux or macOS** (The shell script installation method does **not** support Windows natively. Windows users can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).)  
- [Node.js (v18 or higher)](https://nodejs.org/)
- [npm (Node Package Manager)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
- [`curl`](https://curl.se/) or [`wget`](https://www.gnu.org/software/wget/) (Check with `curl --version` or `wget --version`)
- [~0.20 xBZZ on Gnosis Chain](/docs/bee/installation/fund-your-node)
- [~0.01 xDAI on Gnosis Chain](/docs/bee/installation/fund-your-node)

:::info
Although `BZZ` is the official symbol of the token on both Ethereum and Gnosis Chain, the term `xBZZ` is widely used by the Swarm community and in documentation to indicate that it is BZZ on Gnosis Chain (not Ethereum).
:::

## Install Bee

Run the shell script using `curl` or `wget`:


:::tip
We specify `TAG=v2.6.0` to indicate which Bee version to install. You can find available versions in the ["releases" section](https://github.com/ethersphere/bee/releases) of the Bee GitHub repo.
:::

```bash
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.6.0 bash
```

OR

```bash
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.6.0 bash
```

Verify installation:

```bash
bee version
```



## Install Swarm-CLI

Requires **Node.js 18+**. Install using **npm**:

```bash
npm install --global @ethersphere/swarm-cli
```

Verify installation:

```bash
swarm-cli --version
```


## Start Your Bee Node

Start Bee with a secure password:

```bash
bee start \
  --password YOUR_SECURE_PASSWORD \
  --verbosity 5 \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```

Example output:

```bash
Welcome to Swarm.... Bzzz Bzzzz Bzzzz


"Share the knowledge" - in memory of ldeffenb


                \     /
            \    o ^ o    /
              \ (     ) /
   ____________(%%%%%%%)____________
  (     /   /  )%%%%%%%(  \   \     )
  (___/___/__/           \__\___\___)
     (     /  /(%%%%%%%)\  \     )
      (__/___/ (%%%%%%%) \___\__)
              /(       )\
            /   (%%%%%)   \
                 (%%%)
                   !

DISCLAIMER:
This software is provided to you "as is", use at your own risk and without warranties of any kind.
It is your responsibility to read and understand how Swarm works and the implications of running this software.
The usage of Bee involves various risks, including, but not limited to:
damage to hardware or loss of funds associated with the Ethereum account connected to your node.
No developers or entity involved will be liable for any claims and damages associated with your use,
inability to use, or your interaction with other nodes or the software.

version: 2.6.0-390a402e - planned to be supported until 22 April 2025, please follow https://ethswarm.org/

"time"="2025-03-04 11:13:10.113050" "level"="info" "logger"="node" "msg"="bee version" "version"="2.6.0-390a402e"
"time"="2025-03-04 11:13:10.164801" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="02b19880b8d024eac3bf8afa3fa85b31b72fcfd491cebc6af78ddd85ff97f65416"
"time"="2025-03-04 11:13:10.216657" "level"="debug" "logger"="node" "msg"="using existing libp2p key"
"time"="2025-03-04 11:13:10.268431" "level"="debug" "logger"="node" "msg"="using existing pss key"
"time"="2025-03-04 11:13:10.268474" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="03a3166e04b749ab3d04fda8a41180598ff2eed01a8096fb72d2c7da393a47c46a"
"time"="2025-03-04 11:13:10.268479" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x003842B26B3dB292Cf84d5969E71c0d1e93F5578"
"time"="2025-03-04 11:13:10.288418" "level"="info" "logger"="node" "msg"="using overlay address" "address"="fe38346dd89e4211c0e60195ee73e38d2c2ee2fe2b914b771d4ad503cfedbd3c"
"time"="2025-03-04 11:13:10.288474" "level"="info" "logger"="node" "msg"="starting with an enabled chain backend"
"time"="2025-03-04 11:13:10.987200" "level"="info" "logger"="node" "msg"="connected to blockchain backend" "version"="Nethermind/v1.30.3+87c86379/linux-x64/dotnet9.0.0"
"time"="2025-03-04 11:13:11.196067" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2025-03-04 11:13:11.211976" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="127.0.0.1:1633"
"time"="2025-03-04 11:13:11.623998" "level"="info" "logger"="node" "msg"="using default factory address" "chain_id"=100 "factory_address"="0xC2d5A532cf69AA9A1378737D8ccDEF884B6E7420"
"time"="2025-03-04 11:13:11.675186" "level"="info" "logger"="node/chequebook" "msg"="no chequebook found, deploying new one."
"time"="2025-03-04 11:13:11.723451" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.000250000002" "address"="0x003842B26B3dB292Cf84d5969E71c0d1e93F5578"
```

🎉 Congratulations! You've just successfully installed and started your first Bee node 🐝!


## Get Your Node’s Address

The final line of the logs in the previous step lets us know that we need to fund our node to continue, and shows our node's Gnosis chain address. Copy the address and save it for the next step:

```bash
"time"="2025-03-04 11:13:11.723451" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.000250000002" "address"="0x003842B26B3dB292Cf84d5969E71c0d1e93F5578"
```

You can also view your node's addresses any time using the `swarm-cli addresses` command:

```bash
swarm-cli addresses
```

Example output:

```bash
Node Addresses
-----------------------------------------------------------------------------------------------------------------------------------
Ethereum: 0x003842b26b3db292cf84d5969e71c0d1e93f5578
Overlay: fe38346dd89e4211c0e60195ee73e38d2c2ee2fe2b914b771d4ad503cfedbd3c
PSS Public Key: 03a3166e04b749ab3d04fda8a41180598ff2eed01a8096fb72d2c7da393a47c46a
Public Key: 02b19880b8d024eac3bf8afa3fa85b31b72fcfd491cebc6af78ddd85ff97f65416
Underlay: /ip4/127.0.0.1/tcp/1634/p2p/QmPbXzjN9mzYnpxsMn6ftFvvUuf4VArcmR6oGtpf1mRgWt /ip4/172.25.128.69/tcp/1634/p2p/QmPbXzjN9mzYnpxsMn6ftFvvUuf4VArcmR6oGtpf1mRgWt /ip6/::1/tcp/1634/p2p/QmPbXzjN9mzYnpxsMn6ftFvvUuf4VArcmR6oGtpf1mRgWt
```

## Fund Your Node

Send **xDAI** (to pay for transaction fees on Gnosis Chain) and **xBZZ** (for uploads and staking) to your node’s Ethereum address on **Gnosis Chain**.

- **xDAI:** 0.01 xDAI is enough to start a light node
- **xBZZ:** 0.20 xBZZ is enough to upload a small amount of data

Learn how to [get xDAI and xBZZ](/docs/bee/installation/fund-your-node#getting-tokens) if you need some.

:::tip
If you wait too long to fund your node it may shut itself down. In that case, simply use the same startup command to start the node again.
:::

## Wait to Sync (~30 Minutes)

After starting and funding a Bee light node for the first time, the node will automatically issue a [transaction](https://gnosisscan.io/tx/0xf8048c4e8020ccef842c9a901e6262e9c06d6f5926ff31bdb7dd9d7274dcf19c) on Gnosis Chain to deploy the node's [chequebook contract](/docs/concepts/incentives/bandwidth-incentives#chequebook-contract).

The node then needs to sync blockchain data before it can buy a postage stamp batch. The process may take ***half an hour or longer*** depending on your RPC provider and network speed.

You can check your node's syncing progress with the `swarm-cli status` command:

```bash
swarm-cli status
```

```bash
Bee
API: http://localhost:1633 [OK]
Version: 2.6.0-390a402e
Mode: light

Topology
Connected Peers: 143
Population: 6991
Depth: 11

Wallet
xBZZ: 0.0000000000000000
xDAI: 0.009829728398864856

Chainsync
Block: 33,515,656 / 38,855,407 (Δ 5,339,751)

Chequebook
Available xBZZ: 0.0000000000000000
Total xBZZ: 0.0000000000000000

Staking
Staked xBZZ: 0.0000000000000000
```

The `Chainsync` section tells us how many blocks our node has synced so far out of the total Gnosis Chain blocks (and the number after the Δ symbol shows how many blocks still need to be synced):

```bash
Chainsync
Block: 33,515,656 / 38,855,407 (Δ 5,339,751)
```
