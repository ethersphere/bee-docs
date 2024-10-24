---
title: Install Bee
id: install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<head>
  <title>Head Metadata customized title!</title>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://raw.githubusercontent.com/ethersphere/bee-docs/set-meta-tags/static/img/preview-image.png" />
  <meta property="og:image" content="https://raw.githubusercontent.com/ethersphere/bee-docs/set-meta-tags/static/img/preview-image.png" />
  <meta property="og:image:alt" content="Front page of the Bee client docs site" />
  <meta property="og:title" content="Home of the official Bee client docs" />
  <meta property="og:description" content="How to operate and manage a Bee client for the Swarm network" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://test-twitter-preview-testing-3.netlify.app/docs/bee/installation/install" />
</head>


It is easy to set up a Bee light node on small and inexpensive computers, such as a Raspberry Pi 4, spare hardware you have lying around, or even a cheap cloud hosted VPS (we recommend small, independent providers and colocations). When running a full node however, it's important to meet the minimum required specifications.

## Recommended Hardware Specifications

### Full Nodes

Minimum recommended specifications for each full node:

- Dual core, recent generation, 2ghz processor 
- 8gb RAM
- 30gb SSD
- Stable internet connection

HDD drives are discouraged for full nodes due to their low speeds.

Note that there are additional [hardware requirements](https://docs.gnosischain.com/node/#environment-and-hardware) if you choose to run your own Gnosis Chain node in order to provide your Bee node(s) with the required RPC endpoint. See [configuration step](/docs/bee/installation/install#set-blockchain-rpc-endpoint) for more details.

### Light and UltraLight Nodes

The minimum required hardware specifications for light and ultralight nodes are very low, and can be run on practically any commercially available computer or microcomputer such as a Raspberry Pi. 

## Note on Startup Methods
:::caution
  When a node is started using the `bee start` command the node process will be bound to the terminal session and will exit if the terminal is closed. 
  
  If Bee was installed using one of the supported package managers it is set up to run as a service in the background with tools such as `systemctl` or `brew services` (which also use the `bee start` command[under the hood](https://github.com/ethersphere/bee/blob/master/packaging/bee.service)). 

  Depending on which of these startup methods was used, the default Bee directories will be different. See the [configuration page](/docs/bee/working-with-bee/configuration) for more information about default data and config directories.
:::



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
Preparing to unpack .../archives/bee_2.2.0_amd64.deb ...
Unpacking bee (2.2.0) ...
Setting up bee (2.2.0) ...

Logs:   journalctl -f -u bee.service
Config: /etc/bee/bee.yaml

Bee requires a Gnosis Chain RPC endpoint to function. By default this is expected to be found at ws://localhost:8546.

Please see https://docs.ethswarm.org/docs/installation/install for more details on how to configure your node.

After you finish configuration run 'sudo bee-get-addr' and fund your node with XDAI, and also XBZZ if so desired.

Created symlink /etc/systemd/system/multi-user.target.wants/bee.service → /lib/systemd/system/bee.service.
```

### Shell script install

The [Bee install shell script](https://github.com/ethersphere/bee/blob/master/install.sh) for Linux automatically detects its execution environment and installs the latest stable version of Bee.

:::info
Note that this install method copies precompiled binaries directly to the `/usr/local/bin` directory, so Bee installed through this method cannot be managed or uninstalled with package manager command line tools like `dpkg`, `rpm`, and `brew`.

Also note that unlike the package install method, this install method will not set up Bee to run as a service (such as with `systemctl` or `brew services`).
:::

Use either of the following commands to run the script and install Bee:

#### wget

```bash
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.2.0 bash
```

#### curl

```bash
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.2.0 bash
```
### Build from source 
If neither of the above methods works for your system, you can see our guide for [building directly from source](/docs/bee/installation/build-from-source).

## 2. Configure Bee

Before starting Bee for the first time you will need to make sure it is properly configured. 

See the [configuration](/docs/bee/working-with-bee/configuration) section for more details.

### Config for the Bee Service

When installing Bee with a package manager the configuration file for the Bee service will be automatically generated. 

Check that the file was successfully generated and contains the [default configuration](https://github.com/ethersphere/bee/blob/master/packaging) for your system:

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

:::info
You may be aware of the `bee printconfig` command which prints out a complete default Bee configuration. However, note that it outputs the default `data` and `config` directories for running Bee with `bee start`, and will need to be updated to use [the default locations for your system](https://github.com/ethersphere/bee/tree/master/packaging) if you plan on running Bee as a service with `systemctl` or `brew services`.
:::

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

### Config for `bee start`

When running your node using `bee start` you can set options using either command line flags, environment variables, or a YAML configuration file. See the configuration section for [more information on setting options for running a node with `bee start`](/docs/bee/working-with-bee/configuration).

No default YAML configuration file is generated to be used with the `bee start` command, so it must be generated and placed in the default config directory if you wish to use it to set your node's options. You can view the default configuration including the default config directory for your system with the `bee printconfig` command.

```bash
root@user-bee:~# bee printconfig
```

Check the configuration printed to your terminal. Note that the values for `config` and `data-dir` will vary slightly depending on your operating system.

```bash
# allow to advertise private CIDRs to the public network
allow-private-cidrs: false
# HTTP API listen address
api-addr: 127.0.0.1:1633
# chain block time
block-time: "15"
# rpc blockchain endpoint
blockchain-rpc-endpoint: ""
# initial nodes to connect to
bootnode: []
# cause the node to always accept incoming connections
bootnode-mode: false
# cache capacity in chunks, multiply by 4096 to get approximate capacity in bytes
cache-capacity: "1000000"
# enable forwarded content caching
cache-retrieval: true
# enable chequebook
chequebook-enable: true
# config file (default is $HOME/.bee.yaml)
config: /root/.bee.yaml
# origins with CORS headers enabled
cors-allowed-origins: []
# data directory
data-dir: /root/.bee
# size of block cache of the database in bytes
db-block-cache-capacity: "33554432"
# disables db compactions triggered by seeks
db-disable-seeks-compaction: true
# number of open files allowed by database
db-open-files-limit: "200"
# size of the database write buffer in bytes
db-write-buffer-size: "33554432"
# cause the node to start in full mode
full-node: false
# help for printconfig
help: false
# triggers connect to main net bootnodes.
mainnet: true
# NAT exposed address
nat-addr: ""
# suggester for target neighborhood
neighborhood-suggester: https://api.swarmscan.io/v1/network/neighborhoods/suggestion
# ID of the Swarm network
network-id: "1"
# P2P listen address
p2p-addr: :1634
# enable P2P WebSocket transport
p2p-ws-enable: false
# password for decrypting keys
password: ""
# path to a file that contains password for decrypting keys
password-file: ""
# percentage below the peers payment threshold when we initiate settlement
payment-early-percent: 50
# threshold in BZZ where you expect to get paid from your peers
payment-threshold: "13500000"
# excess debt above payment threshold in percentages where you disconnect from your peer
payment-tolerance-percent: 25
# postage stamp contract address
postage-stamp-address: ""
# postage stamp contract start block number
postage-stamp-start-block: "0"
# enable pprof mutex profile
pprof-mutex: false
# enable pprof block profile
pprof-profile: false
# price oracle contract address
price-oracle-address: ""
# redistribution contract address
redistribution-address: ""
# ENS compatible API endpoint for a TLD and with contract address, can be repeated, format [tld:][contract-addr@]url
resolver-options: []
# forces the node to resync postage contract data
resync: false
# staking contract address
staking-address: ""
# lru memory caching capacity in number of statestore entries
statestore-cache-capacity: "100000"
# protect nodes from getting kicked out on bootnode
static-nodes: []
# enable storage incentives feature
storage-incentives-enable: true
# gas price in wei to use for deployment and funding
swap-deployment-gas-price: ""
# enable swap
swap-enable: false
# swap blockchain endpoint
swap-endpoint: ""
# swap factory addresses
swap-factory-address: ""
# initial deposit if deploying a new chequebook
swap-initial-deposit: "0"
# neighborhood to target in binary format (ex: 111111001) for mining the initial overlay
target-neighborhood: ""
# admin username to get the security token
token-encryption-key: ""
# enable tracing
tracing-enable: false
# endpoint to send tracing data
tracing-endpoint: 127.0.0.1:6831
# host to send tracing data
tracing-host: ""
# port to send tracing data
tracing-port: ""
# service name identifier for tracing
tracing-service-name: bee
# bootstrap node using postage snapshot from the network
use-postage-snapshot: false
# log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace
verbosity: info
# time to warmup the node before some major protocols can be kicked off
warmup-time: 5m0s
# send a welcome message string during handshakes
welcome-message: ""
# withdrawal target addresses
withdrawal-addresses-whitelist: []
```

If you do wish to use a YAML file to manage your configuration, simply generate a new file in the same directory as shown for `config` from the `bee printconfig` output. For us, that is `/root/.bee.yaml` (make sure to change this directory to match the value for the `config` directory which is output from `bee printconfig` on your system). 

```bash
touch /root/.bee.yaml
vi /root/.bee.yaml
```

You can then populate your `.bee.yaml` file with the default config output from `bee printconfig` to get started and save the file.

### Set Bee API Address
:::danger
Make sure that your api-addr (default 1633) is never exposed to the internet. It is good practice to employ one or more firewalls that block traffic on every port except for those you are expecting to be open.
:::

If you are not using a firewall or other method to protect your node, it's recommended that you change your Bee API address from the default `1633` to `127.0.0.1:1633` to ensure that it is not publicly exposed to the internet.

```yaml
## HTTP API listen address (default ":1633")
api-addr: 127.0.0.1:1633
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

For running a light node or for testing out a single full node you may also consider using one of the [free public RPC endpoints](https://docs.gnosischain.com/tools/RPC%20Providers/) listed in the Gnosis Chain documentation. However the providers of these endpoints make no [SLA](https://business.adobe.com/blog/basics/service-level-agreements-slas-a-complete-guide#what-is-a-service-level-agreement-sla) or availability guarantees, and is therefore not recommended for full node operators.

To set your RPC endpoint provider, specify it with the `blockchain-rpc-endpoint` value, which is set to an empty string by default.

```yaml
## bee.yaml
blockchain-rpc-endpoint: https://rpc.gnosis.gateway.fm
```

:::info
The gateway.fm RPC endpoint in the example is great for learning how to set up Bee, but for the sake of security and reliability it's recommended that you run your [run your own Gnosis Chain node](https://docs.gnosischain.com/node/) rather than relying on a third party provider.
:::


### Configure Swap Initial Deposit (Optional)

When running your Bee node with SWAP enabled for the first time, your node will deploy a 'chequebook' contract using the canonical factory contract which is deployed by Swarm. Once the chequebook is deployed, Bee will (optionally) deposit a certain amount of xBZZ in the chequebook contract so that it can pay other nodes in return for their services. The amount of xBZZ transferred to the chequebook is set by the `swap-initial-deposit` configuration setting (it may be left at the default value of zero or commented out). 

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

In older versions of Bee, [neighborhood](/docs/learn/technology/disc#neighborhoods) assignment was random by default. However, we can maximize a node's chances of winning xBZZ and also strengthen the resiliency of the network by strategically assigning neighborhoods to new nodes (see the [staking section](/docs/bee/working-with-bee/staking) for more details).

Therefore the default Bee configuration now includes the `neighborhood-suggester` option which is set by default to to use the Swarmscan neighborhood suggester (`https://api.swarmscan.io/v1/network/neighborhoods/suggestion`). An alternative suggester URL could be used as long as it returns a JSON file in the same format `{"neighborhood":"101000110101"}`, however only the Swarmscan suggester is officially recommended. 

#### Setting Neighborhood Manually

It's recommended to use the default `neighborhood-suggester` configuration for choosing your node's neighborhood, however you may also set your node's neighborhood manually using the `target-neighborhood` option.

To use this option, it's first necessary to identify potential target neighborhoods. A convenient tool for finding underpopulated neighborhoods is available at the [Swarmscan website](https://swarmscan.io/neighborhoods). This tool provides the leading binary bits of target neighborhoods in order of least populated to most. Simply copy the leading bits from one of the least populated neighborhoods (for example, `0010100001`) and use it to set `target-neighborhood`. After doing so, an overlay address within that neighborhood will be generated when starting Bee for the first time.

```yaml
## bee.yaml
target-neighborhood: "0010100001"
```

There is also a [Swarmscan API endpoint](https://api.swarmscan.io/#tag/Network/paths/~1v1~1network~1neighborhoods~1suggestion/get) which you can use to get a suggested neighborhood programmatically:

```bash
curl https://api.swarmscan.io/v1/network/neighborhoods/suggestion
```
A suggested neighborhood will be returned:

```bash
{"neighborhood":"1111110101"}
```


## 3. Find Bee address

:::danger
  In the following section we print our `swarm.key` file contents to the terminal. Do not share the contents of your `swarm.key` or any other keys with anyone as it controls access to your Gnosis Chain account and can be used to withdraw assets.
:::

As part of the process of starting a Bee full or light node the node must issue a Gnosis Chain transaction to set up its chequebook contract. We need to find our node's Gnosis Chain address in order to deposit xDAI which will be used to pay for this initial Gnosis Chain transaction. We can find our node's address by reading it directly from our key file. The location for your key file will differ depending on your system and startup method:  

### Bee Service

The default keys directory for a Bee node set up with a package manager to run as a service will differ depending on your system:

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">


```bash
sudo cat /var/lib/bee/keys/swarm.key
``` 

```bash    
{"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
```
The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix and save it for the next step (0x215693a6e6cf0a27441075fd98c31d48e3a3a100).



</TabItem>

<TabItem value="macos-arm64">


```bash
sudo cat /opt/homebrew/var/lib/swarm-bee/keys/swarm.key
``` 

```bash    
{"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
```
The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix and save it for the next step (0x215693a6e6cf0a27441075fd98c31d48e3a3a100).

</TabItem>

<TabItem value="macos-amd64">


```bash
sudo cat /usr/local/var/lib/swarm-bee/keys/swarm.key
``` 

```bash    
{"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
```
The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix and save it for the next step (0x215693a6e6cf0a27441075fd98c31d48e3a3a100).

</TabItem>
</Tabs>


### For `bee start`

The default keys directory when running Bee with the `bee start` command will depend on your operating system. Run the `bee printconfig` command to see the default config directory for your operating system, and look for the `data-dir` value. 

```bash
data-dir: /root/.bee
```

Your keys folder is found in the root of the `data-dir` directory. We can print our key data to the terminal to find our node's address:

```bash
sudo cat /root/.bee/keys/swarm.key
```


```bash    
{"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
```

The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix and save it for the next step (0x215693a6e6cf0a27441075fd98c31d48e3a3a100).
      
## 4. Fund Node

:::info
  We recommend not holding a high value of xBZZ or xDAI in your nodes' wallet. Please consider regularly removing accumulated funds. 
:::

To fund your node with xDAI you can use a Gnosis Chain compatible wallet such as Metamask, or a centralized exchange which supports xDAI withdrawals to Gnosis Chain. If you already have some DAI on Ethereum, you can use the [Gnosis Chain Bridge](https://bridge.gnosischain.com/) to mint xDAI on Gnosis Chain. 

After acquiring some xDAI, you can fund your node by sending some xDAI to the address you saved from the previous step (1 xDAI is more sufficient).  You can optionally also send some xBZZ to your node which you can use to pay for storage on Swarm.

While depositing xBZZ is optional, node operators who intend to download or upload large amounts of data on Swarm may wish to deposit some xBZZ in order to pay for SWAP settlements.

For nodes which stake xBZZ and participate in the storage incentives system, small amounts of xDAI are used regularly to pay for staking related transactions on Gnosis Chain, so xDAI must be periodically topped up. See the [staking section](/docs/bee/working-with-bee/staking#check-redistribution-status) for more information.

After sending xDAI and optionally xBZZ to the Gnosis Chain address collected in the previous step, restart the node:

### Bee Service

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

```bash
sudo systemctl restart bee
```

</TabItem>

<TabItem value="macos">

```bash
brew services restart swarm-bee
```

</TabItem>
</Tabs>

### For `bee start`

Restart your terminal and run `bee start`:

```bash
bee start
```


## 5. Wait for Initialisation

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

## 6. Check if Bee is Working

First check that the correct version of Bee is installed:

```bash
bee version
```

```
2.2.0
```

Once the Bee node has been funded, the chequebook deployed, and postage stamp
batch store synced, its HTTP [API](/docs/bee/working-with-bee/bee-api)
will start listening at `localhost:1633`.

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

## 7. Back Up Keys

Once your node is up and running, make sure to [back up your keys](/docs/bee/working-with-bee/backups). 

## 8. Deposit Stake (Optional)

While depositing stake is not required to run a Bee node, it is required in order for a node to receive rewards for sharing storage with the network. You will need to [deposit xBZZ to the staking contract](/docs/bee/working-with-bee/staking) for your node. To do this, send a minimum of 10 xBZZ to your nodes' wallet and run:

```bash
curl -X POST localhost:1633/stake/100000000000000000
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
The [Bee API](/docs/bee/working-with-bee/bee-api) is the primary method for interacting with Bee and getting information about Bee. After installing Bee and getting it up and running, it's a good idea to start getting familiar with the API.

### Run a hive! 
If you would like to run a hive of many Bees, check out the [hive operators](/docs/bee/installation/hive) section for information on how to operate and monitor many Bees at once.

### Start building DAPPs on Swarm
If you would like to start building decentralised applications on Swarm, check out our section for [developing with Bee](/docs/develop/introduction).
