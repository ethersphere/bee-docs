---
title: PSS Messaging
id: pss
---

Out of the ashes of Ethereum's vision for a leak-proof decentralised anonymous messaging system - Whisper - comes PSS. Swarm provides the ability to send messages that appear to be normal Swarm traffic, but are in fact messages that may be received and decrypted to reveal their content only by the specific nodes they were intended to be received by.

:::danger
PSS is currently an experimental feature and messages are not currently encrypted! Encryption is coming soon, but for now this feature should be used for evaluation and non-sensitive purposes only. API's may change!
:::

PSS provides a pub-sub facility that can be used for a variety of tasks. Nodes are able to listen to messages received for a specific topic in their nearest neighbourhood and create messages destined for another neighbourhood which are sent over the network using Swarm's usual data dissemination protocols.

### Enable PSS On Your Node

In order to use the PSS messaging facilities you must pass the relevant configuration flags when starting your node.

```sh
	make binary && dist/bee start --api-addr=:8080 --debug-api-addr=:6063 --verbosity=5 --password="x" --data-dir=/Users/sig/.bee72365789 --cors-allowed-origins="*" --bootnode="" --p2p-ws-enable --debug-api-enable --p2p-addr=:7073
```

### Subscribe and Receive Messages

In order to receive PSS messages you must first enable the p2p websockets api when starting your node.

```sh
	bee start --p2p-ws-enable
```

Once your Bee node is up and running, you will be able to subscribe to feeds using websockets. For testing, it is useful to use the [websocat](https://docs.rs/crate/websocat/1.0.1) command line utility.

Here we subscribe to the topic `test-topic`

```sh
websocat ws://localhost:8080/pss/subscribe/test-topic
```

Our node is now watching for new messages received in it's nearest neighbourhood.

### Send Messages

Messages can be sent simply by sending a `POST` request to the PSS api endpoint.

When sending messages, we must specify the first two bytes of the recipients swarm address, which represents their neighbourhood. In this case, we want to send to a node with address `49d80b28adccd67a09959a601f0e28521aaeb06bf1bf17e9e012e7b597c3d926`, so we must include the 'target' `49d8`.

```sh
curl -XPOST localhost:8082/pss/send/test/49d8 --data "test2"
```

:::danger
Remember that for now all nodes in the neighbourhood will be able to see these messages. PSS encryption is coming soon and will deliver fully encrypted messaging.
:::

### Send Messages in a Test Network

Now, let's set up two Bee nodes, connect them, and send messages from one to the other.

First run two Bee nodes. We will start them with distinct ports for the api, debug api and p2p port so that there are no conflicts. 

Run the first node:

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

We must make a note of the Swarm overlay address and the underlay address which are created once each node has started.

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
  "overlay": "d7bf6bc57a88acbedf2c0aef44b8e6b9879a2b9b4851c84c5bb38ad261669fa7",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAmQuSr9YL1qNqvtySp67VqkUzFJTiy7nLFXkgn6qNSywYA",
    "/ip4/10.169.169.20/tcp/7073/p2p/16Uiu2HAmQuSr9YL1qNqvtySp67VqkUzFJTiy7nLFXkgn6qNSywYA",
    "/ip6/::1/tcp/7073/p2p/16Uiu2HAmQuSr9YL1qNqvtySp67VqkUzFJTiy7nLFXkgn6qNSywYA",
    "/ip4/81.98.94.4/tcp/48231/p2p/16Uiu2HAmQuSr9YL1qNqvtySp67VqkUzFJTiy7nLFXkgn6qNSywYA"
  ]
}
```

Because we configured the nodes to start with now bootnodes, using `--bootnode=""`, neither node should have any peers yet.

```sh
 curl -s localhost:6062/peers | jq
```

```json
{
  "peers": []
}
```

Let's connect them.

```sh
curl -XPOST localhost:6062/connect/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAmQuSr9YL1qNqvtySp67VqkUzFJTiy7nLFXkgn6qNSywYA
```

We can now see our first node is peered with our second.

```sh
 curl -s localhost:6062/peers | jq
```

```json
{
  "peers": [
    {
      "address": "d7bf6bc57a88acbedf2c0aef44b8e6b9879a2b9b4851c84c5bb38ad261669fa7"
    }
  ]
}
```

Next, let's use `websocat` to listen for PSS messages on a specific topic ID.

```sh
websocat ws://localhost:8082/pss/subscribe/test-topic
```

Now we can use PSS to send a message from our second node to our first node. 

Since our first node has address prefix `c477`, we must specify this as the `targets` argument in our POST request.

```sh
curl -XPOST localhost:8083/pss/send/test-topic/c477 --data "Hello Swarm"
```

If we're successful, we'll see a message pop up in our `websocat` console!

```sh
sig :: ~ » websocat ws://localhost:8082/pss/subscribe/test-topic
Hello Swarm
```


