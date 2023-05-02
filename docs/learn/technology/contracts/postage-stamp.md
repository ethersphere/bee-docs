---
title: Postage Stamp 
id: postage-stamp
---

The [postage stamp contract](https://github.com/ethersphere/storage-incentives/blob/master/src/PostageStamp.sol) is a smart contract which is a key part of Swarm's [storage incentives](/docs/learn/technology/storage-incentives) which make up the foundation of Swarm's self-sustaining economic system. It allows users to purchase batches of postage stamps for xBZZ tokens. These stamps can then be used to attach to data chunks that are uploaded to the Swarm network.

When a user uploads data to Swarm, they attach a postage stamp to each chunk of data. The value of the stamp indicates how much it is worth to persist the associated content on Swarm, which storer nodes use to prioritize which chunks to remove from the reserve first.

The value of a postage stamp decreases over time as if storage rent was regularly deducted from the batch balance. Once the value of a stamp is no longer sufficient, the associated chunk is evicted from the reserve.


### How Postage Stamps Work

Stamp batches are created in buckets with a depth 16. The entire swarm address space is divided into $$2^{16}$$ different buckets. When uploaded, files are split into 4kb chunks and assigned to a specific bucket based on the chunk's address.

Each batch of stamps has two key parameters, batch depth and amount.

### Batch Depth

A batch of postage stamps can be used to stamp a maximum of $$2^{depth}$$ number of chunks.

Batch depth determines how many chunks are allowed in each bucket. The number of chunks allowed in each bucket is calculated like so:

$$2^{(batch depth - bucket depth)}$$

*Example: Batch depth = 20*

For a batch with a batch depth of 20, a maximum of $$2^{20} = 1,048,576$$ chunks can be stamped.   

Given the constant bucket depth of 16, for a batch depth of 20, the number of chunks per bucket is calculated like so:

$$2^{(20 - 16)} = 16 \text{ chunks/bucket}$$

### Amount

The *amount* parameter is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total amount of xBZZ that will be paid for the batch is calculated from this figure and the batch depth like so:

$$2^{depth} \times {amount}$$

The paid amount forms the balance of the batch. This balance is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.

*Example: Batch depth = 20 and Amount = 1000000000* 

$$\text{balance}=2^{20} \times {1000000000} = 0.1048576 \text{ xBZZ}$$ 

