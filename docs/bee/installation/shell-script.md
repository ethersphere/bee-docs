---
title: Shell Script Install
id: shell-script-install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Swarm Shell Script Installation Guide

The official [shell script](https://github.com/ethersphere/bee/blob/master/install.sh) provided by Swarm automatically detects your system and installs the correct version of Bee. This installation method is an excellent choice if you're looking for a minimalistic and flexible option for your Bee node installation.

:::warning
Note that we append 127.0.0.1 (localhost) to our Bee API's port (1633 by default), since we do not want to expose our Bee API endpoint to the public internet, as that would allow anyone to control our node. Make sure you do the same. Additionally, it's recommended to use a firewall to restrict access to your node(s).
:::

:::info
This guide uses command line flag options in the node startup commands such as `--blockchain-rpc-endpoint`, however, there are [several other methods available for configuring options](/docs/bee/working-with-bee/configuration). 
:::

## Install and Start Your Node 
Below is a step-by-step guide for installing and setting up your Bee node using the shell script installation method.

### Run Shell Script 


Run the install shell script using either `curl` or `wget`:

:::caution
In the example below, the version is specified using `TAG=v2.4.0`. Check the [latest Bee releases](https://github.com/ethersphere/bee/tags) and if needed, update the command to install the most recent version (note that in tags containing "rc," the abbreviation stands for "release candidate", and these versions should be used for testing purposes only). 
:::

:::info
Note that while this shell script supports many commonly used Unix-like systems, it is not quite a universal installer tool. The architectures it supports include:

**1. Linux:**  
- `linux-386` (32-bit x86)  
- `linux-amd64` (64-bit x86)  
- `linux-arm64` (64-bit ARM)  
- `linux-armv6` (32-bit ARM v6)  

**2. macOS (Darwin):**  
- `darwin-arm64` (Apple Silicon, M1/M2/M3)  
- `darwin-amd64` (Intel-based Mac)  

This means the script works on most modern Linux distributions and macOS versions that match these architectures. Windows users can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
:::

:::caution
You may need to install [`curl`](https://curl.se/) or [`wget`](https://www.gnu.org/software/wget/) if your system doesn't have one of them pre-installed and the shell script command fails to run.
:::

<Tabs
defaultValue="curl"
values={[
{label: 'Curl', value: 'curl'},
{label: 'Wget', value: 'wget'},
]}>

<TabItem value="curl">

```bash
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.4.0 bash
```
</TabItem>
<TabItem value="wget">

**wget**

```bash
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.4.0 bash
```
</TabItem>

</Tabs>
 
Let's check that the script ran properly:

```bash=
bee 
```

If the script ran without any problems you should see this:

```bash=
Ethereum Swarm Bee

Usage:
  bee [command]

Available Commands:
  start       Start a Swarm node
  dev         Start a Swarm node in development mode
  init        Initialise a Swarm node
  deploy      Deploy and fund the chequebook contract
  version     Print version number
  db          Perform basic DB related operations
  split       Split a file into chunks
  printconfig Print default or provided configuration in yaml format
  help        Help about any command
  completion  Generate the autocompletion script for the specified shell

Flags:
      --config string   config file (default is $HOME/.bee.yaml)
  -h, --help            help for bee

Use "bee [command] --help" for more information about a command.
```


### Node Startup Commands
 
Let's try starting up our node for the first time with the command below. Make sure to pick a [strong password](https://xkcd.com/936/) of your own:

Below are startup commands configured for each of the three Bee node types, ***full***, ***light***, and ***ultra-light***. Refer to the [Node Types](/docs/bee/working-with-bee/node-types) page to learn more about each node type and decide which one best suits your needs.

<Tabs
defaultValue="full"
values={[
{label: 'Full', value: 'full'},
{label: 'Light', value: 'light'},
{label: 'Ultra Light', value: 'ultra-light'},
]}>

<TabItem value="full">
For the full node, we have `--full-node` and `--swap-enable` both enabled, and we've used `--blockchain-rpc-endpoint` to set our RPC endpoint as `https://xdai.fairdatasociety.org`. Your RPC endpoint may differ depending on your setup.

```bash
bee start \
  --password flummoxedgranitecarrot \
  --full-node \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```
</TabItem>
<TabItem value="light">
For the light node, we omit `--full-node`, keeping the rest the same as the full node setup.

```bash
bee start \
  --password flummoxedgranitecarrot \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```
</TabItem>
<TabItem value="ultra-light">
 For the ultra-light node, we omit all three of the relevant settings to disable them (since they default to `false`), `--full-node`, `--swap-enable`, and `--blockchain-rpc-endpoint`.

```bash
bee start \
  --password flummoxedgranitecarrot \
  --api-addr 127.0.0.1:1633 
```
</TabItem>

</Tabs>


:::info

Command explained:

1. **`bee start`**: This is the command to start the Bee node.

2. **`--password flummoxedgranitecarrot`**: The password to decrypt the private key associated with the node. Replace "flummoxedgranitecarrot" with your actual password.

3. **`--full-node`**: This option enables the node to run in full mode, sharing its disk with the network, and becoming eligible for staking.

4. **`--swap-enable`**: This flag enables SWAP, which is the bandwidth incentives scheme for Swarm. It will initiate a transaction to set up the SWAP chequebook on Gnosis Chain (required for light and full nodes).

5. **`--api-addr 127.0.0.1:1633`**: Specifies that the Bee API will be accessible locally only via `127.0.0.1` on port `1633` and not accessible to the public. 

6. **`--blockchain-rpc-endpoint https://xdai.fairdatasociety.org`**: Sets the RPC endpoint for interacting with the Gnosis blockchain (required for light and full nodes).
:::

### Example Startup Output

<Tabs
defaultValue="full"
values={[
{label: 'Full', value: 'full'},
{label: 'Light', value: 'light'},
{label: 'Ultra Light', value: 'ultra-light'},
]}>

<TabItem value="full">
The node has successfully started, but it still needs funding with xDAI (for Gnosis Chain transactions) and xBZZ (for uploads, downloads, and staking). 

```bash
Welcome to Swarm.... Bzzz Bzzzz Bzzzz
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

version: 2.2.0-06a0aca7 - planned to be supported until 11 December 2024, please follow https://ethswarm.org/

"time"="2024-09-24 18:15:34.383102" "level"="info" "logger"="node" "msg"="bee version" "version"="2.2.0-06a0aca7"
"time"="2024-09-24 18:15:34.428546" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="0373fe2ab33ab836635fc35864cf708fa0f4a775c0cf76ca851551e7787b58d040"
"time"="2024-09-24 18:15:34.520686" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="03a341032724f1f9bb04f1d9b22607db485cccd74174331c701f3a6957d94d95c1"
"time"="2024-09-24 18:15:34.520716" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
"time"="2024-09-24 18:15:34.533789" "level"="info" "logger"="node" "msg"="fetching target neighborhood from suggester" "url"="https://api.swarmscan.io/v1/network/neighborhoods/suggestion"
"time"="2024-09-24 18:15:36.773501" "level"="info" "logger"="node" "msg"="mining a new overlay address to target the selected neighborhood" "target"="00100010110"
"time"="2024-09-24 18:15:36.776550" "level"="info" "logger"="node" "msg"="using overlay address" "address"="22d502d022de0f8e9d477bc61144d0d842d9d82b8241568c6fe4e41f0b466615"
"time"="2024-09-24 18:15:36.776576" "level"="info" "logger"="node" "msg"="starting with an enabled chain backend"
"time"="2024-09-24 18:15:37.388997" "level"="info" "logger"="node" "msg"="connected to blockchain backend" "version"="erigon/2.60.7/linux-amd64/go1.21.5"
"time"="2024-09-24 18:15:37.577840" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2024-09-24 18:15:37.593747" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="127.0.0.1:1633"
"time"="2024-09-24 18:15:37.969782" "level"="info" "logger"="node" "msg"="using default factory address" "chain_id"=100 "factory_address"="0xC2d5A532cf69AA9A1378737D8ccDEF884B6E7420"
"time"="2024-09-24 18:15:38.160249" "level"="info" "logger"="node/chequebook" "msg"="no chequebook found, deploying new one."
"time"="2024-09-24 18:15:38.728534" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0003750000017" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
```

  
</TabItem>
<TabItem value="light">

Here you can see that the node has started up successfully, but our node still needs to be funded with xDAI and xBZZ (xDAI for Gnosis Chain transactions and xBZZ for uploads/downloads). Continue to the next section for funding instructions.   

```bash
Welcome to Swarm.... Bzzz Bzzzz Bzzzz
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

version: 2.2.0-06a0aca7 - planned to be supported until 11 December 2024, please follow https://ethswarm.org/

"time"="2025-01-24 12:57:21.274657" "level"="info" "logger"="node" "msg"="bee version" "version"="2.2.0-06a0aca7"
"time"="2025-01-24 12:57:21.274854" "level"="warning" "logger"="node" "msg"="your node is outdated, please check for the latest version"
"time"="2025-01-24 12:57:21.449064" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="03c356839a5570c758e812d0c248b135f0dc8ffa2b8404a97597e456f4fe5f7ee8"
"time"="2025-01-24 12:57:21.805033" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="036c63b7c544ad401a5dbfb463f71cda265eec74c1d0d9cbc9db2abd6b3e4f11e9"
"time"="2025-01-24 12:57:21.805124" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x5c39545873Bd663b0bB0716ED87dE0E399Aae419"
"time"="2025-01-24 12:57:21.815765" "level"="info" "logger"="node" "msg"="using overlay address" "address"="74539eab1dbd5c722bb8ba10cef55f715e38f298b706fb1866af49f4fd15d8d3"
"time"="2025-01-24 12:57:21.815855" "level"="info" "logger"="node" "msg"="starting with an enabled chain backend"
"time"="2025-01-24 12:57:21.861341" "level"="info" "logger"="node" "msg"="connected to blockchain backend" "version"="Nethermind/v1.30.1+2b75a75a/linux-x64/dotnet9.0.0"
"time"="2025-01-24 12:57:21.869117" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2025-01-24 12:57:21.880930" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="127.0.0.1:1633"
"time"="2025-01-24 12:57:21.897675" "level"="info" "logger"="node" "msg"="using default factory address" "chain_id"=100 "factory_address"="0xC2d5A532cf69AA9A1378737D8ccDEF884B6E7420"
"time"="2025-01-24 12:57:21.911463" "level"="info" "logger"="node/chequebook" "msg"="no chequebook found, deploying new one."
"time"="2025-01-24 12:57:21.938038" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.000250000002" "address"="0x5c39545873Bd663b0bB0716ED87dE0E399Aae419"
```

</TabItem>
<TabItem value="ultra-light">
 If you've started in ultra-light mode, you should see output which looks something like this, and you're done! Your node is now successfully running in ultra-light mode. You can now skip down to the final section on this page about logs and monitoring.

```bash
 root@noah-bee:~# bee start \
  --password flummoxedgranitecarrot \
  --api-addr 127.0.0.1:1633

Welcome to Swarm.... Bzzz Bzzzz Bzzzz
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

version: 2.2.0-06a0aca7 - planned to be supported until 11 December 2024, please follow https://ethswarm.org/

"time"="2025-01-24 12:51:06.981505" "level"="info" "logger"="node" "msg"="bee version" "version"="2.2.0-06a0aca7"
"time"="2025-01-24 12:51:06.981658" "level"="warning" "logger"="node" "msg"="your node is outdated, please check for the latest version"
"time"="2025-01-24 12:51:07.131555" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="03c356839a5570c758e812d0c248b135f0dc8ffa2b8404a97597e456f4fe5f7ee8"
"time"="2025-01-24 12:51:07.402847" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="036c63b7c544ad401a5dbfb463f71cda265eec74c1d0d9cbc9db2abd6b3e4f11e9"
"time"="2025-01-24 12:51:07.402915" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x5c39545873Bd663b0bB0716ED87dE0E399Aae419"
"time"="2025-01-24 12:51:07.416074" "level"="info" "logger"="node" "msg"="using overlay address" "address"="74539eab1dbd5c722bb8ba10cef55f715e38f298b706fb1866af49f4fd15d8d3"
"time"="2025-01-24 12:51:07.416149" "level"="info" "logger"="node" "msg"="starting with a disabled chain backend"
"time"="2025-01-24 12:51:07.416242" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2025-01-24 12:51:07.428047" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="127.0.0.1:1633"
"time"="2025-01-24 12:51:07.464425" "level"="info" "logger"="node" "msg"="using datadir" "path"="/root/.bee"
"time"="2025-01-24 12:51:07.486853" "level"="info" "logger"="migration-RefCountSizeInc" "msg"="starting migration of replacing chunkstore items to increase refCnt capacity"
"time"="2025-01-24 12:51:07.486921" "level"="info" "logger"="migration-RefCountSizeInc" "msg"="migration complete"
"time"="2025-01-24 12:51:07.489133" "level"="info" "logger"="node" "msg"="starting reserve repair tool, do not interrupt or kill the process..."
"time"="2025-01-24 12:51:07.489346" "level"="info" "logger"="node" "msg"="removed all bin index entries"
"time"="2025-01-24 12:51:07.489430" "level"="info" "logger"="node" "msg"="removed all chunk bin items" "total_entries"=0
"time"="2025-01-24 12:51:07.489482" "level"="info" "logger"="node" "msg"="counted all batch radius entries" "total_entries"=0
"time"="2025-01-24 12:51:07.489520" "level"="info" "logger"="node" "msg"="parallel workers" "count"=2
"time"="2025-01-24 12:51:07.489612" "level"="info" "logger"="node" "msg"="migrated all chunk entries" "new_size"=0 "missing_chunks"=0 "invalid_sharky_chunks"=0
"time"="2025-01-24 12:51:07.489659" "level"="info" "logger"="migration-step-04" "msg"="starting sharky recovery"
"time"="2025-01-24 12:51:07.514853" "level"="info" "logger"="migration-step-04" "msg"="finished sharky recovery"
"time"="2025-01-24 12:51:07.515253" "level"="info" "logger"="migration-step-05" "msg"="start removing upload items"
"time"="2025-01-24 12:51:07.515374" "level"="info" "logger"="migration-step-05" "msg"="finished removing upload items"
"time"="2025-01-24 12:51:07.515434" "level"="info" "logger"="migration-step-06" "msg"="start adding stampHash to BatchRadiusItems, ChunkBinItems and StampIndexItems"
"time"="2025-01-24 12:51:07.515571" "level"="info" "logger"="migration-step-06" "msg"="finished migrating items" "seen"=0 "migrated"=0
"time"="2025-01-24 12:51:07.517270" "level"="info" "logger"="node" "msg"="starting in ultra-light mode"
```
</TabItem>

</Tabs>


## Fund and Stake 

Running a full node for the purpose of earning xBZZ by sharing disk space and participating in the redistribution game requires a minimum of 10 xBZZ and a small amount of xDAI (for initializing the chequebook contract and for paying for redistribution-related transactions). 

While running a light node requires a small amount of xDAI to pay for initializing the chequebook contract and a smaller amount of xBZZ to pay for uploads and downloads.

### Fund node 

You will need to transfer xDAI (to pay for transaction fees) and xBZZ (to pay for storage and bandwidth fees and for staking) to your node's address on Gnosis Chain. If you do not already have them, then you will need to [acquire](/docs/bee/installation/fund-your-node#getting-tokens) some xDAI and xBZZ. 

:::caution
When interacting with `swarm-cli` and other Bee tools, you will see your node's address referred to as its `Ethereum` address - ***take note that this does not refer to the Ethereum blockchain***, it refers to an Ethereum format address on Gnosis Chain.  
:::

Check the logs from the previous step. Look for the line which says: 

```
"time"="2024-09-24 18:15:34.520716" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x9a73f283cd9211b96b5ec63f7a81a0ddc847cd93"
```
That address is your node's address on Gnosis Chain which needs to be funded with xDAI (and also xBZZ if you plan on doing any uploading or on staking). Copy it and save it for the next step.

You can also use `swarm-cli` to view your node's addresses:

```bash
swarm-cli addresses
```

Which will return your node's address in the `Ethereum` field: 

```bash
Node Addresses
----------------------------------------------------------------------------------------------------------------------------
Ethereum: 9a73f283cd9211b96b5ec63f7a81a0ddc847cd93
Overlay: 1e2054bec3e681aeb0b365a1f9a574a03782176bd3ec0bcf810ebcaf551e4070
PSS Public Key: 035ade58d20be7e04ee8f875eabeebf9c53375a8fc73917683155c7c0b572f47ef
Public Key: 027d0c4759f689ea3dd3eb79222870671c492cb99f3fade275bcbf0ea39cd0ef6e
Underlay: /ip4/127.0.0.1/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j /ip4/172.17.0.2/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j /ip6/::1/tcp/1634/p2p/QmcpSJPHuuQYRgDkNfwziihVcpuVteoNxePvfzaJyp9z7j

Chequebook Address
----------------------------------------------------------------------------------------------------------------------------
0x9953f4F6aA3A4A52eC021Dd8E3b2924b298b3cb5
```

***How Much to Send?***

Only a very small amount of xDAI is needed to get started, 0.1 xDAI is more than enough.
 
For very small short term uploads you can start with ~0.2 xBZZ, but the required amount will scale up with the volume and duration of storage required.

You will also need and additional 10 xBZZ as a non-refundable deposit if you plan on staking.


### Initialize full node

After sending the required tokens of ~0.1 xDAI and 10 xBZZ (or a smaller amount of xBZZ if you don't plan on staking) to your node's Gnosis Chain address, close the bee process in your terminal (`Ctrl + C`). Then start it again with the same command:

```bash
bee start \
  --password flummoxedgranitecarrot \
  --full-node \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```
After funding and restarting your node, the logs printed to the terminal should look something like this:

```bash
Welcome to Swarm.... Bzzz Bzzzz Bzzzz
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

version: 2.2.0-06a0aca7 - planned to be supported until 11 December 2024, please follow https://ethswarm.org/

"time"="2024-09-24 18:57:16.710417" "level"="info" "logger"="node" "msg"="bee version" "version"="2.2.0-06a0aca7"
"time"="2024-09-24 18:57:16.760154" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="0373fe2ab33ab836635fc35864cf708fa0f4a775c0cf76ca851551e7787b58d040"
"time"="2024-09-24 18:57:16.854594" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="03a341032724f1f9bb04f1d9b22607db485cccd74174331c701f3a6957d94d95c1"
"time"="2024-09-24 18:57:16.854651" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
"time"="2024-09-24 18:57:16.866697" "level"="info" "logger"="node" "msg"="using overlay address" "address"="22d502d022de0f8e9d477bc61144d0d842d9d82b8241568c6fe4e41f0b466615"
"time"="2024-09-24 18:57:16.866730" "level"="info" "logger"="node" "msg"="starting with an enabled chain backend"
"time"="2024-09-24 18:57:17.485408" "level"="info" "logger"="node" "msg"="connected to blockchain backend" "version"="erigon/2.60.1/linux-amd64/go1.21.5"
"time"="2024-09-24 18:57:17.672282" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2024-09-24 18:57:17.686479" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="127.0.0.1:1633"
"time"="2024-09-24 18:57:18.065029" "level"="info" "logger"="node" "msg"="using default factory address" "chain_id"=100 "factory_address"="0xC2d5A532cf69AA9A1378737D8ccDEF884B6E7420"
"time"="2024-09-24 18:57:18.252410" "level"="info" "logger"="node/chequebook" "msg"="no chequebook found, deploying new one."
"time"="2024-09-24 18:57:19.576100" "level"="info" "logger"="node/chequebook" "msg"="deploying new chequebook" "tx"="0xf7bc9c5b04e96954c7f70cecfe717cad9cdc5d64b6ec080b2cbe712166ce262a"
"time"="2024-09-24 18:57:27.619377" "level"="info" "logger"="node/transaction" "msg"="pending transaction confirmed" "sender_address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66" "tx"="0xf7bc9c5b04e96954c7f70cecfe717cad9cdc5d64b6ec080b2cbe712166ce262a"
"time"="2024-09-24 18:57:27.619437" "level"="info" "logger"="node/chequebook" "msg"="chequebook deployed" "chequebook_address"="0x261a07a63dC1e7200d51106155C8929b432181fb"
```

Here we can see that after our node has been funded, it was able to issue the transactions for deploying the chequebook contract, which is a prerequisite for running a staking node.

Next your node will begin to sync [postage stamp data](/docs/develop/access-the-swarm/buy-a-stamp-batch), which can take ~5 to 10 minutes. You will see this log message while your node is syncing postage stamp data:

```bash
"time"="2024-09-24 22:21:19.664897" "level"="info" "logger"="node" "msg"="waiting to sync postage contract data, this may take a while... more info available in Debug loglevel"
```

You can also use `swarm-cli` to check on your node's progress:

```bash
swarm-cli status
```

Various key metrics will be logged to the terminal. To check on your node's postage stamp contract syncing progress, refer to the `Chainsync` section:

```bash
# ... 

Chainsync
Block: 40,059,785 / 40,059,794 (Δ 9)

# ...
```

This will show how many blocks are left to be synced until your node is caught up to the latest Gnosis Chain block. It just needs to get close to the latest block to be considered fully synced as there are new blocks every ~5 seconds (~Δ 10 or less blocks is typical when fully synced). 

After your node finishes syncing postage stamp data it will start in full node mode and begin to sync all the chunks of data it is responsible for storing as a full node. 

Here we can see the confirmation in the logs that our node has started in `full` mode:


```bash
"time"="2024-09-24 22:30:19.154067" "level"="info" "logger"="node" "msg"="starting in full mode"
```

This syncing process can take a while, possibly up to several hours depending on your system and network. You can check your node's progress with `swarm-cli`:

```bash
swarm-cli status
```

In the `Bee` section, we should make sure that our node's `Mode` is `full`, and that our `Version` number matches the [latest Bee release](https://github.com/ethersphere/bee/releases/latest).

In the `Topology` section we should check that our node is successfully connecting to peers:

And then finally we will check the `Redistribution` section periodically until the `Fully synced` value changes to `true`. At that point your node is fully synced!


```bash
Bee
API: http://localhost:1633 [OK]
Version: 2.5.0-5ec231ba
Mode: full

Topology
Connected Peers: 105
Population: 4523

# ...

Redistribution
Fully synced: false

# ...
```

  

### Stake node

Now we're ready to stake. We'll slightly modify our startup command so that it runs in the background instead of taking control of our terminal. Since it is running in the background we will no longer see the logs printed to the terminal, and we will therefore redirect the logs to a `bee.log` file so we can view them when needed:

```bash
nohup bee start \
  --password flummoxedgranitecarrot \
  --full-node \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org > bee.log 2>&1 &
```

:::info
1. **`nohup`**: `nohup` prevents the `bee start` process from stopping when the terminal closes.

2. **`> bee.log 2>&1`**: Redirects both standard output and standard error to a log file called `bee.log`. 

3. **`&`**: This sends the process to the background, allowing the terminal to be used for other commands while the Bee node continues running.
:::

Let's use `swarm-cli` again to confirm the node is running:

```bash
swarm-cli status
```

If the node is running we should see:

```bash
Bee
API: http://localhost:1633 [OK]
Version: 2.5.0-5ec231ba
Mode: full
# ...
```

Now with our node properly running in the background, we're ready to stake our node. You can use the following command to stake 10 xBZZ:

:::tip
The value for `--deposit` is denominated in [PLUR](/docs/references/glossary/#plur) (1e-16 xBZZ = 1 PLUR)
:::

```bash
swarm-cli stake --deposit 100000000000000000
```

The transaction will complete after a moment. We can use `swarm-cli` to confirm:

```bash
swarm-cli stake
```

You should then see the 10 xBZZ which was just staked:

```bash
Staked xBZZ: 10.0000000000000000
```
 
Congratulations! You have now installed your Bee node and are connected to the network as a full staking node. Your node will now be in the process of syncing chunks from the network. Once the node is fully synced, your node will finally be eligible to earn staking rewards.

### Set Target Neighborhood

When installing your Bee node it will automatically be assigned a neighborhood. However, when running a full node with staking there are benefits to periodically updating your node's neighborhood. Learn more about why and how to set your node's target neighborhood [here](/docs/bee/installation/set-target-neighborhood).


### Logs and monitoring

:::info
You can learn more about Bee logs [here](/docs/bee/working-with-bee/logs-and-files).
:::

With our previously modified command, our Bee node will now be running in the background and the logs will be written to the `bee.log` file. To review our node's logs we can simply view the file contents:

```bash
cat bee.log
```

The file will continue to update with all the latest logs as they are output:

```bash
"time"="2024-09-27 18:05:34.096641" "level"="info" "logger"="node/kademlia" "msg"="connected to peer" "peer_address"="03b48e678938d63c0761c74a805fbe0446684c9c417330c2bec600ecfd6c492f" "proximity_order"=8
"time"="2024-09-27 18:05:35.168425" "level"="info" "logger"="node/kademlia" "msg"="connected to peer" "peer_address"="0e9388fff473a9c74535337c32cc74d8f921514d2635d0c4a49c6e8022f5594e" "proximity_order"=4
"time"="2024-09-27 18:05:35.532723" "level"="info" "logger"="node/kademlia" "msg"="disconnected peer" "peer_address"="3c195cd8882ee537d170e92d959ad6bd72a76a50097a671c72646e83b45a1832"
```

There are many different ways to monitor your Bee node's process, but one convenient way to do so is the [bashtop command line tool](https://github.com/aristocratos/bashtop). The method of [installation](https://github.com/aristocratos/bashtop?tab=readme-ov-file#installation) will vary depending on your system.

After installation, we can launch it with the `bashtop` command:

```bash
bashtop
```

![](/img/bashtop_01.png)

We can use the `f` key to filter for our Bee node's specific process by searching for the `bee` keyword (use the arrow keys to navigate and `enter` to select). From here we can view info about our node's process, or shut it down using the `t` key (for "terminate").

![](/img/bashtop_02.png)


## Back Up Keys

Once your node is up and running, make sure to [back up your keys](/docs/bee/working-with-bee/backups).

## Getting help

The CLI has built-in documentation. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure your Bee node via the command line arguments.

You may also check out the [configuration guide](/docs/bee/working-with-bee/configuration), or simply run your Bee terminal command with the `--help` flag, eg. `bee start --help` or `bee --help`.


## Next Steps to Consider


### Access the Swarm
If you'd like to start uploading or downloading files to Swarm, [start here](/docs/develop/access-the-swarm/introduction).


### Run a hive! 
If you would like to run a hive of many Bees, check out the [hive operators](/docs/bee/installation/hive) section for information on how to operate and monitor many Bees at once.

### Start building DAPPs on Swarm
If you would like to start building decentralised applications on Swarm, check out our section for [developing with Bee](/docs/develop/introduction).
