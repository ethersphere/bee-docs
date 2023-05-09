---
title: Install
id: install
---

## Download and Install Swarm Desktop

Installing the Swarm Desktop app takes only a few clicks. To get started, simply download and install the Swarm Desktop app for your operating system. Installers are available for Windows, Linux, and OSX. You can find download links for Swarm Desktop at the Swarm [homepage](https://www.ethswarm.org/build/desktop) and you can find installers for specific operating systems at the [releases page](https://github.com/ethersphere/swarm-desktop/releases) of the Swarm Desktop GitHub repo.

:::caution
Swarm Desktop is in Beta and currently includes the Sentry application monitoring and bug reporting software which automatically collects data in order to help improve the software.
:::

:::caution
This project is in beta state. There might (and most probably will) be changes in the future to its API and working. Also, no guarantees can be made about its stability, efficiency, and security at this stage.
:::


[![](/img/desktop-homepage-dl.png)](https://www.ethswarm.org/build/desktop) 
*Ethswarm.org Swarm Desktop Page*

[![](/img/desktop-releases-dl.png)](https://github.com/ethersphere/swarm-desktop/releases)
*Swarm Desktop GitHub Releases Page*

After running the installer, a window will pop up and display the installation status:


![](/img/desktop-install-downloading.png)

Once the installation is complete, Swarm Desktop will open up in your default browser in a new window to the "Info" tab of the app:

![](/img/desktop-new-install.png)

If the installation went smoothly, you should see the message "Your node is connected" above the "Access Content" button along with a status message of "Node OK".

### What Just Happened?

Running the Swarm Desktop app for the first time set up a new Bee node on your system. The installation process generated and save private keys for your node in the Swarm Desktop's data directory. Those keys were used to start up a new Bee node in ultra-light mode. 

:::warning
If your Swarm Desktop files are accidentally deleted or become corrupted you will lose access to any assets or data which are secured using those keys. Make sure to [backup your keys](/docs/desktop/backup-restore).
:::

### "Ultra-light" and "Light" 

Swarm Desktop by default starts up a node in "ultra-light" mode. When running in ultra-light mode Swarm Desktop  limited to only downloading data from Swarm. Moreover, it's limited to downloading only within the free threshold allowed by other nodes. For instructions on switching to light mode see the [configuration section](/docs/desktop/configuration).

## Tour of Swarm Desktop

### Info Tab

The "Info" tab gives you a quick view of your Swarm Desktop's status. From here we can quickly see if the node is connected to Swarm, whether the node is funded, and whether its chequebook contract is set up. On a new install of Swarm Desktop, the node should be connected, but the wallet and chequebook will not have been set up yet.

![](/img/swarm-desktop-info-tab.png)

### Files Tab

From "Files" tab you can input a Swarm hash in order to download the file associated with the hash. See this full [guide for downloading](/docs/desktop/access-content) using Swarm Desktop.

![](/img/swarm-desktop-files-tab.png)

### Account Tab

From the "Account" tab you can view your Swarm Desktop node's Gnosis Chain address and associated xBZZ and xDAI balances.

![](/img/swarm-desktop-account-tab.png)

### Settings Tab

From the "Settings" tab you can view important settings values. Note that the Blockchain RPC URL and ENS resolver URL are already filled in, and only the Blockchain RPC URL is modifiable through this tab. If you wish to modify other settings see the [ configuration page](/docs/desktop/configuration) for detailed instructions.

![](/img/swarm-desktop-settings-tab.png)

### Status Tab

From the "Status" tab you can see a quick overview of the health of your Swarm Desktop's Bee node.

![](/img/swarm-desktop-status-tab.png)