---
title: Uninstalling Bee
id: uninstalling-bee
---

Choose the appropriate uninstall method based on the install method used:

## Package Manager  

This method can be used for package manager based [installs](/docs/bee/installation/package-manager-install) of the official Debian, RPM, and Homebrew packages.

:::danger
This will remove your keyfiles so make certain that you have a [full backup](/docs/bee/working-with-bee/backups) of your keys and configuration before uninstalling.
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

These values will look something like this:

```bash
# config file (default is $HOME/.bee.yaml)
config: /home/noah/.bee.yaml
# data directory
data-dir: /home/noah/.bee
```

## Backup Files (Optional)


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
ls -l ~/bee
```


###  Backup Important Data First 

Before proceeding, ensure you have backed up any necessary data.  

Bee stores **node keys, passwords, chunks, and state files** in its data directory. Without a backup, you will lose access to any funds managed by your node’s **Gnosis Chain account**, and you will also lose any **postage stamps** you have purchased.  

Follow the [official backup guide](https://docs.ethswarm.org/docs/bee/working-with-bee/backups) to avoid permanent data loss.



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

Ensure Bee has been completely removed by running:

```bash
command -v bee
```

If the command does **not return anything**, Bee has been successfully uninstalled. 🎉  


