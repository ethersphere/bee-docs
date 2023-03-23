---
title: Install Bee
id: install
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Swarm thrives on decentralisation, is designed so that it
works best when many individuals contribute to the health and
distributed nature of the network by running Bee nodes.

It is easy to set up Bee on small and inexpensive computers, such as a Raspberry Pi 4, spare hardware you have lying around, or even a cheap cloud hosted VPS (we recommend small, independent providers and colocations).

## Recommended Hardware Specifications
Minimum recommended specifications for a single full node:

- Dual core 2ghz processor 
- 8gb RAM
- 50gb SSD

HDD drives are strongly discouraged due to their low speeds.

## Note on Startup Methods
:::caution
  Startup methods may not be used interchangeably. See details below:
:::

Bee may be operated either by using the `bee start` command within a terminal session or by running Bee as a service in the background using `systemctl` (Linux) and `brew services` (MacOS) commands. 

While the Bee service does use the `bee start` command [under the hood](https://github.com/ethersphere/bee/blob/master/packaging/bee.service), there are two important differences between these modes of operation in practice:

1. When starting a node by directly using `bee start` after starting up a terminal session, the Bee node process is bound to that terminal session. When the session ends due to closing the terminal window or logging out from a remote ssh session, the node will stop running. When running bee as a service on the other hand, the node can continue to operate in the background even after the terminal session ends. 

2. When running a Bee node using the `bee start` command, a separate instance of Bee using different default locations for the config and data folders from the Bee service is used. The `bee start` command uses `~/.bee.yaml` as the default config directory and `~/.bee` as the default data directory, while `systemctl` uses `/etc/bee/bee.yaml` as the default config directory and `/var/lib/bee` as the default data directory. See the [configuration page](/docs/working-with-bee/configuration) for more details.

In general `bee start` may not be the best option for most users - especially if operating a full node. 

## Installation Steps

1.  [Install Bee](/docs/installation/install#1-install-bee) 
1.  [Configure Bee](/docs/installation/install#2-configure-bee)
1.  [Find Bee address](/docs/installation/install#3-find-bee-address)
1.  [Fund node](/docs/installation/install#4-fund-node) (Not required for ultra-light nodes) 
1.  [Start Bee and wait for initialisation](/docs/installation/install#5-wait-for-initialisation)
1.  [Check if Bee is working](/docs/installation/install#6-check-if-bee-is-working)
1.  [Back up keys](/docs/installation/install#7-back-up-keys)


## 1. Install Bee

Bee is available as a package for Debian (Ubuntu) and Centos from our GitHub, and is available for MacOS through Homebrew.

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
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_amd64.deb
sudo dpkg -i bee_1.13.0_amd64.deb
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_armhf.deb
sudo dpkg -i bee_1.13.0_armhf.deb
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_arm64.deb
sudo dpkg -i bee_1.13.0_arm64.deb
```

</TabItem>
<TabItem value="centos">

#### CentOS

#### AMD64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_amd64.rpm
sudo rpm -i bee_1.13.0_amd64.rpm
```

#### ARM (Raspberry Pi)

##### ARMv7

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_armv7.rpm
sudo rpm -i bee_1.13.0_armv7.rpm
```

##### ARM64

```bash
wget https://github.com/ethersphere/bee/releases/download/v1.13.0/bee_1.13.0_arm64.rpm
sudo rpm -i bee_1.13.0_arm64.rpm
```

</TabItem>
<TabItem value="macos">

#### MacOS

```bash
brew tap ethersphere/tap
brew install swarm-bee
```

</TabItem>
</Tabs>

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

If you would like to run a hive of many Bees, check out the [node hive operators](/docs/installation/hive) section for information on how to operate and monitor many Bees at once.

## 2. Configure Bee

Bee is a versatile piece of software with diverse use cases. Before starting Bee for the first time you will need to configure it to suit your needs. The installation script should have generated a config file at
`/etc/bee/bee.yaml` populated by the default configuration for the Bee service. 

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


### Edit Default Config

To alter Bee's default configuration, simply edit the configuration file, and restart the node (default directory `/etc/bee/bee.yaml`). See the [configuration](/docs/working-with-bee/configuration#environment-variables) page for more details.

<Tabs
defaultValue="linux"
values={[
{label: 'Linux', value: 'linux'},
{label: 'MacOS', value: 'macos'},
]}>
<TabItem value="linux">

#### Linux

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

### Set Node Type

#### Full Node, Light Node, Ultra-light Node

See the [quick start guide](/docs/installation/quick-start) if you're not sure which type of node to run.

To run Bee as a full node `full-node` must be set to `true`.

```yaml
## bee.yaml
full-node: true
```

To run Bee as a light node `full-node` must be set to `false`.

```yaml
## bee.yaml
full-node: false
```

To run Bee as an ultra-light node `full-node` and `swap-enable` must both be set to `false`.

```yaml
## bee.yaml
full-node: false
swap-enable: false
```

### Set Blockchain RPC Endpoint

Full and light nodes require a Gnosis Chain RPC endpoint so they can interact with and deploy their chequebook contract, see the latest view of the current postage stamp batches, and interact with and top up postage stamp batches. A blockchain RPC endpoint is not required for nodes running in ultra-light mode.

We recommend you [run your own Gnosis Chain Node](https://docs.gnosischain.com/clients/gnosis-chain-node-openethereum-and-nethermind).

If you do not wish to sync your own nodes, and are willing to trust a third party, you may also consider using an RPC endpoint provider such as [GetBlock](https://getblock.io/).

By default, Bee expects a local Gnosis Chain node at `ws://localhost:8545`. To use a Gnosis Chain RPC provider instead, change your configuration to use the API endpoint URL they provide, for example:

```yaml
## bee.yaml
blockchain-rpc-endpoint: https://gno.getblock.io/mainnet/?api_key=b338ee33-b3e3-be33-bee5-b335b555b555
```

### NAT Address

Swarm is all about sharing and storing chunks of data. To enable other
Bees (also known as _peers_) to connect to your Bee, you must
broadcast your public IP address in order to ensure that Bee is reachable on
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
## bee.yaml
nat-addr: "123.123.123.123:1634"
```

#### Funding Your Chequebook (Optional)

You may select how much xBZZ to fund your wallet with. If you are happy to stay within the free usage limits initially, you may select `0`.

```yaml
## bee.yaml
swap-initial-deposit: 0
```

We recommend 1 BZZ as denominated in PLUR — `10000000000000000` — as a good starter amount, but you can start with more if you will be paying for a lot of interactions on the network.

#### ENS Resolution (Optional)

The [ENS](https://ens.domains/) domain resolution system is used to host websites on Bee, and in order to use this your Bee must be connected to a mainnet Ethereum blockchain node. We recommend you sign up to [Infura's](https://infura.io) API service and set your `--resolver-options` to `https://mainnet.infura.io/v3/your-api-key`.

```yaml
## bee.yaml
resolver-options: ["https://mainnet.infura.io/v3/<<your-api-key>>"]
```


## 3. Find Bee address

As part of the process of starting a Bee full node or light node the node must issue a Gnosis Chain transaction to set up its chequebook contract. Therefore before starting the node's address must be found so that the node can be funded.

1. Generate node keys by starting Bee service:

  <Tabs
  defaultValue="linux"
  values={[
  {label: 'Linux', value: 'linux'},
  {label: 'MacOS', value: 'macos'},
  ]}>
  <TabItem value="linux">

  #### Linux

  ```bash
  sudo systemctl start bee
  ```

  </TabItem>
  <TabItem value="macos">

  #### MacOS

  ```bash
  brew services start swarm-bee
  ```

  </TabItem>
  </Tabs>

  Running this command will start your node and generate a set of keys in the data directory at `/var/lib/bee`. The node will fail to start as it has not yet been funded.

1. Find your node address

  There are two methods for finding your node address:

    1. Review log messages:
      ```bash
      sudo journalctl --lines=100 --follow --unit bee
      ```
      The output should look like this:
      ![Get address](/img/get-address.png)

      Find the line which look like this:
         "time"="2023-03-23 21:10:50.761652" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x215693a6E6Cf0a27441075FD98c31d48E3a3a100

      The address shown there is the Gnosis Chain address for your node. Copy and save it for the next step.
    1. Read the address directly from key file (don't forget to replace `<user>` with your user name):
      ```bash
      sudo chown -R <user>:<user> /var/lib/bee # Give ownership to current user
      cat /var/lib/bee/keys/swarm.key # Read contents of key file
      sudo chown -R <user>:<user> /var/lib/bee # Return ownership to bee
      ``` 
      *Output from cat /var/lib/bee/keys/swarm.key*:

      ```bash    
      {"address":"215693a6e6cf0a27441075fd98c31d48e3a3a100","crypto":{"cipher":"aes-128-ctr","ciphertext":"9e2706f1ce135dde449af5c529e80d560fb73007f1edb1636efcf4572eed1265","cipherparams":{"iv":"64b6482b8e04881446d88f4f9003ec78"},"kdf":"scrypt","kdfparams":{"n":32768,"r":8,"p":1,"dklen":32,"salt":"3da537f2644274e3a90b1f6e1fbb722c32cbd06be56b8f55c2ff8fa7a522fb22"},"mac":"11b109b7267d28f332039768c4117b760deed626c16c9c1388103898158e583b"},"version":3,"id":"d4f7ee3e-21af-43de-880e-85b6f5fa7727"}
      ```
      The `address` field contains the Gnosis Chain address of the node, simply add the `0x` prefix.
      :::danger
        Do not share the contents of your `swarm.key` or any other kets with anyone, this example is for a throwaway account.
      :::
      
## 4. Fund Node

:::info
  We recommend not holding a high value of xBZZ or xDAI in your nodes' wallet. Please consider regularly removing accumulated funds. 
:::

Your Bee must deploy a chequebook contract to keep track of its exchanges with other Bees in the Swarm. To do that you must deposit xDAI and optionally [xBZZ](/docs/installation/fund-your-node).
 

Once you have determined your Bee's Ethereum address, [fund your
node](/docs/installation/fund-your-node) with xDAI and xBZZ

If too much time has elapsed, you may need to [restart your
node](#edit-config-file) at this point.

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

When first started, Bee must deploy a chequebook to the Gnosis Chain
blockchain, and sync the postage stamp batch store so that it can
check chunks for validity when storing or forwarding them. This can
take a while, so please be patient! Once this is complete, you will
see Bee starting to add peers and connect to the network.

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

:::info
While you are waiting for Bee to initalise, this is a great time to [back up your keys](/docs/working-with-bee/backups) so you can them safe.
:::


## 6. Check If Bee Is Working

Once Bee has been funded, the chequebook deployed, and postage stamp
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
on the Swarm network.

Welcome to the swarm! 🐝 🐝 🐝 🐝 🐝

## 7. Back up Keys

Once your node is up and running, make sure to [back up your keys](/docs/working-with-bee/backups). 

## Deposit Stake for Your Node

In order to start receiving rewards, you will need to [deposit xBZZ to the staking contract](/docs/working-with-bee/staking) for your node. To do this, send a minimum of 10 xBZZ to your nodes' wallet and run:

```bash
curl -XPOST localhost:1635/stake/100000000000000000
```

This will initiate a transaction on-chain which deposits the specified amount of xBZZ into the staking contract. 

Rewards are only available for full nodes which are providing storage capacity to the network.

