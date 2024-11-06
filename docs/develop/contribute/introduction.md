---
title: Introduction
id: introduction
---

# Contribute to Bee Development

Welcome to the Dev area! We love PR's! 🐝

We would would love you to get involved with our [Github repo](https://github.com/ethersphere/bee).

Connect with other Bee developers over at the official [Discord Server](https://discord.gg/wdghaQsGq5). Sign up and get involved with our buzzing hive of daily dev chat.

- If you would like to contribute, please read the [coding guidelines](https://github.com/ethersphere/bee/blob/master/CODING.md) before you get started.

- Installation from source is described in the [Installation](/docs/bee/installation/build-from-source).

- Contribute to Swarm’s evolution by proposing your own Swarm Improvement Proposal (SWIP) [here](https://github.com/ethersphere/SWIPs).

## Testing a connection with PingPong protocol

To check if two nodes are connected and to see the round trip time for message exchange between them, get the overlay address from one node, for example local node 2:

```bash
curl localhost:1833/addresses
```

Make sure addresses are configured as in examples above.

And use that address in the API call on another node, for example, local node 1:

```bash
curl -X POST localhost:1735/pingpong/d4440baf2d79e481c3c6fd93a2014d2e6fe0386418829439f26d13a8253d04f1
```

## Generating protobuf

To process protocol buffer files and generate the Go code from it two tools are needed:

- [protoc](https://github.com/protocolbuffers/protobuf/releases)
- [protoc-gen-gogofaster](https://github.com/gogo/protobuf)

Makefile rule `protobuf` can be used to automate `protoc-gen-gogofaster` installation and code generation:

```bash
make protobuf
```
