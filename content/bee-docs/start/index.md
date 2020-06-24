---
title: 'Starting your node'
weight: 6
summary: "How to start and configure your node."
alias: "/bee-docs/start.html"
---

The Bee node binary (see [Installation](/bee-docs/installation.html) on how to download this) is used to start and configure your Bee node *before* it starts. If you want to interact with you Bee node after it is started, you can use the HTTP APIs (see sections [API](/bee-docs/API-reference.html).

## Getting help
The CLI has documentation build-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure you bee node via the command line arguments.

## Start a bee node
Run `bee start`. This command starts your bee node with all configuration parameters on their default value.

## Configuring your bee node
Bee can be configured with:

* command line arguments;
* environment variables;
* a configuration file.

The order of precedence is from command line arguments (most important) to the configuration file (least important)

### Command line arguments
You can pass several command-line arguments to the bee node upon startup. Run `bee-start -h` to get a list of available command line arguments.

### Environment variables
Environment variables are set as variables in your operating systems session. To set an environment variable, type

`export VARIABLE_NAME=variableValue`

in your command line.

Verify if it is correctly set by running `echo $VARIABLE_NAME`.

All available command-line flags (run `bee start -h`) are available as environment variables too, but their names are slightly different. To go from command-line flags to environment variable:

- remove `--` prefix from the flag name,
- capitalize all characters in the command-line name,
- replace all `-` characters with `_`,
- prepend `BEE_` prefix to the resulted string.

Hence, the flag `--api-addr` becomes `BEE_API_ADDR` and it can be set in your environment by running `BEE_API_ADDR=:8081`.

### Configuration file
Bee can be configured by means of a configuration file. The encoding of Bee's configuration file is [YAML](https://yaml.org/).

To make use of a configuration file, create a YAML file (template provided below), save it and start with with the `--config` flag, pointing to your file. For example:

`bee start --config ~/bee-config.yaml `

#### Config file template
This configuration file template, with arguments at their default value is provided here for your convenience. Note that the most-recent release of Bee might have different configuration options than the one provided here. Please verify this before using the template.

``` yaml
# Bee config template
# Date of generation: 18 June 2020

# HTTP API listen address (default ":8080")
api-addr: :8083
# initial nodes to connect to (default [/dnsaddr/bootnode.ethswarm.org])
bootnode: [/dnsaddr/bootnode.ethswarm.org]
# data directory (default "/home/<user>/.bee")
data-dir: ~/.bee
# db capacity in chunks, multiply by 4096 to get approximate capacity in bytes
db-capacity: 5000000
# debug HTTP API listen address (default ":6060")
debug-api-addr: :6060
# enable debug HTTP API
enable-debug-api : false
# NAT exposed address
nat-addr: ""
# ID of the Swarm network (default 1)
network-id: 1
# P2P listen address (default ":7070")
p2p-addr: :7070
# disable P2P QUIC protocol
p2p-disable-quic: false
# disable P2P WebSocket protocol
p2p-disable-ws: false
# password for decrypting keys
password: ""
# path to a file that contains password for decrypting keys
password-file: ""
# enable tracing
tracing: false
# endpoint to send tracing data (default "127.0.0.1:6831")
tracing-endpoint: 127.0.0.1:6831
# service name identifier for tracing
tracing-service-name: "bee"
# log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")
verbosity: 3
```
