---
title: Backups
id: backups
---

## Files

A full Bee node backup includes the `keys`, `localstore`, `statestore`, and `password` files. The node should be stopped before taking a backup and not restarted until restoring the node from the backup to prevent the node from getting out of sync with the network.

Node key and state data is found in the data directory specified in its [configuration](configuration).

Key data in backup files allows access to Bee node's Gnosis account. If lost or stolen it could lead to the loss of all assets in that account. Multiple backups should be kept in secure locations.

:::info
Don't forget - it's not a backup until you're sure the backup files work! Make sure to test restoring from backup files to prevent loss of assets due to data loss or corruption.
:::

### Ubuntu / Debian / Raspbian / CentOS Package Managers

For Linux installations from package managers _yum_ or _apt_, the data directory is located at:

```bash
/var/lib/bee
```

It may also be useful to include the `bee.yaml` config file in a backup so that configuration can be easily restored. The default location of the config file is:

```bash
/etc/bee
```

### Binary package install

If you installed Bee using the [automated shell script](/docs/installation/install#shell-script-install-alternate-method) or by [building Bee from source](/docs/installation/build-from-source), your data directory will typically be located at:

```bash
/home/<user>/.bee
```

### Docker Compose

When using [Docker Compose](/docs/installation/docker) configuration files to run a node, Docker will create a volume for Bee and a volume for Bee Clef.

Use `docker cp` to retrieve the contents of these folders:

```bash
docker cp bee_bee_1:/home/bee/.bee/ bee
docker cp bee_clef_1:/app clef
```

## Data Types

The data directory contains three directories. Its default location depends on the node install method used.

Shell script install:

```
/home/<user>/.bee
├── keys
│   ├── libp2p.key
│   ├── pss.key
│   └── swarm.key
├── localstore
│   └── ...
└── statestore
    └── ...
```

Package manager install:

```
/var/lib/bee
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

The `keys` directory contains three key files: `libp2p_v2.key`, `pss.key`, and `swarm.key`. These keys are generated during the Bee node's initialisation and are the most important data to retain for a backup.

:::danger
The `swarm.key` file allows access to Bee node's Gnosis account. If the key is lost or stolen it could lead to the loss of all assets secured by that key. Multiple backups should be kept in secure locations to prevent loss of assets or unauthorized access.
:::

If using **bee-clef**, see below for information on how to back up the node.

:::info
To use `swarm.key` to manage the Gnosis account for a node through Metamask or other wallets,[exportSwarmKeys](https://github.com/ethersphere/exportSwarmKey) can be used to
convert `swarm.key` to a compatible format.
:::

### Statestore

The `statestore` directory retains information related to the node,
including SWAP balances, info on peers, block list, postage stamps, and more.

:::info
As the data in `statestore` and `localstore` continually changes during normal operation of a node, when taking a backup the node should first be stopped and not re-connected to the Swarm network until restoring from the backup (otherwise the `statestore` and `localstore` files will get out of sync with the network). It is possible to restore using out of sync `statestore` and `localstore` files, however it may lead to data loss or unexpected behavior related to chunk uploads, postage stamps, and more. 
:::

### Localstore

The `localstore` directory contains chunks locally which are frequently requested, 
pinned in the node, or are in the node's neighbourhood of responsibility.

## Bee Clef

If Clef is used for key management and transaction signing then Clef data must be backed up and secured in a safe location to prevent loss of access to the node and its assets.

### Ubuntu / Debian / Raspbian / CentOS Package Managers


For Linux installations by the package managers _yum_ or _apt_, the `bee-clef` data directory is located at:

```bash
/var/lib/bee-clef/
```

Configuration files are stored in:

```bash
/etc/bee-clef/
```

### Manual

For a manual installation of Clef the default data directory is:

```bash
~/.clef
```

## Restore from Backup

:::danger
Before restoring, make sure to check for any old node data at `/var/lib/bee` from a previous node which has not yet been backed up.
:::


1. Install Bee. See [install](../installation/install) page for more info:

    ```
    wget https://github.com/ethersphere/bee/releases/download/v1.15.0/bee_1.15.0_amd64.deb
    sudo dpkg -i bee_1.15.0_amd64.deb
    ```
    Edit `bee.yaml` to include Gnosis Chain RPC endpoint: 
    ```
    sudo vi /etc/bee/bee.yaml
    ```

1. Change ownership of `bee` data folder.
    ```
    cd /var/lib/
    sudo chown -R <user>:<user> bee
    cd bee/
    ```
    
1. Delete statestore, keys, localstore, and password files.

    ```
    sudo rm -r keys password statestore localstore
    ```

1. Navigate to backup directory and copy files to data folder.

        ```
        cp -r keys password statestore localstore /var/lib/bee
        ```
    
1. Revert ownership of the data folder. 
    ```
    sudo chown -R bee:bee bee
    ```
1. Start `bee` service and check logs to see if Bee node is running properly.
    ```
    sudo systemctl restart bee
    sudo journalctl --lines=100 --follow --unit bee      
    ```

