---
title: Backups
id: backups
---

In order to ensure you are able to redeploy your Bee node in the event of a disaster, the contents of several directories must be retained.

:::danger
Your keys represent your ability to access your BZZ. Make sure to back up your keys directory in multiple places, so you can keep your BZZs safe! See below to discover the location of your keys.
:::

:::info
Don't forget - it's not a backup until you have restored it! Make sure to test your backups out so that you can be sure of recovery incase of data loss or data corruption.
:::

## Bee

To restore a Bee node you must have the following directories, all backed up in an atomic moment so that they are syncronised.

All of this data is contained within the *data directory* specified in your Bee configuration. 

### Ubuntu / Debian / Raspbian / CentOS Package Managers

For Linux installations from package managers *yum* or *apt*, your data directory is located at:

```bash
/var/lib/bee
```

It may be also useful for you to retain your configuration files, which are held at:

```bash
/etc/bee
```

### Manual

For a [manual installation](/docs/installation/manual) your data directory is normally located at:

```bash
~/.bee
```

### Docker Compose

When using our [Docker Compose](/docs/installation/docker) configuration files to run your node, Docker will create a volume for Bee and a volume for Bee Clef.

You may use `docker cp` to retrieve the contents of these folders.

```bash
docker cp bee_bee_1:/home/bee/.bee/ bee
docker cp bee_clef_1:/app clef
```

## Data Types

Your Bee data directory contains three stores.

```
/Users/sig/.bee
├── keys
│   ├── libp2p.key
│   ├── pss.key
│   └── swarm.key
├── localstore
│   └── ...
└── statestore
    └── ...
```

### Keys

The `keys` directory contains your important key material. This is the
most important data by far, and is produced and retained from Bee's
initialisation procedure. If you have used **bee-clef** to manage your
key material and signing procedures, see below for information on how
to keep backups of your keys.

:::info
If you are using Bee to manage your keys (not recommended - please use [Bee
Clef](/docs/installation/bee-clef)!). You must convert your keys in order to
import into MetaMask and other Ethereum wallets. You may use
[exportSwarmKeys](https://github.com/ethersphere/exportSwarmKey) to make the
conversion.
:::

### Statestore

The `statestore` directory retains information related to your node,
including SWAP balances, info on peers, blocklisting, and more.

:::info
Although your statestore retains your node's state. It is only possible to restore from this if your node has not been connected in the meantime, as the blockchain and state may have desyncronised if your node was turned on in the meantime.
:::

### Localstore

The `localstore` directory contains chunks that your node is retaining
locally, either because they are frequently requested, or they are
pinned in your node, or they are in your neighbourhood of
responsibility.

## Bee Clef

It is also important to back up Bee Clef's stored data. This includes your sensitive key material, so make sure to keep this private and safe!

### Ubuntu / Debian / Raspbian / CentOS Package Managers

:::danger
Your keys represent your ability to access your BZZ. Make sure to back up your keys directory in multiple places, so you can keep your BZZs safe!
:::

For Linux installations by the package managers *yum* or *apt*, your
`bee-clef` data directory is located at:

```bash
/var/lib/bee-clef/
```

Configuration files are stored in:

```bash
/etc/bee-clef/
```

### Manual

For a manual installation of Clef your default data directory is:

```bash
~/.clef
```
