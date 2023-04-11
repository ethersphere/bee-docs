---
title: Uninstalling Bee
id: uninstalling-bee
---

## Uninstalling Bee

If you need to remove Bee, you may simply run the below commands.

### Ubuntu / Debian / Raspbian

:::danger
Uninstalling Bee will also delete Bee and Bee Clef data! Make sure you [make backups](/docs/bee/working-with-bee/backups) so you don't lose your keys and data.
:::

```bash
sudo apt-get remove bee
sudo apt-get remove bee-clef
```

### Centos

:::danger
Uninstalling Bee will also delete Bee and Bee Clef data! Make sure you [make backups](/docs/bee/working-with-bee/backups) so you don't lose your keys and data.
:::

```bash
sudo yum remove bee
sudo yum remove bee-clef
```

## Data Locations

### Bee Clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`
