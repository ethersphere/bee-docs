---
title: Hive
id: hive
---

Due to the mechanics of Swarm's [storage incentives](/docs/concepts/incentives/redistribution-game), node operators may wish to run multiple nodes in order to maximize earning potential. Read [The Book of Swarm](https://www.ethswarm.org/the-book-of-swarm-2.pdf) for more information on how the
swarm comes together.

### Docker

Up-to-date [Docker images for Bee](/docs/bee/installation/docker) are provided.

### Docker Compose

Running multiple Bee nodes is easier with
`docker-compose`. Check out the Docker compose section of the
[Docker README](https://github.com/ethersphere/bee/tree/master/packaging/docker).

### Helm

If you plan to run a large number of Bee nodes and you have experience using Kubernetes with Helm, you can have a look at how we manage our cluster under [Ethersphere/helm](https://github.com/ethersphere/helm/tree/master/charts/bee).

### Manual Setup

If you just want to run a handful of Bee nodes, you can run multiple Bee nodes by creating separate configuration files.

Create your first configuration file by running

```console
bee printconfig &> bee-config-1.yaml
```

Make as many copies of bee-config-1.yaml as you want to run Bee nodes. Increment the number in the name (`bee-config-1` to `bee-config-2`) for each new configuration file.

Configure your nodes as desired, but ensure that the values `api-addr`, `data-dir` and `p2p-addr` are unique for each configuration.

### Monitoring

See the [logging section](/docs/bee/working-with-bee/logs-and-files) for more information on how to access your node's metrics. Share your community creations (such as [swarmMonitor](https://github.com/doristeo/SwarmMonitoring) - thanks doristeo!) in the [#node-operators](https://discord.gg/X3ph5yGRFU) channel of our Discord server so we can add you to our list of all things that are [awesome](https://github.com/ethersphere/awesome-swarm) and Swarm. 🧡
