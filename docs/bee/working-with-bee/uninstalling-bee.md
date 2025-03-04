---
title: Uninstalling Bee
id: uninstalling-bee
---

Choose the appropriate uninstallation method based on how Bee was installed:

## Package Manager  

This method can be used for package manager based [installs](/docs/bee/installation/package-manager-install) of the official Debian, RPM, and Homebrew packages.

:::danger
Uninstalling Bee will permanently delete your keyfiles and configuration. Ensure you have a [full backup](/docs/bee/working-with-bee/backups) before proceeding.
:::

### Debian

To uninstall Bee and completely remove all associated files including keys and configuration, run: 

```bash
sudo apt-get purge bee
```

### RPM

```bash
sudo yum remove bee
```


## Shell Script / Binary Install

If Bee was installed using the [automated shell script](/docs/bee/installation/shell-script-install) or as a binary by [building from source](/docs/bee/installation/build-from-source), it can be uninstalled by manually removing the installed binary, configuration files, and data directories.

### Identify Data and Config Locations

The shell script install method may result in slightly different default data and configuration locations based on your system. The easiest way to find these locations is to check the default configuration using the `bee printconfig` command:

```bash
bee printconfig
```

The output from this command contains several dozen default configuration values, however we only include the two we need in the example output below, `config` and `data-dir`. These will reveal the default locations for the configuration files and data directory according to our specific system.

Your output should look similar to this:

```bash
# config file (default is $HOME/.bee.yaml)
config: /home/noah/.bee.yaml
# data directory
data-dir: /home/noah/.bee
```

## Remove Configuration Files

Bee does not automatically generate a configuration file, but it looks for one at **`$HOME/.bee.yaml`** by default. 

### Check for Configuration Files 

**Default location for shell script installs:**  
```bash
ls -l $HOME/.bee.yaml
```

### Remove Configuration Files  
If the files exist, remove them:

```bash
rm -f $HOME/.bee.yaml
```


### Verify Removal 
Run the following commands to ensure the configuration files have been deleted:

```bash
ls -l $HOME/.bee.yaml
```

If the command returns **"No such file or directory"**, the configuration file has been successfully removed.

:::caution
If you have generated a config file and saved it to a non default location which you specify when starting your node using a command line flag (`--config`) or environment variable (`BEE_CONFIG`), then it is up to you to keep track of where you saved it and remove it yourself.
:::

## Remove Data Files

Bee stores its **node data, blockchain state, and other persistent files** in a data directory. If you want to fully remove Bee, this directory must be deleted. The data directory [default location](/docs/bee/working-with-bee/configuration#default-data-and-config-directories) differs based on install method and system type. 


## Verify Uninstallation

To confirm that Bee has been fully uninstalled, run:

```bash
command -v bee
```

If Bee is still installed, this command will return the binary path (e.g., /usr/bin/bee). If it returns nothing, Bee has been successfully uninstalled.


