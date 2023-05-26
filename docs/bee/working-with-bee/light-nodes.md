---
title: Light Nodes
id: light-nodes
---

:::danger
When a light node is requesting data from the network - it will not benefit from plausible deniability. This is because a light node does not forward on behalf of other nodes, and so it is always the _originator_ of the request.
:::

#### Configuration

To run Bee as a light node `full-node` must be set to `false` and `swap-enable` must be set to `true`, and a stable Gnosis Chain RPC endpoint URL must be specified with `blockchain-rpc-endpoint` in the [configuration](/docs/working-with-bee/configuration).

#### Mode of Operation

At present, light mode represents a pragmatic and elegant approach to improving network stability, reliability and resilience.

In general, _light mode_ may be thought of as simply not participating
in the activity of forwarding or storing chunks for other members of
the swarm, these nodes are strictly consumers, who will pay xBZZ in
return for services rendered by _full nodes_ - those contributing
towards moving data around the network.

This means that although the node will participate in the pull
syncing protocol by filling up its local storage with the chunks
closest to its overlay address, the node will not serve these chunks
to other peers.

Additionally, a light node will not participate in the forwarding protocol, as it will not forward chunks to peers closer to the destination address.
