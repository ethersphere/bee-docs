---
title: Upgrading Bee
id: upgrading-bee
description: Procedures for safely upgrading Bee to latest versions while preserving keys avoiding round disruption and cashing out rewards.
---

It's very important to keep Bee up to date to benefit from security updates and ensure you are able to properly interact with the Swarm network. The [#node-operators](https://discord.com/channels/799027393297514537/811553590170353685) channel is an excellent resource for any of your questions regarding node operation. 

:::warning
Bee sure to [back up](./backups.md) your keys and [cash out your cheques](./cashing-out.md) to ensure your xBZZ is safe before applying updates.
:::

:::warning
Nodes should not be shut down or updated in the middle of a round they are playing in as it may cause them to lose out on winnings or become frozen. To see if your node is playing the current round, check if `lastPlayedRound` equals `round` in the output from the [`/redistributionstate` endpoint](/api/#tag/RedistributionState/paths/~1redistributionstate/get). See [staking section](./staking.md) for more information on staking and troubleshooting.
:::


## Version compatibility and upgrade path

The Swarm network has a **minimum supported Bee version**.
It is currently **v2.8.0**, the release which introduced a breaking p2p protocol change, so nodes running an older protocol can no longer connect to the network.

When upgrading across a breaking protocol change, do not skip the release that introduced it.
Upgrade *through* that version so any one-time data migrations run while they still exist in the code, since Bee removes old migration and compatibility code once a version is no longer supported.

Bee v2.8.1 is **non-disruptive for nodes already on v2.8.0**: it makes no breaking p2p protocol changes, so you can upgrade in place using the steps below.

:::warning
**If you are running Bee v2.6.0 or older:** Bee v2.8.1 removes the last of the v2.6.0 backward-compatibility code, so you cannot upgrade to it directly.
Either upgrade stepwise (**v2.6.0 → v2.8.0 → v2.8.1**) so the data migrations run, or reinstall the node fresh on v2.8.1.
:::


### Ubuntu / Debian 

To upgrade Bee, first stop the Bee service: 

```bash
sudo systemctl stop bee
```

Next, upgrade the `bee` package:

```bash
sudo apt-get update
sudo apt-get upgrade bee
```

And will see output like this after a successful upgrade:
```
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
The following packages will be upgraded:
  bee
1 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 0 B/27.2 MB of archives.
After this operation, 73.7 kB of additional disk space will be used.
Do you want to continue? [Y/n] Y
(Reading database ... 103686 files and directories currently installed.)
Preparing to unpack .../archives/bee_2.0.0_amd64.deb ...
Unpacking bee (2.0.0) over (1.17.3) ...
Setting up bee (2.0.0) ...
Installing new version of config file /etc/default/bee ...
```

Make sure to pay attention to any prompts, read them carefully, and respond to them with your preference.

You may now start your node again:

```bash
sudo systemctl start bee
```

### Manual Installations

To upgrade your manual installation, simply stop Bee, replace the Bee binary and restart.

### Docker

To upgrade your Docker installation, simply increment the version number in your configuration and restart.

