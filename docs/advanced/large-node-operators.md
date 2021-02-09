---
title: Large node operators
id: large-node-operators
---

This page gives some pointers for everybody who wishes to contribute a lot of storage space to Swarm. 

# Assigning more space to my Bee node or running multiple Bee nodes?
We advise running multiple bee nodes, each with the default size of the database.
To understand why this is the case, we must understand the level of pickiness (how picky a node is when deciding to store a chunk) of nodes with a large capacity versus a node with a small capacity.
A node with a large capacity has a much lower pickiness than a node with a smaller capacity. Hence, the node will store chunks that would not have been stored by a more picky node.
If your node has a much larger capacity than the average node in the network, it is likely to store chunks that belong together with chunks that were already deleted by other nodes.
Since your node gets paid by serving chunks upon request and it is less likely that chunks are requested that belong to content that is mostly gone from Swarm, it is best to run a node whose pickiness is equal to the average pickiness of the network.

# Running multiple Bee nodes
## with configuration files
If you just want to run a handful of bee nodes, you can run multiple bee nodes by creating separate configuration files.
Create your first configuration file by running

```console
bee printconfig \
  &> bee-config-1.yaml
```
Make as many copies of bee-config-1.yaml as you want to run bee nodes. Increment the number in the name (`bee-config-1` to `bee-config-2`) for each new configuration file.

Configure your nodes as desired, but ensure that the values `api-addr`, `data-dir`, `debug-api-addr`, `p2p-addr` and `clef-signer-endpoint` are unique for each configuration.

Start each bee node in a separate terminal by running:

```console
bee start --config bee-config-<number_of_config_file>
```

## with docker-compose
It becomes easier to run multiple bee nodes with `docker-compose`. Please have a look at the [README](https://github.com/ethersphere/bee/tree/master/packaging/docker) the docker-compose section of the bee node.

## with Kubernetes
If you really want to run a lot of bee nodes and you have experience using Kubernetes with Helm, you can have a look at how we manage our cluster under [Ethersphere/helm](https://github.com/ethersphere/helm/tree/master/charts/bee).
