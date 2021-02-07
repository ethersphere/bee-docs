---
title: Quick Start
id: quick-start
---

Bee is packaged for MacOS and Ubuntu, Raspbian, Debian and CentOS based Linux distributions.

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

The overview of the installation process:
 1. (Recommended) set up an external signer for Bee (i.e. install *bee-clef*)
 2. install the Bee application package
 3. fund your node with gETH and gBZZ

## Install Bee Clef

Before installing Bee, it is recommended that you first [install the Bee clef package](/docs/installation/bee-clef). This will set up a Bee specific instance of the Go-Ethereum Clef signer which will be integrated with your Bee node.

:::info
While it is not necessary that node operators make use of Go Ethereum's Clef external signer to manage your Ethereum key pair. The following instructions include and integrate Bee-clef alongside Bee to help keep your keys safe!
:::

## Install Bee

To install Bee itself, simply choose the appropriate command from the ones below. This will set up Bee and start running it in the background as a service on your computer.

:::info
Follow post install guide in terminal for initial configuration and how to start `bee`.
:::

### Ubuntu / Raspbian / Debian

#### AMD64

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_amd64.deb
sudo dpkg -i bee_0.5.0_amd64.deb
```

#### ARM (Raspberry Pi)

##### ARMv7

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_armv7.deb
sudo dpkg -i bee_0.5.0_armv7.deb
```

##### ARM64

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_arm64.deb
sudo dpkg -i bee_0.5.0_arm64.deb
```

### CentOS

#### AMD64

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_amd64.rpm
sudo rpm -i bee_0.5.0_amd64.rpm
```

#### ARM (Raspberry Pi)

##### ARMv7

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_armv7.rpm
sudo rpm -i bee_0.5.0_armv7.rpm
```

##### ARM64

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.5.0/bee_0.5.0_arm64.rpm
sudo rpm -i bee_0.5.0_arm64.rpm
```

### MacOS

```sh
brew tap ethersphere/tap
brew install swarm-bee
```

To run Bee as a service now and on startup, run:

```sh
brew services start swarm-bee
```

## SWAP Blockchain Endpoint

Your Bee node must have access to the Ethereum blockchain, so that it
can interact and deploy your chequebook contract. You can run your
[own Goerli node](https://github.com/goerli/testnet), or use a
provider such as [rpc.slock.it/goerli](https://rpc.slock.it/goerli) or
[Infura](https://infura.io/).

By default, Bee expects a local Goerli node at `http://localhost:8545`. To use a provider instead, simply change your `--swap-endpoint` in your [configuration file](/docs/installation/configuration#configuring-bee-installed-using-a-package-manager).

## Interact With Bee

Once Bee has been installed, it will start up as a `systemd` service,
and once it has been funded, its HTTP based
[API](/docs/api-reference/api-reference) will start listening at
`localhost:1633`.

```sh
curl localhost:1633
```

```
Ethereum Swarm Bee
```

### Linux

We can now manage the Bee service using `systemctl`.

```sh
systemctl status bee
```

```
● bee.service - Bee - Ethereum Swarm node
     Loaded: loaded (/lib/systemd/system/bee.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2020-11-20 23:50:15 GMT; 6s ago
```

Logs are available using the `journalctl` command:

```sh
journalctl --lines=100 --follow --unit bee
```

```text
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="using swarm network address through clef: 2c24e02f26f7fdd8c5c3>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="swarm public key 0269fb8085bf4ac07a5f5050d7a5104a8e623e5379f64>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="pss public key 02f32c79a2f314afd3263e3cf9478b076acf211be1bfd88>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="using ethereum address 06c5aefd35d85028d65554660f353defa5ba989>
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=info msg="using default factory address for chain id 5: a6b88705036f2a56>
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=info msg="no chequebook found, deploying new one."
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=warning msg="please make sure there is sufficient eth and bzz available >
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=warning msg="on goerli you can get both goerli eth and goerli bzz from https://faucet.ethswarm.org?address=06c5aefd35d85028d65554660f353defa5ba989>

```

### MacOS

Services are managed using Homebrew services.

```sh
brew services restart bee
```

Logs are available at `/usr/local/var/log/swarm-bee/bee.log`

```sh
tail -f /usr/local/var/log/swarm-bee/bee.log
```

### Fund Your Node

A SWAP enabled Bee node requires both ETH and BZZ to begin
operation. The current version of Swarm incentives is running on the
Ethereum testnet called Goerli. You can acquire free Goerli tokens
from the [Swarm faucet](https://faucet.ethswarm.org).

To find a Bee node's Ethereum address you can:
 - look into its logs (see above),
 - use the handy `bee-get-addr` utility,
 - send a request to our Bee node's
   [debug API](/docs/api-reference/api-reference) endpoint
   called  *addresses*.

```sh
bee-get-addr
```

```
Please make sure there is sufficient eth and bzz available on 06c5aefd35d85028d65554660f353defa5ba989 address.
You can get both goerli eth and goerli bzz from https://faucet.ethswarm.org
```

:::info
For a new installation of Bee, the debug API endpoint is not yet exposed for security reasons. To enable the debug API endpoints, set `debug-api-enable` to `true` in your [configuration file](/docs/installation/configuration#configuring-bee-installed-using-a-package-manager) and restart your Bee service.
:::

```sh
curl -s localhost:1635/addresses | jq .ethereum
```

```json
"0x97a472ff3a28a2e93ef4d2f523ff48e39c4bf579"
```

Visit [https://faucet.ethswarm.org](https://faucet.ethswarm.org) and fill out the form to receive your initial supply of gBZZ and GETH.

Once this has been credited, we can now watch our logs and watch as Bee automatically deploys a chequebook and makes an initial deposit.

```sh
journalctl --lines=100 --follow --unit bee
```

Once this is complete, we should start to see our Bee node connect to other nodes in the network as it begins to take part in the swarm.

```
...
Nov 20 23:52:44 sig-ln bee[55528]: time="2020-11-20T23:52:44Z" level=info msg="greeting <Welcome to the Swarm, you are Bee-ing connected!> from peer: a0c8fb41346b877b87e7aa31b109a9eef1f38f476304631f4962407b732e3db0"
...
```

If these messages are missing, check out our comprehensive guide to Bee [connectivity](/docs/installation/connectivity).

## Updating Bee

Your Bee and Bee-clef installations can be updated by repeating the install steps above. Bee sure to [backup](/docs/maintenance/backups) your clef key material and Bee data before applying updates.

## Uninstalling Bee

If you need to remove Bee, you may simply run the below commands.

### Ubuntu / Debian / Raspbian

:::danger
Uninstalling Bee will also delete Bee and Bee-clef data! Make sure you [make backups](/docs/maintenance/backups) so you don't lose your keys and data.
:::

```sh
sudo apt-get remove bee
sudo apt-get remove bee-clef
```

### Centos

:::danger
Uninstalling Bee will also delete Bee and Bee-clef data! Make sure you [make backups](/docs/maintenance/backups) so you don't lose your keys and data.
:::

```sh
sudo yum remove bee
sudo yum remove bee-clef
```


## Data Locations

### Bee-clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`
