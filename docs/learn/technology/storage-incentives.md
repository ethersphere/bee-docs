---
title: Storage Incentives
id: storage-incentives
---

One of the key challenges in a decentralised data network is incentivising users to store data. Swarm's storage incentives are designed to address this challenge by providing economic and reputation-based incentives for users to participate in the network.


### Postage Stamps

Swarm's storage incentives are based on [postage stamps](/docs/learn/technology/contracts/postage-stamp), which serve as verifiable proof of payment associated with chunks witnessed by their owner's signature. Postage stamps signal chunks' relative importance by ascribing them with xBZZ quantity which storer nodes can use when selecting which chunks to retain and serve or garbage collect during capacity shortage.

The amount of xBZZ required for a postage stamp depends on the amount of data being stored and the duration for which it will be stored. The longer a chunk is stored, the more xBZZ is required for the postage stamp. This ensures that users are incentivised to store data for longer periods, which helps ensure that data remains available in the network.

Storer nodes can use the xBZZ associated with postage stamps when selecting which chunks to retain and serve or garbage collect during capacity shortage. This means that popular content will be widely distributed across the network, reducing retrieval latency.

Swarm's storage incentives also include an opportunistic caching mechanism. Profit-maximising storage nodes serve chunks that are often requested from them, ensuring that popular content becomes widely distributed across the network and thus also reducing retrieval latency.

Swarm's storage incentives ensure that there is sufficient storage capacity available in the network by providing economic incentives for users to participate in the network. Postage stamps serve as verifiable proof of payment associated with chunks witnessed by their owner's signature, and signal chunks' relative importance by ascribing them with xBZZ quantity which storer nodes can use when selecting which chunks to retain and serve or garbage collect during capacity shortage. Swarm's storage incentives also include an opportunistic caching mechanism in order to ensure that data remains available in the network and that reliable storage services are rewarded.

