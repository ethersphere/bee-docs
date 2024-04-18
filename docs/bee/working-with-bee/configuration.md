---
title: Configuration
id: configuration
---

Bee is a very flexible piece of software, and can be configured in a variety of
ways depending on your use case. This expanded section will cover configuration in detail. The default methods for setting configuration vary depending on the install and startup method used. There are two main methods of installing and running Bee.


1. Installing Bee as a Debian or RPM package and running it as a background service with `systemctl` (Linux) or `brew services` (MacOS). This is the recommended method for most users:

1. Installing Bee binaries and running using the `bee start` command directly. This method should be used if the recommended method does not work or for a customized non-default setup.



:::caution
These two methods have [significant differences](/docs/bee/installation/install#note-on-startup-methods) and cannot not be used interchangeably. 
:::


## Configuration for Bee Service

*Note that Bee is only set up to run as a service by default when it is [installed using one of the officially supported](/docs/bee/installation/install#shell-script-install) Linux Debian or RPM packages or the Homebrew installer for MacOS.*


### Default Data and Config Directories

When running Bee as a service `/etc/bee/bee.yaml` is used as the default config directory and `/var/lib/bee` as the default data directory. 

### Change Default Config Directory

Add the `--config` flag to `bee start` to specify a config file with another location or file name.

```bash
bee start --config /<path-to-config>/<config-filename>.yaml
```

### Change Default Config

Configuration for the Bee service should not be set through command line arguments and environment variables as it is with the `bee start` command. 

To change configuration, simply edit the yaml file and restart Bee: 

#### Linux

```bash
sudo vi /etc/bee/bee.yaml
sudo systemctl restart bee
```

#### MacOS

```bash
vi /usr/local/etc/swarm-bee/bee.yaml
brew services restart swarm-bee
```

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

### Default Data and Config Directories

The `bee start` command uses `~/.bee.yaml` as the default config directory and `~/.bee` as the default data directory.


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
config: /home/noah/.bee.yaml
# origins with CORS headers enabled
cors-allowed-origins: []
# data directory
data-dir: /home/noah/.bee
# size of block cache of the database in bytes
db-block-cache-capacity: "33554432"
# disables db compactions triggered by seeks
db-disable-seeks-compaction: true
# number of open files allowed by database
db-open-files-limit: "200"
# size of the database write buffer in bytes
db-write-buffer-size: "33554432"
# debug HTTP API listen address
debug-api-addr: :1635
# enable debug HTTP API
debug-api-enable: false
# cause the node to start in full mode
full-node: false
# help for printconfig
help: false
# triggers connect to main net bootnodes.
mainnet: true
# NAT exposed address
nat-addr: ""
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
# enable permission check on the http APIs
restricted: false
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
# legacy swap factory addresses
swap-legacy-factory-addresses: []
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
```

### Configuration Priority

Configuration is processed in the following ascending order of preference when using `bee start` to run a Bee node:

1. Command Line Arguments
2. Environment Variables
3. Configuration File

### Command Line Arguments

Run `bee start --help` in your Terminal to list the available command line arguments as follows:

  ```
  Start a Swarm node

Usage:
  bee start [flags]

Flags:
      --admin-password string                   bcrypt hash of the admin password to get the security token
      --allow-private-cidrs                     allow to advertise private CIDRs to the public network
      --api-addr string                         HTTP API listen address (default ":1633")
      --block-time uint                         chain block time (default 15)
      --blockchain-rpc-endpoint string          rpc blockchain endpoint
      --bootnode strings                        initial nodes to connect to
      --bootnode-mode                           cause the node to always accept incoming connections
      --cache-capacity uint                     cache capacity in chunks, multiply by 4096 to get approximate capacity in bytes (default 1000000)
      --cache-retrieval                         enable forwarded content caching (default true)
      --chequebook-enable                       enable chequebook (default true)
      --clef-signer-enable                      enable clef signer
      --clef-signer-endpoint string             clef signer endpoint
      --clef-signer-ethereum-address string     blockchain address to use from clef signer
      --cors-allowed-origins strings            origins with CORS headers enabled
      --data-dir string                         data directory (default "/home/noah/.bee")
      --db-block-cache-capacity uint            size of block cache of the database in bytes (default 33554432)
      --db-disable-seeks-compaction             disables db compactions triggered by seeks (default true)
      --db-open-files-limit uint                number of open files allowed by database (default 200)
      --db-write-buffer-size uint               size of the database write buffer in bytes (default 33554432)
      --debug-api-addr string                   debug HTTP API listen address (default ":1635")
      --debug-api-enable                        enable debug HTTP API
      --full-node                               cause the node to start in full mode
  -h, --help                                    help for start
      --mainnet                                 triggers connect to main net bootnodes. (default true)
      --nat-addr string                         NAT exposed address
      --network-id uint                         ID of the Swarm network (default 1)
      --p2p-addr string                         P2P listen address (default ":1634")
      --p2p-ws-enable                           enable P2P WebSocket transport
      --password string                         password for decrypting keys
      --password-file string                    path to a file that contains password for decrypting keys
      --payment-early-percent int               percentage below the peers payment threshold when we initiate settlement (default 50)
      --payment-threshold string                threshold in BZZ where you expect to get paid from your peers (default "13500000")
      --payment-tolerance-percent int           excess debt above payment threshold in percentages where you disconnect from your peer (default 25)
      --postage-stamp-address string            postage stamp contract address
      --postage-stamp-start-block uint          postage stamp contract start block number
      --pprof-mutex                             enable pprof mutex profile
      --pprof-profile                           enable pprof block profile
      --price-oracle-address string             price oracle contract address
      --redistribution-address string           redistribution contract address
      --resolver-options strings                ENS compatible API endpoint for a TLD and with contract address, can be repeated, format [tld:][contract-addr@]url
      --restricted                              enable permission check on the http APIs
      --resync                                  forces the node to resync postage contract data
      --staking-address string                  staking contract address
      --statestore-cache-capacity uint          lru memory caching capacity in number of statestore entries (default 100000)
      --static-nodes strings                    protect nodes from getting kicked out on bootnode
      --storage-incentives-enable               enable storage incentives feature (default true)
      --swap-deployment-gas-price string        gas price in wei to use for deployment and funding
      --swap-enable                             enable swap
      --swap-endpoint string                    swap blockchain endpoint
      --swap-factory-address string             swap factory addresses
      --swap-initial-deposit string             initial deposit if deploying a new chequebook (default "0")
      --swap-legacy-factory-addresses strings   legacy swap factory addresses
      --target-neighborhood string              neighborhood to target in binary format (ex: 111111001) for mining the initial overlay
      --token-encryption-key string             admin username to get the security token
      --tracing-enable                          enable tracing
      --tracing-endpoint string                 endpoint to send tracing data (default "127.0.0.1:6831")
      --tracing-host string                     host to send tracing data
      --tracing-port string                     port to send tracing data
      --tracing-service-name string             service name identifier for tracing (default "bee")
      --use-postage-snapshot                    bootstrap node using postage snapshot from the network
      --verbosity string                        log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")
      --warmup-time duration                    time to warmup the node before some major protocols can be kicked off (default 5m0s)
      --welcome-message string                  send a welcome message string during handshakes

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
debug-api-enable: true
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

## Configuration Options

Bee provides the following options to customise your node.

### Global

#### --config

_default_ `/home/<user>/.bee.yaml`

The location of a YAML configuration file containing configuration options. See [configuration](/docs/bee/working-with-bee/configuration#default-data-and-config-directories-1).

### Start

#### --admin-password

When the permission checks for the API is enabled then this option configure admin password that
is used to generate Bearer tokens.

**Be aware that you need to pass a bcrypt hash of the password here not the actual plaintext password!**

_default_ `""`

#### --allow-private-cidrs: false

_default_ `""`

#### --api-addr

_default_ `:1633`

The IP and port the API will serve HTTP requests from. Omitting the IP
part of the address will cause the server to listen to all
interfaces. Argument values are of the form '132.132.132.132:1633'.

#### --block-time

_default_ `15`

The expected block time of the attached SWAP endpoint.

#### --block-hash

_default_ `""`

The block hash of the block whose parent is the block that contains the transaction hash

#### --blockchain-rpc-endpoint

_default_ `""`

Gnosis Chain (mainnet) or Sepolia (testnet) blockchain endpoint. Leave unset to boot in `ultra-light` (chainless) mode.

#### --bootnode

_default_ `/dnsaddr/mainnet.ethswarm.org`

This is a [multiaddr](https://github.com/multiformats/multiaddr)
specifying the Bee bootnodes used for bootstrapping the network. It
can be multiple values.

By default a node connects to the Swarm mainnet. When using a private or test network, network specific bootnodes must be set.

Any Bee node in a network can act as a bootnode.

#### --bootnode-mode

_default_ `false`

Cause the node to always accept incoming connections

#### --cache-capacity

_default_ `1000000`

The amount of disk space, in chunks, that is used for forwarding and uploading chunks.

#### --cache-retrieval

_default_ `true`

Enable the caching of forwarded content.

#### --chequebook-enable

_default_ `true`

Enable chequebook.

#### --cors-allowed-origins

_default_ `[]`

HTTP/WS origin domains or wildcards defining these, which the API will
allow responses to, e.g.

```bash
bee start --cors-allowed-origins="*"
bee start --cors-allowed-origins="https://website.ethswarm.org"
```

#### --data-dir

_default_ `/home/<user>/.bee`

The location on your disk where Bee stores its data. Data in this
directory will be required to restore a node state using the same key.

This consists of the following three types of data.

##### 1. Chunk Data (localstore)

This consists of chunks and files that you have pinned locally, cached chunks you have requested, or chunks within your radius of responsibility which you are responsible for serving to your peers.

##### 2. State Data (statestore)

This is information about the local state of your Bee node and should be backed up.

##### 3. Keystore Data (keys)

These files contain encrypted versions of your private key and should be backed up and kept private.

:::danger
Keep the key files in your keystore data directory safe!

They are the cryptographic proof of your network identity and cannot be recovered.
:::

_The next four options expose low-level configurations for
[LevelDB](https://pkg.go.dev/github.com/syndtr/goleveldb@v1.0.0/leveldb/opt#Options)'s
 [Openfile](https://pkg.go.dev/github.com/syndtr/goleveldb@v1.0.0/leveldb#OpenFile)
method. Please let us know how you get on with tweaking these settings
on your hardware in the
[#node-operators](https://discord.gg/X3ph5yGRFU) channel on our
[Discord server](https://discord.gg/wdghaQsGq5)_

#### --db-block-cache-capacity

_default_ `33554432`

Corresponds to LevelDB `BlockCacheCapacity` (see above)

#### --db-disable-seeks-compaction

_default_ `false`

Corresponds to LevelDB `DisableSeeksCompaction` (see above)

#### --db-open-files-limit

_default_ `200`

:::info
To accommodate less powerful hardware and operating systems, the `db-open-files-limit` is set deliberately low. We recommend that you try to increase it to nearer to `10000` or more if this is possible when using your hardware. _Please let us know how you get on with tweaking these settings on your hardware in the [#node-operators](https://discord.gg/X3ph5yGRFU) channel on our [Discord server](https://discord.gg/wdghaQsGq5)_
:::

Corresponds to LevelDB `OpenFilesCacheCapacity` (see above)

#### --db-write-buffer-size

_default_ `33554432`

Corresponds to LevelDB `WriteBuffer` (see above)

#### --debug-api-addr

_default_ `:1635`

The IP and port the [Debug API](/docs/api-reference/)
will serve HTTP requests from.

Omitting the IP part of the address will cause the server to listen to
all requests.

`--debug-api-enable` must be set to `true`.

#### --debug-api-enable

_default_ `false`

Set this to `true` to enable access to the [Debug API](/docs/api-reference/)

#### --full-node

_default_ false

Enable this by setting it to `true` to fully participate in serving and forwarding chunks to the network.

#### --mainnet

_default_ `true`

Set to `false` to connect to the Swarm testnet, or other
networks. Note that if you do so then you'll need to specify some
bootnodes using the [`--bootnode` argument](#--bootnode).

#### --nat-addr

_default_ `""`

Sets the expected public IP. Normally this is generated automatically, but in certain circumstances it may be desirable to set it manually.

Format is `123.123.123.123:1634` where the port number is your Bee p2p port.

#### --network-id

_default_ `1`  if `--mainnet=true`
_default_ `10` if `--mainnet=false`

The network ID for which to accept new connections. Set to 1 for mainnet, 10 for testnet.

#### --p2p-addr

_default_ `:1634`

The IP and port to listen for p2p protocol messages.

#### --p2p-ws-enable

_default_ `false`

Enables web-sockets transport for p2p communications.

#### --password

_default_ `""`

Password used to decrypt Swarm identity keys.

:::danger
Passing passwords as command line arguments is insecure. Use a password file or environment variable in production environments.
:::

#### --password-file

_default_ `""`

The path to a file that contains password for decrypting keys. The empty string assumes no file is presented.

#### --payment-early-percent

_default_ `50`

Percentage below the peers payment threshold when we initiate settlement.

#### --payment-threshold

_default_ `13500000`

The threshold in BZZ where you expect to get paid from your peers.

#### --payment-tolerance-percent

_default_ `25`

Excess debt above payment threshold as a percentage where you disconnect from your peer (default 25).

#### --postage-stamp-start-block

_default_ `0`

The block number of the deployed postage stamp contract.

#### --postage-stamp-address

_default_ _automatically configured depending on network_

The address of the postage stamp contract on the Ethereum blockchain, used for buying batches of stamps.

#### --resolver-options

_default_ eth:0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e@localhost:8545

ENS API endpoint for a TLD, with contract address. Multiple values can be provided.

Settings should be provided in the format `[tld:][contract-addr@]url`

A default top level domain and resolver contract address are provided, but an ENS/Geth endpoint must be provided to enable this functionality.

#### --restricted

_default_ false

Enable permission check on certain http APIs. More information on how to restrict the access
to the APIs is available [here](/docs/bee/working-with-bee/security).

If enabled - you must specify an admin password using the `--admin-password` option and a `--token-encryption-key` string value.

To generate a valid admin password use the provided [bcrypt utility](/docs/bee/working-with-bee/bcrypt)

#### --resync

_default_ false

Forces the node to resync postage contract data.

#### --static-nodes

_default_ []

Protect nodes from getting kicked out on bootnode.

#### --storage-incentives-enable

_default_ false

Enables the storage incentives feature.

#### --swap-deployment-gas-price

_default_ _determined automatically_

Gas price in wei to use for deployment and funding

#### --swap-enable

_default_ `true`

#### --blockchain-endpoint

_default_ `""`

Deprecated, use `--blockchain-rpc-endpoint` instead.

SWAP Gnosis Chain (mainnet) or Sepolia (testnet) blockchain endpoint. Leave unset to boot in `ultra-light` (chainless) mode.

#### --swap-factory-address

_default_ _anointed contract for the current blockchain id_

#### --swap-initial-deposit

_default_ `0`

#### --token-encryption-key

_default_

Admin username to get the security token.

#### --tracing-enable

_default_ `false`

Send tracing spans to the tracing service. More information on how to
configure and visualize tracing data is available
[here](/docs/develop/bee-developers/useful-dev-info#tracing).

#### --tracing-endpoint

_default_ `127.0.0.1:6831`

The URL where the tracing service listens for Thrift protocol UDP messages.

#### --tracing-host

_default_ `""`

Host to send tracing data.

#### --tracing-port

_default_ `""`

Port to send tracing data.

#### --tracing-service-name

_default_ `bee`

Bee service identifier in tracing spans.

#### --transaction

_default_ `""`

As a spam prevention measure, for nodes which deployed their
chequebook with v0.5.0 or before, specify `transaction`.

#### --verbosity

_default_ `info`

0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace

#### --warmup-time

_default_ `5m0s`

Time to warmup the node before pull/push protocols can be kicked off.

#### --welcome-message

_default_ `""`

Custom welcome message to be displayed to peers on succesful connection.
