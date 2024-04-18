---
title: Backup and Restore 
id: backup-restore
---

## Create a Backup

To create a backup of your Bee node in Swarm Desktop, start by shutting down your node.

Right click the Bee icon in the System tray and select `Stop Bee` and then `Quit` to close and exit from Swarm Desktop:

![](/img/backup2.png)


Next navigate to the `Settings` tab in the app and copy the location of the data directory as indicated in the `Data DIR` field: 

![](/img/backup1.png)

Navigate to the directory you just copied and create copies of all the files in that directory (`\data-dir`), including `localstore`, `statestore`, `stamperstore`, `kademlia-metrics` and `keys` folders and store them in a secure and private location. 

![](/img/backup7.png)

In addition to the data folders, you will also need the password found in the `config.yaml` file in order to restore a Bee node from backup. Move up one directory from `Data DIR` to the `Data` directory, and create a copy of the `config.yaml` file and save it along with the other folders you just backed up:

![](/img/backup4.png)

Alternatively you may open the `config.yaml` and save the password as a text file along with the rest of your backup files:

![](/img/backup5.png)

Your completed backup should contain all the files from your data directory as well as your password (either in your `config.yaml` file or as a separate file or written down.)

![](/img/backup8.png)

### Back-up Gnosis Chain Key Only

If you only wish to back-up your Gnosis Chain key, navigate to the `\data-dir\keys` directory, and copy the `swarm.key` to a safe location:

![](/img/backup9.png)


You also need the password found in the `config.yaml` file in order to access your Gnosis Chain account. Move up one directory from `Data DIR` to the `Data` directory, and create a copy of the `config.yaml` file and save it along with the other folders you just backed up:

![](/img/backup4.png)

Alternatively you may open the `config.yaml` and save the password as a text file along with the rest of your backup files:

![](/img/backup5.png)

## Restore from Backup

To restore from backup, begin with a [new install](/docs/desktop/install) of Swarm Desktop. Once the installation process is finished, navigate to the `Settings` tab in the app and copy the install file directory as indicated in the `Data DIR` field:

![](/img/backup1.png)

Before navigating to the directory you just copied, right click the Bee icon in the System tray and select `Stop Bee` and then `Quit` to close and exit from Swarm Desktop:

![](/img/backup2.png)

Next open your file explorer and navigate to the directory you just copied. Delete any files present in the directory, and replace them with your own backup copies (excluding the `config.yaml` / password file):

![](/img/backup7.png)

Move up one directory from `Data DIR` to `Data`, and replace delete the `config.yaml` file and replace it with the `config.yaml` file from your backup. 

Alternatively if you have saved just the password and not the entire config file, open the default `config.yaml` file in a text editor such as VS Code or a plain text editor:

![](/img/backup4.png)

![](/img/backup5.png)

Replace the `password` string with your own password which you saved from the `config.yaml` backup.

Restart Swarm Desktop and check to see if the backup was restored successfully:

![](/img/backup6.png)

### Restore Gnosis Chain Account

If you only wish to access your Gnosis Chain account, you can [follow these instructions](/docs/bee/working-with-bee/backups#metamask-import) for exporting to Metamask in order to access your account.