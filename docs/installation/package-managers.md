---
title: Package Managers
id: package-managers
---

Bee provides packages for installation of **Bee** and the [Bee Clef external signer](/docs/installation/bee-clef) using the **apt-get** and **yum** managers for Debian and CentOS based Linux distributions.

Although it is possible to use Bee without Bee Clef, it is advised to use the external signer to keep the keys your Bee node uses to interact with the Ethereum blockchain safe. 

```warning
Clef will create a new Ethereum key pair for you during installation. Make sure you keep a [backup](/docs/maintainance/backups) of your key pair somewhere safe and secure!
```

## Install Bee Clef

Before installing Bee, you may install the Bee clef package. This will set up a Bee-specific instance of the Go-Ethereum Clef signer which will be integrated with your Bee node.

### Ubuntu / Raspbian / Debian

#### AMD64

```sh
wget https://github.com/ethersphere/bee-clef/releases/download/v0.3.2/bee-clef_0.3.2_amd64.deb
sudo dpkg -i bee-clef_0.3.2_amd64.deb
```

#### ARM (Raspberry Pi)

```sh
wget https://github.com/ethersphere/bee-clef/releases/download/v0.3.2/bee-clef_0.3.2_armv7.deb
sudo dpkg -i bee-clef_0.3.2_armv7.deb
```

### CentOS

#### AMD64

```sh
wget https://github.com/ethersphere/bee-clef/releases/download/v0.3.2/bee-clef_0.3.2_amd64.rpm
sudo yum localinstall bee-clef_0.3.2_amd64.rpm
```

#### ARM (Raspberry Pi)

```sh
wget https://github.com/ethersphere/bee-clef/releases/download/v0.3.2/bee-clef_0.3.2_armv7.rpm
sudo yum localinstall bee-clef_0.3.2_armv7.rpm
```

## Interact With Clef

Once Clef has been installed, it will begin running as a service using `systemd`.

To check Clef is running ok, we may use `systemctl` to query the status of the `bee-clef` service.

```sh
systemctl status bee-clef
```

```
● bee-clef.service - Bee Clef
     Loaded: loaded (/lib/systemd/system/bee-clef.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2020-11-20 23:45:16 GMT; 1min 29s ago
```

## Install Bee

To install Bee itself, simply choose the appropriate command from the ones below. This will set up Bee and start running it in the background as a service on your computer.

### Ubuntu / Raspbian / Debian

#### AMD

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.4.0/bee_0.4.0_amd64.deb
sudo dpkg -i bee_0.4.0_amd64.deb
```

#### ARM (Raspberry Pi)

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.4.0/bee_0.4.0_armv7.deb
sudo dpkg -i bee_0.4.0_armv7.deb
```

SWAP is enabled by default, during instalation you will be asked to set ethereum endpoint and if you want to enable clef support (if you enable it make sure that you have bee-clef running already).

### CentOS

#### AMD64

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.4.0/bee_0.4.0_amd64.rpm
sudo dpkg -i bee_0.4.0_amd64.rpm
```

#### ARM (Raspberry Pi)

```sh
wget https://github.com/ethersphere/bee/releases/download/v0.4.0/bee_0.4.0_armv7.rpm
sudo dpkg -i bee_0.4.0_armv7.rpm
```

When installed service will be stopped.
SWAP is enabled by default, set ethereum endpoint `swap-endpoint` and enable clef support `clef-signer-enable` (if you enable it make sure that you have bee-clef running already) inside `/etc/bee/bee.yaml` and start the service `systemctl start bee`.

## Interact With Bee

Once Bee has been installed, it will begin running as a service using `systemd` and the [APIs](/docs/api-reference/api-reference) will be available at `localhost:1633` and `localhost:1365`.

```sh
curl localhost:1633
```

```
Ethereum Swarm Bee
```

We can manage the Bee service using `systemctl`.

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
journalctl -f -u bee
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

When a Bee node is initialised for the first time with a new key, it will need to be funded with both gBZZ and GETH (Goerli BZZ and Goerli ETH). Swarm incentives are currently running on the Goerli testnet and tokens are availiable from the [Swarm faucet](https://faucet.ethswarm.org).

We can find our our Bee node's Ethereum address either from the logs, as above, or by sending a request to our Bee node's *addresses* debug API endpoint.

```sh
curl -s localhost:1635/addresses | jq .ethereum
```

```
"0x97a472ff3a28a2e93ef4d2f523ff48e39c4bf579"
```

Visit [https://faucet.ethswarm.org](https://faucet.ethswarm.org) and fill out the form to receive your initial supply of gBZZ and GETH.

Once this has been credited, we can watch our logs and watch as Bee automatically deploys a chequebook and makes an initial deposit.

```sh
journalctl -f -u bee
```

Once this is complete, we should start to see our Bee node connect to other nodes in the network as it begins to take part in the swarm.

```
...
Nov 20 23:52:44 sig-ln bee[55528]: time="2020-11-20T23:52:44Z" level=info msg="greeting <Welcome to the Swarm, you are Bee-ing connected!> from peer: a0c8fb41346b877b87e7aa31b109a9eef1f38f476304631f4962407b732e3db0"
...
```

If these messages are missing, check out our comprehensive guide to Bee [connectivity](/docs/installation/connectivity).

## Updates

Your Bee and Bee-clef installations can be updated by repeating the install steps above. Bee sure to [backup](/docs/maintenance/backups) your clef key material and Bee data before applying updates.

## Uninstalling Bee

If you need to remove Bee, you may simply run the below commands.

### Ubuntu / Debian / Raspbian

To uninstall bee run

```sh
sudo apt-get remove bee
sudo apt-get remove bee-clef
```

**WARNING**
To remove all bee data and bee user, keys included run

```sh
sudo apt-get purge bee
sudo apt-get purge bee-clef
```

### Centos

To uninstall bee run
**WARNING**
You will delete all the data and keys.

```sh
sudo yum remove bee
sudo yum remove bee-clef
```

## Data Location

### Bee-clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`