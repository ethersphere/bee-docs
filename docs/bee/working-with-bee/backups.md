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

### Ubuntu / Debian / Raspbian / CentOS package managers

For Linux installations from package managers _yum_ or _apt_, the data directory is located at:

```bash
/var/lib/bee
```

It may also be useful to include the `bee.yaml` config file in a backup so that configuration can be easily restored. The default location of the config file is:

```bash
/etc/bee
```

### Binary package install

If you installed Bee using the [automated shell script](/docs/bee/installation/install#shell-script-install-alternate-method) or by [building Bee from source](/docs/bee/installation/build-from-source), your data directory will typically be located at:

```bash
/home/<user>/.bee
```

### Docker Compose

When using [Docker Compose](/docs/bee/installation/docker) configuration files to run a node, Docker will create a volume for Bee.

Use `docker cp` to retrieve the contents of these folders:

```bash
docker cp bee_bee_1:/home/bee/.bee/ bee
```

## Data types

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

:::info
To use `swarm.key` to manage the Gnosis account for a node through Metamask or other wallets, [exportSwarmKeys](https://github.com/ethersphere/exportSwarmKey) can be used to convert `swarm.key` to a compatible format.
:::

### Statestore

The `statestore` directory retains information related to the node,
including SWAP balances, info on peers, block list, postage stamps, and more.

:::info
As the data in `statestore` and `localstore` continually changes during normal operation of a node, when taking a backup the node should first be stopped and not re-connected to the Swarm network until restoring from the backup (otherwise the `statestore` and `localstore` files will get out of sync with the network). It is possible to restore using out of sync `statestore` and `localstore` files, however it may lead to data loss or unexpected behavior related to chunk uploads, postage stamps, and more. 
:::

### Localstore

The `localstore` directory contains chunks locally which are frequently requested, pinned in the node, or are in the node's neighbourhood of responsibility.

## Backup Your node


Copy entire `bee` data folder to fully backup node. This will do a full backup of `statestore`. `localstore`, and `key` files into the newly created `/backup` directory. Make sure to save the backup directory to a safe location.
```
mkdir backup
sudo cp -r /var/lib/bee/ backup
```
    
### Export keys

If you only need to export your node's blockchain keys, you need to export the `swarm.key` UTC / JSON keystore file and the `password` file used to encrypt it. First create a directory for your keys and then export, make sure to save the newly created `keystore` directory in a safe location.  


```bash
mkdir keystore
sudo cp -r /var/lib/bee/keys/swarm.key /var/lib/bee/password keystore    

```

### View key and password for wallet import 

```bash
sudo cat /var/lib/bee/keys/swarm.key 
sudo cat /var/lib/bee/password
```

:::info
Note that `swarm.key` is in UTC / JSON keystores format and is encrypted by default by your password file inside the `/bee` directory. Make sure to export both the `swarm.key` file and the `password` file in order to secure your wallet. If you need your private key exported from the keystore file, you may use one of a variety of Ethereum wallets which support exporting private keys from UTC files (such as [Metamask](https://metamask.io/), however we offer no guarantees for any software, make sure you trust it completely before using it). 
:::

### Get private key from keystore and password

There are many tools and wallets you may use to get your private key from your keystore and password. Most Ethereum wallets which support importing accounts by keystore also include the option to export your private key, and Metamask is one of the most popular wallets for doing so. 

To import to Metamask:

1. Get your `swarm.key` and `keystore` as described in the section above.
2. Go to Metamask and click "Account 1" --> "Import Account"
3. Choose the "Select Type" dropdown menu and choose "JSON file"
4. Paste the password (Make sure to do this first)
5. Upload exported JSON file  
6. Click "Import"

To export your private key:

1. Go to Metamask and click "Account 1" to view the dropdown menu of all accounts
2. Click the three dots next to the account you want to export
3. Click "Account details"
4. Click "Show private key"
5. Enter your Metamask password (not your keystore password)
6. Copy your private key to a safe location

## Restore from backup

:::danger
Before restoring, make sure to check for any old node data at `/var/lib/bee` from a previous node which has not yet been backed up, and back it up if needed.
:::


1. Install Bee. See [install](/docs/bee/installation/install/) page for more info.

1. Change ownership of `bee` data folder.

    ```
    sudo chown -R /var/lib/bee
    ```
    
1. Delete statestore, keys, localstore, and password files.

    ```
    sudo rm -r /var/lib/bee
    ```

1. Navigate to backup directory and copy files to data folder.

    ```
    cp -r /<path-to-backup>/bee /var/lib/
    ```
    
1. Revert ownership of the data folder. 
    ```
    sudo chown -R bee:bee /var/lib/bee
    ```
1. Start `bee` service and check logs to see if Bee node is running properly.
    ```
    sudo systemctl restart bee
    sudo journalctl --lines=100 --follow --unit bee      
    ```

