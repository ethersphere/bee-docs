---
title: Uninstalling Bee
id: uninstalling-bee
---

## Uninstalling Bee

Choose the appropriate uninstall method based on the install method used:

### Package Manager Install

This method can be used for package manager based [installs](/docs/bee/installation/install#package-manager-install-recommended-method) of the official Debian, RPM, and Homebrew packages.

#### Debian

```bash
sudo apt-get remove bee
```

If Clef (deprecated) was used, remove Clef.
:::danger
This will delete your keys, [make backups](/docs/bee/working-with-bee/backups).
:::
```bash
sudo apt-get remove bee-clef
```

#### RPM

```bash
sudo yum remove bee
```

If Clef (deprecated) was used, remove Clef.
:::danger
This will delete your keys, [make backups](/docs/bee/working-with-bee/backups) .
:::
Remove Clef:
```bash
sudo yum remove bee-clef
```

### Binary Install
If Bee is installed using the [automated shell script](/docs/bee/installation/install#shell-script-install-alternate-method) or by [building from source](/docs/bee/installation/build-from-source), Bee can be uninstalled by directly removing the installed file.

```bash
sudo rm `/usr/local/bin/bee`
```

## Remove Bee Data Files

To completely remove all Bee files from your system you will also need to remove the config and data files. 

:::danger
Node keys, password, chunks and state files are stored in the data folder. [Make backups](/docs/bee/working-with-bee/backups) of your data folder to prevent losing keys and data. 
:::

### Bee

**Config folder:** Configuration file is stored in `/etc/bee/`

**Data folder:** State, keys, chunks, and other data are stored in `/var/lib/bee/`

### Bee Clef (Deprecated)

**Config folder:** Configuration file is stored in `/etc/bee-clef/`

**Data folder:** Key material and other data are stored in `/var/lib/bee-clef/`