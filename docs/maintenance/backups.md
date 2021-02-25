---
title: Backups
id: backups
---

In order to ensure you are able to redeploy your Bee node in the event of a disaster, the contents of several directories must be retained.

:::info
Don't forget - it's not a backup until you have restored from it! Make sure to test your backups out so that you can be sure of recovery incase of data loss or data corruption.
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

The Bee data directory contains three stores.

### Keystore

The keystore contains your important key material. This is the most important data by far, and is produced and retained from Bee's initialisation procedure. If you have used **Bee-clef** to manage your key material and signing procedures, see [below](/docs/maintenance/backups#ubuntu--debian--raspbian--centos-package-managers-1) for information on how to keep backups.

### Statestore

The statestore retains information related to your node, including SWAP balances, info on peers, blocklisting and much more.

### Chunkstore

The chunkstore contains chunks that are pinned in your node, or are in your neighbourhood of responsibility.

## Clef

It is also important to back up Clef's stored data. This includes your sensitive key material, so make sure to keep this private and safe!

### Ubuntu / Debian / Raspbian / CentOS Package Managers

For Linux installations from package managers *yum* or *apt*, your Clef data directory is located at:

```bash
/var/lib/bee-clef/
```

Configuration files are stored in:

```bash
/etc/bee-clef/
```

### Manual

For a manual installation of Clef your data directory is normally located at:

```bash
~/.clef
```
