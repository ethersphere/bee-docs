---
title: Keep Your Data Alive
id: keep-your-data-alive
---

The swarm comprises the sum total of all storage space provided by all of our nodes, called the DISC (Distributed Immutable Store of Chunks). The _right to write_ data into this distributed store is determined by the postage stamps that have been attached.

### Fund your node's wallet.

To start up your node, you will already have provided your node with
xDAI for gas and xBZZ which was transferred into your chequebook when
your node was initialised. This will be used to interact with other
nodes using the _SWAP_ protocol. In order to access more funds to buy
batches of stamps, your wallet must be funded with xBZZ. The easiest
way to acheive this is to withdraw funds from your chequebook:

```bash
curl -XPOST "http://localhost:1635/chequebook/withdraw?amount=1000"
```

## Purchase a Batch of Stamps

Stamps are created in batches, so that storer nodes may calculate the
validity of a chunk's stamp with only local knowledge. This enables
the privacy you enjoy in the swarm.

Stamp batches are created in _buckets_ with a _depth_ 16. The entire
swarm _address space_ is divided into 2^16 = 65,536 different
buckets. When uploaded, each of your file's are split into 4kb chunks
and assigned to a specific bucket based on it's address.

When creating a batch you must specify two values, _batch depth_ and _amount_.

### Amount

The _amount_ represents the quantity of xBZZ that is assigned to this batch. The total amount of xBZZ that will be paid for the batch is calulated from this figure and the _batch depth_.

The paid amount forms the _balance_ of the _batch_. This _balance_ is then slowly depleted as time ticks on and _blocks_ are mined on the xDAI blockchain.

### Batch Depth

The _batch depth_ determines _how many chunks_ are allowed to be in each _bucket_. The number of chunks allowed in each _bucket_ is calculated to be a `2^(batch depth - bucket depth) = 2^(batch depth - 16)`.

### Calculating the Depth and Amount of Your Batch of Stamps

_Postage Stamps_ are a brand new feature addition to Swarm, and it's early days in the conception of how to get the best out of the stamp batches.

Right now, the easiest way to start uploading content, is to buy a large enough batch so that it is incredibly unlikely you will end up with too many _chunks_ falling into the same _bucket_.

The _amount_ you specify will determine the amount of time your chunks live in the swarm. Because pricing is variable, it is not possible to predict with accuracy exactly when your chunks will run out of balance, however, it can be estimated based on the _current price_ and the _remaining batch balance_.

For now, we suggest you specify depth 20 and amount 10000000 for your
batches. This should be ample to upload quite some data, and to keep
your files in the swarm for the forseeable future.

:::warning
When you purchase a batch of stamps, you agree to burn xBZZ. Although your 'balance' slowly decrements as time goes on, there is no way to withdraw xBZZ from a batch. This is an outcome of Swarm's decentralised design, to read more about how the swarm fits together, read <a href="/the-book-of-swarm.pdf" target="_blank" rel="noopener noreferrer">The Book of Swarm</a> .
:::

```bash
curl -s -XPOST http://localhost:1635/stamps/10000000/20
```

:::info
Once your batch has been purchased, it will take a few minutes for other Bee nodes in the Swarm to catch up and register your batch. Allow some time for your batch to propagate in the network before proceeding to the next step.
:::

Look out for more ways to more accurately estimate the correct size of your batch coming soon!

To check on your stamps, send a GET request to the stamp endpoint.

```sh
curl http://localhost:1635/stamps
```

:::info
When uploading content which has been stamped using an already expired postage stamp, the node will not attempt to sync the content. You are advised to use longer-lived postage stamps and encrypt your content to work around this. It is not possible to reupload unencrypted content which was stamped using an expired postage stamp. We're working on improving on this.
:::

### Calculating the Remaining TTL of Your Batch

:::info
At present, TTL is a primitive calculation based on the current storage price and the assumption that storage price will remain static in the future. As more data is uploaded into Swarm, the price of storage will begin to increase. For data that it is important to keep alive, make sure your batches have plenty of time to live!
:::

In order to make sure your _batch_ has sufficient _remaining balance_ to be stored and served by nodes in its _neighbourhood of responsibility_, you must regularly check on its _time to live_ and act accordingly. The _time to live_ is the number of seconds before the chunks will be considered for garbage collection by nodes in the network.

The remaining _time to live_ in seconds is shown in the returned json object as the value for `batchTTL`.

```bash
	curl "http://localhost:1635/stamps"
```

```bash
{
  "stamps": [
    {
      "batchID": "6d32e6f1b724f8658830e51f8f57aa6029f82ee7a30e4fc0c1bfe23ab5632b27",
      "utilization": 0,
      "usable": true,
      "label": "",
      "depth": 20,
      "amount": "113314620",
      "bucketDepth": 16,
      "blockNumber": 19727733,
      "immutableFlag": false,
      "exists": true,
      "batchTTL": 68795140
    }
  ]
}
```

### Top Up Your Batch

:::danger
Don't let your batch run out! If it does, you will need to restamp and resync your content.
:::

If your batch is starting to run out, or you would like to extend the life of your batch to protect against storage price rises, you can increase the batch TTL by topping up your batch using the stamps endpoint, passing in the relevant batchID into the HTTP PATCH request.

```bash
curl -X PATCH "http://localhost:1635/stamps/topup/6d32e6f1b724f8658830e51f8f57aa6029f82ee7a30e4fc0c1bfe23ab5632b27/10000000"
```
