---
title: Postage Stamp 
id: postage-stamp
---

import DepthCalc from '@site/src/components/DepthCalc';
import BatchCostCalc from '@site/src/components/BatchCostCalc';

The [postage stamp contract](https://github.com/ethersphere/storage-incentives/blob/master/src/PostageStamp.sol) is a smart contract which is a key part of Swarm's [storage incentives](/docs/learn/technology/incentives) which make up the foundation of Swarm's self-sustaining economic system. It allows users to purchase batches of postage stamps for xBZZ tokens. These stamps can then be used to attach to [chunks](/docs/learn/technology/DISC) that are uploaded to the Swarm network.

When a node uploads data to Swarm, it attaches postage stamps to each chunk of data. Postage stamps are issued in batches rather than one by one. The value assigned to a stamp indicates how much it is worth to persist the associated data on Swarm, which nodes use to prioritize which chunks to remove from their reserve first.

The value of a postage stamp decreases over time as if storage rent was regularly deducted from the batch balance. Once the value of a stamp is no longer sufficient, the associated chunk is evicted from the reserve.



## Bucket Depth

Postage stamps are issued in batches with a certain number of storage slots divided amongst $$2^{bucketDepth}$$ equally sized address space buckets. Each bucket is responsible for storing chunks that fall within a certain range of address space. When uploaded, files are split into 4kb chunks, each chunk is assigned a unique address, and each chunk is then assigned to the bucket in which its address falls. While the value of `bucket depth` is not defined in The Book of Swarm, in its current implementation in the Bee client, `bucket depth` has been set to 16, so there are a total of 65,536 buckets.

## Batch Depth and Batch Amount

Each batch of stamps has two key parameters, `batch depth` and `amount`, which are recorded on Gnosis Chain at issuance. Note that these "depths" do not refer to the depth terms used to describe topology which are outlined [here in the glossary](/docs/learn/glossary#depth-types).

### Batch Depth 

`Batch depth` is a measurement of how much data can be stored by a batch. The number of chunks which can be stored (stamped) by a batch is equal to  $$2^{depth}$$. 

`Batch depth` determines how many chunks are allowed in each bucket. The number of chunks allowed in each bucket is calculated like so:

$$
2^{(batchDepth - bucketDepth)}
$$

For a batch with a `batch depth` of 20, a maximum of $$2^{20} = 1,048,576$$ chunks can be stamped.   

Given the constant `bucket depth` of 16, for a `batch depth` of 20, the number of chunks per bucket is calculated like so:

$$
2^{(20 - 16)} = 16 \text{ chunks/bucket}
$$


#### Depth to kb calculator:

<DepthCalc></DepthCalc>

### Batch Amount

The `amount` parameter is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total number of xBZZ that will be paid for the batch is calculated from this figure and the `batch depth` like so:

$$2^{batchDepth} \times {amount}$$

The paid xBZZ forms the `balance` of the batch. This `balance` is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.

For example, with a `batch depth` of 20 and an `amount` of 1000000000 PLUR:

$$
2^{20} \times 1000000000 = 1048576000000000 \text{ PLUR} = 0.1048576 \text{ xBZZ}
$$

#### Batch cost calculator:

<BatchCostCalc></BatchCostCalc>


## Batch Utilisation

### Immutable Batches

Utilisation of an immutable batch is computed using a hash map of size $$2^{bucketDepth}$$ which is $$2^{16}$$ for all batches, so 65536 total entries. For the keys of the key-value pairs of the hash map, the keys are 16 digit binary numbers from 0 to 65535, and the value is a counter. 

![](/img/batches_01.png)

As chunks are uploaded to Swarm, each chunk is assigned to a bucket based the first 16 binary digits of the [chunk's hash](/docs/learn/technology/disc#chunks). The chunk will be assigned to whichever bucket's key matches the first 16 bits of its hash, and that bucket's counter will be incremented by 1. This is referred to as "stamping" a chunk. 

The batch is deemed "full" when ANY of these counters reach a certain max value. The max value is computed from the batch depth as such: $$2^{(batchDepth-bucketDepth)}$$. For example if the batch depth is 21, then the max value is $$2^{(21-16)}$$ or 32. A bucket can be thought of as have a number of "slots" equal to this maximum value, and every time the bucket's counter is incremented, one of its slots gets filled. 

In the diagram below, the batch depth is 18, so there are $$2^{(18-16)}$$ or 4 slots for each bucket. The utilisation of a batch is simply the highest number of filled slots out of all 65536 entries or "buckets". In this batch, none of the slots in any of the buckets have yet been filled with 4 chunks, so the batch is not yet fully utilised. The most filled slots out of all buckets is 2, so the stamp batch's utilisation is 2 out of 4. 

![](/img/batches_02.png)

As more chunks get uploaded and stamped, the bucket slots will begin to fill. As soon as the slots for any SINGLE bucket get filled, the entire batch is considered 100% utilised and can no longer be used to upload additional chunks.  

![](/img/batches_03.png)


### Mutable Batches

Mutable batches use the same hash map structure as immutable batches, however its utilisation works very differently. In contrast with immutable batches, mutable batches are never considered fully utilised. Rather, at the point where an immutable batch would be considered fully utilised, a mutable batch can continue to stamp chunks. However, if any chunk's address lands in a bucket whose slots are already filled, that bucket's counter gets reset, and the new chunk will replace the oldest chunk in that bucket.

![](/img/batches_04.png)

Therefore rather than speaking of the number of slots as determining the utilisation of a batch as with immutable batches, we can think of the slots as defining a limit to the amount of data which can be uploaded before old data starts to get overwritten. 





