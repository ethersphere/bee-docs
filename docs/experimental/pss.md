---
title: PSS Messaging
id: pss
---

Out of the ashes of Ethereum's vision for a leak-proof decentralised anonymous messaging system - Whisper - comes PSS. Swarm provides the ability to send messages that appear to be normal Swarm traffic, but are in fact messages that may be received and decrypted to reveal their content only by the specific nodes they were intended to be received by.

PSS provides a pub-sub facility that can be used for a variety of tasks. Nodes are able to listen to messages received for a specific topic in their nearest neighbourhood and create messages destined for another neighbourhood which are sent over the network using Swarm's usual data dissemination protocols.

### Enable PSS On Your Node

In order to receive PSS messages you must first enable the p2p websockets API when starting your node.

```sh
	bee start --p2p-ws-enable
```

### Subscribe and Receive Messages

Once your Bee node is up and running, you will be able to subscribe to feeds using websockets. For testing, it is useful to use the [websocat](https://docs.rs/crate/websocat/1.0.1) command line utility.

Here we subscribe to the topic `test-topic`

```sh
websocat ws://localhost:8080/pss/subscribe/test-topic
```

Our node is now watching for new messages received in it's nearest neighbourhood.

### Send Messages

Messages can be sent simply by sending a `POST` request to the PSS api endpoint.

When sending messages, we must specify a 'target' prefix of the recipients swarm address, a partial address representing their neighbourhood. Currently the length of this prefix is recommended to be two bytes, which will work well until the network has grown to a size of ca. 20-50K nodes. 

For example, if we want to send a PSS message to a node with address `49d80b28adccd67a09959a601f0e28521aaeb06bf1bf17e9e012e7b597c3d926`, we must include the 'target' `49d8`.

```sh
curl -XPOST localhost:8082/pss/send/test/49d8 --data "Hello Swarm"
```

### Send Messages in a Test Network

Now, let's see this in action by setting up two Bee nodes, connecting them, and sending PSS messages from one to the other.

First start two Bee nodes. We will start them with distinct ports for the api, debug api and p2p port so that there are no conflicts, since they will be running on the same computer. 

Run the following command to start the first node. Note that we are passing `""` to the `--bootnode` argument so that our nodes will not connect to the network.

```sh
bee start \
    --api-addr=:8082 \
    --debug-api-enable \
    --debug-api-addr=:6062 \
    --data-dir=/tmp/bee2 \
    --bootnode="" \
    --p2p-ws-enable \
    --p2p-addr=:7072
```

We must make a note of the Swarm overlay address, underlay address and public key which are created once each node has started. We find this information from the addresses endpoint of the debug API.

```sh
curl -s localhost:6062/addresses | jq
```

```json
{
  "overlay": "c4773d0d7e8e0b7cc2145b1f9c149a0befecaf7cb2ed6eb83a32babe60a18646",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAkypRG6iEA86Vgq8xWrywcFyFHeuX9apCezcbS3cCjGtnL",
    "/ip4/10.169.169.20/tcp/7072/p2p/16Uiu2HAkypRG6iEA86Vgq8xWrywcFyFHeuX9apCezcbS3cCjGtnL",
    "/ip6/::1/tcp/7072/p2p/16Uiu2HAkypRG6iEA86Vgq8xWrywcFyFHeuX9apCezcbS3cCjGtnL",
    "/ip4/81.98.94.4/tcp/38023/p2p/16Uiu2HAkypRG6iEA86Vgq8xWrywcFyFHeuX9apCezcbS3cCjGtnL"
  ],
  "public_key": "02548ba0cec39e6cae23b698eeff8bebbfee45811cdcf77bc53f1f59c528d00b98"
}
```

Now the same for the second node.

```sh
bee start \
    --api-addr=:8083 \
    --debug-api-enable \
    --debug-api-addr=:6063 \
    --data-dir=/tmp/bee3 \
    --bootnode="" \
    --p2p-ws-enable \
    --p2p-addr=:7073
```

```sh
curl -s localhost:6062/addresses | jq
```

```json
{
  "overlay": "c7806e676ac14f0f20aba144299146131bd33635c5b814ab993752386496b2cb",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAmVTDofiUt3BKE739m3ozsUMGuzD8mo6agADkzmrJ33uvn",
    "/ip4/192.168.0.10/tcp/7073/p2p/16Uiu2HAmVTDofiUt3BKE739m3ozsUMGuzD8mo6agADkzmrJ33uvn",
    "/ip6/::1/tcp/7073/p2p/16Uiu2HAmVTDofiUt3BKE739m3ozsUMGuzD8mo6agADkzmrJ33uvn",
    "/ip4/81.98.94.4/tcp/20044/p2p/16Uiu2HAmVTDofiUt3BKE739m3ozsUMGuzD8mo6agADkzmrJ33uvn"
  ],
  "public_key": "034de9400e9200d7b22b9c6ff72a1d6b424c97ae4f4e151dd7ab49741db22e1310"
}
```

Because we configured the nodes to start with no bootnodes, neither node should have any peers yet.

```sh
 curl -s localhost:6062/peers | jq
```

```json
{
  "peers": []
}
```

Let's connect them using the localhost (127.0.0.1) underlay address we noted earlier.

```sh
curl -XPOST localhost:6062/connect/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAmVTDofiUt3BKE739m3ozsUMGuzD8mo6agADkzmrJ33uvn
```

Now, if we check our peers endpoint for node 1, we can see our nodes are now peered together.

```sh
 curl -s localhost:6062/peers | jq
```

```json
{
  "peers": [
    {
      "address": "c7806e676ac14f0f20aba144299146131bd33635c5b814ab993752386496b2cb"
    }
  ]
}
```

We will use `websocat` to listen for PSS messages on a specific topic ID on our first node.

```sh
websocat ws://localhost:8082/pss/subscribe/test-topic
```

Now we can use PSS to send a message from our second node to our first node. 

Since our first node has a 2 byte address prefix of `c477`, we will specify this as the `targets` argument in our POST request. We must also include the public key of the recipient as a query parameter so that the message can be encrypted in a way only our recipient can decrypt.

```sh
curl \
	-XPOST "localhost:8083/pss/send/test-topic/c477?recipient=02548ba0cec39e6cae23b698eeff8bebbfee45811cdcf77bc53f1f59c528d00b98"\
	--data "Hello Swarm"
```

The PSS API endpoint will now create a PSS message for it's recipient in the form of a 'Trojan Chunk' and send this into the network so that it may be pushed to the correct neighbourhood. Once it is received by it's destination target it will be decrypted and determined to be a message with the topic we are listening for. Our second node will decrypt the data and we'll see a message pop up in our `websocat` console!

```sh
sig :: ~ » websocat ws://localhost:8082/pss/subscribe/test-topic
Hello Swarm
```

