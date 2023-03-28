---
title: Uninstalling Bee
id: uninstalling-bee
---

## Uninstalling Bee

Choose the appropriate uninstall method based on the install method used:

### Package Install

#### Debian

:::danger
Uninstalling Bee will also delete Bee and Bee Clef data! Make sure you [make backups](/docs/working-with-bee/backups) so you don't lose your keys and data.
:::

```bash
sudo apt-get remove bee
sudo apt-get remove bee-clef
```

#### RPM

:::danger
Uninstalling Bee will also delete Bee and Bee Clef data! Make sure you [make backups](/docs/working-with-bee/backups) so you don't lose your keys and data.
:::

```bash
sudo yum remove bee
sudo yum remove bee-clef
```

### Binary Install
If Bee is installed using the [automated shell script](/docs/installation/install#shell-script-install-alternate-method) or by [building from source](/docs/installation/build-from-source), then package managers may not be used to uninstall Bee. In this case it must be uninstalled by directly removing the installed file.

```bash
sudo rm `/usr/local/bin/bee`
```

## Data Locations

### Bee Clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`
