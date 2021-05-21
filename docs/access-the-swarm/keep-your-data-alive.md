---
title: Keep Your Data Alive
id: keep-your-data-alive
---

The swarm comprises the sum total of all storage space provided by all of our nodes, called the DISC (Distributed Immutable Store of Chunks). The *right to write* data into this distributed store is determined by the postage stamps that have attached.

### Fund your node's wallet.

To start up your node, you will already have provided your node with gETH for gas and gBZZ which was transferred into your chequebook when your node was initialised and will be used to interact with other nodes using the *SWAP* protocol. In order to access more funds to buy batches of stamps, go to the [#faucet](https://discord.gg/kfKvmZfVfe) channel on our [Discord Server](https://discord.gg/wdghaQsGq5).

`/faucet stamps 0xabeecde123...`

You must *type* the commands, copy and paste will not work.

## Purchase a Batch of Stamps

Stamps are created in batches, so that storer nodes may calculate the validity of a chunk's stamp with only local knowledge. This enables the privacy you enjoy in the swarm.

Stamp batches are created in *buckets* with *depth* 16. The entire swarm *address space* is divided into into 2^16 = 65,536 different buckets. When uploaded, each of your file's are split into 4kb chunks is assigned to a specific bucket based on its address.

When creating a batch you must specify two values, *batch depth* and *amount*.

### Amount

The *amount* represents the quantity of gBZZ that is assigned to this batch. The total amount of gBZZ that will be paid for the batch is calulated from this figure and the *batch depth*.

The paid amount forms the *balance* of the *batch*. This *balance* is then slowly depleted as time ticks on and *blocks* are mined on the Goerli blockchain.

### Batch Depth

The *batch depth* determines *how many chunks* are allowed to be in each *bucket*. The number of chunks allowed in each *bucket* is calculated to be a `2^(batch depth - bucket depth) = 2^(batch depth - 16)`.

### Calculating the Depth and Amount of Your Batch of Stamps

*Postage Stamps* are a brand new feature addition to Swarm, and it's early days in the conception of how to get the best out of the stamp batches.

Right now, the easiest way to start uploading content, is to buy a large enough batch so that it is incredibly unlikely you will end up with too many *chunks* falling into the same *bucket*.

The *amount* you specify will determine the amount of time your chunks live in the swarm. Because pricing is variable, it is not possible to predict with accuracy exactly when your chunks will run out of balance, however, it can be estimated based on the *current price* and the *remaining batch balance*.

For now, we suggest you specify depth 20 and amount 100 for your batches. This should be ample to upload up quite some data, and to keep your files in the Swarm for the forseeable future.

:::warning
When you purchase a batch of stamps, you agree to burn gBZZ. Although your 'balance' slowly decrements as time goes on, there is no way to withdraw gBZZ from a batch. This is an outcome of Swarm's decentralised design, to read more about how the swarm fits together, read [The Book of Swarm](https://gateway.ethswarm.org/bzz/latest.bookofswarm.eth/).
:::

```bash
curl -s -XPOST http://localhost:1633/stamps/100/20
```

:::info
Once your batch has been purchased, it will take a few minutes for other Bee nodes in the swarm to catch up and register your batch. Allow some time for your batch to propogate to the network before proceeding to the next step.
:::

Look out for more ways to more accurately estimate the correct size of your batch coming soon!

### Calculating the Remaining Balance of Your Batch

In order to make sure your *batch* has sufficient *remaining balance* to be stored and served by nodes in its *neighbourhood of responsibility*, you must regularly check on its *balance* and act accordingly. 

```bash
curl localhost:1635/chainstate
```

Shows the current price per chunk per block in GPLUR, the smallest unit of GBZZ

Soon, functionality will be added to *top up* your batches balance. For now, you must reupload content with a newly created *stamp batch id*.