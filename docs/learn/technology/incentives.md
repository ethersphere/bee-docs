---
title: Incentives
id: incentives
---

One of the key challenges in a decentralised data network is incentivising users to store data and provide bandwidth. Swarm addresses this challenge with two incentives systems, one which rewards nodes for sharing their storage space and another which rewards them for sharing bandwidth.


## Storage Incentives 

Swarm's storage incentives protocol is defined in depth in the [Future Proof Storage](https://www.ethswarm.org/swarm-storage-incentives.pdf) paper published by the Swarm team.

Swarm's storage incentives are based on [postage stamps](/docs/learn/technology/contracts/postage-stamp), which serve as verifiable proof of payment associated with chunks witnessed by their owner's signature. Postage stamps signal chunks' relative importance by ascribing them with xBZZ quantity which storer nodes can use when selecting which chunks to retain and which to evict from their reserve when their reserve capacity is exceeded.

The amount of xBZZ required for a postage stamp depends on the amount of data being stored and the duration for which it will be stored. The longer a chunk is stored, the more xBZZ is required for the postage stamp. This ensures that users are incentivised to store data for longer periods, which helps ensure that data remains available in the network.

Storer nodes can use the xBZZ associated with postage stamps when selecting which chunks to retain and serve or garbage collect during capacity shortage. This means that popular content will be widely distributed across the network, reducing retrieval latency.


### Storage Incentives Details

 When someone wants to upload data to Swarm, they do so by buying [postage stamp batches](/docs/learn/technology/contracts/postage-stamp) with xBZZ. The xBZZ is collected and later redistributed to storage provider nodes to pay for their services. Which node earns the reward is determined by playing a "game". Every 152 Gnosis Chain blocks the game is played, and one node will win the accumulated xBZZ. 

The game has 3 phases, `commit`, `reveal`, and `claim`. In the `reveal` phase of a previous game, an "anchor" overlay address is randomly generated and used to determine the neighborhood for the current round. Only nodes within that neighborhood (meaning they have a certain number of [shared leading bits](/docs/learn/glossary#proximity-order-po) with the neighborhood address) may participate and have a chance to win. 

In the `commit` phase, nodes issue an on-chain transaction including an encrypted hash of the data they are storing (the unencrypted hash is known as the "reserve commitment") along with the [depth](/docs/learn/glossary#2-area-of-responsibility-related-depths) for which they are reporting. This serves as an attestation of the data they are storing without revealing any other information.

In the `reveal` phase, each node reveals the decryption key for their encrypted hashes thereby publishing the hash. One of the nodes is chosen as the honest node, and from among the honest nodes, one node is chosen as the winner. The winner is chosen at random among the honest nodes, but it is weighted in proportion to each node's stake density. Stake density is calculated as so:

$$
\text{stake density} = \text{stake(xBZZ)} \times {2}^\text{storage depth}
$$


### Penalties

During the `reveal` phase if a nodes' revealed hash does not match the honest nodes' hash, that node will be temporarily frozen and will not be able to participate in a number of upcoming rounds. Currently the freeze period is defined as:

$$
152 \times 2^{10} \text{ blocks (at 5s per block)} ≈ \text{ 9 days}
$$

## Bandwidth Incentives (SWAP) 

The Swarm Accounting Protocol (SWAP) is a protocol used in the Swarm network to manage the exchange of resources between nodes. SWAP ensures that node operators collaborate in routing messages and data while protecting the network against frivolous use of bandwidth.

SWAP works by tracking the relative consumption of bandwidth between nodes. As nodes relay requests and responses, they keep track of their bandwidth usage with each of their peers. Within bounds, peers engage in a service-for-service exchange, where they provide resources to each other based on their relative usage.

However, once a limit is reached, the party in debt can either wait until their liabilities are amortized over time or can pay by sending cheques that cash out in xBZZ on the blockchain. [Chequebook](/docs/learn/technology/contracts/chequebook/) contracts are used to manage these cheques and ensure that they are valid and can be cashed out correctly.

SWAP uses built-in incentives to optimize the allocation of bandwidth and storage resources and render Swarm economically self-sustaining. Swarm nodes track their relative bandwidth contribution on each peer connection, and excess debt due to unequal consumption can be settled in xBZZ. Publishers in Swarm must spend xBZZ to purchase the right to write data to Swarm and prepay some rent for long-term storage.

The SWAP protocol also includes some additional features to prevent abuse or fraud. For example, it can impose limits on how much debt a node can accumulate before requiring payment or require nodes to provide collateral before sending cheques.
