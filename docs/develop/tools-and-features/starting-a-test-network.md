---
title: Starting a Private Network
id: starting-a-test-network
---

A private network can be used to test your applications in an isolated environment before you deploy to Swarm mainnet. It can be started by overriding the default configuration values of your Swarm node. Throughout this tutorial, we will make use of configuration files to configure the nodes but of course you can also do the same using flags or environment variables (see [Start your node](/docs/bee/working-with-bee/configuration)).

## Start a network on your own computer

### Configuration

Starting a network is easiest achieved by making use of configuration files. We need at least two nodes to start a network. Hence, below two configuration files are provided. Save them respectively as `config_1.yaml` and `config_2.yaml`.

**config_1.yaml**

```yaml
network-id: 7357
api-addr: 127.0.0.1:1633
p2p-addr: :1634
bootnode: ""
data-dir: /tmp/bee/node1
password: set-a-strong-password
swap-enable: false
mainnet: false
blockchain-rpc-endpoint: https://sepolia.dev.fairdatasociety.org
verbosity: 5
full-node: true
```

**config_2.yaml**

```yaml
network-id: 7357
api-addr: 127.0.0.1::1733
p2p-addr: :1734
data-dir: /tmp/bee/node2
bootnode: ""
password: set-a-strong-password
welcome-message: "Bzz Bzz Bzz"
swap-enable: false
mainnet: false
blockchain-rpc-endpoint: https://sepolia.dev.fairdatasociety.org
verbosity: 5
full-node: true
```

Note that for each node, we provide a different `api-addr`. If we had not specified different addresses here, we
would get an `address already in use` error, as no two applications
can listen to the same port. We also specify a different
`p2p-addr`. If we had not, our nodes would not be able to communicate
with each other. We also specify a separate `data-dir` for each node,
as each node must have its own separate key and chunk data store.

We also provide a network-id, so that our network remains separate
from the Swarm mainnet, which has network-id 1. Nodes will not connect
to peers which have a different network id. We also set our bootnode
to be the empty string `""`. A bootnode is responsible for
bootstrapping the network so that a new node can find its first few
peers before it begins its own journey to find friends in the
Swarm. In Swarm any node can be used as a bootnode. Later, we will
use our first node as the bootnode for our other node(s), but for now we leave this option blank.

We have set `mainnet` to false so that our node runs on the Sepolia testnet, and we provide an RPC endpoint for Sepolia in the `blockchain-rpc-endpoint` option. We have also set `full-node` and `swap-enable` to `true` so that we can run full nodes.

Log verbosity has been set to level 5 with the `verbosity` option. By setting it at the highest level of 5, we make sure all important information is shown in our logs. Setting this is optional.

Finally, note the `welcome-message` in the first nodes configuration file. This is a friendly feature allowing you to send a message to peers that connect to you!

### Starting Your Nodes

Now we have created our configuration files, let's start our nodes by running `bee start --config config_1.yaml`, then in another Terminal session, run `bee start --config config_2.yaml`.

We can now inspect the state of our network by sending HTTP requests to the [API](/api/).

```bash
curl -s http://localhost:1633/topology | jq .connected
```

```
0
```

```bash
curl -s http://localhost:1733/topology | jq .connected
```

```
0
```

No connections yet? Right! Let's remedy that!

:::info
Here we are using the `jq` command line utility to count the amount of objects in the `peers` array in the JSON response we have received from our API, learn more about how to install and use `jq` [here](https://stedolan.github.io/jq/).
:::

### Making a network

In order to create a network from our two isolated nodes, we must first instruct our nodes to connect to each other. This step is not explicitly needed if you connect to the main Swarm network, as the default bootnodes in the Swarm network will automatically suggest peers.

First, we will need to find out the network address of the first node. To do this, we send a HTTP request to the `addresses` endpoint of the API.

```bash
curl localhost:1633/addresses | jq
```

```json
{
	"overlay": "b1978be389998e8c8596ef3c3a54214e2d4db764898ec17ec1ad5f19cdf7cc59",
	"underlay": [
		"/ip4/127.0.0.1/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ",
		"/ip4/172.25.128.69/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ",
		"/ip6/::1/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ"
	],
	"ethereum": "0xd22cc790e2aef341827e1e49cc631d2a16898cd9",
	"publicKey": "023b26ce8b78ed8cdb07f3af3d284c95bee5e038e7c5d0c397b8a5e33424f5d790",
	"pssPublicKey": "039ceb9c1f0afedf79991d86d89ccf4e96511cf656b43971dc3e878173f7462487"
}
```

Here, we get firstly the **overlay address** - this is the permanent address Swarm uses as your anonymous identity in the network and secondly, a list of all the [multiaddresses](https://docs.libp2p.io/reference/glossary/#multiaddr), which are physical network addresses at which you node can be found by peers.

Note the addresses starting with an `/ip4`, followed by `127.0.0.1`, which is the `localhost` internal network in your computer. Now we can use this full address to be the bootnode of our second node so that when it starts up, it goes to this address and both nodes become peers of each other. Let's add this into our config_2.yaml file.

**config_2.yaml**

```yaml
network-id: 7357
api-addr: 127.0.0.1::1733
p2p-addr: :1734
data-dir: /tmp/bee/node2
bootnode: "/ip4/127.0.0.1/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ"
password: set-a-strong-password
welcome-message: "Bzz Bzz Bzz"
swap-enable: false
blockchain-rpc-endpoint: https://sepolia.dev.fairdatasociety.org
verbosity: 5
full-node: true
```

Now, we can shut our second node and reboot with the new configuration.

Look at the the output for your first node, you should see our connection message!

Let's also verify that we can see both nodes in using each other's API's.

```bash
curl -s http://localhost:1633/peers | jq
```

```bash
curl -s http://localhost:1733/peers | jq
```

Congratulations! You have made your own tiny two bee Swarm! 🐝 🐝

## Funding Nodes

While you have successfully set up two nodes, they are currently unfunded with either sETH or sBZZ. Sepolia ETH (sETH) is required for issuing transactions on the Sepolia testnet, and Sepolia BZZ (sBZZ) is required for your node to operate as a full staking node.

To fund our nodes, we need to first collect the blockchain addresses for each node. We can use the `/addresses` endpoint for this:

```bash
curl localhost:1633/addresses | jq
```

```bash
{
  "overlay": "b1978be389998e8c8596ef3c3a54214e2d4db764898ec17ec1ad5f19cdf7cc59",
  "underlay": [
    "/ip4/127.0.0.1/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ",
    "/ip4/172.25.128.69/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ",
    "/ip6/::1/tcp/1634/p2p/QmQHgcpizgoybDtrQXCWRSGdTP526ufeMFn1PyeGd1zMEZ"
  ],
  "ethereum": "0xd22cc790e2aef341827e1e49cc631d2a16898cd9",
  "publicKey": "023b26ce8b78ed8cdb07f3af3d284c95bee5e038e7c5d0c397b8a5e33424f5d790",
  "pssPublicKey": "039ceb9c1f0afedf79991d86d89ccf4e96511cf656b43971dc3e878173f7462487"
}
```

Then copy the address in the "ethereum" field. This is the address you need to send sETH and sBZZ to. There are many public faucets you can use to obtain Sepolia ETH, [here is a curated list](https://faucetlink.to/sepolia).

To get Sepolia BZZ (sBZZ) you can use [this Uniswap market](https://app.uniswap.org/swap?outputCurrency=0x543dDb01Ba47acB11de34891cD86B675F04840db&inputCurrency=ETH), just make sure that you've switched to the Sepolia network in your browser wallet.

You will need to send only a very small amount of sETH such as 0.01 sETH, to get started. You will need 10 sBZZ to run a full node with staking.

After sending sETH and sBZZ to your node's address which you copied above, restart your node and it should begin operating properly as a full node.

Repeat these same steps with the other node in order to complete a private test network of two full nodes.
