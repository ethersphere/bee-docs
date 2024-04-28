---
title: Postage Stamp 
id: postage-stamp
---

The [postage stamp contract](https://github.com/ethersphere/storage-incentives/blob/master/src/PostageStamp.sol) is one component in the suite of smart contract orchestrating Swarm's [storage incentives](/docs/learn/technology/incentives) which make up the foundation of Swarm's self-sustaining economic system. 

When a node uploads data to Swarm, it 'attaches' postage stamps to each [chunk](/docs/learn/technology/disc) of data. Postage stamps are purchased in batches rather than one by one. The value assigned to a stamp indicates how much it is worth to persist the associated data on Swarm, which nodes use to prioritize which chunks to remove from their reserve first.

The value of a postage stamp decreases over time as if storage rent was regularly deducted from the batch balance. We say that a stamp expires when the batch it is issued from has insufficient balance. A chunk with an expired stamp can not be used in the proof of entitlement storer nodes need to submit in order to get compensated for their contributed storage space, therefore such expired chunks are evicted from nodes' reserves and put into the cache where their continued persistence depends on their popularity. 

## Batch Buckets

Postage stamps are issued in batches with a certain number of storage slots partitioned into $$2^{bucketDepth}$$ equally sized address space buckets. Each bucket is responsible for storing chunks that fall within a certain range of the address space. When uploaded, files are split into 4kb chunks, each chunk is assigned a unique address, and each chunk is then assigned to the bucket in which its address falls. Falling into the same range means a match on `n` leading bits of the chunk and bucket. This restriction is necessary to ensure (incentivise) uniform utilisation of the address space and is fair since the distribution of content addresses are uniform as well. Uniformity depth is the number of leading bits determining bucket membership (also called `bucket depth`). The uniformity depth is set to 16, so there are a total of $$2^{16} = 65,536$$ buckets.

### Bucket Size

Each bucket has a certain number of slots which can be "filled" by chunks (In other words, for each bucket, a certain number of chunks can be stamped). Once all the slots of a bucket are filled, the entire postage batch will be fully utilised and can no longer be used to upload additional data. 

Together with `batch depth`, `bucket depth`determines how many chunks are allowed in each bucket. The number of chunks allowed in each bucket is calculated like so:

$$
2^{(batchDepth - bucketDepth)}
$$

So with a batch depth of 24 and a bucket depth of 16:

$$
2^{(24 - 16)} = 2^{8} = 256 \text{ chunks/bucket}
$$


## Batch Depth and Batch Amount

Each batch of stamps has two key parameters, `batch depth` and `amount`, which are recorded on Gnosis Chain at issuance. Note that these "depths" do not refer to the depth terms used to describe topology which are outlined [here in the glossary](/docs/learn/glossary#depth-types).

### Batch Depth 

`Batch depth` determines how much data can be stored by a batch. The number of chunks which can be stored (stamped) by a batch is equal to  $$2^{batchDepth}$$. 

For a batch with a `batch depth` of 24, a maximum of $$2^{24} = 16,777,216$$ chunks can be stamped.   

Since we know that one chunk can store 4 kb of data, we can calculate the theoretical maximum amount of data which can be stored by a batch from the `batch depth`. 

$$
\text{Theoretical maximum batch volume} = 2^{batchDepth} \times \text{4 kb}   
$$

However, due to the way postage stamp batches are utilised, batches will become fully utilised before stamping the theoretical maximum number of chunks. Therefore when deciding which batch depth to use, it is important to consider the effective amount of data that can be stored by a batch, and not the theoretical maximum. The effective rate of utilisation increases along with the  batch depth. See [section on stamp batch utilisation below](/docs/learn/technology/contracts/postage-stamp#batch-utilisation) for more information.

### Batch Amount (& Batch Cost)

The `amount` parameter is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total number of xBZZ that will be paid for the batch is calculated from this figure and the `batch depth` like so:

$$2^{batchDepth} \times {amount}$$

The paid xBZZ forms the `balance` of the batch. This `balance` is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.

For example, with a `batch depth` of 24 and an `amount` of 1000000000 PLUR:

$$
2^{24} \times 1000000000 = 16777216000000000 \text{ PLUR} = 1.6777216 \text{ xBZZ}
$$


## Batch Utilisation

### Immutable Batches

Utilisation of an immutable batch is computed using a hash map of size $$2^{bucketDepth}$$ which is $$2^{16}$$ for all batches, so 65536 total entries. For the keys of the key-value pairs of the hash map, the keys are 16 digit binary numbers from 0 to 65535, and the value is a counter. 

![](/img/batches_01.png)

As chunks are uploaded to Swarm, each chunk is assigned to a bucket based the first 16 binary digits of the [chunk's hash](/docs/learn/technology/disc#chunks). The chunk will be assigned to whichever bucket's key matches the first 16 bits of its hash, and that bucket's counter will be incremented by 1. 

The batch is deemed "full" when ANY of these counters reach a certain max value. The max value is computed from the batch depth as such: $$2^{(batchDepth-bucketDepth)}$$. For example with batch depth of 24, the max value is $$2^{(24-16)}$$ or 256. A bucket can be thought of as have a number of "slots" equal to this maximum value, and every time the bucket's counter is incremented, one of its slots gets filled. 


:::info
Note that 18 is below the minimum batch depth, but is used in these examples to simplify the explanation of batch utilisation.
:::

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
 
### Re-uploading 

There are several nuances to how the re-uploading of previously uploaded data to Swarm affect stamp batch utilisation. For single chunks, the behaviour is relatively straightforward, however with files that must get split into multiple chunks, the behaviour is less straightforward.

#### Single chunks

When a chunk which has previously been uploaded to Swarm is re-uploaded from the same node while the initial postage batch it was stamped by is still valid, no additional stamp will be utilised from the batch. However if the chunk comes from a different node than the original node, then a stamp WILL be utilised, and as long as at least one of the batches the chunk was stamped by is still valid, the chunk will be retained by storer nodes in its neighbourhood.

#### Files 

When an identical file is re-uploaded then the stamp utilisation behaviour will be the same as with single chunks described in the section above. However, if part of the file has been modified and then re-uploaded, stamp utilisation behaviour will be different. This is due to how the chunking process works when a file is uploaded to Swarm. When uploaded to Swarm, files are split into 4kb sized chunks (2^12 bytes), and each chunk is assigned an address which is based on the content of the chunk. If even a single bit within the chunk is modified, then the address of the chunk will also be modified. 

When a file which was previously uploaded with a single bit flipped is again split into chunks by a node before being uploaded to Swarm, then only the chunk with the flipped bit will have an updated address and require the utilisation of another stamp. The content of all the other chunks will remain the same, and therefore will not require new stamps to be utilised. 

However, if rather than flipping a single bit we add some data to our file, this could cause changes in the content of every chunk of the file, meaning that every single chunk must be re-stamped. We can use a simplified example of why this is the case to more easily understand the stamp utilisation behaviour. Let us substitute a message containing letters of the alphabet rather than binary data.

Our initial message consists of 16 letters:


> abcdefghijklmnop 

When initially uploaded, it will be split into four chunks of four letters each:

> abcdefghijklmnop => abcd | efgh | ijkl | mnop

Let us look at what happens when a single letter is changed (here we change a to z):

> abcdefghijklmnop => zbcd | efgh | ijkl | mnop

In this case, only the first chunk is affected, all the other chunks retain the same content.

> Now let is examine the case where a new letter is added rather than simply modifying an already existing one. Here we add the number 1 at the start of the message: 

> 1abcdefghijklmnop => 1abc | defg | hijk | lmno | p

As you can see, by adding a single new letter at the start of the message, all the letters are shifted to the right by a single position, which a has caused EVERY chunk in the message to be modified rather than just a single chunk.

#### Implications

The implications of this behaviour are that even a small change to the data of a file may cause every single chunk from the file to be changed, meaning that new stamps must be utilised for every chunk from that file. In practice, this could lead to high costs in data which is frequently changed, since for even a small change, every chunk from the file must be re-stamped. One way to mitigate this behaviour is to limit the size of files which are uploaded. For example, when uploading a website, each file from the website should be uploaded and chunked separately, so that when an update is performed to the content of the website, we can specifically re-upload the file we are changing, rather than the entire website as a single file. 


### Implications for Swarm Users

Due to the nature of batch utilisation described above, batches are often fully utilised before reaching their theoretical maximum storage amount. However as the batch depth increases, the chance of a postage batch becoming fully utilised early decreases. At batch depth 24, there is a 0.1% chance that a batch will be fully utilised/start replacing old chunks before reaching 64.33% of its theoretical maximum.

Let's look at an example to make it clearer. Using the method of calculating the theoretical maximum storage amount [outlined above](/docs/learn/technology/contracts/postage-stamp#batch-depth), we can see that for a batch depth of 24, the theoretical maximum amount which can be stored is 68.72 gb:

$$
2^{24+12} = \text{68,719,476,736 bytes} = \text{68.72 gb}
$$

Therefore we should use 64.33% the effective rate of usage for the stamp batch:

$$
\text{68.72 gb} \times{0.6433} =  \text{44.21 gb }
$$

:::info
The details of how the effective rates of utilisation are calculated will be published soon.
:::


### Effective Utilisation Table


When a user buys a batch of stamps they may make the naive assumption that they will be able to upload data equal to the sum total size of the maximum capacity of the batch. However, in practice this assumption is incorrect, so it is essential that Swarm users understand the relationship between batch depth and the theoretical and effective volumes of a batch.

The provided table shows the effective volume for each batch depth from 20 to 41. The "utilisation rate" is the rate of utilisation a stamp batch can reach with a 0.1% failure rate (that is, there is a 1/1000 chance the batch will become fully utilised before reaching that utilisation rate). The "effective volume" figure shows the actual amount of data which can be stored at the effective rate. The effective volume figure is the one which should be used as the de-facto maximum amount of data that a batch can store before becoming either fully utilised (for immutable batches), or start overwriting older chunks (mutable batches).

 
| Batch Depth | Utilisation Rate | Theoretical Max Volume | Effective Volume |
|-------------|------------------|-------------------------|-------------------|
| 20          | 0.00%          | 4.29 GB                 | 0.00 B            |
| 21          | 0.00%          | 8.59 GB                 | 0.00 B            |
| 22          | 28.67%          | 17.18 GB                | 4.93 GB           |
| 23          | 49.56%          | 34.36 GB                | 17.03 GB          |
| 24          | 64.33%           | 68.72 GB                | 44.21 GB          |
| 25          | 74.78%           | 137.44 GB               | 102.78 GB         |
| 26          | 82.17%           | 274.88 GB               | 225.86 GB         |
| 27          | 87.39%           | 549.76 GB               | 480.43 GB         |
| 28          | 91.08%           | 1.10 TB                 | 1.00 TB           |
| 29          | 93.69%           | 2.20 TB                 | 2.06 TB           |
| 30          | 95.54%           | 4.40 TB                 | 4.20 TB           |
| 31          | 96.85%           | 8.80 TB                 | 8.52 TB           |
| 32          | 97.77%           | 17.59 TB                | 17.20 TB          |
| 33          | 98.42%           | 35.18 TB                | 34.63 TB          |
| 34          | 98.89%           | 70.37 TB                | 69.58 TB          |
| 35          | 99.21%           | 140.74 TB               | 139.63 TB         |
| 36          | 99.44%           | 281.47 TB               | 279.91 TB         |
| 37          | 99.61%           | 562.95 TB               | 560.73 TB         |
| 38          | 99.72%           | 1.13 PB                 | 1.12 PB           |
| 39          | 99.80%           | 2.25 PB                 | 2.25 PB           |
| 40          | 99.86%           | 4.50 PB                 | 4.50 PB           |
| 41          | 99.90%           | 9.01 PB                 | 9.00 PB           |


:::info
This table is based on preliminary calculations and may be subject to change.
:::

Nodes' storage is actually defined as a number of chunks with a size of 4kb (2^12 bytes) each, but in fact some [SOC](/docs/learn/technology/disc#content-addressed-chunks-and-single-owner-chunks) chunks can be a few bytes longer, and some chunks can be smaller, so the conversion is not precise. Furthermore, due to the way Swarm represents files in a merkle tree, the intermediate chunks are additional overhead which must also be accounted for. 

Additionally, when a node stores chunks it uses additional indexes — therefore the disk space a maximally filled reserve would demand cannot be calculated with perfect accuracy.
