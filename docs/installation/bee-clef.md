---
title: Clef External Signer
id: bee-clef
---

Bee makes use of Go Ethereum's external signer, [Clef](https://geth.ethereum.org/docs/clef/tutorial).

Because Bee must sign a lot of transactions automatically and quickly, a [Bee specific version of Clef, Bee-clef](https://github.com/ethersphere/bee-clef) has been packaged which includes all the relevant configuration and implements the specific configuration needed to make Clef work with Bee.

:::caution
Clef will create a new Ethereum key pair for you during installation. Make sure you keep a [backup](/docs/maintainance/backups) of your key pair somewhere safe and secure!
:::

## Packages

Bee clef can be installed automatically using your system's package manager.

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

### Interact With Clef

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

## Data Locations

### Bee-clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

## Manual Installation

To install Clef manually, first retrieve the relevant Clef binary from Ethereum's [Geth & Tools](https://geth.ethereum.org/downloads/) download page, or build directly from the [source](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum).

Because Bee needs Clef to sign many transactions automatically, we must run Clef as a service with relaxed permissions and rules set. To ensure Clef only signs transactions from Bee, we must protect the `clef.ipc` file by **creating a Bee user and setting permissions so that it is only possible for this user to make use of the ipc socket.**

Additionally, Clef requires transaction signatures for the Bee's chequebook interaction.

A shell script automating the post-initialisation permission changing and including the Clef config, `clef-service`, as well as the `4byte.json` transaction signature file and `rules.js` file can all be found in the [Bee-clef repository](https://github.com/ethersphere/bee-clef/tree/master/packaging).

Finally, once Clef is running, simply [configure your Bee node](/docs/installation/configuration) to enable Clef using `--clef-signer-enable` and point Bee to the correct ipc socket using `--clef-signer-endpoint`.

