---
title: Upgrading Bee
id: upgrading-bee
---

Keep a close eye on the
[#bee-node-updates](https://discord.gg/vQcngMzZ9c) channel in our
[Discord Server](https://discord.gg/wdghaQsGq5) for information on the
latest software updates for Bee. It's very important to keep Bee up to
date to benefit from security updates and ensure you are able to
properly interact with the swarm.

## Upgrade Procedure

:::warning
Bee sure to [back up](/docs/bee/working-with-bee/backups) your clef key material and [cash out your cheques](/docs/bee/working-with-bee/cashing-out) to make sure your xBZZ is safe before applying updates.
:::

### Ubuntu / Debian / Raspbian

To upgrade Bee, simply stop the Bee and Bee Clef services.

```sh
sudo systemctl stop bee
sudo systemctl stop bee-clef
```

Now follow the [installation instructions](/docs/bee/installation/install) to download the new package and install the new version, as you would during a new installation.

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

You may now start your node again, waiting for bee-clef to initialise before starting Bee.

```sh
sudo systemctl start bee-clef
sleep 30
sudo systemctl start bee
```

#### Manual Installations

To upgrade your manual installation, simply stop Bee, replace the Bee binary and restart.

#### Docker

To upgrade your docker installation, simply increment the version number in your configurations and restart.

### Upgrading from a mainnet v1.5.x series to a mainnet v1.6.x series

Bee v1.6.x contains a completely new data storage format called Sharky.

As part of these changes, existing data must be migrated to the new data structure expected by
the 1.5.x client. This will happen automatically, but **may require extra space** and cause a spike in cpu requirements for the duration of the migration.

If you can not accommodate approximately 3x (2x might even be enough) as much disk space as is currently being used by your Bee `datadir`, you may want to run `bee db nuke` before upgrading (but after stopping the Bee service) to resync your nodes content from the network. If you have **locally pinned content** please ensure you have a local backup so that you can restamp and restore it to the network in case of disaster.
