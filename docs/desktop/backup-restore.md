---
title: Backup and Restore 
id: backup-restore
---

## Create a Backup

To create a backup of your Bee node in Swarm Desktop, begin by navigating to the ***Settings*** tab in the app and copying the location of the data directory as indicated in the ***Data DIR*** field: 

![](/img/backup1.png)

Navigate to the directory you just copied and create copies of the ***localstore***, ***statestore***, and ***keys*** folders and store them in a secure and private location. The ***keys*** folder is the most important folder as it contains your Bee node's private keys, and you will lose access to your Bee node and its assets if those keys are lost.

![](/img/backup7.png)

In addition to the data folders, you will also need the password found in the ***config.yaml*** file in order to restore a Bee node from backup. Move up one directory from ***Data DIR*** to the ***Data*** directory, and create a copy of the ***config.yaml*** file and save it along with the other folders you just backed up:

![](/img/backup4.png)

Alternatively you may open the ***config.yaml*** and save the password as a text file along with the rest of your backup files:

![](/img/backup5.png)

Your completed backup should have three folders and one file (***localstore***, ***statestore***, ***keys*** and ***config.yaml***/***password.txt*** ) and look like this:

![](/img/backup8.png)

## Restore from Backup

To restore from backup, begin with a [new install](/docs/desktop/install) of Swarm Desktop. Once the installation process is finished, navigate to the ***Settings*** tab in the app and copy the install file directory as indicated in the ***Data DIR*** field:

![](/img/backup1.png)

Before navigating to the directory you just copied, right click the Bee icon in the System tray and select ***Stop Bee*** and then ***Quit*** to close and exit from Swarm Desktop:

![](/img/backup2.png)

Next open your file explorer and navigate to the directory you just copied. Delete the ***localstore***, ***statestore***, and ***keys*** (if present) folders, and replace them with your own backup copies of these folders:

![](/img/backup3.png)

Move up one directory from ***Data DIR*** to ***Data***, and open the ***config.yaml*** file in a text editor such as VS Code or a plaintext editor:

![](/img/backup4.png)

![](/img/backup5.png)

Replace the ***password*** string with your own password from the ***config.yaml*** backup.

Restart Swarm Desktop and check to see if the backup was restored successfully:

![](/img/backup6.png)
