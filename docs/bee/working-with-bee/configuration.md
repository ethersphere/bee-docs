---
title: Configuration
id: configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Default Data and Config Directories

Depending on the operating system and startup method used, the default data and configuration directories for your node will differ.

### Bee Service Default Directories

When installed using a package manager, Bee is set up to run as a service with default data and (`data-dir`) and configuration (`config`) directories set up during the installation. You can find the complete details of default directories for different operating systems in the [packaging folder of the Bee repo](https://github.com/ethersphere/bee/tree/master/packaging). 

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

When Bee is installed using a package manager it will be set up to run as a service so that it can be run in the background using tools such as `systemctl` or `brew services`. It can also be started using the `bee start` command, however there are different default data and config directories for both startup methods.

If installed using the [automated shell script](/docs/bee/installation/install#shell-script-install) or by [building Bee from source](/docs/bee/installation/build-from-source), ONLY the `bee start` startup method is available by default.

For all operating systems, the default data and config directories for the `bee start` startup method can be found using the `bee printconfig` command:

This will print out a complete default Bee node configuration file to the terminal, the `config` and `data-dir` values show the default directories for your system: 

```yaml
config: /root/.bee.yaml
data-dir: /root/.bee
```

## Bee Service Configuration 

When Bee is installed using one of the [officially supported package managers](/docs/bee/installation/install#package-manager-install), it can be run as a service in the background using tools such as `systemctl` (Linux) or `brew services` (macOS). When running Bee as a service, a YAML file is used to specify the Bee node's configuration. 

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
sudo sudo vi /opt/homebrew/etc/swarm-bee/bee.yaml
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

### Manually generate config for Bee service

If the config file is accidentally deleted or missing, it can be manually generated:

```bash
bee printconfig
```
Copy the output and save in `/etc/bee/bee.yaml`:
```bash
sudo vi /etc/bee/bee.yaml
```


## Configuration for *bee start*

While the `bee start` command uses `~/.bee.yaml` as the default config directory, no `~/.bee.yaml` file is generated during install, so it must be generated in the default directory in order to specify options using the YAML file.

### Configuration Methods and Priority

There are three methods of configuration which each have different priority levels. Configuration is processed in the following ascending order of preference when using `bee start` to run a Bee node:

1. Command Line Arguments
2. Environment Variables
3. Configuration File


### Manually generate config for *Bee start*

No configuration file is generated automatically at the default config directory for `bee start` during the Bee installation process so it must be manually generated. It can be easily generated with the following command:

For `bee start`:
```bash
bee printconfig &> $HOME/.bee.yaml
```


This produces the following file contents, showing the default
configuration of Bee:

```yaml
# bcrypt hash of the admin password to get the security token
admin-password: ""
# allow to advertise private CIDRs to the public network
allow-private-cidrs: false
# HTTP API listen address
api-addr: :1633
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
# enable clef signer
clef-signer-enable: false
# clef signer endpoint
clef-signer-endpoint: ""
# blockchain address to use from clef signer
clef-signer-ethereum-address: ""
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



### Command Line Arguments

Run `bee start --help` in your Terminal to list the available command line arguments as follows:

```bash
Start a Swarm node

Usage:
  bee start [flags]

Flags:
      --admin-password string                    bcrypt hash of the admin password to get the security token
      --allow-private-cidrs                      allow to advertise private CIDRs to the public network
      --api-addr string                          HTTP API listen address (default ":1633")
      --block-time uint                          chain block time (default 15)
      --blockchain-rpc-endpoint string           rpc blockchain endpoint
      --bootnode strings                         initial nodes to connect to
      --bootnode-mode                            cause the node to always accept incoming connections
      --cache-capacity uint                      cache capacity in chunks, multiply by 4096 to get approximate capacity in bytes (default 1000000)
      --cache-retrieval                          enable forwarded content caching (default true)
      --chequebook-enable                        enable chequebook (default true)
      --clef-signer-enable                       enable clef signer
      --clef-signer-endpoint string              clef signer endpoint
      --clef-signer-ethereum-address string      blockchain address to use from clef signer
      --cors-allowed-origins strings             origins with CORS headers enabled
      --data-dir string                          data directory (default "/home/noah/.bee")
      --db-block-cache-capacity uint             size of block cache of the database in bytes (default 33554432)
      --db-disable-seeks-compaction              disables db compactions triggered by seeks (default true)
      --db-open-files-limit uint                 number of open files allowed by database (default 200)
      --db-write-buffer-size uint                size of the database write buffer in bytes (default 33554432)
      --debug-api-addr string                    debug HTTP API listen address (default ":1635")
      --debug-api-enable                         enable debug HTTP API
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
      --restricted                               enable permission check on the http APIs
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


## Sepolia Testnet Configuration 

:::info
Sepolia is supported only in Bee 2.0.0 and upwards.
:::

In order to operate a Bee node on the Sepolia testnet, modify the following options in your configuration to the values below. Make sure that you replace the `blockchain-rpc-endpoint` option value with your own valid Sepolia RPC endpoint. If you choose to use [Infura](https://www.infura.io/) as in the example configuration below, make sure to [check in their docs](https://docs.infura.io/api/network-endpoints) that the endpoint format is up to date, and also make sure that you have filled in your own API key which you can find from the [Infura web app](https://app.infura.io). Besides Infura there are many other RPC providers you may wish to choose from.

Also make sure to fund your node with Sepolia ETH rather than xDAI to pay for gas on the Sepolia testnet. There are many public faucets you can use to obtain Sepolia ETH, such as [this one from Infura](https://www.infura.io/faucet/sepolia). 

To get Sepolia BZZ (sBZZ) you can use [this Uniswap market](https://app.uniswap.org/swap?outputCurrency=0x543dDb01Ba47acB11de34891cD86B675F04840db&inputCurrency=ETH), just make sure that you've switched to the Sepolia network in your browser wallet. 


```yaml
bootnode:
- /ip4/3.122.234.225/tcp/31050/p2p/QmdSgC9yDsK2for1VSBgK4CdP3agt76NPuEBs2KCGAnfSQ
data-dir: /home/username/bee/sepolia
full-node: true
mainnet: false
network-id: 10
password: password
blockchain-rpc-endpoint: wss://sepolia.infura.io/ws/v3/<API-KEY>
swap-enable: true
verbosity: 5
welcome-message: "welcome-from-the-hive"
warmup-time: 30s
```
