---
title: Uninstalling Bee
id: uninstalling-bee
---

## Uninstalling Bee

Choose the appropriate uninstall method based on the install method used:

### Package Manager Install

This method can be used for package manager based [installs](/docs/bee/installation/install#shell-script-install) of the official Debian, RPM, and Homebrew packages.

:::danger
This will remove your keyfiles so make certain that you have a [full backup](/docs/bee/working-with-bee/backups) of your keys and configuration before uninstalling.
:::

#### Debian

To uninstall Bee and completely remove all associated files including keys and configuration, run: 

```bash
sudo apt-get purge bee
```

#### RPM

```bash
sudo yum remove bee
```

### Binary Install
If Bee is installed using the [automated shell script](/docs/bee/installation/install#shell-script-install) or by [building from source](/docs/bee/installation/build-from-source), Bee can be uninstalled by directly removing the installed file.

```bash
sudo rm /usr/local/bin/bee
```

## Remove Bee Data Files

To completely remove all Bee files from your system you will also need to remove the config and data files. 

:::danger
Node keys, password, chunks and state files are stored in the data folder. [Make backups](/docs/bee/working-with-bee/backups) of your data folder to prevent losing keys and data. 
:::

### Bee

**Config folder:** Configuration file is stored in `/etc/bee/`

**Data folder:** State, keys, chunks, and other data are stored in `/var/lib/bee/`
