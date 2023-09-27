---
title: Postage Stamp 
id: postage-stamp
---

import DepthCalc from '@site/src/components/DepthCalc';
import BatchCostCalc from '@site/src/components/BatchCostCalc';

The [postage stamp contract](https://github.com/ethersphere/storage-incentives/blob/master/src/PostageStamp.sol) is a smart contract which is a key part of Swarm's [storage incentives](/docs/learn/technology/incentives) which make up the foundation of Swarm's self-sustaining economic system. 

When a node uploads data to Swarm, it attaches postage stamps to each [chunk](/docs/learn/technology/DISC) of data. Postage stamps are issued in batches rather than one by one. The value assigned to a stamp indicates how much it is worth to persist the associated data on Swarm, which nodes use to prioritize which chunks to remove from their reserve first.

The value of a postage stamp decreases over time as if storage rent was regularly deducted from the batch balance. Once the value of a stamp is no longer sufficient, the associated chunk is evicted from the reserve.

## Batch Buckets

Postage stamps are issued in batches with a certain number of storage slots divided amongst $$2^{bucketDepth}$$ equally sized address space buckets. Each bucket is responsible for storing chunks that fall within a certain range of the address space. When uploaded, files are split into 4kb chunks, each chunk is assigned a unique address, and each chunk is then assigned to the bucket in which its address falls. While the value of `bucket depth` is not defined in The Book of Swarm, in its current implementation in the Bee client, `bucket depth` has been set to 16, so there are a total of 65,536 buckets.

### Bucket Size

Each bucket has a certain number of slots which can be "filled" by chunks (In other words, for each bucket, a certain number of chunks can be stamped). Once all the slots of a bucket are filled, the entire postage batch will be fully utilised and can no longer be used to upload additional data. Given the constant `bucket depth` of 16, for a `batch depth` of 20, the number of chunks per bucket is calculated like so:

$$
2^{(20 - 16)} = 16 \text{ chunks/bucket}
$$


`Batch depth` determines how many chunks are allowed in each bucket. The number of chunks allowed in each bucket is calculated like so:

$$
2^{(batchDepth - bucketDepth)}
$$


## Batch Depth and Batch Amount

Each batch of stamps has two key parameters, `batch depth` and `amount`, which are recorded on Gnosis Chain at issuance. Note that these "depths" do not refer to the depth terms used to describe topology which are outlined [here in the glossary](/docs/learn/glossary#depth-types).

### Batch Depth 

`Batch depth` determines how much data can be stored by a batch. The number of chunks which can be stored (stamped) by a batch is equal to  $$2^{depth}$$. 

For a batch with a `batch depth` of 23, a maximum of $$2^{23} = 33,554,432$$ chunks can be stamped.   

Since we know that one chunk can store 4 kb of data, we can calculate the theoretical maximum amount of data which can be stored by a batch from the `batch depth`. 

$$
\text{Theoretical maximum batch volume} = 2^{batchDepth} \times \text{4 kb}   
$$

However, due to the way postage stamp batches are utilised, batches will become fully utilised before stamping the theoretical maximum number of chunks. Therefore when deciding which batch depth to use, it is important to consider the effective amount of data that can be stored by a batch, and not the theoretical maximum. The effective rate of utilisation increases along with the  batch depth. See [section on stamp batch utilisation below](/docs/learn/technology/contracts/postage-stamp#batch-utilisation) for more information.

### Batch Amount (& Batch Cost)

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

As chunks are uploaded to Swarm, each chunk is assigned to a bucket based the first 16 binary digits of the [chunk's hash](/docs/learn/technology/disc#chunks). The chunk will be assigned to whichever bucket's key matches the first 16 bits of its hash, and that bucket's counter will be incremented by 1. 

The batch is deemed "full" when ANY of these counters reach a certain max value. The max value is computed from the batch depth as such: $$2^{(batchDepth-bucketDepth)}$$. For example if the batch depth is 21, then the max value is $$2^{(21-16)}$$ or 32. A bucket can be thought of as have a number of "slots" equal to this maximum value, and every time the bucket's counter is incremented, one of its slots gets filled. 

In the diagram below, the batch depth is 18, so there are $$2^{(18-16)}$$ or 4 slots for each bucket. The utilisation of a batch is simply the highest number of filled slots out of all 65536 entries or "buckets". In this batch, none of the slots in any of the buckets have yet been filled with 4 chunks, so the batch is not yet fully utilised. The most filled slots out of all buckets is 2, so the stamp batch's utilisation is 2 out of 4. 

![](/img/batches_02.png)

As more chunks get uploaded and stamped, the bucket slots will begin to fill. As soon as the slots for any SINGLE bucket get filled, the entire batch is considered 100% utilised and can no longer be used to upload additional chunks.  

![](/img/batches_03.png)


### Mutable Batches

Mutable batches use the same hash map structure as immutable batches, however its utilisation works very differently. In contrast with immutable batches, mutable batches are never considered fully utilised. Rather, at the point where an immutable batch would be considered fully utilised, a mutable batch can continue to stamp chunks. However, if any chunk's address lands in a bucket whose slots are already filled, rather than the batch becoming fully utilised, that bucket's counter gets reset, and the new chunk will replace the oldest chunk in that bucket.

![](/img/batches_04.png)

Therefore rather than speaking of the number of slots as determining the utilisation of a batch as with immutable batches, we can think of the slots as defining a limit to the amount of data which can be uploaded before old data starts to get overwritten. 

### Which Type of Batch to Use

Immutable batches are suitable for long term storage of data or for data which otherwise does not need to be changed and should never be overwritten, such as records archival, legal documents, family photos, etc. 

Mutable batches are great for data which needs to be frequently updated and does not require a guarantee of immutability. For example, a blog, personal or company websites, ephemeral messaging app, etc.

The default batch type when unspecified is immutable. This can be modified through the Bee api by setting the `immutable` header with the [`\stamps POST` endpoint](https://docs.ethswarm.org/api/#tag/Transaction/paths/~1transactions~1%7BtxHash%7D/post) to `false`.
 

### Implications for Swarm Users

Due to the nature of batch utilisation described above, batches are often fully utilised before reaching their theoretical maximum storage amount. However as the batch depth increases, the chance of a postage batch becoming fully utilised early decreases. At batch depth 23, there is a 0.1% chance that a batch will be fully utilised/start replacing old chunks before reaching 50% of its theoretical maximum.

Let's look at an example to make it clearer. Using the method of calculating the theoretical maximum storage amount [outlined above](/docs/learn/technology/contracts/postage-stamp#batch-depth), we can see that for a batch depth of 23, the theoretical maximum amount which can be stored is 33,554,432 kb:

$$
2^{23} \times \text{4kb} = \text{33,554,432 kb}
$$

Therefore we should use 50% the effective rate of usage for the stamp batch:

$$
\text{33,554,432 kb} \times{0.5} = \text{16,777,216 kb} = \text{16.77 gb}
$$

:::info
The details of how the effective rates of utilisation are calculated will be published soon.
:::


### Effective Utilisation Table

:::info
This table is based on preliminary calculations and may be subject to change.
:::

The provided table shows the effective volume for each batch depth from 20 to 41. The "utilisation rate" is the rate of utilisation a stamp batch can reach with a 0.1% failure rate (that is, there is a 1/1000 chance the batch will become fully utilised before reaching that utilisation rate). The "effective volume" figure shows the actual amount of data which can be stored at the effective rate. The effective volume figure is the one which should be used as the de-facto maximum amount of data that a batch can store before becoming either fully utilised (for immutable batches), or start overwriting older chunks (mutable batches).
 
| Batch Depth | Utilisation Rate | Effective Volume | Theoretical Max Volume |
|-------------|------------------|------------------|------------------------|
| 20          | 0.00%            | 4.29 GB          | 0.00 B                 |
| 21          | 0.00%            | 8.59 GB          | 0.00 B                 |
| 22          | 28.67%           | 17.18 GB         | 4.93 GB                |
| 23          | 49.56%           | 34.36 GB         | 17.03 GB               |
| 24          | 64.33%           | 68.72 GB         | 44.21 GB               |
| 25          | 74.78%           | 137.44 GB        | 102.78 GB              |
| 26          | 82.17%           | 274.88 GB        | 225.86 GB              |
| 27          | 87.39%           | 549.76 GB        | 480.43 GB              |
| 28          | 91.08%           | 1.10 TB          | 1.00 TB                |
| 29          | 93.69%           | 2.20 TB          | 2.06 TB                |
| 30          | 95.54%           | 4.40 TB          | 4.20 TB                |
| 31          | 96.85%           | 8.80 TB          | 8.52 TB                |
| 32          | 97.77%           | 17.59 TB         | 17.20 TB               |
| 33          | 98.42%           | 35.18 TB         | 34.63 TB               |
| 34          | 98.89%           | 70.37 TB         | 69.58 TB               |
| 35          | 99.21%           | 140.74 TB        | 139.63 TB              |
| 36          | 99.44%           | 281.47 TB        | 279.91 TB              |
| 37          | 99.61%           | 562.95 TB        | 560.73 TB              |
| 38          | 99.72%           | 1.13 PB          | 1.12 PB                |
| 39          | 99.80%           | 2.25 PB          | 2.25 PB                |
| 40          | 99.86%           | 4.50 PB          | 4.50 PB                |
| 41          | 99.90%           | 9.01 PB          | 9.00 PB                |



