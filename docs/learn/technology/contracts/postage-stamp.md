---
title: Postage Stamp 
id: postage-stamp
---

The [postage stamp contract](https://github.com/ethersphere/storage-incentives/blob/master/src/PostageStamp.sol) is a smart contract on the Gnosis blockchain that allows users to purchase batches of postage stamps for xBZZ tokens. These stamps can then be used to attach to data chunks that are uploaded to the Swarm network.

When a user uploads data to Swarm, they attach a postage stamp to each chunk of data. The value of the stamp indicates how much it is worth for a user to persist the associated content in Swarm. By using this value to prioritize which chunks to remove from the reserve first, storer nodes maximize the utility of the DISC algorithm.

The value of a postage stamp decreases over time as if storage rent was regularly deducted from the batch balance. Once the value of a stamp is no longer sufficient, the associated chunk is evicted from the reserve and put into the cache.

The postage stamp contract ensures that users pay for storage on the Swarm network and provides incentives for node operators to store and retrieve data correctly. By purchasing batches of postage stamps, users can ensure that their data is stored securely and efficiently on the Swarm network.