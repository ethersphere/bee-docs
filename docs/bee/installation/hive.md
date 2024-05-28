---
title: Hive
id: hive
---

Because of how the swarm is structured, we recommend that users
wishing to scale up their Bee operation, or set up a commercial Bee
hive should seek to run many instances of Bee simultaneously. Read [The Book of Swarm](https://www.ethswarm.org/the-book-of-swarm-2.pdf) for more information on how the
swarm comes together.

Swarm provides tooling to help you install many Bees at once.

### Docker

Up to date [Docker images for Bee](/docs/bee/installation/docker) are provided.

### Docker-Compose

It becomes easier to run multiple Bee nodes with
`docker-compose`. Check out the Docker compose section of the
[Docker README](https://github.com/ethersphere/bee/tree/master/packaging/docker).

### Helm

If you really want to run a lot of Bee nodes and you have experience using Kubernetes with Helm, you can have a look at how we manage our cluster under [Ethersphere/helm](https://github.com/ethersphere/helm/tree/master/charts/bee).

### Manually

If you just want to run a handful of bee nodes, you can run multiple bee nodes by creating separate configuration files.

Create your first configuration file by running

```console
bee printconfig &> bee-config-1.yaml
```

Make as many copies of bee-config-1.yaml as you want to run bee nodes. Increment the number in the name (`bee-config-1` to `bee-config-2`) for each new configuration file.

Configure your nodes as desired, but ensure that the values `api-addr`, `data-dir` and `p2p-addr` are unique for each configuration.

### Monitoring

See the monitoring section on how to access Bee's internal metrics! Share your community creations (like [swarmMonitor](https://github.com/doristeo/SwarmMonitoring) - thanks doristeo!) in the [#node-operators](https://discord.gg/X3ph5yGRFU) channel of our Discord server so we can add you to our list of all things that are [awesome](/docs/learn/ecosystem/awesome) and Swarm. 🧡
