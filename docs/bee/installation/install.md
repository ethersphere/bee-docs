---
title: Install Bee
id: install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

It is easy to set up a Bee light node on small and inexpensive computers, such as a Raspberry Pi 4, spare hardware you have lying around, or even a cheap cloud hosted VPS (we recommend small, independent providers and colocations). When running a full node however, it's important to meet the minimum required specifications.

## Recommended Hardware Specifications

### Full Nodes

Minimum recommended specifications for each full node:

- Dual core, recent generation, 2ghz processor 
- 8gb RAM
- 30gb SSD
- Stable internet connection

HDD drives are very strongly discouraged for full nodes due to their low speeds.

Note that there are additional [hardware requirements](https://docs.gnosischain.com/node/#environment-and-hardware) if you choose to run your own Gnosis Chain node in order to provide your Bee node(s) with the required RPC endpoint. See [configuration step](/docs/bee/installation/install#set-blockchain-rpc-endpoint) for more details.

In order to test whether a set of hardware specs is sufficient for running a full node and participating in the storage incentives redistribution, see [this guide](/docs/bee/working-with-bee/staking#check-node-performance) on the staking page.

### Light and UltraLight Nodes

The minimum required hardware specifications for light and ultralight nodes are very low, and can be run on practically any commercially available computer or microcomputer such as a Raspberry Pi. 

## Note on Startup Methods
:::caution
  The `bee start` startup method *may not* be used interchangeably with running Bee as a service using `systemctl` or `brew services`. 
  
  It is strongly advised to use run Bee using a service manager such as `systemctl`. 
  
  Bee will be set up to run as a service automatically as part of the installation process if using one of the official Debian or RPM packages.    
:::

Bee may be operated either by using the `bee start` command within a terminal session or by running Bee as a service in the background using `systemctl` (Linux) and `brew services` (MacOS) commands. 

While the Bee service does use the `bee start` command [under the hood](https://github.com/ethersphere/bee/blob/master/packaging/bee.service), there are two important differences between these modes of operation in practice:

1. When starting a node by directly using `bee start` after starting up a terminal session, the Bee node process is bound to that terminal session. When the session ends due to closing the terminal window or logging out from a remote ssh session, the node will stop running. When running bee as a service on the other hand, the node can continue to operate in the background even after the terminal session ends. 

2. When running a Bee node using the `bee start` command, a separate instance of Bee using different default locations for the config and data folders from the Bee service is used. The `bee start` command uses `~/.bee.yaml` as the default config directory and `~/.bee` as the default data directory, while `systemctl` uses `/etc/bee/bee.yaml` as the default config directory and `/var/lib/bee` as the default data directory. See the [configuration page](/docs/bee/working-with-bee/configuration) for more details.

In general `bee start` may not be the best option for most users - especially if operating a full node. 

## Installation Steps

1.  [Install Bee](/docs/bee/installation/install#1-install-bee) 
1.  [Configure Bee](/docs/bee/installation/install#2-configure-bee)
1.  [Find Bee Address](/docs/bee/installation/install#3-find-bee-address)
1.  [Fund node](/docs/bee/installation/install#4-fund-node) (Not required for ultra-light nodes) 
1.  [Wait for Initialisation](/docs/bee/installation/install#5-wait-for-initialisation)
1.  [Check Bee Status](/docs/bee/installation/install#6-check-if-bee-is-working)
1.  [Back Up Keys](/docs/bee/installation/install#7-back-up-keys)
1.  [Deposit Stake](/docs/bee/installation/install#8-deposit-stake-optional) (Full node only, optional)


## 1. Install Bee

### Package manager install

Bee is available for Linux in .rpm and .deb package format for a variety of system architectures, and is available for MacOS through Homebrew. See the [releases](https://github.com/ethersphere/bee/releases) page of the Bee repo for all available packages. One of the advantages of this method is that it automatically sets up Bee to run as a service as a part of the install process.

<Tabs
defaultValue="debian"
values={[
{label: 'Debian', value: 'debian'},
{label: 'RPM', value: 'rpm'},
{label: 'MacOS', value: 'macos'},
]}>

<TabItem value="debian">

Get GPG key:

```bash
curl -fsSL https://repo.ethswarm.org/apt/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/ethersphere-apt-keyring.gpg
```

Set up repo inside apt-get sources:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ethersphere-apt-keyring.gpg] https://repo.ethswarm.org/apt \
  * *" | sudo tee /etc/apt/sources.list.d/ethersphere.list > /dev/null
```

Install package:

```bash
sudo apt-get update
sudo apt-get install bee
```

</TabItem>

<TabItem value="rpm">

Set up repo:

```bash
sudo echo "[ethersphere]
name=Ethersphere Repo
baseurl=https://repo.ethswarm.org/yum/
enabled=1
gpgcheck=0" > /etc/yum.repos.d/ethersphere.repo
```
Install package:

```bash
yum install bee
```
</TabItem>
<TabItem value="macos">

```bash
brew tap ethersphere/tap
brew install swarm-bee
```

</TabItem>
</Tabs>

You should see the following output to your terminal after a successful install:

```bash
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  bee
0 upgraded, 1 newly installed, 0 to remove and 37 not upgraded.
Need to get 0 B/27.2 MB of archives.
After this operation, 50.8 MB of additional disk space will be used.
Selecting previously unselected package bee.
(Reading database ... 82381 files and directories currently installed.)
Preparing to unpack .../archives/bee_1.18.2_amd64.deb ...
Unpacking bee (1.18.2) ...
Setting up bee (1.18.2) ...

Logs:   journalctl -f -u bee.service
Config: /etc/bee/bee.yaml

Bee requires a Gnosis Chain RPC endpoint to function. By default this is expected to be found at ws://localhost:8546.

Please see https://docs.ethswarm.org/docs/installation/install for more details on how to configure your node.

After you finish configuration run 'sudo bee-get-addr' and fund your node with XDAI, and also XBZZ if so desired.

Created symlink /etc/systemd/system/multi-user.target.wants/bee.service → /lib/systemd/system/bee.service.
```

### Shell script install (Alternate method)

The [Bee install shell script](https://github.com/ethersphere/bee/blob/637b67a8e0a2b15e707f510bb7f49aea4ef6c110/install.sh) for Linux automatically detects its execution environment and installs the latest stable version of Bee.

:::info
Note that this install method copies precompiled binaries directly to the `/usr/local/bin` directory, so Bee installed through this method cannot be managed or uninstalled with package managers such as `dpkg` and `rpm`.

Also note that unlike the package install method, this install method will not set up Bee to run as a service (such as with systemctl or brew services).
:::

Use either of the following commands to run the script and install Bee:

#### wget

```bash
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v1.18.2 bash
```

#### curl

```bash
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v1.18.2 bash
```
### Build from source 
If neither of the above methods works for your system, you can see our guide for [building directly from source](/docs/bee/installation/build-from-source).


## 2. Configure Bee

Bee is a versatile piece of software with diverse use cases. Before starting Bee for the first time you will need to configure it to suit your needs. The installation script should have generated a config file at
`/etc/bee/bee.yaml` populated by the default configuration for the Bee service. See the [configuration](/docs/bee/working-with-bee/configuration#environment-variables) section for more details.

Check that the file was successfully generated and contains the [default configuration](https://github.com/ethersphere/bee/blob/master/packaging/bee.yaml):

```bash
 test -f /etc/bee/bee.yaml && echo "$FILE exists."
 cat /etc/bee/bee.yaml
```
The output should match the [default bee.yaml](https://github.com/ethersphere/bee/blob/master/packaging/bee.yaml) values.

If your `bee.yaml` file is missing, create a new one and fill it in with the default configuration copied from the Ethswarm GitHub Bee repo.

```bash
sudo touch /etc/bee/bee.yaml
sudo vi /etc/bee/bee.yaml  
```

### Set node type

#### Full Node, Light Node, Ultra-light Node

See the [quick start guide](/docs/bee/installation/quick-start) if you're not sure which type of node to run.

To run Bee as a full node both `full-node` and `swap-enable` must be set to `true`, and a valid and stable Gnosis Chain RPC endpoint must be specified with `blockchain-rpc-endpoint`.

```yaml
## bee.yaml
full-node: true
```

To run Bee as a light node `full-node` must be set to `false` and `swap-enable` must both be set to `true`, and a valid and stable Gnosis Chain RPC endpoint must be specified with `blockchain-rpc-endpoint`.

```yaml
## bee.yaml
full-node: false
```

To run Bee as an ultra-light node `full-node` and `swap-enable` must both be set to `false`. No Gnosis Chain endpoint is required, and `blockchain-rpc-endpoint` can be left to its default value of an empty string.

```yaml
## bee.yaml
full-node: false
swap-enable: false
```

### Set blockchain RPC endpoint

Full and light Bee nodes require a Gnosis Chain RPC endpoint so they can interact with and deploy their chequebook contract, see the latest view of the current postage stamp batches, and interact with and top-up postage stamp batches. A blockchain RPC endpoint is not required for nodes running in ultra-light mode. 

We strongly recommend you [run your own Gnosis Chain node](https://docs.gnosischain.com/node/) if you are planning to run a full node, and especially if you plan to run a [hive of nodes](/docs/bee/installation/hive). 

If you do not wish to run your own Gnosis Chain node and are willing to trust a third party, you may also consider using an RPC endpoint provider such as [GetBlock](https://getblock.io/).

For running a light node or for testing out a single full node you may also consider using one of the [free public RPC endpoints](https://docs.gnosischain.com/tools/rpc/) listed in the Gnosis Chain documentation. However the providers of these endpoints make no [SLA](https://business.adobe.com/blog/basics/service-level-agreements-slas-a-complete-guide#what-is-a-service-level-agreement-sla) or availability guarantees, and is therefore not recommended for full node operators.

To set your RPC endpoint provider, specify it in configuration for the `blockchain-rpc-endpoint` value, which is set to an empty string by default.

```yaml
## bee.yaml
blockchain-rpc-endpoint: https://gno.getblock.io/<<your-api-key>>/mainnet/
```
### Configure Swap Initial Deposit (Optional)

When running your Bee node with SWAP enabled for the first time, your Bee node will deploy a 'chequebook' contract using the canonical factory contract which is deployed by Swarm. A factory is used to ensure every node is using legitimate and verifiable chequebook contracts. Once the chequebook is deployed, Bee will (optionally) deposit a certain amount of xBZZ in the chequebook contract so that it can pay other nodes in return for their services. The amount of xBZZ transferred to the chequebook is set by the `swap-initial-deposit` configuration setting (it may be left at the default value of zero or commented out). 

### NAT address

Swarm is all about sharing and storing chunks of data. To enable other
Bees (also known as _peers_) to connect to your Bee, you must
broadcast your public IP address in order to ensure that Bee is reachable on
the correct p2p port (default `1634`). We recommend that you [manually
configure your external IP and check
connectivity](/docs/bee/installation/connectivity) to ensure your Bee is
able to receive connections from other peers.

First determine your public IP address:

```bash
curl icanhazip.com
```

```
123.123.123.123
```

Then configure your node, including your p2p port (default 1634).

```yaml
## bee.yaml
nat-addr: "123.123.123.123:1634"
```
### ENS Resolution (Optional)

The [ENS](https://ens.domains/) domain resolution system is used to host websites on Bee, and in order to use this your Bee must be connected to a mainnet Ethereum blockchain node. We recommend you run your own ethereum node. An option for resource restricted devices is geth+nimbus and a guide can be found [here](https://ethereum-on-arm-documentation.readthedocs.io/en/latest/). Other options include [dappnode](https://dappnode.io/), [nicenode](https://www.nicenode.xyz/), [stereum](https://stereum.net/) and [avado](https://ava.do/). 


If you do not wish to run your own Ethereum node you may use a blockchain API service provider such as Infura. After signing up for [Infura's](https://infura.io) API service, simply set your `--resolver-options` to `https://mainnet.infura.io/v3/your-api-key`.

```yaml
## bee.yaml
resolver-options: ["https://mainnet.infura.io/v3/<<your-api-key>>"]
```

### Set Target Neighborhood (Optional)

When setting up a new Bee node, a randomly generated overlay address will determine the node's [neighborhood](/docs/learn/technology/disc#neighborhoods). By using the `target-neighborhood` config option, however, an overlay address will be generated which falls within a specific neighborhood. There are two good reasons for doing this. First, by choosing a lesser populated neighborhood, a node's chances of winning rewards can be increased. Second, choosing to set up a node in a less populated neighborhood will strengthen the resiliency of the Swarm network. Therefore it is recommended to use the `target-neighborhood` option.

To use this option, it's first necessary to identify potential target neighborhoods. A convenient tool for finding underpopulated neighborhoods is available at the [Swarmscan website](https://swarmscan.io/neighborhoods). This tool returns the leading binary bits of target neighborhoods in order of least populated to most. Simply copy the leading bits from one of the least populated neighborhoods (for example, `0010100001`) and use it to set `target-neighborhood`. After doing so, an overlay address within that neighborhood will be generated when starting Bee for the first time.

```yaml
## bee.yaml
target-neighborhood: 0010100001
```

See the [staking section](/docs/bee/working-with-bee/staking) for more information.

## 3. Find Bee address

As part of the process of starting a Bee full node or light node the node must issue a Gnosis Chain transaction which is paid for using xDAI. We therefore need to find our node's Gnosis Chain address. We can find it by reading it directly from our key file:  

```bash
sudo cat /var/lib/bee/keys/swarm.key
``` 
*Output from cat /var/lib/bee/keys/swarm.key*:

```bash    
{"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
```
The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix.
:::danger
  Do not share the contents of your `swarm.key` or any other keys with anyone, this example is for a throwaway account.
:::
      
## 4. Fund Node

:::info
  We recommend not holding a high value of xBZZ or xDAI in your nodes' wallet. Please consider regularly removing accumulated funds. 
:::

Before funding your node, you first need to get some xDAI. You can send it either from your own Gnosis Chain compatible wallet such as Metamask, or from a centralized exchange which supports xDAI withdrawals to Gnosis Chain. If you already have some DAI on Ethereum, you can use the [xDAI bridge](https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge/) to mint xDAI on Gnosis Chain. 

Once you have some xDAI ready, you're ready to fund your Bee node. Send at least 1 xDAI to the address you found in the previous step to fund your node. You can optionally also send some xBZZ to your node which you can use to pay for storage on Swarm.

While depositing xBZZ is optional, node operators who intend to download or upload large amounts of data on Swarm may wish to deposit some xBZZ in order to pay for SWAP settlements. See the section on [node funding](/docs/bee/installation/fund-your-node) for more information.

For nodes which stake xBZZ and participate in the storage incentives system, very small amounts of xDAI will be used regularly to pay for staking related transactions on Gnosis Chain, so xDAI may need to be periodically topped up. See the [staking section](/docs/bee/working-with-bee/staking#check-redistribution-status) for more information.

After sending xDAI and optionally xBZZ to the Gnosis Chain address collected in the previous step, [restart the node](#edit-config-file):

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

#### Linux

```bash
sudo systemctl restart bee
```

</TabItem>

<TabItem value="macos">

#### MacOS

```bash
brew services restart swarm-bee
```

</TabItem>
</Tabs>


## 5. Wait for Initialisation

When first started in full or light mode, Bee must deploy a chequebook to the Gnosis Chain blockchain, and sync the postage stamp batch store so that it can check chunks for validity when storing or forwarding them. This can take a while, so please be patient! Once this is complete, you will see Bee starting to add peers and connect to the network.

You can keep an eye on progress by watching the logs while this is taking place.

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

#### Linux

```bash
sudo journalctl --lines=100 --follow --unit bee
```

</TabItem>
<TabItem value="macos">

#### MacOS

```bash
tail -f /usr/local/var/log/swarm-bee/bee.log
```

</TabItem>
</Tabs>

If all goes well, you will see your node automatically begin to connect to other Bee nodes all over the world.

```
INFO[2020-08-29T11:55:16Z] greeting <Hi I am a very buzzy bee bzzzz bzzz bzz. 🐝> from peer: b6ae5b22d4dc93ce5ee46a9799ef5975d436eb63a4b085bfc104fcdcbda3b82c
```

Now your node will begin to request chunks of data that fall within your _radius of responsibilty_ - data that you will then serve to other p2p clients running in the swarm. Your node will then begin to
respond to requests for these chunks from other peers.

:::tip Incentivisation
In Swarm, storing, serving and forwarding chunks of data to other nodes can earn you rewards! Follow [this guide](/docs/bee/working-with-bee/cashing-out) to learn how to regularly cash out cheques other nodes send you in return for your services so that you can get your xBZZ!
:::

Your Bee client has now generated an elliptic curve key pair similar to an Ethereum wallet. These are stored in your [data directory](/docs/bee/working-with-bee/configuration), in the `keys` folder.

:::danger Keep Your Keys and Password Safe!
Your keys and password are very important, back up these files and
store them in a secure place that only you have access to. With great
privacy comes great responsibility - while no-one will ever be able to
guess your key - you will not be able to recover them if you lose them
either, so be sure to look after them well and [keep secure
backups](/docs/bee/working-with-bee/backups).
:::

## 6. Check if Bee is Working

First check that the correct version of Bee is installed:

```bash
bee version
```

```
1.18.2
```

Once the Bee node has been funded, the chequebook deployed, and postage stamp
batch store synced, its HTTP [API](/docs/api-reference/)
will start listening at `localhost:1633`.

To check everything is working as expected, send a GET request to localhost port 1633.

```bash
curl localhost:1633
```

```
Ethereum Swarm Bee
```

Great! Our API is listening!

Next, let's see if we have connected with any peers by querying our
[Debug API](/docs/bee/working-with-bee/debug-api). Note that the debug api listens at port 1635 by default (`localhost:1635`).

:::info
Here we are using the `jq` [utility](https://stedolan.github.io/jq/) to parse our javascript. Use your package manager to install `jq`, or simply remove everything after and including the first `|` to view the raw json without it.
:::

```bash
curl -s localhost:1635/peers | jq ".peers | length"
```

```
87
```

Perfect! We are accumulating peers, this means you are connected to
the network, and ready to start [using
Bee](/docs/develop/access-the-swarm/introduction) to [upload and
download](/docs/develop/access-the-swarm/upload-and-download) content or host
and browse [websites](/docs/develop/access-the-swarm/host-your-website) hosted
on the Swarm network.

Welcome to the swarm! 🐝 🐝 🐝 🐝 🐝

## 7. Back Up Keys

Once your node is up and running, make sure to [back up your keys](/docs/bee/working-with-bee/backups). 

## 8. Deposit Stake (Optional)

While depositing stake is not required to run a Bee node, it is required in order for a node to receive rewards for sharing storage with the network. You will need to [deposit xBZZ to the staking contract](/docs/bee/working-with-bee/staking) for your node. To do this, send a minimum of 10 xBZZ to your nodes' wallet and run:

```bash
curl -XPOST localhost:1635/stake/100000000000000000
```

This will initiate a transaction on-chain which deposits the specified amount of xBZZ into the staking contract. 

Storage incentive rewards are only available for full nodes which are providing storage capacity to the network.

Note that SWAP rewards are available to all full and light nodes, regardless of whether or not they stake xBZZ in order to participate in the storage incentives system.

## Getting help

The CLI has documentation built-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure your Bee node via the command line arguments.

You may also check out the [configuration guide](/docs/bee/working-with-bee/configuration), or simply run your Bee terminal command with the `--help` flag, eg. `bee start --help` or `bee --help`.

## Next Steps to Consider

### Access the Swarm
If you'd like to start uploading or downloading files to Swarm, [start here](/docs/develop/access-the-swarm/introduction).

### Explore the API
The [Bee API and Debug API](/docs/api-reference/) are the primary methods for interacting with Bee and getting information about Bee. After installing Bee and getting it up and running, it's a good idea to start getting familiar with the APIs.

### Run a hive! 
If you would like to run a hive of many Bees, check out the [hive operators](/docs/bee/installation/hive) section for information on how to operate and monitor many Bees at once.

### Start building DAPPs on Swarm
If you would like to start building decentralised applications on Swarm, check out our section for [developing with Bee](/docs/develop/dapps-on-swarm/introduction).