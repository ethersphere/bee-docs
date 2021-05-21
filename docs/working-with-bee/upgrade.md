---
title: Upgrading Bee
id: upgrading-bee
---

Keep a close eye on the [#bee-node-updates](https://discord.gg/vQcngMzZ9c) channel in our [Discord Server](https://discord.gg/wdghaQsGq5) for information on the latest software updates for Bee. It's very important to keep Bee up to date to benefit from security updates and ensure you are able to properly interact with the swarm. 

:::warning
Bee sure to [backup](/docs/working-with-bee/backups) your clef key material and [cashout your cheques](/docs/working-with-bee/cashing-out) to make sure your gBZZs are safe before applying updates.
:::


### Upgrading from 0.5.x Series to 0.6.x

Bee 0.6.0 contains a few breaking changes which mean a database migration must take place. We also intoduce [postage stamps](/docs/access-the-swarm/keep-your-data-alive) which must be attached to chunks of data so that they will be retained in the Swarm network.

:::info
Please take note that nodes which deployed their chequebook with bee v0.5.0 will have to be started with the --transaction TXHASH flag where TXHASH is any Ethereum transaction on goerli network sent from the bee node's Ethereum address. The hash of the chequebook deployment transaction can be used for this and can be looked up on etherscan. For nodes which first started with v0.5.1 or higher no action is necessary, as their chequebook deployment transaction will be automatically picked-up by the Bee node. 
:::

As part of these changes, if you have any **locally pinned content**, this must be manually migrated to the new data structure expected by the network of 0.6.0 clients, see below for information on how to proceed. 

If you *do not* have any locally pinned content, your migration will be automatic and your update will proceed as normal.

To check if a 0.5.x has pinned content, query the `pin` api endpoint as follows:

```bash
curl -s localhost:1633/pin/chunks | jq ".chunks | length"
```

```
100
```

If any non-zero values are returned, **you must** complete the manual migration procedure, automatic migration will be prevented and *you must* follow the Manual Migration Procedure detailed further down the page.

#### Automatic Migration Procedure

To update **without pinned content:**

1. Optionally, [cashout your node's cheques](/docs/working-with-bee/cashing-out) to make sure your gBZZs are safe. If you have cashed out recently, you can skip this step.
2. [Backup your Bee](/docs/working-with-bee/backups) data, especially your keys folder!
3. Upgrade your node, as you normally would (see below).
4. Adjust your configuration. Several configuration parameters have changed in 0.6.x - If you wish to continue running as a full node, you must set the new `full-node` flag to `true`. check out the [configuration](/docs/working-with-bee/configuration) guide for more info on how to update your configuration.
5. Restart your node.

Your Bee should start up as normal, and begin to connect to other Bees that are running Bee 0.6.0 or later.

#### Manual Migration Procedure

1. [Cashout your node](/docs/working-with-bee/cashing-out) to make sure your gBZZs are safe. If you have cashed out recently, you can skip this step.
2. [Backup your Bee](/docs/working-with-bee/backups) data, especially your keys folder!
3. If you have pinned data, Download all your pinned data. Please use these to download all your data ready for re-upload with [postage stamps](/docs/working-with-bee/keep-your-data-alive).
4. Carefully, delete your `localstorage` folder **only**. *DO NOT DELETE* your `keys` or `statestore` folder. Your `localstorage` folder can be located by consulting your Bee's `data-dir` configuration parameter. If you are using Docker, please delete just the contents of the folder.
5. Upgrade your node, as you normally would (see below).
6. Adjust your configuration. Several configuration parameters have changed in 0.6.x - If you wish to continue running as a full node, you must set the new `full-node` flag to `true`. check out the [configuration](/docs/working-with-bee/configuration) guide for more info on how to update your configuration.
7. Restart your node.

Your Bee should start up as normal, and begin to connect to other Bees that are running Bee 0.6.0 or later.

## Upgrade Procedure

### Ubuntu / Debian / Raspbian

To upgrade Bee, simply stop the Bee service.

```sh
sudo systemctl stop bee
```

Now follow the [installation instructions](/docs/installation/install) to download the new package and install the new version, as you would during a new installation.

You will be greeted by the following prompt:

```
Configuration file '/etc/bee/bee.yaml'
 ==> Modified (by you or by a script) since installation.
 ==> Package distributor has shipped an updated version.
   What would you like to do about it ?  Your options are:
    Y or I  : install the package maintainer's version
    N or O  : keep your currently-installed version
      D     : show the differences between the versions
      Z     : start a shell to examine the situation
 The default action is to keep your current version.
*** bee.yaml (Y/I/N/O/D/Z) [default=N] ?
```

Select `N` to keep your current data and keys.

You may now start your node again.

```sh
sudo systemctl start bee
```

#### Manual Installations

To upgrade your manual installation, simply stop Bee, replace the Bee binary and restart.

#### Docker

To upgrade your docker installation, simply increment the version number in your configurations and restart.