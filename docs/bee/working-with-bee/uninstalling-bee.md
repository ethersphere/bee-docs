---
title: Uninstalling Bee
id: uninstalling-bee
---

## Uninstalling Bee

Choose the appropriate uninstall method based on the install method used:

### Package Manager

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

## Uninstalling Bee (Shell Script / Binary Install)

If Bee was installed using the [automated shell script](/docs/bee/installation/shell-script-install) or as a binary by [building from source](/docs/bee/installation/build-from-source), it can be uninstalled by manually removing the installed binary, configuration files, and data directories.

### Identify Data and Config Locations

The shell script install method may result in slightly different default data and configuration locations based on your system. The easiest way to find these locations is to check the default configuration using the `bee printconfig` command:

```bash
bee printconfig
```

The output from this command contains several dozen default configuration values, however we only include the two we need in the example output below, `config` and `data-dir`. These will reveal the default locations for the configuration files and data directory according to our specific system.

These values will look something like this:

```bash
# config file (default is $HOME/.bee.yaml)
config: /home/noah/.bee.yaml
# data directory
data-dir: /home/noah/.bee
```

### Backup Files (Optional)

**1. Remove the Bee Binary**

First, check if the Bee binary exists:

```bash
ls -l /usr/local/bin/bee
```

If it exists, remove it:

```bash
sudo rm -f /usr/local/bin/bee
```

Verify that the binary has been removed:

```bash
ls -l /usr/local/bin/bee
```

If Bee was built from source but not moved [as described in step 6](/docs/bee/installation/build-from-source) of the instructions for building from source, check the default build directory:

```bash
ls -l ~/bee
```

If it exists, remove it:

```bash
rm -rf ~/bee
```

Verify removal:

```bash
sudo rm "/usr/local/bin/bee"
```

## Remove Bee Data Files

To completely remove all Bee files from your system you will also need to remove the config and data files.

:::danger
Node keys, password, chunks and state files are stored in the data folder. [Make backups](/docs/bee/working-with-bee/backups) of your data folder to prevent losing keys and data.
:::

### Bee

**Config folder:** Configuration file is stored in `/etc/bee/`

**Data folder:** State, keys, chunks, and other data are stored in `/var/lib/bee/`
