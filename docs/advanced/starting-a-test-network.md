---
title: Starting a Test Network
id: starting-a-test-network
---

A test network can be used to test your applications in an isolated environment before you deploy to Swarm mainnet. It can be started by overriding the default configuration values of your Swarm node. Throughout this tutorial, we will make use of configuration files to configure the nodes but of course you can also do the same using flags or environment variables (see [Start your node](/docs/installation/configuration)). 

## Start a network on your own computer
### Configuration
Starting a network is easiest achieved by making use of configuration files. We need at least two nodes to start a network. Hence, below two configuration files are provided. Save them respectively as `config_1.yaml` and `config_2.yaml`.

**config_1.yaml**
```yaml
network-id: 7357
api-addr: :1633
p2p-addr: :1634
debug-api-addr: 127.0.0.1:1635
debug-api-enable: true
bootnode: ""
data-dir: /tmp/bee/node1
password: some pass phze
swap-enable: false
```

**config_2.yaml**
```yaml
network-id: 7357
api-addr: :1733
p2p-addr: :1734
debug-api-addr: 127.0.0.1:1735
debug-api-enable: true
data-dir: /tmp/bee/node2
bootnode: ""
password: some pass phze
welcome-message: "Bzz Bzz Bzz"
swap-enable: false
```

Note that for each node, we provide a different `api-addr`, `debug-api-addr`. If we had not specified different addresses here, we would get an `address already in use` error, as no two applications can listen to the same port. We also specify a different `p2p-addr`. If we had not, our nodes would not be able to communicate with each other. We also specify a separate `data-dir` for each node, as each node must have a it's own separate key and chunk data store.

We also provide a network-id, so that our network remains separate from the Swarm mainnet, which has network-id 1. Nodes will not connect to peers which have a different network id. We also set our bootnode to be the empty string `""`. A bootnode is responsible for bootstrapping the network so that a new node can find it's first few peers before it begins it's own journey to find friends in the Swarm. In Swarm any node can be used as a bootnode. Later, we will manually join our nodes together so in this case a bootnode isn't required.

Finally, note the `welcome-message` in the first nodes configuration file. This is a friendly feature allowing you to send a message to peers that connect to you!

### Starting Your Nodes
Now we have created our configuration files, let's start our nodes by running `bee start --config config_1.yaml`, then in another Terminal session, run `bee start --config-file config_2.yaml`.

We can now inspect the state of our network by sending HTTP requests to the [Debug API](/docs/api-reference/api-reference)..


```sh
curl -s http://localhost:1635/topology | jq .connected
> 0
```

```sh
curl -s http://localhost:1735/topology | jq .connected
> 0
```

No connections yet? Right! Let's remedy that!

:::info
Here we are using the `jq` command line utility to count the amount of objects in the `peers` array in the JSON response we have received from our Debug API, learn more about how to install and use `jq` [here](https://stedolan.github.io/jq/).
:::

### Making a network
In order to create a network from our two isolated nodes, we must first instruct our nodes to connect to each other. This step is not explicitly needed if you connect to the main Swarm network, as the default bootnodes in the Swarm network will automatically suggest peers. 

First, we will need to find out the network address of the first node. To do this, we send a HTTP request to the `addresses` endpoint of the Debug API. 

```sh
curl localhost:1635/addresses | jq
```

```json
{
  "overlay": "f57a65207f5766084d3ebb6bea5e2e4a712504e54d86a00961136b514f07cdac",
  "underlay": [
    "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmUdCRWmyQCEahHthy7G4VsbBQ6dY9Hnk79337NfadKJEs",
    "/ip4/192.168.0.10/tcp/1634/p2p/16Uiu2HAmUdCRWmyQCEahHthy7G4VsbBQ6dY9Hnk79337NfadKJEs",
    "/ip6/::1/tcp/1634/p2p/16Uiu2HAmUdCRWmyQCEahHthy7G4VsbBQ6dY9Hnk79337NfadKJEs",
    "/ip4/xx.xx.xx.xx/tcp/40317/p2p/16Uiu2HAmUdCRWmyQCEahHthy7G4VsbBQ6dY9Hnk79337NfadKJEs"
  ]
}
```

Here, we get firstly the **overlay address** - this is the permanent address Swarm uses as your anonymous identity in the network and secondly, a list of all the [multiaddresses](https://docs.libp2p.io/reference/glossary/#multiaddr), which are physical network addresses at which you node can be found by peers. 

Note the addresses starting with an `/ip4`, followed by `127.0.0.1`, which is the `localhost` internal network in your computer. Now we can use this full address to be the bootnode of our second node so that when it starts up, it goes to this address and both nodes become peers of each other. Let's add this into our config_2.yaml file. 

**config_2.yaml**
```yaml
network-id: 7357
api-addr: :1733
p2p-addr: :1734
debug-api-addr: 127.0.0.1:1735
debug-api-enable: true
data-dir: /tmp/bee/node2
bootnode: "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAmUdCRWmyQCEahHthy7G4VsbBQ6dY9Hnk79337NfadKJEs"
password: some pass phze
welcome-message: "Bzz Bzz Bzz"
swap-enable: false
```

Now, we can shut our second node and reboot with the new configuration.

Look at the the output for your first node, you should see our connection message!

Let's also verify that we can see both nodes in using each other's Debug API's.

```sh
curl -s http://localhost:1635/peers | jq
```

```sh
curl -s http://localhost:1635/peers | jq
```

Congratulations! You have made your own tiny two bee Swarm! 🐝 🐝