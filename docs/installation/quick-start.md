---
title: Quick Start
id: quick-start
---

Bee is packaged for MacOS and Ubuntu, Raspbian, Debian and CentOS based Linux distributions.

If your system is not supported, please see the [manual installation](/docs/installation/manual) section for information on how to install Bee.

The overview of the installation process:
 1. (Recommended) set up an external signer for Bee (i.e. install *bee-clef*)
 2. install the Bee application package
 3. [fund your node](/docs/installation/quick-start#fund-your-node) with gETH and gBZZ

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
INFO[2021-02-09T18:55:11Z] swarm public key 03379f7aa673b7f03737064fd23ba1453619924a4602e70bbccc133ba67d0968bd
DEBU[2021-02-09T18:55:11Z] using existing libp2p key
DEBU[2021-02-09T18:55:11Z] using existing pss key
INFO[2021-02-09T18:55:11Z] pss public key 03bae655ce94431e1f2c2de8d017f88c8c5c293ef0057379223084aba9e318596e
INFO[2021-02-09T18:55:11Z] using ethereum address 99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a
INFO[2021-02-09T18:55:14Z] using default factory address for chain id 5: f0277caffea72734853b834afc9892461ea18474
INFO[2021-02-09T18:55:14Z] no chequebook found, deploying new one.
WARN[2021-02-09T18:55:15Z] cannot continue until there is sufficient ETH (for Gas) and at least 10 BZZ available on 99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a
WARN[2021-02-09T18:55:15Z] get your Goerli ETH and Goerli BZZ now via the bzzaar at https://bzz.ethswarm.org/?transaction=buy&amount=10&slippage=30&receiver=0x99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a

```

### MacOS

Services are managed using Homebrew services.

```sh
brew services restart swarm-bee
```

Logs are available at `/usr/local/var/log/swarm-bee/bee.log`

```sh
tail -f /usr/local/var/log/swarm-bee/bee.log
```

### Fund Your Node

A SWAP enabled Bee node requires both gETH and gBZZ to begin
operation. The current version of Swarm incentives is running on the
Ethereum Goerli testnet. To acquire free gBZZ tokens
visit the [Bzzaar](https://bzz.ethswarm.org) and follow the following steps!

#### 1. Find your Bee node's address.

To find a Bee node's Ethereum address you can:
 - look into its logs (see above),
 - use the handy `bee-get-addr` utility,

```sh
bee-get-addr
```

```
WARN[2021-02-09T18:55:15Z] get your Goerli ETH and Goerli BZZ now via the bzzaar at https://bzz.ethswarm.org/?transaction=buy&amount=10&slippage=30&receiver=0x99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a
```

```sh
curl -s localhost:1635/addresses | jq .ethereum
```

 - send a request to our Bee node's
   [debug API](/docs/api-reference/api-reference) endpoint
   called  *addresses*.

```json
"0x97a472ff3a28a2e93ef4d2f523ff48e39c4bf579"
```

#### 2. Come to the [Bzzaar](https://bzz.ethswarm.org) and buy some gBZZ! 

*You can get to the Bzzaar by navigating to the link shown in your logs. It should look something like this, note that the Ethereum address of your node is prefilled in the `receiver` query parameter.*

`https://bzz.ethswarm.org/?transaction=buy&amount=10&slippage=30&receiver=0xbee467355...`

*Make sure that your Bee node's correct address is displayed above the transaction modal.*

`You are minting to receiver - 0xbee467355...`

#### 3. Connect your wallet, we recommend [Metamask](https://metamask.io/) or [Portis](https://www.portis.io/). 

#### 3. Click the `GET G-ETH` button in the bottom left hand corner of your screen.

#### 4. Wait for the Goerli ETH to arrive in your wallet.

*We will send a small amount of gETH to both your connected wallet, and your Bee's wallet!*

*This can take a couple of minutes, check the [faucet address on Etherscan](https://goerli.etherscan.io/address/0x44f9fda7a5bf504ddf16dd37b8411c3fba34461d) and look for the transactions to your addresses.*

*You may need to reconnect your wallet to see your balance increase once the transaction has completed.*

#### 5. Once you have balance, enter at least 10 in the `gBZZ` field, you may even have enough gETH to buy a little more!

*This is another blockchain transaction, minutes check Metamask to see how your transaction is getting on.*

#### 6. When your transaction is complete, your Bee node should be the proud owner of some freshly minted gBZZ!	

#### 7. Check your Bee node, it should now begin deploying your checkbook contract.

*If your node has stopped polling for updates, you may now need to restart it.*

Once your Bee node is fully loaded with gBZZ, we can now watch our logs and watch as Bee automatically deploys a chequebook and makes an initial deposit.

```sh
journalctl --lines=100 --follow --unit bee
```

Once this is complete, we should start to see our Bee node connect to other nodes in the network as it begins to take part in the swarm.

```
...
Nov 20 23:52:44 sig-ln bee[55528]: time="2020-11-20T23:52:44Z" level=info msg="greeting <Welcome to the Swarm, you are Bee-ing connected!> from peer: a0c8fb41346b877b87e7aa31b109a9eef1f38f476304631f4962407b732e3db0"
...
```

:::info
The Bzzaar is brand new. If you have any issues, please [get in touch](/docs/#community) and let us know! You may also visit our legacy Goerli faucet at [https://faucet.ethswarm.org](https://faucet.ethswarm.org) and fill out the form with your Bee node's address to receive your nodes initial supply of gBZZ and GETH.
:::

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
