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

Bee is packaged for MacOS and Ubuntu, Raspbian, Debian and CentOS based Linux distributions.

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

:::info
If you would like to run a hive of many Bees, checkout the [node hive operators](/docs/installation/hive) section for information on how to operate and monitor many Bees at once.
:::

To install Bee you will need to go through the following process.

1.  Set up the external signer for Bee, [Bee Clef](/docs/installation/bee-clef). (Recommended)
2.  Install Bee and set it up to run as a service.
3.  Configure Bee.
4.  [Fund your node](/docs/installation/fund-your-node) with XDAI and BZZ for the mainnet and gETH and gBZZ for our testnet.
5.  Wait for your chequebook transactions to complete and batch store to update.
6.  Check Bee is working.

## Install Bee Clef

Bee makes use of Go Ethereum's external signer, [Clef](https://geth.ethereum.org/docs/clef/tutorial).

Because Bee must sign a lot of transactions automatically and quickly,
a Bee specific version of Clef,
[bee-clef](https://github.com/ethersphere/bee-clef) has been packaged
which includes all the relevant configuration and implements the
specific configuration needed to make Clef work with Bee.

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
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_amd64.deb
sudo dpkg -i bee-clef_0.9.0_amd64.deb
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_armv7.deb
sudo dpkg -i bee-clef_0.9.0_armv7.deb
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_arm64.deb
sudo dpkg -i bee-clef_0.9.0_arm64.deb
```

</TabItem>
<TabItem value="centos">

#### AMD64

```bash
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_amd64.rpm
sudo rpm -i bee-clef_0.9.0_amd64.rpm
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_armv7.rpm
sudo rpm -i bee-clef_0.9.0_armv7.rpm
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee-clef/releases/download/v0.9.0/bee-clef_0.9.0_arm64.rpm
sudo rpm -i bee-clef_0.9.0_arm64.rpm
```

</TabItem>
<TabItem value="macos">

```bash
brew tap ethersphere/tap
brew install swarm-clef
```

To run Bee Clef as a service now and on startup, run:

```bash
brew services start swarm-clef
```

</TabItem>
</Tabs>

If you are running a mainnet node, you must change the Bee clef configuration to use chainid `100`.

```bash
sudo vim /etc/default/bee-clef
```

```bash
BEE_CLEF_CHAIN_ID=100
```

Finally, let's check Bee Clef is running.

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

```bash
systemctl status bee-clef
```

```
● bee-clef.service - Bee Clef
     Loaded: loaded (/lib/systemd/system/bee-clef.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2020-11-20 23:45:16 GMT; 1min 29s ago
```

</TabItem>
  <TabItem value="macos">

```bash
launchctl list | grep swarm-clef
```

  </TabItem>
</Tabs>

## Install Bee

Next, install Bee itself. Simply choose the appropriate command from
the ones below. This will automatically set up your Bee and start it
running in the background as a service on your computer.

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
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_amd64.deb
sudo dpkg -i bee_1.4.3_amd64.deb
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_armv7.deb
sudo dpkg -i bee_1.4.3_armv7.deb
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_arm64.deb
sudo dpkg -i bee_1.4.3_arm64.deb
```

</TabItem>
<TabItem value="centos">

### CentOS

#### AMD64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_amd64.rpm
sudo rpm -i bee_1.4.3_amd64.rpm
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_armv7.rpm
sudo rpm -i bee_1.4.3_armv7.rpm
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.4.3/bee_1.4.3_arm64.rpm
sudo rpm -i bee_1.4.3_arm64.rpm
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

## Configure Bee

To get the most out of your Bee it is important that you configure Bee for your specific use
case!

### Important Configuration Parameters

Bee is a versatile piece of software with diverse use cases. Before
starting Bee for the first time, please consider changing the
following configuration parameters to suit your needs. Read on for
more specific information on how to tune your Bee, and (re)start it's
service.

#### Testnet Node

Thanks for helping by running a testnet node, you are helping to make the swarm stronger and better! Register your node at

#### Mainnet Node

Bee is set up to connect automatically to our testnet, so you may leave the `mainnet` and `network-id` flag as is.

```yaml
mainnet: true
network-id: 1
bootnode: [/dnsaddr/mainnet.ethswarm.org]
```

#### Full Node or Light Node

Since Bee can take a lot of resources when providing services to the
network in exchange for BZZ, Bee nodes default automatically to
running as a [_light node_](/docs/access-the-swarm/light-nodes). To
allow your Bee to use your network bandwidth and computing resources
to serve the network and start [cashing
out](/docs/working-with-bee/cashing-out) cheques, set the
`--full-node` flag to `true`.

```yaml
full-node: true
```

#### Blockchain Endpoints

Your Bee node must have _stable_ access to the XDAI blockchain, so that it
can interact with and deploy your chequebook contract. We recommend you run your own [XDAI Node using Nethermind](https://www.xdaichain.com/for-validators/new-validator-process-flow/nethermind-node-setup).

By default, Bee expects a local XDAI node at `ws://localhost:8545`. To use an Ethereum RPC provider instead, change your configuration as follows:

```yaml
swap-endpoint: http://localhost:8545
```

#### Funding Your Chequebook

You may select how much BZZ to fund your wallet with. We suggest 1 BZZ as a good starter amount, but you can start with more if you will be paying for a lot of interaction with the network, or even none at all if you will stay within the time based payment thresholds!

```yaml
swap-initial-deposit: 10000000000000000
```

If you would like to use your node to resolve ENS domain names, you must also provide the endpoint for an Ethereum mainnet RPC provider.

```yaml
resolver-options: ["https://mainnet.infura.io/v3/<<your-api-key>>"]
```

#### Open File Descriptors

Bee is designed to work on a lot of different hardware configurations. To facilitate the exploration of this, during our beeta phase, we have given node operators access to leveldb's `--db-open-files-limit`. This helps determine the speed with which Bee can read and write to its database, and therefore its efficiency in forwarding and serving chunks. Some say setting this to much more than the default 200 leads to a much enhanced ability to participate in the swarm and get those BZZ! Share your experience in the #node-operators channel of our [Discord server](https://discord.gg/wdghaQsGq5) to help us make this process more automated in the future.

```yaml
db-open-files-limit: 2000
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

```bash
123.123.123.123
```

Then configure your node, including your p2p port (default 1634).

```yaml
nat-addr: "123.123.123.123:1634"
```

#### Debug API

For a new installation of Bee, the Debug API endpoint is _not_ exposed
by default for security reasons. To enable the Debug API endpoints,
set the `--debug-api-enable` flag to `true` in your [configuration
file](/docs/working-with-bee/configuration) and [restart your Bee's
service](#edit-config-file).

```yaml
debug-api-enable: true
debug-api-addr: 127.0.0.1:1635
```

Some package manager installations will automatically set your Debug API to be listening on localhost.

:::danger
The Debug API contains **sensitive endpoints** and therefore you
should ensure that port `1635` is firewalled and _never_ exposed to
the public Internet.
:::

:::info
See the [configuration](/docs/working-with-bee/configuration) section for more information on how to fine tune your Bee.
:::

### Edit Config File

To alter Bee's configuration, edit the relevant configuration file (default `bee.yaml`), and then restart your Bee service.

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

### CentOS

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

## Fund Your Bee

Your Bee must deploy a chequebook contract to keep track of its exchanges with other Bees in the Swarm. To do that it needs BZZ and XDAI.

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
node](/docs/installation/fund-your-node) with XDAI and BZZ

:::info
If too much time has elapsed, you may need to [restart your
node](#edit-config-file) at this point.
:::

## Wait for Initialisation

When first started, Bee must deploy a chequebook to the XDAI
blockchain, and sync the postage stamp batch store so that it can
check chunks for validity when storing or forwarding them. This can
take a while, so please be patient! Once this is complete, you will
see Bee starting to add peers and connect to the network.

While you are waiting for Bee to initalise, this is a great time to [back up your keys](/docs/working-with-bee/backups) so you can keep the tokens you earn safe.

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
6
```

Perfect! We are accumulating peers, this means you are connected to
the network, and ready to start [using
Bee](/docs/access-the-swarm/introduction) to [upload and
download](/docs/access-the-swarm/upload-and-download) content or host
and browse [websites](/docs/access-the-swarm/host-your-website) hosted
on the Swarm network - and accumulating cheques tht you can [cashout
to get your BZZ](/docs/working-with-bee/cashing-out).

Welcome to the swarm! 🐝 🐝 🐝 🐝 🐝
