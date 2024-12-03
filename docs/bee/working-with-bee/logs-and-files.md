---
title: Logs and Files
id: logs-and-files
---

### Linux

If you have installed Bee on Linux using a package manager you will now be able to manage your Bee service using `systemctl`.

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

### Bee

Configuration files are stored in `/etc/bee/`. State, chunks and other data are stored in `/var/lib/bee/`

## Logging Guidelines

The Bee logs provide a robust information on the workings of a Bee node which are useful both to node operators and to Bee developers. Log messages have four levels described below, and logs can be adjusted for verbosity and granularity to suit the needs of the user.

### Log Levels

- **`Error`**: Logs critical issues that indicate a problem requiring attention. Node operation may continue but may be impaired.
- **`Warning`**: Logs non-critical issues that may require user intervention to prevent further problems.
- **`Info`**: Logs general operational information useful for monitoring node activity.
- **`Debug`**: Logs detailed diagnostic and internal state information, useful primarily for developers.

### Logging API usage

The Bee node supports dynamically changing the log level for specific components using the `/loggers` API endpoint. This allows node operators to adjust logging verbosity without restarting the node.

```json
{
  "tree": {
    "node": {
      "/": {
        "api": {
          "+": [
            "info|node/api[0][]>>824634933256"
          ]
        },
        "batchstore": {
          "+": [
            "info|node/batchstore[0][]>>824634933256"
          ]
        },
        "leveldb": {
          "+": [
            "info|node/leveldb[0][]>>824634933256"
          ]
        },
        "pseudosettle": {
          "+": [
            "info|node/pseudosettle[0][]>>824634933256"
          ]
        },
        "pss": {
          "+": [
            "info|node/pss[0][]>>824634933256"
          ]
        },
        "storer": {
          "+": [
            "info|node/storer[0][]>>824634933256"
          ]
        }
      },
      "+": [
        "info|node[0][]>>824634933256"
      ]
    }
  },
  "loggers": [
    {
      "logger": "node/api",
      "verbosity": "info",
      "subsystem": "node/api[0][]>>824634933256",
      "id": "bm9kZS9hcGlbMF1bXT4-ODI0NjM0OTMzMjU2"
    },
    {
      "logger": "node/storer",
      "verbosity": "info",
      "subsystem": "node/storer[0][]>>824634933256",
      "id": "bm9kZS9zdG9yZXJbMF1bXT4-ODI0NjM0OTMzMjU2"
    },
    {
      "logger": "node/pss",
      "verbosity": "info",
      "subsystem": "node/pss[0][]>>824634933256",
      "id": "bm9kZS9wc3NbMF1bXT4-ODI0NjM0OTMzMjU2"
    },
    {
      "logger": "node/pseudosettle",
      "verbosity": "info",
      "subsystem": "node/pseudosettle[0][]>>824634933256",
      "id": "bm9kZS9wc2V1ZG9zZXR0bGVbMF1bXT4-ODI0NjM0OTMzMjU2"
    },
    {
      "logger": "node",
      "verbosity": "info",
      "subsystem": "node[0][]>>824634933256",
      "id": "bm9kZVswXVtdPj44MjQ2MzQ5MzMyNTY="
    },
    {
      "logger": "node/leveldb",
      "verbosity": "info",
      "subsystem": "node/leveldb[0][]>>824634933256",
      "id": "bm9kZS9sZXZlbGRiWzBdW10-PjgyNDYzNDkzMzI1Ng=="
    },
    {
      "logger": "node/batchstore",
      "verbosity": "info",
      "subsystem": "node/batchstore[0][]>>824634933256",
      "id": "bm9kZS9iYXRjaHN0b3JlWzBdW10-PjgyNDYzNDkzMzI1Ng=="
    }
  ]
}
```


#### Modifying Log Levels

Use the following endpoint format to change log levels dynamically:
```
PUT /loggers/{subsystem}/{verbosity}
```

- `{subsystem}`: Base64-encoded name of the logger.
- `{verbosity}`: The desired log level (`none`, `error`, `warning`, `info`, `debug`).

##### Examples
1. Disable all logs:
   ```bash
   curl -X PUT http://localhost:1633/loggers/bm9kZS8q/none
   ```
2. Set `node/api` logs to `debug`:
   ```bash
   curl -X PUT http://localhost:1633/loggers/bm9kZS9hcGlbMF1bXT4-ODI0NjM0OTMzMjU2/debug
   ```

## Advanced: V-Levels

V-levels are an advanced logging feature primarily used by Bee developers. They allow finer-grained control over debug-level messages by specifying verbosity levels numerically. Each V-level corresponds to progressively more detailed information.

While V-levels can be set via the `/loggers` API (e.g., `PUT /loggers/{subsystem}/3`), most users will find named levels (`info`, `debug`) sufficient for all operational needs.