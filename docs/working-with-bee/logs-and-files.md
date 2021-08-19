---
title: Logs and Files
id: logs-and-files
---

### Linux

If you have installed Bee on Linux using a package manager you will now be able to the manage your Bee service using `systemctl`.

```bash
systemctl status bee
```

```
● bee.service - Bee - Ethereum Swarm node
     Loaded: loaded (/lib/systemd/system/bee.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2020-11-20 23:50:15 GMT; 6s ago
```

Logs are available using the `journalctl` command:

```bash
journalctl --lines=100 --follow --unit bee
```

```text
INFO[2021-02-09T18:55:11Z] swarm public key 03379f7aa673b7f03737064fd23ba1453619924a4602e70bbccc133ba67d0968bd
DEBU[2021-02-09T18:55:11Z] using existing libp2p key
DEBU[2021-02-09T18:55:11Z] using existing pss key
INFO[2021-02-09T18:55:11Z] pss public key 03bae655ce94431e1f2c2de8d017f88c8c5c293ef0057379223084aba9e318596e
INFO[2021-02-09T18:55:11Z] using ethereum address 99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a
INFO[2021-02-09T18:55:14Z] using default factory address for chain id 5: f0277caffea72734853b834afc9892461ea18474
INFO[2021-02-09T18:55:14Z] no chequebook found, deploying new one.
WARN[2021-02-09T18:55:15Z] cannot continue until there is sufficient ETH (for Gas) and at least 10 BZZ available on 99c9e7868d22244106a5ffbc2f5d6b7c88e2c85a
```

### MacOS

Services are managed using Homebrew services.

```bash
brew services restart swarm-bee
```

Logs are available at `/usr/local/var/log/swarm-bee/bee.log`

```bash
tail -f /usr/local/var/log/swarm-bee/bee.log
```


## Data Locations

### Bee-clef

Configuration files are stored in `/etc/bee-clef/`

Key material and other data is stored in `/var/lib/bee-clef/`

### Bee

Configuration files are stored in `/etc/bee/`

State, chunks and other data is stored in `/var/lib/bee/`
