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
From Bee v2.8.3, you can [pause redistribution participation](./staking.md#pause-redistribution-participation) to find a safe moment to shut down.
:::


## Version compatibility and upgrade path

The Swarm network has a **minimum supported Bee version**.
The minimum supported version is currently **v2.8.0**, the release that introduced a breaking p2p protocol change, so nodes running an older protocol can no longer connect to the network.

When upgrading across a breaking protocol change, do not skip the release that introduced it.
Upgrade *through* that version so any one-time data migrations run while they still exist in the code, since Bee removes old migration and compatibility code once a version is no longer supported.

Bee v2.8.3 is **non-disruptive for nodes already on v2.8.0, v2.8.1, or v2.8.2**: it makes no breaking p2p protocol changes, so you can upgrade in place using the steps below.

:::warning
**If you are running Bee v2.6.0 or older:** Bee v2.8.1 removed the last of the v2.6.0 backward-compatibility code, so you cannot upgrade directly to v2.8.1 or later.
Either upgrade stepwise (**v2.6.0 → v2.8.0 → v2.8.3**) so the data migrations run, or reinstall the node fresh on v2.8.3.
:::

:::info
If you are upgrading from v2.8.1 or older with tracing enabled, note that Bee v2.8.2 replaced Jaeger/OpenTracing with OpenTelemetry (OTLP export).
Point `tracing-endpoint` at an OTLP-capable collector before upgrading, and review the new tracing options in the [v2.8.2 release notes](https://github.com/ethersphere/bee/releases/tag/v2.8.2).
With tracing disabled, nothing changes.
:::

:::info
Bee v2.8.3 includes these changes that may affect your setup:

- **One-time reserve migration:** On first start, full nodes re-verify stored chunks that are not content-addressed and remove any that are invalid.
- **ACT on `/chunks` and `/soc`:** These endpoints no longer accept the `Swarm-Act` header. Use `/bzz` or `/bytes` for ACT uploads (see [Access Control](./../../develop/access-control.md)).
- **Connection metrics:** `bee_libp2p_created_connection_count` and `bee_libp2p_handled_connection_count` now have `transport` and `public` labels. Update dashboards that use `count(...)` on these metrics to use `sum by (...)` instead.
- **Gas limit fallback:** The `gas-limit-fallback` default has increased from 500000 to 900000.
- **Postage sync:** The new [`postage-sync-block-range`](./configuration.md#postage-sync-block-range) option limits each postage log request to 1000 blocks by default.

See the [v2.8.3 release notes](https://github.com/ethersphere/bee/releases/tag/v2.8.3) for the full list of changes.
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

You will see output like this after a successful upgrade:

```text
The following packages will be upgraded:
  bee
1 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 57.1 MB of archives.
After this operation, 3120 kB of additional disk space will be used.
Preparing to unpack .../archives/bee_2.8.2_arm64.deb ...
Unpacking bee (2.8.2) over (2.8.1) ...
Setting up bee (2.8.2) ...
Installing new version of config file /etc/bee/bee.yaml ...
```

If you have edited `/etc/bee/bee.yaml`, the upgrade stops and asks what to do with it:

```text
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

Answer `N` to keep your configuration, including your password and RPC endpoint.
The new default configuration is saved next to it as `/etc/bee/bee.yaml.dpkg-dist`, so you can compare the two afterwards.
Answering `Y` replaces your configuration with the default one.

You may now start your node again:

```bash
sudo systemctl start bee
```

### Manual Installations

To upgrade your manual installation, simply stop Bee, replace the Bee binary and restart.
If you installed Bee with the [shell script](../installation/shell-script.md), you can replace the binary by running the script again with the new version's `TAG`.

### Docker

To upgrade your Docker installation, simply increment the version number in your configuration and restart.

