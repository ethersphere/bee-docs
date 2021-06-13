---
title: Useful Developer Info
id: useful-dev-info
---

Welcome to the Dev area! We love PR's! 🐝 

We would would love you to get involved with our [Github repo](https://github.com/ethersphere/bee).

All the action can be found on our [Discord Server](https://discord.gg/wdghaQsGq5). Sign up and get involved with our buzzing hive of daily dev chat.

If you would like to contribute, please read the [coding guidelines](https://github.com/ethersphere/bee/blob/master/CODING.md) before you get started.

Installation from source is described in the [Installation](/docs/installation/build-from-source).

# Testing a connection with PingPong protocol

To check if two nodes are connected and to see the round trip time for message exchange between them, get the overlay address from one node, for example local node 2:

```bash
curl localhost:1835/addresses
```

Make sure that Debug API is enabled and addresses configured as in examples above.

And use that address in the Debug API call on another node, for example, local node 1:

```bash
curl -XPOST localhost:1735/pingpong/d4440baf2d79e481c3c6fd93a2014d2e6fe0386418829439f26d13a8253d04f1
```

# Generating protobuf

To process protocol buffer files and generate the Go code from it two tools are needed:

- [protoc](https://github.com/protocolbuffers/protobuf/releases)
- [protoc-gen-gogofaster](https://github.com/gogo/protobuf)

Makefile rule `protobuf` can be used to automate `protoc-gen-gogofaster` installation and code generation:

```bash
make protobuf
```

# Tracing
Developers can gain an additional level of insight into the node by enabling `tracing`. To make use of Tracing, we advice to make use of [jaeger](https://www.jaegertracing.io/). 

- Set up tracing by:
  - Start jaeger:
`docker run -p 6831:6831/udp -p 16686:16686 jaegertracing/all-in-one:latest`

  - start locally two bee nodes (different data dirs and ports) and connect them (see "Start a test network" in the [advanced section](/docs/bee-developers/starting-a-test-network)) with `--tracing` flag provided for both nodes

- Make a call to the PingPong API on one of the two nodes (`curl -XPOST localhost:1735/pingpong/<overlay address other node>`).

Validate tracing in the web interface (`http://localhost:16686/`).
