---
title: 'Development'
weight: 5
summary: "Information for client developers about development of Swarm."
---

Installation from source is described in the [Installation](../installation/).

## Starting more bee nodes locally with debugging

It is possible to start multiple, persistent, completely independent, bee nodes on a single running operating system. This can be achieved with less complexity with prepared configuration files for every node.

An example configuration for the first node would be:

```yaml
api-addr: :8081
p2p-addr: :7071
debug-api-addr: 127.0.0.1:6061
enable-debug-api: true
data-dir: /tmp/bee/node1
password: some pass phze
verbosity: trace
tracing: true
```

Save a file named `node1.yaml` with this content, and create as many as you need by incrementing the number in in filename and `api-addr`, `p2p-addr`, `debug-api-addr` and `data-dir`.

For example, file `node2.yaml` should have this content:

```yaml
api-addr: :8082
p2p-addr: :7072
debug-api-addr: 127.0.0.1:6062
enable-debug-api: true
data-dir: /tmp/bee/node2
password: some pass phze
verbosity: trace
tracing: true
```

### Starting the first node

The first node address will be used for other nodes to discover themselves. It is usually referred as the `bootnode address`.

```sh
bee --config node1.yaml start
```

When the node starts it will print out some of its `p2p addresses` in a multiaddress form like this: `/ip4/127.0.0.1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM`. This address is the `bootnonde address`.

### Starting other nodes

Other nodes should be started by providing the bootnode address to them, so that they can connect to each other:

```sh
bee --config node2.yaml start --bootnode /ip4/127.0.0.1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM
bee --config node3.yaml start --bootnode /ip4/127.0.0.1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM
bee --config node4.yaml start --bootnode /ip4/127.0.0.1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM
...
```

## Getting node addresses

Every node can provide its overlay address and underlay addresses by reading the logs when the node starts or through Debug API. For example, for the node 1 started with configuration above:

```sh
curl localhost:6061/addresses
```

Debug API is not started by default and has to be explicitly enabled with `--enable-debug-api --debug-api-addr 127.0.0.1:6061` command line flags or options.

It will return a response with addresses:

```json
{
  "overlay": "7ecf777fdab7553fbc4db7f265a7bd80d27b171babe931bc61e9d7966974ef47",
  "underlay": [
    "/ip6/::1/udp/7071/quic/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM",
    "/ip4/127.0.0.1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM",
    "/ip4/127.0.0.1/udp/7071/quic/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM",
    "/ip6/::1/tcp/7071/p2p/16Uiu2HAm2LXfYsY9pXtgGdQ8oPb3bAkxwpfBE6AMzcscH1UkQLZM",
  ]
}
```


## Testing a connection with PingPong protocol

To check if two nodes are connected and to see the round trip time for message exchange between them, get the overlay address from one node, for example local node 2:

```sh
curl localhost:6062/addresses
```

Make sure that Debug API is enabled and address configured as in examples above.

And use that address in the Debug API call on another node, for example, local node 1:

```sh
curl -XPOST localhost:6061/pingpong/d4440baf2d79e481c3c6fd93a2014d2e6fe0386418829439f26d13a8253d04f1
```

## Generating protobuf

To process protocol buffer files and generate the Go code from it two tools are needed:

- protoc - https://github.com/protocolbuffers/protobuf/releases
- protoc-gen-gogofaster - https://github.com/gogo/protobuf

Makefile rule `protobuf` can be used to automate `protoc-gen-gogofaster` installation and code generation:

```sh
make protobuf
```
