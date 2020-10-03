---
title: PSS Messaging
id: pss
---

Out of the ashes of Ethereum's vision for a leak-proof decentralised anonymous messaging system - Whisper - comes PSS. Swarm provides the ability to send messages that appear to be normal Swarm traffic, but are in fact messages that may be received and decrypted to reveal their content only by the specific nodes they were intended to be received by.

PSS provides a pub-sub facility that can be used for a variety of tasks. Nodes are able to listen to messages received for a specific topic in their nearest neighbourhood and create messages destined for another neighbourhood which are sent over the network using Swarm's usual data dissemination protocols.

### Subscribe and Receive Messages

Once your Bee node is up and running, you will be able to subscribe to feeds using websockets. For testing, it is useful to use the [websocat](https://docs.rs/crate/websocat/1.0.1) command line utility.

Here we subscribe to the topic `test-topic`

```sh
websocat ws://localhost:8080/pss/subscribe/test-topic
```

Our node is now watching for new messages received in it's nearest neighbourhood.

### Send Messages

Messages can be sent simply by sending a `POST` request to the PSS api endpoint.

When sending messages, we must specify a 'target' prefix of the recipients swarm address, a partial address representing their neighbourhood. Currently the length of this prefix is recommended to be two bytes, which will work well until the network has grown to a size of ca. 20-50K nodes. We must also provide the public key, so that Bee can encrypt the message in such a way that it may only be read by the intended recipient.

For example, if we want to send a PSS message with **topic** `test-topic` to a node with address...

`7bc50a5d79cb69fa5a0df519c6cc7b420034faaa61c175b88fc4c683f7c79d96` 

...and public key...

`0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd`

...we must include the **target** `7bc5` and the public key itself as a query argument.

```sh
curl -XPOST \
localhost:8082/pss/send/test/7bc5?recipient=0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd \
--data "Hello Swarm"
```

### Send Messages in a Test Network

Now, let's see this in action by setting up two Bee nodes on a test network, connecting them, and sending PSS messages from one to the other.

First start two Bee nodes. We will start them with distinct ports for the api, debug api and p2p port so that there are no conflicts, since they will be running on the same computer. 

Run the following command to start the first node. Note that we are passing `""` to the `--bootnode` argument so that our nodes will not connect to a network.

```sh
bee start \
    --api-addr=:8082 \
    --debug-api-enable \
    --debug-api-addr=:6062 \
    --data-dir=/tmp/bee2 \
    --bootnode="" \
    --p2p-addr=:7072 \
    --swap-enable=false
```

We must make a note of the Swarm overlay address, underlay address and public key which are created once each node has started. We find this information from the addresses endpoint of the Debug API.

```sh
curl -s localhost:6062/addresses | jq
```

```json
{
  "overlay": "7bc50a5d79cb69fa5a0df519c6cc7b420034faaa61c175b88fc4c683f7c79d96",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAmP9i7VoEcaGtHiyB6v7HieoiB9v7GFVZcL2VkSRnFwCHr",
    "/ip4/192.168.0.10/tcp/7072/p2p/16Uiu2HAmP9i7VoEcaGtHiyB6v7HieoiB9v7GFVZcL2VkSRnFwCHr",
    "/ip6/::1/tcp/7072/p2p/16Uiu2HAmP9i7VoEcaGtHiyB6v7HieoiB9v7GFVZcL2VkSRnFwCHr"
  ],
  "ethereum": "0x0000000000000000000000000000000000000000",
  "public_key": "0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd"
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
    --p2p-addr=:7073 \
    --swap-enable=false
```

```sh
curl -s localhost:6063/addresses | jq
```

```json
{
  "overlay": "a231764383d7c46c60a6571905e72021a90d506ef8db06750f8a708d93fe706e",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAmAqJkKJqZjNhuDtepc8eBANM9TvagaWUThfTN5NkfmKTq",
    "/ip4/192.168.0.10/tcp/7073/p2p/16Uiu2HAmAqJkKJqZjNhuDtepc8eBANM9TvagaWUThfTN5NkfmKTq",
    "/ip6/::1/tcp/7073/p2p/16Uiu2HAmAqJkKJqZjNhuDtepc8eBANM9TvagaWUThfTN5NkfmKTq",
    "/ip4/81.98.94.4/tcp/25178/p2p/16Uiu2HAmAqJkKJqZjNhuDtepc8eBANM9TvagaWUThfTN5NkfmKTq"
  ],
  "ethereum": "0x0000000000000000000000000000000000000000",
  "public_key": "02d68d57d9f3fe539990cdf03e7de96d56a5c68b42515bc465acec4edc5cedfe35"
}
```

Because we configured the nodes to start with no bootnodes, neither node should have peers yet.

```sh
curl -s localhost:6062/peers | jq
```

```sh
curl -s localhost:6063/peers | jq
```

```json
{
  "peers": []
}
```

Let's connect node 2 to node 1 using the localhost (127.0.0.1) underlay address for node 1 that we have noted earlier.

```sh
curl -XPOST \
  localhost:6063/connect/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAmP9i7VoEcaGtHiyB6v7HieoiB9v7GFVZcL2VkSRnFwCHr
```

Now, if we check our peers endpoint for node 1, we can see our nodes are now peered together.

```sh
curl -s localhost:6062/peers | jq
```

```json
{
  "peers": [
    {
      "address": "a231764383d7c46c60a6571905e72021a90d506ef8db06750f8a708d93fe706e"
    }
  ]
}
```

Of course, since we are p2p, node 2 will show node 1 as a peer too.

```sh
curl -s localhost:6063/peers | jq
```

```json
{
  "peers": [
    {
      "address": "7bc50a5d79cb69fa5a0df519c6cc7b420034faaa61c175b88fc4c683f7c79d96"
    }
  ]
}
```

We will use `websocat` to listen for PSS messages topic ID `test-topic` on our first node.

```sh
websocat ws://localhost:8082/pss/subscribe/test-topic
```

Now we can use PSS to send a message from our second node to our first node. 

Since our first node has a 2 byte address prefix of `a231`, we will specify this as the `targets` section in our POST request's URL. We must also include the public key of the recipient as a query parameter so that the message can be encrypted in a way only our recipient can decrypt.

```sh
curl \
  -XPOST "localhost:8083/pss/send/test-topic/7bc5?recipient=0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd"\
  --data "Hello Swarm"
```

The PSS API endpoint will now create a PSS message for it's recipient in the form of a 'Trojan Chunk' and send this into the network so that it may be pushed to the correct neighbourhood. Once it is received by it's destination target it will be decrypted and determined to be a message with the topic we are listening for. Our second node will decrypt the data and we'll see a message pop up in our `websocat` console!

```sh
sig :: ~ » websocat ws://localhost:8082/pss/subscribe/test-topic
Hello Swarm
```

Congratulations! 🎉 You have sent your first encrypted, zero leak message over Swarm!
