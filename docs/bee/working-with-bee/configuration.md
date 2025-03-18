---
title: Configuration
id: configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## Configuration Methods and Priority

There are three configuration methods, each with a different priority level. Configuration is processed in the following ascending order of preference:

1. Command Line Flags 
2. Environment Variables
3. YAML Configuration File

:::info
All three methods may be used when running Bee using `bee start`. 

However when Bee is started as a service with tools like `systemctl` or `brew services`, only the YAML configuration file is supported by default.
:::


### Command Line Arguments

Run `bee start --help` in your terminal to list the available command-line arguments:

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
      --minimum-storage-radius uint              minimum radius storage threshold
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
      --reserve-capacity-doubling int            reserve capacity doubling
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
      --tracing-enable                           enable tracing
      --tracing-endpoint string                  endpoint to send tracing data (default "127.0.0.1:6831")
      --tracing-host string                      host to send tracing data
      --tracing-port string                      port to send tracing data
      --tracing-service-name string              service name identifier for tracing (default "bee")
      --transaction-debug-mode                   skips the gas estimate step for contract transactions
      --use-postage-snapshot                     bootstrap node using postage snapshot from the network
      --verbosity string                         log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")
      --warmup-time duration                     time to warmup the node before some major protocols can be kicked off (default 5m0s)
      --welcome-message string                   send a welcome message string during handshakes
      --withdrawal-addresses-whitelist strings   withdrawal target addresses

Global Flags:
      --config string   config file (default is $HOME/.bee.yaml)
```

### Environment variables

Bee configuration can also be set using environment variables.

Environment variables are set as variables in your operating system's
session or systemd configuration file. To set an environment variable,
type the following in your terminal session.

```bash
export VARIABLE_NAME=variableValue
```

Verify that it is correctly set by running `echo $VARIABLE_NAME`.

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

## Manually generating YAML config file for *bee start*

No YAML file is generated during installation when using the [shell script install method](/docs/bee/installation/shell-script-install), so you must generate one if you wish to use a YAML file to specify your configuration options. To do this you can use the `bee printconfig` command to print out a set of default options and save it to a new file in the default location:

```bash
bee printconfig &> $HOME/.bee.yaml
```

:::info
Note that `bee printconfig` prints the default configuration for your node, not the current configuration including any changes.
:::

When using `bee.yaml` with the `bee start` command, make sure to use the `--config` flag to specify the location of your configuration file.


## Node Types

There are three node types which each offer varying levels of functionality - ***full***, ***light***, and ***ultra-light***. You can configure your node to run as any of these three types by setting the related options within your configuration. 

For a deeper dive into each node type and its features and limitations, refer to the [Node Types](/docs/bee/working-with-bee/node-types) page.


### How to Set Node Type

There are three relevant options which are used to set your node type: `full-node`, `swap-enable`, and `blockchain-rpc-endpoint`. The required option values for each node type are outlined below:

| Node Type        | `full-node` | `swap-enable` | `blockchain-rpc-endpoint` | Functionality                                                                      |
| ---------------- | ----------- | ------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| Full Node        | `true`      | `true`        | Required                  | Full functionality, including uploads, downloads, and Swarm network participation. |
| Light Node       | `false`     | `true`        | Required                  | Supports uploading and downloading only.                                               |
| Ultra-Light Node | `false`     | `false`       | Not required              | Free-tier downloads only.                                                          |


## Configuration Examples

Bee nodes can be configured using command-line flags, environment variables, or a YAML configuration file:

<Tabs
  defaultValue="full"
  values={[ 
    {label: 'Full', value: 'full'},
    {label: 'Light', value: 'light'},
    {label: 'Ultra-Light', value: 'ultra-light'},
  ]}>

  <TabItem value="full">

  ### Full Node Configuration

  #### Using Command-Line Arguments
  ```bash
  bee start \
    --password mypassword \
    --full-node \
    --swap-enable \
    --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
  ```

  #### Using Environment Variables
  ```bash
  export BEE_PASSWORD="mypassword"
  export BEE_FULL_NODE="true"
  export BEE_SWAP_ENABLE="true"
  export BEE_BLOCKCHAIN_RPC_ENDPOINT="https://xdai.fairdatasociety.org"
  bee start
  ```

  #### Using YAML Configuration
  ```yaml
  password: mypassword
  full-node: true
  swap-enable: true
  blockchain-rpc-endpoint: "https://xdai.fairdatasociety.org"
  ```
  </TabItem>

  <TabItem value="light">

  ### Light Node Configuration

  #### Using Command-Line Arguments
  ```bash
  bee start \
    --password mypassword \
    --swap-enable \
    --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
  ```

  #### Using Environment Variables
  ```bash
  export BEE_PASSWORD="mypassword"
  export BEE_SWAP_ENABLE="true"
  export BEE_BLOCKCHAIN_RPC_ENDPOINT="https://xdai.fairdatasociety.org"
  bee start
  ```

  #### Using YAML Configuration
  ```yaml
  password: mypassword
  swap-enable: true
  blockchain-rpc-endpoint: "https://xdai.fairdatasociety.org"
  ```
  </TabItem>

  <TabItem value="ultra-light">

  ### Ultra-Light Node Configuration

  #### Using Command-Line Arguments
  ```bash
  bee start \
    --password mypassword
  ```

  #### Using Environment Variables
  ```bash
  export BEE_PASSWORD="mypassword"
  bee start
  ```

  #### Using YAML Configuration
  ```yaml
  password: mypassword
  ```
  </TabItem>

</Tabs>


## Default Data and Config Directories

Depending on the operating system and startup method used, the default directories for your node will differ:

### Bee Service Default Directories (Package Manager Install)

When installed using a package manager, Bee is set up to run as a service with default data and configuration  directories set up automatically during the installation. The examples below include default directories for Linux and macOS. You can find the complete details of default directories for different operating systems in the `bee.yaml` files included in the [packaging folder of the Bee repo](https://github.com/ethersphere/bee/tree/master/packaging). 


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

### Shell Script Install Default Directories

For all operating systems, the default data and config directories for the `bee start` startup method can be found using the `bee printconfig` command:

This will print out a complete default Bee node configuration file to the terminal, the `config` and `data-dir` values show the default directories for your system: 

```yaml
config: /root/.bee.yaml
data-dir: /root/.bee
```

:::info
The default directories for your system may differ from the example above, so make sure to run the `bee printconfig` command to view the default directories for your system.
:::

## Create Password

A password is required for all modes, and can either be set directly in text through the `password` configuration option or alternatively a file can be used by setting the `password-file` option to the path where your password file is located.

## Setting Blockchain RPC endpoint

:::warning
A RPC endpoint for *a full archival Gnosis Chain node is required* since a Bee node must sync all data starting from when the [postage stamp smart contract was created](https://gnosisscan.io/tx/0x3427deb106b30a7d23f7ce9d2465f2d83945948c5aeddba55337c318fb56ec25). 

The free RPC endpoint offered by the Fair Data Society (https://xdai.fairdatasociety.org) will work since it is a full archival node, but running Bee with other public free RPC endpoints from non-archive nodes will result in the `storage: not found` error.

If you do encounter the `storage: not found` error, update your RPC endpoint to one for a full archival node, and restart your node with the `resync` option set to `true`. 
:::

Full and light Bee nodes require a Gnosis Chain RPC endpoint in order to sync blockchain data and issue transactions (not required for ultra-light nodes). 

To set your RPC endpoint, specify it with the `blockchain-rpc-endpoint` value, which is set to an empty string by default.

```yaml
## bee.yaml
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

We recommend you [run your own Gnosis Chain node](https://docs.gnosischain.com/node/), but you may also consider using a paid RPC endpoint provider such as [GetBlock](https://getblock.io/).


### RPC Providers

For a comprehensive list of RPC providers, refer to the [Gnosis Chain documentation](https://docs.gnosischain.com/tools/RPC%20Providers/). The list includes both free and paid RPC providers (refer to [warning above](#setting-blockchain-rpc-endpoint) about free RPC providers).

For running a light node or for testing out a single full node you can use the free RPC endpoint provided by the Fair Data Society: `https://xdai.fairdatasociety.org`.


## Configuring Swap Initial Deposit (Optional)

When running your Bee node with SWAP enabled for the first time, your node will deploy a 'chequebook' contract using the canonical factory contract which is deployed by Swarm. Once the chequebook is deployed, Bee will (optionally) deposit a certain amount of xBZZ in the chequebook contract so that it can pay other nodes in return for their services. The amount of xBZZ transferred to the chequebook is set by the `swap-initial-deposit` configuration setting (it may be left at the default value of zero or commented out). 

## NAT address

Swarm is all about sharing and storing chunks of data. To enable other Bees (also known as _peers_) to connect to your Bee, you must
broadcast your public IP address in order to ensure that Bee is reachable on the correct p2p port (default `1634`). We recommend that you [manually configure your external IP and check
connectivity](/docs/bee/installation/connectivity) to ensure your Bee is able to receive connections from other peers.

First, determine your public IP address:

```bash
curl icanhazip.com
```

```bash
123.123.123.123
```

Then configure your node, including your p2p port (default 1634).

```yaml
## bee.yaml
nat-addr: "123.123.123.123:1634"
```

## ENS Resolution (Optional)

The [ENS](https://ens.domains/) domain resolution system is used to host websites on Bee, and in order to use this your Bee must be connected to a mainnet Ethereum blockchain node. We recommend you run your own ethereum node. An option for resource restricted devices is geth+nimbus and a guide can be found [here](https://ethereum-on-arm-documentation.readthedocs.io/en/latest/). Other options include [dappnode](https://dappnode.io/), [nicenode](https://www.nicenode.xyz/), [stereum](https://stereum.net/) and [avado](https://ava.do/). 

If you do not wish to run your own Ethereum node, you may use a blockchain RPC service provider such as [Infura](https://infura.io). After signing up for Infura, simply set your `--resolver-options` to `https://mainnet.infura.io/v3/your-api-key`.

```yaml
## bee.yaml
resolver-options: ["https://mainnet.infura.io/v3/<<your-api-key>>"]
```

## Sepolia Testnet Configuration 

In order to operate a Bee node on the Sepolia testnet, you need to change `mainnet` to `false`, and provide a valid Sepolia testnet RPC endpoint through the `blockchain-rpc-endpoint` option.

Here is an example of a full configuration for a testnet full node:

```yaml
data-dir: /home/username/bee/sepolia # Specified an alternate "data-dir" for our testnet node data
full-node: true
mainnet: false # Changed to "false"
password: password
blockchain-rpc-endpoint: wss://sepolia.infura.io/ws/v3/<API-KEY> # Replaced the Gnosis Chain RPC with a Sepolia testnet RPC endpoint
swap-enable: true
verbosity: 5
welcome-message: "welcome-from-the-hive"
warmup-time: 30s
```

### Funding Testnet Node

Make sure to fund your node with Sepolia ETH rather than xDAI to pay for gas on the Sepolia testnet. There are many public faucets you can use to obtain Sepolia ETH, such as [this one from Infura](https://www.infura.io/faucet/sepolia). 

To get Sepolia BZZ (sBZZ) you can use [this Uniswap market](https://app.uniswap.org/swap?outputCurrency=0x543dDb01Ba47acB11de34891cD86B675F04840db&inputCurrency=ETH), just make sure that you've switched to the Sepolia network in your browser wallet. 