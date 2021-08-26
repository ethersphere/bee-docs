---
title: PSS Messaging
id: pss
---

Out of the ashes of Ethereum's vision for a leak-proof decentralised anonymous messaging system - Whisper - comes PSS (or BZZ, whispered! 🤫). Swarm provides the ability to send messages that appear to be normal Swarm traffic, but are in fact messages that may be received and decrypted to reveal their content only by the specific nodes they were intended to be received by.

PSS provides a pub-sub facility that can be used for a variety of tasks. Nodes are able to listen to messages received for a specific topic in their nearest neighbourhood and create messages destined for another neighbourhood which are sent over the network using Swarm's usual data dissemination protocols.

### Subscribe and Receive Messages

Once your Bee node is up and running, you will be able to subscribe to feeds using WebSockets. For testing, it is useful to use the [websocat](https://docs.rs/crate/websocat/1.0.1) command line utility.

Here we subscribe to the topic `test-topic`

```bash
websocat ws://localhost:1633/pss/subscribe/test-topic
```

Our node is now watching for new messages received in its nearest neighbourhood.

:::info
Because a message is disguised as a normal chunk in Swarm, you will receive the message upon syncing the chunk, even if your node is not online at the moment when the message was send to you.
:::

### Send Messages

Messages can be sent simply by sending a `POST` request to the PSS API endpoint.

When sending messages, we must specify a 'target' prefix of the
recipient's Swarm address, a partial address representing their
neighbourhood. Currently the length of this prefix is recommended to
be two bytes, which will work well until the network has grown to a
size of ca. 20-50K nodes. We must also provide the public key, so that
Bee can encrypt the message in such a way that it may only be read by
the intended recipient.

For example, if we want to send a PSS message with **topic** `test-topic` to a node with address...

`7bc50a5d79cb69fa5a0df519c6cc7b420034faaa61c175b88fc4c683f7c79d96` 

...and public key...

`0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd`

...we must include the **target** `7bc5` and the public key itself as a query argument.

```bash
curl -XPOST \
localhost:1833/pss/send/test-topic/7bc5?recipient=0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd \
--data "Hello Swarm"
```

### Send Messages in a Test Network

Now, let's see this in action by setting up two Bee nodes on a test network, connecting them, and sending PSS messages from one to the other.

First start two Bee nodes. We will start them with distinct ports for
the API, Debug API, and p2p port, since they will be running on the
same computer.

Run the following command to start the first node. Note that we are passing `""` to the `--bootnode` argument so that our nodes will not connect to a network.

```bash
bee start \
    --api-addr=:1833 \
    --debug-api-enable \
    --debug-api-addr=:1835 \
    --data-dir=/tmp/bee2 \
    --bootnode="" \
    --p2p-addr=:1834 \
    --swap-endpoint=http://localhost:8545
```

We must make a note of the Swarm overlay address, underlay address and public key which are created once each node has started. We find this information from the addresses endpoint of the Debug API.

```bash
curl -s localhost:1835/addresses | jq
```

```json
{
  "overlay": "46275b02b644a81c8776e2459531be2b2f34a94d47947feb03bc1e209678176c",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq",
    "/ip4/192.168.0.10/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq",
    "/ip6/::1/tcp/7072/p2p/16Uiu2HAmTbaZndBa43PdBHEekjQQEdHqcyPgPc3oQwLoB2hRf1jq"
  ],
  "ethereum": "0x0b546f2817d0d889bd70e244c1227f331f2edf74",
  "public_key": "03660e8dbcf3fda791e8e2e50bce658a96d766e68eb6caa00ce2bb87c1937f02a5"
}
```

Now the same for the second node.

```bash
bee start \
    --api-addr=:1933 \
    --debug-api-enable \
    --debug-api-addr=:1935 \
    --data-dir=/tmp/bee3 \
    --bootnode="" \
    --p2p-addr=:1934 \
    --swap-endpoint=http://localhost:8545
```

```bash
curl -s localhost:1935/addresses | jq
```

```json
{
  "overlay": "085b5cf15a08f59b9d64e8ce3722a95b2c150bb6a2cef4ac8b612ee8b7872253",
  "underlay": [
    "/ip4/127.0.0.1/tcp/7073/p2p/16Uiu2HAm5RwRgkZWxDMAff2io6L4Qd1uL9yNgZSNTCdPsukcg5Qr",
    "/ip4/192.168.0.10/tcp/7073/p2p/16Uiu2HAm5RwRgkZWxDMAff2io6L4Qd1uL9yNgZSNTCdPsukcg5Qr",
    "/ip6/::1/tcp/7073/p2p/16Uiu2HAm5RwRgkZWxDMAff2io6L4Qd1uL9yNgZSNTCdPsukcg5Qr"
  ],
  "ethereum": "0x9ec47bd86a82276fba57f3009c2f6b3ace4286bf",
  "public_key": "0289634662d3ed7c9fb1d7d2a3690b69b4075cf138b683380023d2edc2e6847826"
}
```

Because we configured the nodes to start with no bootnodes, neither node should have peers yet.

```bash
curl -s localhost:1835/peers | jq
```

```bash
curl -s localhost:1935/peers | jq
```

```json
{
  "peers": []
}
```

Let's connect node 2 to node 1 using the localhost (127.0.0.1) underlay address for node 1 that we have noted earlier.

```bash
curl -XPOST \
  localhost:1935/connect/ip4/127.0.0.1/tcp/1834/p2p/16Uiu2HAmP9i7VoEcaGtHiyB6v7HieoiB9v7GFVZcL2VkSRnFwCHr
```

Now, if we check our peers endpoint for node 1, we can see our nodes are now peered together.

```bash
curl -s localhost:1835/peers | jq
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

```bash
curl -s localhost:1935/peers | jq
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

We will use `websocat` to listen for the PSS messages' Topic ID
`test-topic` on our first node.

```bash
websocat ws://localhost:1833/pss/subscribe/test-topic
```

Now we can use PSS to send a message from our second node to our first node. 

Since our first node has a 2 byte address prefix of `a231`, we will specify this as the `targets` section in our POST request's URL. We must also include the public key of the recipient as a query parameter so that the message can be encrypted in a way only our recipient can decrypt.

```bash
curl \
  -XPOST "localhost:1933/pss/send/test-topic/7bc5?recipient=0349f7b9a6fa41b3a123c64706a072014d27f56accd9a0e92b06fe8516e470d8dd" \
  --data "Hello Swarm"
```

The PSS API endpoint will now create a PSS message for its recipient
in the form of a 'Trojan Chunk' and send this into the network so that
it may be pushed to the correct neighbourhood. Once it is received by
its recipient it will be decrypted and determined to be a message with
the topic we are listening for. Our second node will decrypt the data
and we'll see a message pop up in our `websocat` console!

```bash
websocat ws://localhost:1833/pss/subscribe/test-topic
```

```
Hello Swarm
```

Congratulations! 🎉 You have sent your first encrypted, zero leak message over Swarm!
