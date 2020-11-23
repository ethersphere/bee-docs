---
title: Quick Start
id: quick-start
---

Bee is packaged for Ubuntu, Raspbian, Debian and CentOS based Linux distributions, and also for MacOS using Homebrew.

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

## Install Bee Clef

Before installing Bee, it is recommended that you first [install the Bee clef package](/docs/installation/bee-clef). This will set up a Bee specific instance of the Go-Ethereum Clef signer which will be integrated with your Bee node.

:::info
While it is not necessary that node operators make use of Go Ethereum's Clef external signer to manage your Ethereum key pair. The following instructions include and integrate Bee-clef alongside Bee to help keep your keys safe!
:::

## Install Bee

To install Bee itself, simply choose the appropriate command from the ones below. This will set up Bee and start running it in the background as a service on your computer.

### Ubuntu / Raspbian / Debian

#### AMD

```sh
wget '...'
sudo dpkg -i bee_0.4.0_amd64.deb
```

#### ARM (Raspberry Pi)

```sh
wget '...'
sudo dpkg -i bee_0.4.0_arm.deb
```

### CentOS

#### AMD64

```sh
wget '...'
sudo yum localinstall bee-clef_0.3.0_amd64.rpm
```

#### ARM (Raspberry Pi)

```sh
wget '...'
sudo yum localinstall bee_0.4.0_arm.rpm
```

## Interact With Bee

Once Bee has been installed, it will begin running as a service using `systemd` and the [API](/docs/api-reference/api-reference) will be available at `localhost:1633`.

```sh
curl localhost:1633
```

```
Ethereum Swarm Bee
```

We can now manage the Bee service using `systemctl`.

```sh
systemctl status bee
```

```
● bee.service - Bee - Ethereum Swarm node
     Loaded: loaded (/lib/systemd/system/bee.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2020-11-20 23:50:15 GMT; 6s ago
```

Logs are available using the `journalctl` command.

```sh
journalctl -u bee -f
```

```text
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="using swarm network address through clef: 2c24e02f26f7fdd8c5c3>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="swarm public key 0269fb8085bf4ac07a5f5050d7a5104a8e623e5379f64>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="pss public key 02f32c79a2f314afd3263e3cf9478b076acf211be1bfd88>
Nov 20 23:50:17 sig-ln bee[55528]: time="2020-11-20T23:50:17Z" level=info msg="using ethereum address 06c5aefd35d85028d65554660f353defa5ba989>
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=info msg="using default factory address for chain id 5: a6b88705036f2a56>
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=info msg="no chequebook found, deploying new one."
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=warning msg="please make sure there is sufficient eth and bzz available >
Nov 20 23:50:18 sig-ln bee[55528]: time="2020-11-20T23:50:18Z" level=warning msg="on goerli you can get both goerli eth and goerli bzz from h>
```

### Fund Your Node

When a Bee node is initialised with a new key, it will need to be funded with both gBZZ and GETH (Goerli BZZ and Goerli ETH). Swarm incentives are currently running on the Goerli testnet and tokens are availiable from the [Swarm faucet](https://faucet.ethswarm.org).

We can find our our Bee node's Ethereum address either from the logs, as above, or by sending a request to our Bee node's *addresses* [debug API](/docs/api-reference/api-reference) endpoint.

:::info
For a new installation of Bee, the debug API endpoint is not yet exposed for security reasons. To enable the debug API endpoints, set `debug-api-enable` to `true` in your [configuration file](http://localhost:3000/docs/installation/configuration#configuring-bee-installed-using-a-package-manager) and restart your Bee service.
:::

```sh
curl -s localhost:1635/addresses | jq .ethereum
```

```
"0x97a472ff3a28a2e93ef4d2f523ff48e39c4bf579"
```

Visit [https://faucet.ethswarm.org](https://faucet.ethswarm.org) and fill out the form to receive your initial supply of gBZZ and GETH.

Once this has been credited, we can now watch our logs and watch as Bee automatically deploys a chequebook and makes an initial deposit.

```sh
journalctl -u bee -f
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

:::danger
Uninstalling Bee will also delete Bee and Bee-clef data! Make sure you [make backups]() so you don't lose your keys and data.
:::

### Ubuntu / Debian / Raspbian

```sh
sudo apt-get remove --purge bee
sudo apt-get remove --purge bee-clef
```

### Centos

```sh

```

## Data Locations

### Bee-clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`

