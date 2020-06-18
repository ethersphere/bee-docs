---
title: 'CLI'
date: 2018-11-28T15:14:39+10:00
weight: 6
summary: "Overview of CLI options."
---

Bee client offers CLI binary with help included. Example for help on the `bee` commands:

```
bee --help
```

Gives the output similar to:

```
Ethereum Swarm Bee

Usage:
  bee [command]

Available Commands:
  start       Start a Swarm node
  version     Print version number
  help        Help about any command

Flags:
      --config string   config file (default is $HOME/.bee.yaml)
  -h, --help            help for bee

Use "bee [command] --help" for more information about a command.
```

Help is also available for specific commands, for example:

```
bee start --help
```

Gives the output similar to:

```
Start a Swarm node

Usage:
  bee start [flags]

Flags:
      --api-addr string               HTTP API listen address (default ":8080")
      --bootnode strings              initial nodes to connect to (default [/dnsaddr/bootnode.ethswarm.org])
      --data-dir string               data directory (default "/home/user/.bee")
      --db-capacity uint              db capacity in chunks, multiply by 4096 to get approximate capacity in bytes (default 5000000)
      --debug-api-addr string         debug HTTP API listen address (default ":6060")
      --enable-debug-api              enable debug HTTP API
  -h, --help                          help for start
      --nat-addr string               NAT exposed address
      --network-id uint               ID of the Swarm network (default 1)
      --p2p-addr string               P2P listen address (default ":7070")
      --p2p-disable-quic              disable P2P QUIC protocol
      --p2p-disable-ws                disable P2P WebSocket protocol
      --password string               password for decrypting keys
      --password-file string          path to a file that contains password for decrypting keys
      --tracing                       enable tracing
      --tracing-endpoint string       endpoint to send tracing data (default "127.0.0.1:6831")
      --tracing-service-name string   service name identifier for tracing (default "bee")
      --verbosity string              log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")

Global Flags:
      --config string   config file (default is $HOME/.bee.yaml)

```

Use the command line to get up-to-date help for a specific version of the client.
