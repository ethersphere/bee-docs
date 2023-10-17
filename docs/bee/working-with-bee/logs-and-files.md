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

The log messages are divided into four basic levels:

- `Error` - Errors in the node. Although the node operation may continue, the error indicates that it should be addressed.
- `Warning` - Warnings should be checked in case the problem recurs to avoid potential damage.
- `Info` - Informational messages useful for node operators that do not indicate any fault or error.
- `Debug` - Information concerning program logic decisions, diagnostic information, internal state, etc. which is primarily useful for developers.

There is a notion of `V-level` attached to the `Debug` level. `V-levels` provide a simple way of changing the verbosity of debug messages. `V-levels` provide a way for a given package to distinguish the relative importance or verbosity of a given log message. Then, if a particular logger or package logs too many messages, the package can simply change the `V` level for that logger.

### Logging API usage

In the current Bee code base, it is possible to change the granularity of logging for some services on the fly without the need to restart the node. These services and their corresponding loggers can be found using the `/loggers` endpoint. Example of the output:

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

The recorders come in two versions. The first is the tree version and the second is the flattened version. The `subsystem` field is the unique identifier of the logger. The `id` field is a version of the `subsystem` field encoded in base 64 for easier reference to a particular logger. The node name of the version tree is composed of the subsystem with the log level prefix and delimited by the `|` character. The number in the first square bracket indicates the logger's V-level.

The logger endpoint uses HTTP PUT requests to modify the verbosity of the logger(s). The request must have the following parameters `/loggers/{subsystem}/{verbosity}`. The `{subsytem}` parameter is the base64 version of the subsytem field or regular expression corresponding to multiple subsystems. Since the loggers are arranged in tree structure, it is possible to turn on/off or change the logging level of the entire tree or just its branches with a single command. The verbosity can be one of `none`, `error`, `warning`, `info`, `debug` or a number in the range `1` to `1<<<31 - 1` to enable the verbosity of a particular V-level, if available for a given logger. A value of `all` will enable the highest verbosity of V-level.

Examples:

`curl -XPUT http://localhost:1635/loggers/bm9kZS8q/none` - will disable all loggers; `bm9kZS8q` is base64 encoded `node/*` regular expression.

`curl -XPUT http://localhost:1635/loggers/bm9kZS9hcGlbMV1bXT4-ODI0NjM0OTMzMjU2/error` - will set the verbosity of the logger with the subsystem `node/api[1][]>>824634933256` to `error`.