---
title: Upgrading Bee
id: upgrading-bee
---

Keep a close eye on the[#bee-node-updates](https://discord.gg/vQcngMzZ9c) channel in our [Discord Server](https://discord.gg/wdghaQsGq5) for information on the latest software updates for Bee. It's very important to keep Bee up to date to benefit from security updates and ensure you are able to properly interact with the Swarm network. The [#node-operators](https://discord.com/channels/799027393297514537/811553590170353685) channel is another excellent resource for any of your questions regarding node operation. 

## Upgrade Procedure Warnings

:::warning
Bee sure to [back up](/docs/bee/working-with-bee/backups) your keys and [cash out your cheques](/docs/bee/working-with-bee/cashing-out) to ensure your xBZZ is safe before applying updates.
:::

:::warning
Nodes should not be shut down or updated in the middle of a round they are playing in as it may cause them to lose out on winnings or become frozen. To see if your node is playing the current round, check if `lastPlayedRound` equals `round` in the output from the [`/redistributionstate` endpoint](/debug-api/#tag/RedistributionState/paths/~1redistributionstate/get). See [staking section](/docs/bee/working-with-bee/staking/) for more information on staking and troubleshooting.
:::


### Ubuntu / Debian 

To upgrade Bee, first stop the Bee service: 

```bash
sudo systemctl stop bee
```

Next, upgrade the `bee` package:

```bash
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
Preparing to unpack .../archives/bee_1.17.5_amd64.deb ...
Unpacking bee (1.17.5) over (1.17.3) ...
Setting up bee (1.17.5) ...
Installing new version of config file /etc/default/bee ...
```

Make sure to pay attention to any prompts, read them carefully, and respond to them with your preference.

You may now start your node again:

```bash
sudo systemctl start bee
```

#### Manual Installations

To upgrade your manual installation, simply stop Bee, replace the Bee binary and restart.

#### Docker

To upgrade your Docker installation, simply increment the version number in your configuration and restart.

