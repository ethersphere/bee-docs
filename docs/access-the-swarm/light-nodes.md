---
title: Light Nodes
id: light-nodes
---

:::danger
When requesting content from a light node, if the requesting node will not benefit from plausible deniability when sending or requesting specific chunks.
:::

#### Configuration

In order to configure light node mode, do not disable light mode in your Bee configuration.

#### Mode of Operation

At present, light mode represents a pragmatic and elegant approach to improving network stability, reliability and resiliance.

In general, *light mode* may be thought of as simply not participating in the activity of forwarding or storing chunks for other members of the swarm, these nodes are strictly consumers, who will pay gBZZ in return for services rendered by *full nodes* contributing towards moving data around the network.

This means that, although the node will participate in the pull syncing protocol by filling up it's local storage with the chunks closets to it's overlay address, the node will not serve these chunks to other peers.

Additionally, a light node will not participate in the forwarding protocol, as it will not forward chunks to peers closer to the destination address.

#### Switching On and Off

You may turn light mode on or off without corrupting your node's state.