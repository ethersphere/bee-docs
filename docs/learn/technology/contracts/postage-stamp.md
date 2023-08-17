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

Postage stamps are issued in batches with a certain number of storage slots divided amongst $$2^{bucket \_ depth}$$ equally sized address space buckets. Each bucket is responsible for storing chunks that fall within a certain range of address space. When uploaded, files are split into 4kb chunks, each chunk is assigned a unique address, and each chunk is then assigned to the bucket in which its address falls. While the value of `bucket depth` is not defined in The Book of Swarm, in its current implementation in the Bee client, `bucket depth` has been set to 16, so there are a total of 65,536 buckets.

## Batch Depth and Batch Amount

Each batch of stamps has two key parameters, `batch depth` and `amount`, which are recorded on Gnosis Chain at issuance. Note that these "depths" do not refer to the depth terms used to describe topology which are outlined [here in the glossary](/docs/learn/glossary#depth-types).

### Batch Depth 

`Batch depth` is a measurement of how much data can be stored by a batch. The number of chunks which can be stored (stamped) by a batch is equal to  $$2^{depth}$$. 

`Batch depth` determines how many chunks are allowed in each bucket. The number of chunks allowed in each bucket is calculated like so:

$$
2^{(batch depth - bucket depth)}
$$

For a batch with a `batch depth` of 20, a maximum of $$2^{20} = 1,048,576$$ chunks can be stamped.   

Given the constant `bucket depth` of 16, for a `batch depth` of 20, the number of chunks per bucket is calculated like so:

$$
2^{(20 - 16)} = 16 \text{ chunks/bucket}
$$

Since we know that one chunk can store 4 kb of data, we can easily calculate the maximum amount of data (due to [the details of the Swarm protocol](/docs/learn/technology/contracts/postage-stamp), postage batches may be fully utilized before storing the maximum amount of data) which can be stored by a batch from the `batch depth`:

$$
\text{Maximum data in a batch} = 2^{batchdepth} \times \text{4 kb}   
$$

For a batch of depth 16, for example, the maximum amount of data in kilobytes can be calculated like so:

$$
2^{16} \times \text{4 kb} = 65536 \text{ chunks} \times \text{4 kb} = \text{262144 kb}
$$


#### Depth to kb calculator:

<DepthCalc></DepthCalc>

### Batch Amount

The `amount` parameter is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total number of xBZZ that will be paid for the batch is calculated from this figure and the `batch depth` like so:

$$2^{batch \_ depth} \times {amount}$$

The paid xBZZ forms the `balance` of the batch. This `balance` is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.

For example, with a `batch depth` of 20 and an `amount` of 1000000000 PLUR:

$$
2^{20} \times 1000000000 = 1048576000000000 \text{ PLUR} = 0.1048576 \text{ xBZZ}
$$

#### Batch cost calculator:

<BatchCostCalc></BatchCostCalc>




