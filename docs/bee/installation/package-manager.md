---
title: Package Manager Install
id: package-manager-install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Bee client can be [installed through a variety of package managers](/docs/bee/installation/package-manager-install) including [APT](https://en.wikipedia.org/wiki/APT_(software)), [RPM](https://en.wikipedia.org/wiki/RPM_Package_Manager), and [Homebrew](https://en.wikipedia.org/wiki/Homebrew_(package_manager)). 

:::caution
  When installed using a package manager, Bee is set up so it can be started to run as a background service using `systemctl` or `brew services` (depending on the package manager used.) 
  
  However, a package manager installed Bee node can also be started using the standard `bee start` command.

  When a node is started using the `bee start` command the node process will be bound to the terminal session and will exit if the terminal is closed. 
  
  Depending on which of these startup methods was used, *the default Bee directories will be different*. For each startup method, a different default data directory is used, so each startup method will essentially be spinning up a totally different node.
  
  See the [configuration page](/docs/bee/working-with-bee/configuration) for more information about default data and config directories.
:::


## Install Bee

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

You should see the following output to your terminal after a successful install (your default 'Config' location will vary depending on your operating system):

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
Preparing to unpack .../archives/bee_2.3.0_amd64.deb ...
Unpacking bee (2.3.0) ...
Setting up bee (2.3.0) ...

Logs:   journalctl -f -u bee.service
Config: /etc/bee/bee.yaml

Bee requires a Gnosis Chain RPC endpoint to function. By default this is expected to be found at ws://localhost:8546.

Please see https://docs.ethswarm.org/docs/installation/install for more details on how to configure your node.

After you finish configuration run 'sudo bee-get-addr' and fund your node with XDAI, and also XBZZ if so desired.

Created symlink /etc/systemd/system/multi-user.target.wants/bee.service → /lib/systemd/system/bee.service.
```


## Configure Bee

When Bee is installed using a package manager, a `bee.yaml` file containing the default configuration will be generated. 

:::info
While this package manager install guide uses the `bee.yaml` file for setting configuration options, there are  [several other available methods for setting node options](/docs/bee/working-with-bee/configuration).
:::

After installation, you can check that the file was successfully generated and contains the [default configuration](https://github.com/ethersphere/bee/blob/master/packaging) for your system:

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">


```bash
  test -f /etc/bee/bee.yaml && echo "$FILE exists."
  cat /etc/bee/bee.yaml
```

</TabItem>

<TabItem value="macos-arm64">

```bash
  test -f /opt/homebrew/etc/swarm-bee/bee.yaml && echo "$FILE exists."
  cat /opt/homebrew/etc/swarm-bee/bee.yaml
```

</TabItem>

<TabItem value="macos-amd64">

```bash
  test -f /usr/local/etc/swarm-bee/bee.yaml && echo "$FILE exists."
  cat /usr/local/etc/swarm-bee/bee.yaml
```
</TabItem>
</Tabs>

The configuration printed to the terminal should match the default configuration for your operating system. See the [the packaging section of the Bee repo](https://github.com/ethersphere/bee/tree/master/packaging) for the default configurations for a variety of systems. In particular, pay attention to the `config` and `data-dir` values, as these differ depending on your system. 

If your config file is missing you will need to create it yourself.


<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">

Create the `bee.yaml` config file and save it with the [the default configuration](https://github.com/ethersphere/bee/blob/master/packaging/bee.yaml).

```bash
sudo touch /etc/bee/bee.yaml
sudo vi /etc/bee/bee.yaml
```

</TabItem>

<TabItem value="macos-arm64">

Create the `bee.yaml` config file and save it with the [the default configuration](https://github.com/ethersphere/bee/blob/master/packaging/homebrew-arm64/bee.yaml).

```bash
sudo touch /opt/homebrew/etc/swarm-bee/bee.yaml
sudo sudo vi /opt/homebrew/etc/swarm-bee/bee.yaml
```

</TabItem>

<TabItem value="macos-amd64">

Create the `bee.yaml` config file and save it with the [the default configuration](https://github.com/ethersphere/bee/blob/master/packaging/homebrew-amd64/bee.yaml).

```bash
sudo touch /usr/local/etc/swarm-bee/bee.yaml
sudo vi /usr/local/etc/swarm-bee/bee.yaml
```
</TabItem>

</Tabs>

### Set Node Type

See the [Getting Started guide](/docs/bee/installation/getting-started) if you're not sure which type of node to run.
 
Once you've decided which node type is appropriate for you, refer to the [configuration section](/docs/bee/working-with-bee/configuration#set-bee-node-type) for instructions on setting the options for your preferred node type.

### Set Target Neighborhood

When installing your Bee node it will automatically be assigned a neighborhood. However, when running a full node with staking there are benefits to periodically updating your node's neighborhood. Learn more about why and how to set your node's target neighborhood [here](/docs/bee/installation/set-target-neighborhood).


## Start Node

Use the appropriate command for your system to start your node:

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

```bash
sudo systemctl start bee
```

</TabItem>

<TabItem value="macos">

```bash
brew services start swarm-bee
```

</TabItem>
</Tabs>


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

Take note of the lines:

```bash
"time"="2024-09-24 18:15:34.520716" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
```

and

```bash
"time"="2024-09-24 18:15:38.728534" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0003750000017" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
```

The address referred to in both of these lines is your node's Gnosis Chain address. The second one indicates that the address does not have enough xDAI in order to deploy your node's chequebook contract which is used to pay for bandwidth incentives. You will see this warning if you have configured your node to run as a `full` or `light` node, but it should be absent for `ultra-light` nodes. 

## Fund Node

Depending on your chosen node type, (full, light, or ultra-light), you will want to fund your node with differing amounts of xBZZ and xDAI. See [this section](/docs/bee/installation/fund-your-node) for more information on how to fund your node. 


### Restart and Wait for Initialisation

After funding your node, use the appropriate command for your system below and wait for it to initialize:

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

```bash
sudo systemctl start bee
```

</TabItem>

<TabItem value="macos">

```bash
brew services start swarm-bee
```

</TabItem>
</Tabs>

When first started in full or light mode, Bee must deploy a chequebook to the Gnosis Chain blockchain, and sync the postage stamp batch store so that it can check chunks for validity when storing or forwarding them. This can take a while, so please be patient! Once this is complete, you will see Bee starting to add peers and connect to the network.

You can keep an eye on progress by watching the logs while this is taking place.


<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">

```bash
sudo journalctl --lines=100 --follow --unit bee
```

</TabItem>
<TabItem value="macos-arm64">



```bash
tail -f /opt/homebrew/var/log/swarm-bee/bee.log
```

</TabItem>

<TabItem value="macos-amd64">


```bash
tail -f /usr/local/var/log/swarm-bee/bee.log
```
</TabItem>

</Tabs>

*If you've started your node with `bee start`, simply observe the logs printed to your terminal.*

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

## Check if Bee is Working

First check that the correct version of Bee is installed:

```bash
bee version
```

```
2.3.0
```

Once the Bee node has been funded, the chequebook deployed, and postage stamp
batch store synced, its HTTP [API](/docs/bee/working-with-bee/bee-api)
will start listening at `localhost:1633` (for `full` or `light` nodes - for an `ultra-light` node, it should be initialized and the API should be available more rapidly).

To check everything is working as expected, send a GET request to localhost port 1633.

```bash
curl localhost:1633
```

```
Ethereum Swarm Bee
```

Great! Our API is listening!

Next, let's see if we have connected with any peers by querying the API which listens at port 1633 by default (`localhost:1633`).

:::info
Here we are using the `jq` [utility](https://stedolan.github.io/jq/) to parse our javascript. Use your package manager to install `jq`, or simply remove everything after and including the first `|` to view the raw json without it.
:::

```bash
curl -s localhost:1633/peers | jq ".peers | length"
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

## Back Up Keys

Once your node is up and running, make sure to [back up your keys](/docs/bee/working-with-bee/backups). 

## Deposit Stake (Optional)

While depositing stake is not required to run a Bee node, it is required in order for a node to receive rewards for sharing storage with the network. You will need to [deposit xBZZ to the staking contract](/docs/bee/working-with-bee/staking) for your node. To do this, send a minimum of 10 xBZZ to your nodes' wallet and run:

```bash
curl -X POST localhost:1633/stake/100000000000000000
```

This will initiate a transaction on-chain which deposits the specified amount of xBZZ into the staking contract. 

Storage incentive rewards are only available for full nodes which are providing storage capacity to the network.

Note that SWAP rewards are available to all full and light nodes, regardless of whether or not they stake xBZZ in order to participate in the storage incentives system.



## Next Steps to Consider


### Access the Swarm
If you'd like to start uploading or downloading files to Swarm, [start here](/docs/develop/access-the-swarm/introduction).

### Explore the API
The [Bee API](/docs/bee/working-with-bee/bee-api) is the primary method for interacting with Bee and getting information about Bee. After installing Bee and getting it up and running, it's a good idea to start getting familiar with the API.

### Run a hive! 
If you would like to run a hive of many Bees, check out the [hive operators](/docs/bee/installation/hive) section for information on how to operate and monitor many Bees at once.

### Start building DAPPs on Swarm
If you would like to start building decentralised applications on Swarm, check out our section for [developing with Bee](/docs/develop/introduction).


