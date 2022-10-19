---
title: Install Bee
id: install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The swarm thrives on decentralisation, and Bee is designed so that it
works best when many individuals contribute to the health and
distributed nature of the system by each running a Bee node.

It is easy to set up Bee on small and inexpensive computers, such as a [Raspberry Pi 4](/docs/installation/rasp-bee-ry-pi), spare hardware you have lying around, or even a cheap cloud hosted VPS (we recommend small, independent providers and colocations).

## Installing Bee

To install Bee you will need to go through the following process.

1.  Install Bee and set it up to run as a service.
2.  Configure Bee.
3.  [Fund your node](/docs/installation/fund-your-node) with XDAI and BZZ for the mainnet and gETH and gBZZ for our testnet.
4.  Wait for your chequebook transactions to complete and batch store to update.
5.  Back up your keys.
6.  Check Bee is working.

:::info
  We do not recommend that you retain a large value of BZZ or XDAI in your nodes wallet. Please consider regularly removing accumulated funds. For added security, you may also want to consider running [Bee-Clef](/docs/installation/bee-clef)
:::

## 1. Install Bee

Bee is packaged for Debian (Ubuntu), Centos, and MacOS using Homebrew.

<Tabs
defaultValue="debian"
values={[
{label: 'Ubuntu / Debian / Raspbian', value: 'debian'},
{label: 'CentOS', value: 'centos'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="debian">

#### AMD64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_amd64.deb
sudo dpkg -i bee_1.8.2_amd64.deb
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_armhf.deb
sudo dpkg -i bee_1.8.2_armhf.deb
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_arm64.deb
sudo dpkg -i bee_1.8.2_arm64.deb
```

</TabItem>
<TabItem value="centos">

### CentOS

#### AMD64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_amd64.rpm
sudo rpm -i bee_1.8.2_amd64.rpm
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_armv7.rpm
sudo rpm -i bee_1.8.2_armv7.rpm
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.8.2/bee_1.8.2_arm64.rpm
sudo rpm -i bee_1.8.2_arm64.rpm
```

</TabItem>
<TabItem value="macos">

### MacOS

```bash
brew tap ethersphere/tap
brew install swarm-bee
```

To run Bee as a service now and on startup, run:

```bash
brew services start swarm-bee
```

</TabItem>
</Tabs>

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

If you would like to run a hive of many Bees, checkout the [node hive operators](/docs/installation/hive) section for information on how to operate and monitor many Bees at once.

## 2. Configure Bee

Bee is a versatile piece of software with diverse use cases. Before
starting Bee for the first time you will need to configure it to suit your needs.


### Edit Config File

To alter Bee's configuration, edit the relevant configuration file (default `/etc/bee/bee.yaml`), and then restart your Bee service.

<Tabs
defaultValue="debian"
values={[
{label: 'Ubuntu / Debian / Raspbian', value: 'debian'},
{label: 'CentOS', value: 'centos'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="debian">

#### Linux

```bash
sudo vi /etc/bee/bee.yaml
sudo systemctl restart bee
```

</TabItem>
<TabItem value="centos">

### CentOS ᙇ

```bash
sudo vi /etc/bee/bee.yaml
sudo systemctl restart bee
```

</TabItem>
<TabItem value="macos">

#### MacOS

```bash
vi /usr/local/etc/swarm-bee/bee.yaml
brew services restart swarm-bee
```

</TabItem>
</Tabs>

### Important Configuration

#### Full Node, Light Node

Bee nodes default to run in light-mode. If you want to contribute your resources to provide services to the
network in exchange for bandwidth in kind and perhaps even BZZ, simply set the
`--full-node` flag to `true`.

```yaml
full-node: true
```

### NAT Address

Swarm is all about sharing and storing chunks of data. To enable other
Bees (also known as _peers_) to connect to your Bee, you must
broadcast your public IP address, and ensure that Bee is reachable on
the correct p2p port (default `1634`). We recommend that you [manually
configure your external IP and check
connectivity](/docs/installation/connectivity) to ensure your Bee is
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
nat-addr: "123.123.123.123:1634"
```

#### Blockchain RPC Endpoints

Your Bee node must have _stable_ access to a Gnosis Chain RPC endpoint, so that it
can interact with and deploy your chequebook contract, and see the latest view of the current postage batches, as well as to interact with and top up your own batches.

We recommend you [run your own Gnosis Chain Node](https://docs.gnosischain.com/clients/gnosis-chain-node-openethereum-and-nethermind).
If you do not wish to sync your own nodes, and are willing to trust a third party, you may also like to consider using a RPC endpoint provider such as [GetBlock](https://getblock.io/).

By default, Bee expects a local Gnosis Chain node at `ws://localhost:8545`. To use a Gnosis Chain RPC provider instead, change your configuration to use the API endpoint URL they provide, for example:

```yaml
swap-endpoint: https://gno.getblock.io/mainnet/?api_key=b338ee33-b3e3-be33-bee5-b335b555b555
```

#### Funding Your Chequebook (Optional)

You may select how much BZZ to fund your wallet with. If you are happy to stay within the free usage limits initially, you may even select `0`.

```yaml
swap-initial-deposit: 0
```

We suggest We recommend 1 BZZ, `10000000000000000` PLUR as a good starter amount, but you can start with more if you will be paying for a lot of interaction with the network.

#### ENS Resolution (Optional)

The ENS domain resolution system is used to host websites on Bee, and in order to use this your Bee must be connected to an Ethereum blockchain node on the main network. If you would like to [browse the swarm](/docs/access-the-swarm/browse-the-swarm) We recommend you sign up to [Infura's](https://infura.io) API service and set your `--resolver-options=https://mainnet.infura.io/v3/your-api-key`.

```yaml
resolver-options: ["https://mainnet.infura.io/v3/<<your-api-key>>"]
```

#### Open File Descriptors (Optional)

Bee is designed to work on a lot of different hardware configurations. To facilitate the exploration of this, during our beeta phase, we have given node operators access to leveldb's `--db-open-files-limit`. This helps determine the speed with which Bee can read and write to its database, and therefore its efficiency in forwarding and serving chunks. Some say setting this to much more than the default 200 leads to a much enhanced ability to participate in the swarm and get those BZZ! Share your experience in the #node-operators channel of our [Discord server](https://discord.gg/wdghaQsGq5) to help us make this process more automated in the future.

```yaml
db-open-files-limit: 2000
```

## Fund Your Bee

Your Bee must deploy a chequebook contract to keep track of its exchanges with other Bees in the Swarm. To do that it XDAI and optionally [xBZZ](/docs/installation/fund-your-node).

First, find out your Bee's Ethereum address:

<Tabs
defaultValue="debian"
values={[
{label: 'Ubuntu / Debian / Raspbian', value: 'debian'},
{label: 'CentOS', value: 'centos'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="debian">

#### Linux

```bash
sudo bee-get-addr
```

</TabItem>
<TabItem value="centos">

### CentOS

```bash
sudo bee-get-addr
```

</TabItem>
<TabItem value="macos">

#### MacOS

```bash
head -18 $(brew --prefix)/var/log/swarm-bee/bee.log | grep ethereum
```

</TabItem>
</Tabs>

Once you have determined your Bee's Ethereum address, [fund your
node](/docs/installation/fund-your-node) with XDAI and xBZZ

If too much time has elapsed, you may need to [restart your
node](#edit-config-file) at this point.

<Tabs
defaultValue="debian"
values={[
{label: 'Ubuntu / Debian / Raspbian', value: 'debian'},
{label: 'CentOS', value: 'centos'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="debian">

#### Linux

```bash
sudo systemctl restart bee
```

</TabItem>
<TabItem value="centos">

### CentOS ᙇ

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


## Wait for Initialisation

When first started, Bee must deploy a chequebook to the Gnosis Chain
blockchain, and sync the postage stamp batch store so that it can
check chunks for validity when storing or forwarding them. This can
take a while, so please be patient! Once this is complete, you will
see Bee starting to add peers and connect to the network.

You can keep an eye on progress by watching the logs while this is taking place.

<Tabs
defaultValue="debian"
values={[
{label: 'Ubuntu / Debian / Raspbian', value: 'debian'},
{label: 'CentOS', value: 'centos'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="debian">

#### Linux

```bash
journalctl --lines=100 --follow --unit bee
```

</TabItem>
<TabItem value="centos">

### CentOS ᙇ

```bash
journalctl --lines=100 --follow --unit bee
```

</TabItem>
<TabItem value="macos">

#### MacOS

```bash
tail -f /usr/local/var/log/swarm-bee/bee.log
```

</TabItem>
</Tabs>

:::info
While you are waiting for Bee to initalise, this is a great time to [back up your keys](/docs/working-with-bee/backups) so you can them safe.
:::



## Check Bee Is Working

Once Bee has been funded, the chequebook deployed, and postage stamp
batch store synced, its HTTP [API](/docs/api-reference/api-reference)
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
[Debug API](/docs/working-with-bee/debug-api).

:::info
Here we are using the `jq` utility to parse our javascript. Use your package manager to install `jq`, or simply remove everything after and including the first `|` to view the raw json without it.
:::

```bash
curl -s localhost:1635/peers | jq ".peers | length"
```

```
87
```

Perfect! We are accumulating peers, this means you are connected to
the network, and ready to start [using
Bee](/docs/access-the-swarm/introduction) to [upload and
download](/docs/access-the-swarm/upload-and-download) content or host
and browse [websites](/docs/access-the-swarm/host-your-website) hosted
on the Swarm network - and accumulating cheques tht you can [cashout
to get your BZZ](/docs/working-with-bee/cashing-out).

Welcome to the swarm! 🐝 🐝 🐝 🐝 🐝
