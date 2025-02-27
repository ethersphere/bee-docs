---
title: Backups
id: backups
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Backing up your Bee node involves copying and saving files from the data directory specified in the `dat-dir` configuration option, along with the node's password. The details of where and how this option is specified will vary depending on the type of [configuration method](/docs/bee/working-with-bee/configuration) used (YAML file, command line flag, or environment variable).

:::caution
A node's password may be specified in several different locations. It can be specified either through the `password` option or the `password-file` option. For a backup, you will need to either copy the `password` option value, or copy the file itself from the location specified by the `password-file` option.

Don't forget - it's not a backup until you're sure the backup files work! Make sure to test restoring from backup files and password to prevent loss of assets due to data loss or corruption.
:::


## Bee Files

A full Bee node backup includes the `keys`,  `localstore`,  `password`,  `stamperstore`,  `statestore`, and `password` files. The node should be stopped before taking a backup and not restarted until restoring the node from the backup to prevent the node from getting out of sync with the network.

Key data from the `keys` directory allows access to Bee node's Gnosis account (provided that you have also made sure to back the password for your keys). If your keys and password are lost or stolen it could lead to the loss of all assets in that account. Furthermore the `stamperstore` contains postage stamp data, and postage stamps will not be recoverable if it is lost.

### Statestore and Localstore.

The `statestore` retains data related to its operation, and the `localstore` contains chunks locally which are frequently requested, pinned in the node, or are in the node's neighborhood of responsibility.

:::info
As the data in `statestore` and `localstore` continually changes during normal operation of a node, when taking a backup the node should first be stopped and not re-connected to the Swarm network until restoring from the backup (otherwise the `statestore` and `localstore` files will get out of sync with the network). It is possible to restore using out of sync `statestore` and `localstore` files, however it may lead to data loss or unexpected behavior related to chunk uploads, postage stamps, and more. 
:::

### Stamperstore

The `stamperstore` contains postage stamp batch related data, and so is important to include in your backup if you have purchased any postage batches which you wish to continue using.

### Keys

The `keys` directory contains three key files: `libp2p.key`,  `libp2p_v2.key`,  `pss.key`,  `swarm.key`,. These keys are generated during the Bee node's initialisation and are required for maintaining access to your node.

:::danger
The `swarm.key` file allows access to Bee node's Gnosis Chain account. If the key is lost or stolen it could lead to the loss of all assets secured by that key.
:::

:::info
To use `swarm.key` to manage the Gnosis account for a node through Metamask or other wallets, [exportSwarmKeys](https://github.com/ethersphere/exportSwarmKey) can be used to convert `swarm.key` to a compatible format.
:::




### Data Directory Structure

The data directory contains four directories. Its default location depends on the node install method and startup method used.


```
├── kademlia-metrics
│   └── ...
├── keys
│   ├── libp2p.key
│   ├── libp2p_v2.key
│   ├── pss.key
│   └── swarm.key
├── localstore
│   ├── indexstore
│   └── sharky
├── password
├── stamperstore
│   └── ...
└── statestore
│   └── ...
```


## Data Directory Locations

The default data directory for your Bee node will depend on the installation method used. 


:::caution
If Bee is installed to run as a service using a package manager such as `apt` or `yum`, then it can be started using your system's services manager such as `systemctl` using a command like `systemctl start bee`. However, after installing with a package manager, Bee can also by started using the `bee start` command used for running Bee with a shell script / binary install. When the `bee start` command is run, it will create a SECOND data directory alongside the default data directory for your package manager at the same directory it would for the shell script installation:

```
/home/<user>/.bee
```

In that case, you would have two separate data directories in two different locations, and the directory used will depend on whether you start your node using a service manager like `systemctl` or the `bee start` command. When it comes to package manager installs, make sure to back up the correct data-directory depending on which method you use for starting your node.
:::

### *apt* and *yum / rpm* Package Managers

Default `data-dir` location:

```
/var/lib/bee
```

### Homebrew (amd64)

Default `data-dir` location:

```
/usr/local/var/lib/swarm-bee
```

### Homebrew (arm64)

Default `data-dir` location:

```
/opt/homebrew/var/lib/swarm-bee
```

### *scoop* Package Manager

Default `data-dir` location:

```
./data
``` 

### Shell Script & Binary Install 

If you installed Bee using the [automated shell script](/docs/bee/installation/shell-script-install) or by [building Bee from source](/docs/bee/installation/build-from-source), your data directory will typically be located at:

```bash
/home/<user>/.bee
```

### Docker

Defalt `data-dir` location:

```
/home/bee/.bee
```

## Back-up your node data


Copy entire `bee` data folder to fully backup your node. This will do a full backup of `kademlia-metrics`,  `keys`,  `localstore`,  `stamperstore`, `password`, and `statestore`, files into a newly created `/backup` directory. Make sure to save the backup directory to a safe location.

```
mkdir backup
sudo cp -r /var/lib/bee/ backup
```
    
## Back-up your password 

Depending on your [configuration](/docs/bee/working-with-bee/configuration) method, your password may be located in a variety of different locations. If you use a `.yaml` file for your configuration, then it might be found directly under the `password` option, or it could be that the location of your password file is recorded by the `password-file` option. In either case, make sure to record the password or password file as a part of your backup.   

The same holds true for the to other configuration methods. If you use environment variables for specifying your configuration options, your password itself will likely be specified in a `.env` file somewhere which contains either the password itself in the `BEE_PASSWORD` variable or the location of your password file in the `BEE_PASSWORD_FILE` variable. 

The same again holds true for the command line flag method. Make sure you have the password you use with the `--password` command line flag or the password file specified by the `--password-file` flag saved in your backup. 

## Back-up blockchain keys only

If you only need to export your node's blockchain keys, you need to export the `swarm.key` UTC / JSON keystore file and the `password` file used to encrypt it. First create a directory for your keys and then copy your keys to that directory.


```bash
mkdir keystore
sudo cp -r /var/lib/bee/keys/swarm.key /var/lib/bee/password keystore    
```

## Metamask Import

If you wish to import your blockchain account to a wallet such as Metamask, you can simply print out your keystore file and password and use those data to import into the wallet:

## View key and password for wallet import 

```bash
sudo cat /var/lib/bee/keys/swarm.key 
sudo cat /var/lib/bee/password
```

:::info
Note that `swarm.key` is in UTC / JSON keystores format and is encrypted by default by your password file inside the `/bee` directory. Make sure to export both the `swarm.key` file and the `password` file in order to secure your wallet. If you need your private key exported from the keystore file, you may use one of a variety of Ethereum wallets which support exporting private keys from UTC files (such as [Metamask](https://metamask.io/), however we offer no guarantees for any software, make sure you trust it completely before using it). 
:::

## Get private key from keystore and password

To import to Metamask:

1. View and copy your `swarm.key` and `password` as shown above
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
Before restoring, make sure to check for any old node data from a previous node which has not yet been backed up, and back it up if needed.
:::

:::tip
The specific directories and commands for restoring will depend on which install method and system is used. The instructions below are for a Linux package manager based installation. See the [configuration section](/docs/bee/working-with-bee/configuration#default-data-and-config-directories) more more details about default file locations.
:::

1. After [uninstalling](/docs/bee/working-with-bee/uninstalling-bee) any existing Bee installations, perform a new [installation](/docs/bee/installation/getting-started#installation-methods).

1. Delete Bee data folder which was generated during install

    ```
    sudo rm -r /var/lib/bee
    ```

1. Navigate to backup directory and copy files to data folder.

    ```
    sudo cp -r /<path-to-backup>/. /var/lib/bee
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
