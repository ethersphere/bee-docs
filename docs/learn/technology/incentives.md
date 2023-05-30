---
title: Incentives
id: incentives
---

One of the key challenges in a decentralised data network is incentivising users to store data and provide bandwidth. Swarm addresses this challenge with two incentives systems, one which rewards nodes for sharing their storage space and another which rewards them for sharing bandwidth.


### Storage Incentives 

Swarm's storage incentives protocol is defined in depth in the [Future Proof Storage](https://www.ethswarm.org/swarm-storage-incentives.pdf) paper published by the Swarm team.

Swarm's storage incentives are based on [postage stamps](/docs/learn/technology/contracts/postage-stamp), which serve as verifiable proof of payment associated with chunks witnessed by their owner's signature. Postage stamps signal chunks' relative importance by ascribing them with xBZZ quantity which storer nodes can use when selecting which chunks to retain and which to evict from their reserve when their reserve capacity is exceeded.

The amount of xBZZ required for a postage stamp depends on the amount of data being stored and the duration for which it will be stored. The longer a chunk is stored, the more xBZZ is required for the postage stamp. This ensures that users are incentivised to store data for longer periods, which helps ensure that data remains available in the network.

Storer nodes can use the xBZZ associated with postage stamps when selecting which chunks to retain and serve or garbage collect during capacity shortage. This means that popular content will be widely distributed across the network, reducing retrieval latency.


### Bandwidth Incentives (SWAP) 

The Swarm Accounting Protocol (SWAP) is a protocol used in the Swarm network to manage the exchange of resources between nodes. SWAP ensures that node operators collaborate in routing messages and data while protecting the network against frivolous use of bandwidth.

SWAP works by tracking the relative consumption of bandwidth between nodes. As nodes relay requests and responses, they keep track of their bandwidth usage with each of their peers. Within bounds, peers engage in a service-for-service exchange, where they provide resources to each other based on their relative usage.

However, once a limit is reached, the party in debt can either wait until their liabilities are amortized over time or can pay by sending cheques that cash out in BZZ on the blockchain. [Chequebook](/docs/learn/technology/contracts/chequebook/) contracts are used to manage these cheques and ensure that they are valid and can be cashed out correctly.

SWAP uses built-in incentives to optimize the allocation of bandwidth and storage resources and render Swarm economically self-sustaining. Swarm nodes track their relative bandwidth contribution on each peer connection, and excess debt due to unequal consumption can be settled in BZZ. Publishers in Swarm must spend BZZ to purchase the right to write data to Swarm and prepay some rent for long-term storage.

The SWAP protocol also includes some additional features to prevent abuse or fraud. For example, it can impose limits on how much debt a node can accumulate before requiring payment or require nodes to provide collateral before sending cheques.
