---
title: Configuration
id: configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Configuration Methods and Priority

There are three methods of configuration which each have different priority levels. Configuration is processed in the following ascending order of preference:

1. Command Line Flags
2. Environment Variables
3. YAML Configuration File

:::info
All three methods may be used when running Bee using `bee start`.

However when Bee is started as a service with tools like `systemctl` or `brew services`, only the YAML configuration file is supported by default.
:::

### Command Line Arguments

Run `bee start --help` in your Terminal to list the available command line arguments as follows:

```bash
Start a Swarm node

Usage:
  bee start [flags]

Flags:
      --allow-private-cidrs                      allow to advertise private CIDRs to the public network
      --api-addr string                          HTTP API listen address (default "127.0.0.1:1633")
      --block-time uint                          chain block time (default 15)
      --blockchain-rpc-endpoint string           rpc blockchain endpoint
      --bootnode strings                         initial nodes to connect to
      --bootnode-mode                            cause the node to always accept incoming connections
      --cache-capacity uint                      cache capacity in chunks, multiply by 4096 to get approximate capacity in bytes (default 1000000)
      --cache-retrieval                          enable forwarded content caching (default true)
      --chequebook-enable                        enable chequebook (default true)
      --cors-allowed-origins strings             origins with CORS headers enabled
      --data-dir string                          data directory (default "/home/noah/.bee")
      --db-block-cache-capacity uint             size of block cache of the database in bytes (default 33554432)
      --db-disable-seeks-compaction              disables db compactions triggered by seeks (default true)
      --db-open-files-limit uint                 number of open files allowed by database (default 200)
      --db-write-buffer-size uint                size of the database write buffer in bytes (default 33554432)
      --full-node                                cause the node to start in full mode
  -h, --help                                     help for start
      --mainnet                                  triggers connect to main net bootnodes. (default true)
      --nat-addr string                          NAT exposed address
      --neighborhood-suggester string            suggester for target neighborhood (default "https://api.swarmscan.io/v1/network/neighborhoods/suggestion")
      --network-id uint                          ID of the Swarm network (default 1)
      --p2p-addr string                          P2P listen address (default ":1634")
      --p2p-ws-enable                            enable P2P WebSocket transport
      --password string                          password for decrypting keys
      --password-file string                     path to a file that contains password for decrypting keys
      --payment-early-percent int                percentage below the peers payment threshold when we initiate settlement (default 50)
      --payment-threshold string                 threshold in BZZ where you expect to get paid from your peers (default "13500000")
      --payment-tolerance-percent int            excess debt above payment threshold in percentages where you disconnect from your peer (default 25)
      --postage-stamp-address string             postage stamp contract address
      --postage-stamp-start-block uint           postage stamp contract start block number
      --pprof-mutex                              enable pprof mutex profile
      --pprof-profile                            enable pprof block profile
      --price-oracle-address string              price oracle contract address
      --redistribution-address string            redistribution contract address
      --resolver-options strings                 ENS compatible API endpoint for a TLD and with contract address, can be repeated, format [tld:][contract-addr@]url
      --resync                                   forces the node to resync postage contract data
      --staking-address string                   staking contract address
      --statestore-cache-capacity uint           lru memory caching capacity in number of statestore entries (default 100000)
      --static-nodes strings                     protect nodes from getting kicked out on bootnode
      --storage-incentives-enable                enable storage incentives feature (default true)
      --swap-deployment-gas-price string         gas price in wei to use for deployment and funding
      --swap-enable                              enable swap
      --swap-endpoint string                     swap blockchain endpoint
      --swap-factory-address string              swap factory addresses
      --swap-initial-deposit string              initial deposit if deploying a new chequebook (default "0")
      --target-neighborhood string               neighborhood to target in binary format (ex: 111111001) for mining the initial overlay
      --token-encryption-key string              admin username to get the security token
      --tracing-enable                           enable tracing
      --tracing-endpoint string                  endpoint to send tracing data (default "127.0.0.1:6831")
      --tracing-host string                      host to send tracing data
      --tracing-port string                      port to send tracing data
      --tracing-service-name string              service name identifier for tracing (default "bee")
      --use-postage-snapshot                     bootstrap node using postage snapshot from the network
      --verbosity string                         log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")
      --warmup-time duration                     time to warmup the node before some major protocols can be kicked off (default 5m0s)
      --welcome-message string                   send a welcome message string during handshakes
      --withdrawal-addresses-whitelist strings   withdrawal target addresses

Global Flags:
      --config string   config file (default is $HOME/.bee.yaml)
```

### Environment variables

Bee config may also be passed using environment variables.

Environment variables are set as variables in your operating system's
session or systemd configuration file. To set an environment variable,
type the following in your terminal session.

```bash
export VARIABLE_NAME=variableValue
```

Verify if it is correctly set by running `echo $VARIABLE_NAME`.

All available configuration options are available as `BEE` prefixed,
capitalised, and underscored environment variables, e.g. `--api-addr` becomes `BEE_API_ADDR`.

### YAML configuration file

You can view the default contents of the `bee.yaml` configuration file using the `bee printconfig` command:

```bash
bee printconfig
```

```yaml
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

:::info
Note that depending on whether Bee is started directly with the `bee start` command or started as a service with `systemctl` / `brew services`, the default directory for the YAML configuration file (shown in the `config` option above) [will be different](/docs/bee/working-with-bee/configuration).
:::

To change your node's configuration, simply edit the YAML file and restart Bee:

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">

Open the config file for editing:

```bash
sudo vi /etc/bee/bee.yaml
```

After saving your changes, restart your node:

```bash
sudo systemctl restart bee
```

</TabItem>

<TabItem value="macos-arm64">

Open the config file for editing:

```bash
sudo vi /opt/homebrew/etc/swarm-bee/bee.yaml
```

After saving your changes, restart your node:

```bash
brew services restart swarm-bee
```

</TabItem>

<TabItem value="macos-amd64">

Open the config file for editing:

```bash
sudo vi /usr/local/etc/swarm-bee/bee.yaml
```

After saving your changes, restart your node:

```bash
brew services restart swarm-bee
```

</TabItem>

</Tabs>

## Manually generating YAML config file for `bee start`

No YAML file is generated during installation when using the [shell script install method](/docs/bee/installation/shell-script-install), so you must generate one if you wish to use a YAML file to specify your configuration options. To do this you can use the `bee printconfig` command to print out a set of default options and save it to a new file in the default location:

```bash
bee printconfig &> $HOME/.bee.yaml
```

:::info
Note that `bee printconfig` prints the default configuration for your node, not the current configuration including any changes.
:::

Moreover, when using `bee.yaml` together with the `bee start` command, you must use the `--config` flag to specify where you have saved your configuration file or else your node will ignore it. This can be a good option if you have changed many default options and want to have them cleanly organized in a file that can be used to specify options when running your node node directly with `bee start`.

## Restoring default YAML config file

You can find the default configurations for your system in the [packaging folder of the Bee repo](https://github.com/ethersphere/bee/tree/master/packaging). If your configuration file is missing you can simply copy the contents of the file into a new `bee.yaml` file in the default configuration directory shown in the `bee.yaml` file for your system.

## Default Data and Config Directories

Depending on the operating system and startup method used, the default data and configuration directories for your node will differ.

### Bee Service Default Directories (Package Manager Install)

When installed using a package manager, Bee is set up to run as a service with default data and configuration directories set up automatically during the installation. The examples below include default directories for Linux and macOS. You can find the complete details of default directories for different operating systems in the `bee.yaml` files included in the [packaging folder of the Bee repo](https://github.com/ethersphere/bee/tree/master/packaging).

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS arm64 (Apple Silicon)', value: 'macos-arm64'},
{label: 'MacOS amd64 (Intel)', value: 'macos-amd64'},
]}>
<TabItem value="linux">

The default data folder and config file locations:

```yaml
data-dir: /var/lib/bee
config: /etc/bee/bee.yaml
```

</TabItem>

<TabItem value="macos-arm64">

The default data folder and config file locations:

```yaml
data-dir: /opt/homebrew/var/lib/swarm-bee
config: /opt/homebrew/etc/swarm-bee/bee.yaml
```

</TabItem>

<TabItem value="macos-amd64">

The default data folder and config file locations:

```yaml
data-dir: /usr/local/var/lib/swarm-bee/
config: /usr/local/etc/swarm-bee/bee.yaml
```

</TabItem>
</Tabs>

### `bee start` Default Directories

For all operating systems, the default data and config directories for the `bee start` startup method can be found using the `bee printconfig` command:

This will print out a complete default Bee node configuration file to the terminal, the `config` and `data-dir` values show the default directories for your system:

```yaml
config: /root/.bee.yaml
data-dir: /root/.bee
```

:::info
The default directories for your system may differ from the example above, so make sure to run the `bee printconfig` command to view the default directories for your system.
:::

## Set Bee Node Type

You can set your node's mode of operation by modifying its configuration options. There are three node types: `full`, `light`, and `ultra-light`. If you're not sure which type of node is right for you, check out the [Getting Started guide](/docs/bee/installation/getting-started).

There are three configuration options that must be configured to set your node type. These options are listed below in each of the supported formats (command line flags, environment variables, and yaml values.):

1. `--full-node` / `BEE_FULL_NODE` / `full-node`
2. `--swap-enable` / `BEE_SWAP_ENABLE` / `swap-enable`
3. `--blockchain-rpc-endpoint` / `BEE_BLOCKCHAIN_RPC_ENDPOINT` / `blockchain-rpc-endpoint`

A `password` option is also required for all modes, and can either be set directly as a configuration option or alternatively a file can be used by setting the `password-file` option to the path where your password file is located.

:::info
In the list above, we've provided the configuration options for each node type in all three configuration formats.

Note that configuration options are processed in this order, as mentioned above:

1. Command Line Flags
2. Environment Variables
3. YAML Configuration File

:::

:::info
In the examples below, the RPC endpoint is set as `https://xdai.fairdatasociety.org`. Your RPC endpoint may differ depending on whether you are running your own Gnosis Chain node or using a third-party provider. Free RPC providers are listed in the [Gnosis Chain docs](https://docs.gnosischain.com/node/), while commercial providers such as [Infura](https://www.infura.io/) offer more reliable options.
:::

<Tabs
defaultValue="full"
values={[
{label: 'Full', value: 'full'},
{label: 'Light', value: 'light'},
{label: 'Ultra Light', value: 'ultra-light'},
]}>

<TabItem value="full">

### Full Node Configuration

**Command Line Flags:**

```bash
bee start \
  --password flummoxedgranitecarrot \
  --full-node \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```

**Environment Variables:**

```bash
export BEE_PASSWORD=flummoxedgranitecarrot
export BEE_FULL_NODE=true
export BEE_SWAP_ENABLE=true
export BEE_BLOCKCHAIN_RPC_ENDPOINT=https://xdai.fairdatasociety.org
bee start
```

**YAML Configuration File:**

```yaml
password: flummoxedgranitecarrot
full-node: true
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="light">

### Light Node Configuration

**Command Line Flags:**

```bash
bee start \
  --password flummoxedgranitecarrot \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```

**Environment Variables:**

```bash
export BEE_PASSWORD=flummoxedgranitecarrot
export BEE_FULL_NODE=false
export BEE_SWAP_ENABLE=true
export BEE_BLOCKCHAIN_RPC_ENDPOINT=https://xdai.fairdatasociety.org
bee start
```

**YAML Configuration File:**

```yaml
password: flummoxedgranitecarrot
full-node: false
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="ultra-light">

### Ultra-Light Node Configuration

**Command Line Flags:**

```bash
bee start \
  --password flummoxedgranitecarrot \
  --api-addr 127.0.0.1:1633
```

**Environment Variables:**

```bash
export BEE_PASSWORD=flummoxedgranitecarrot
export BEE_FULL_NODE=false
export BEE_SWAP_ENABLE=false
export BEE_BLOCKCHAIN_RPC_ENDPOINT=
bee start
```

**YAML Configuration File:**

```yaml
password: flummoxedgranitecarrot
full-node: false
swap-enable: false
blockchain-rpc-endpoint: ""
```

</TabItem>

</Tabs>

## Sepolia Testnet Configuration

Connecting to the Swarm testnet is as simple as adding the flag `--mainnet false` to your bee commandline, or `mainnet: false` to your configuration file. Swarm testnet smart contracts are deployed on Sepolia, so if you want to run a light or full node you will need to add a Sepolia RPC to your configuration and fund your node with Sepolia ETH. There are many public faucets you can use to obtain Sepolia ETH, such as [this one from Infura](https://www.infura.io/faucet/sepolia).

To get Sepolia BZZ (sBZZ) you can use [this Uniswap market](https://app.uniswap.org/swap?outputCurrency=0x543dDb01Ba47acB11de34891cD86B675F04840db&inputCurrency=ETH); just make sure that you've switched to the Sepolia network in your browser wallet.

Here is an example of a full configuration for a testnet full node:

```yaml
data-dir: /home/username/bee/sepolia
full-node: true
mainnet: false
password: password
blockchain-rpc-endpoint: wss://sepolia.infura.io/ws/v3/<API-KEY>
swap-enable: true
verbosity: 5
welcome-message: "welcome-from-the-hive"
warmup-time: 30s
```
