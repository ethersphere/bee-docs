---
title: Starting a Network
id: starting-a-network
---

# Starting a private network
A private network can be started by overriding the default configuration values of your Swarm node. We will first talk about how to start a private network on your own computer and will speak afterwards about how you can invite your friends to join this network. Throughout this tutorial, we will make use of configuration files to configure the nodes, but of course you can do the same with flags or environment variables (see [Starting your node](/bee-docs/start.html)). 

## Start a network on your own computer
### Configuration
Starting a network is easiest achieved by making use of configuration files. We need at least two nodes to start a network. Hence, below two configuration files are provided. Save them respectively as `config_1.yaml` and `config_2.yaml`.

**config_1.yaml**
```yaml
api-addr: :8080
p2p-addr: :7070
debug-api-addr: 127.0.0.1:6060
enable-debug-api: true
data-dir: /tmp/bee/node1
password: some pass phze
verbosity: trace
bootnode: ""
welcome-message: "Bzz Bzz Bzz"
```

**config_2.yaml**
```yaml
api-addr: :8081
p2p-addr: :7071
debug-api-addr: 127.0.0.1:6061
enable-debug-api: true
data-dir: /tmp/bee/node2
password: some pass phze
verbosity: trace
tracing: true
bootnode: ""
```

Note that for each node, we provide a different `api-addr`, `debug-api-addr`. If we would not specify different addresses here, we would get an `address already in use` error, as no two applications can listen to the same port. We also specify a different `p2p-addr`. If we would not do that, our nodes would not be able to communicate with each other. We won't get an error, however, as libp2p supports stream multiplexing. We also specify a seperate `data-dir` for each node. If we wouldn't specify this, the node would stop with an error `resource temporarily unavailable`, which is a protection from the database to prevent inconsistencies by multiple applications writing to the same database. Lastly, note the `welcome-message` for the first node. This is a small little feature, allowing you to set a message, printed to the console of the node which initiated a connection with you.

### Starting
Start your nodes by running `bee start --config config_1.yaml` and in another terminal `bee start --config-file config_2.yaml`.
You can expect the state of your network by calling `curl localhost:6060/topology | jq` and `curl localhost:6061/toplogy | jq`.

No connections? Right! Let's remedy that!

### Making a network
In order to create a network, you must instruct your nodes to connect to each other. This step is not explicitely needed if you connect to the main Swarm network, as there are bootnodes into the Swarm network programmed by default. 

To get the network address from the first node, we can call `curl localhost:6060/addresses | jq`. To get a list of all [multiaddresses](https://docs.libp2p.io/reference/glossary/#multiaddr) on which you node can be reached. 

Note down one of the addresses with an `ip4`, starting with 127.0.0.1 and past this full address into your config_2.yaml file. Now, shut down your second node and reboot again. 

Did it connect? Verify this by looking at the console output of your first and second node and call again the `topology` endpoint.

## Invite friends to join your network
Inviting friends to join your network is a breeze if your router or local network supports [UPNP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play). You can verify this easiest by looking again at the output of `localhost:6060/addresses`. Does it list your external IP? If yes, you can just tell your friends to set this IP as their bootnode configuration. If not, now it can become a bit difficult. Most likely, you need to switch on your UPNP, but there may be other factors involved too. Please reach out to us in [the Beehive](beehive.ethswarm.org) or with a [Github issue](https://github.com/ethersphere/bee/issues/new/choose) if you encounter problems in forming a network!