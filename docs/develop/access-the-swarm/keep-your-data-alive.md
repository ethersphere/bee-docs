---
title: Keep Your Data Alive
id: keep-your-data-alive
---

Swarm comprises the sum total of all storage space provided by all of our nodes, called the DISC (Distributed Immutable Store of Chunks). The _right to write_ data into this distributed store is determined by the postage stamps that have been attached.

### Fund your node's wallet.

To start up your node, you will already have provided your node with
xDAI for gas and xBZZ which was transferred into your chequebook when
your node was initialised. This will be used to interact with other
nodes using the _SWAP_ protocol. In order to access more funds to buy
batches of stamps, your wallet must be funded with xBZZ. The easiest
way to achieve this is to withdraw funds from your chequebook:

```bash
curl -XPOST "http://localhost:1635/chequebook/withdraw?amount=1000"
```

## Purchase a batch of stamps

Stamps are created in batches so that storer nodes may calculate the
validity of a chunk's stamp with only local knowledge. This enables
the privacy you enjoy with Swarm.

Stamp batches are created in buckets with a `bucket depth` of 16. The entire
Swarm address space is divided into $$2^{16} = 65,536$$ different
buckets. When uploaded, each of your files are split into 4kb chunks
and assigned to a specific bucket based on its address.

When creating a batch you must specify two values, `batch depth` and `amount`.

### Amount

The `amount` is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total number of xBZZ that will be paid for the batch is calculated from this figure and the `batch depth` like so:

$$2^{batch \_ depth} \times {amount}$$

The paid xBZZ forms the `balance` of the batch. This `balance` is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.


For example, with a `batch depth` of 20 and an `amount` of 1000000000 PLUR:
                                                    
$$
2^{20} \times 1000000000 = 1048576000000000 \text{ PLUR} = 0.1048576 \text{ xBZZ}
$$

### Batch Depth

The `batch depth` determines _how many chunks_ are allowed to be in each bucket. The number of chunks allowed in each bucket is calculated like so:
$$2^{batch \_ depth - bucket \_ depth}$$  $$=$$ $$2^{batch \_ depth - 16}$$. With a minimum `batch depth` of 17.


### Calculating the `depth` and `amount` of your batch of stamps

One notable aspect of batch utilization is that the entire batch is considered fully utilized as soon as any one of its buckets are filled. This means that the actual amount of chunks storable by a batch is less than the nominal maximum amount. 

Right now, the easiest way to start uploading content is to buy a large enough batch so that it is incredibly unlikely you will end up with too many chunks falling into the same bucket.

The `amount` you specify will govern the amount of time your chunks live in Swarm. Because pricing is variable, it is not possible to predict with accuracy exactly when your chunks will run out of balance, however, it can be estimated based on the current price and the remaining batch balance.

For now, we suggest you specify `batch depth` 20 and `amount` 10000000000 for your
batches just to get started. This should be enough to upload several GB of data for a few weeks.

:::warning
When you purchase a batch of stamps, you agree to burn xBZZ. Although your 'balance' slowly decrements as time goes on, there is no way to withdraw xBZZ from a batch. This is an outcome of Swarm's decentralised design, to read more about the different components of Swarm fit together, read <a href="https://www.ethswarm.org/The-Book-of-Swarm.pdf" target="_blank" rel="noopener noreferrer">The Book of Swarm</a> .
:::

```bash
curl -s -XPOST http://localhost:1635/stamps/10000000000/20
```

:::info
Once your batch has been purchased, it will take a few minutes for other Bee nodes in the Swarm to catch up and register your batch. Allow some time for your batch to propagate in the network before proceeding to the next step.
:::

Look out for more ways to more accurately estimate the correct size of your batch coming soon!

To check on your stamps, send a GET request to the stamp endpoint.

```bash
curl http://localhost:1635/stamps
```

:::info
When uploading content which has been stamped using an already expired postage stamp, the node will not attempt to sync the content. You are advised to use longer-lived postage stamps and encrypt your content to work around this. It is not possible to reupload unencrypted content which was stamped using an expired postage stamp. We're working on improving on this.
:::

### Calculating the remaining TTL (time to live) of your batch

:::info
At present, TTL is a primitive calculation based on the current storage price and the assumption that storage price will remain static in the future. As more data is uploaded into Swarm, the price of storage will begin to increase. For data that it is important to keep alive, make sure your batches have plenty of time to live!
:::

In order to make sure your *batch* has sufficient *remaining balance* to be stored and served by nodes in its [*area of responsibility*](/docs/learn/glossary#2-area-of-responsibility-related-depths), you must regularly check on its _time to live_ and act accordingly. The *time to live* is the number of seconds before the chunks will be considered for garbage collection by nodes in the network.

The remaining *time to live* in seconds is shown in the returned json object as the value for `batchTTL`.

```bash
	curl http://localhost:1635/stamps
```

```json
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

### Top up your batch

:::danger
Don't let your batch run out! If it does, you will need to restamp and resync your content.
:::

If your batch is starting to run out, or you would like to extend the life of your batch to protect against storage price rises, you can increase the batch TTL by topping up your batch using the stamps endpoint, passing in the relevant batchID into the HTTP PATCH request.

```bash
curl -X PATCH "http://localhost:1635/stamps/topup/6d32e6f1b724f8658830e51f8f57aa6029f82ee7a30e4fc0c1bfe23ab5632b27/10000000"
```

### Dilute your batch

In order to store more data with a batch of stamps, you must "dilute" the batch. Dilution simply refers to increasing the depth of the batch, thereby allowing it to store a greater number of chunks. As dilution only increases the the depth of a batch and does not automatically top up the batch with more xBZZ, dilution will decrease the TTL of the batch. Therefore if you wish to store more with your batch but don't want to decrease its TTL, you will need to both dilute and top up your batch with more xBZZ.

Here we call the `/stamps` endpoint and find a batch with `depth` 17 and a `batchTTL` of 2083223 which we wish to dilute:

```bash
curl  http://localhost:1635/stamps
```

```json
{
    "stamps": [
        {
            "batchID": "0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5",
            "utilization": 0,
            "usable": true,
            "label": "",
            "depth": 17,
            "amount": "10000000000",
            "bucketDepth": 16,
            "blockNumber": 29717348,
            "immutableFlag": false,
            "exists": true,
            "batchTTL": 2083223,
            "expired": false
        }
    ]
}
```

Next we call the [`dilute`](/api/#tag/Postage-Stamps/paths/~1stamps~1dilute~1{batch_id}~1{depth}/patch) endpoint to increase the `depth` of the batch using the `batchID` and our new `depth` of 19:

```bash
curl -s -XPATCH http://localhost:1635/stamps/dilute/0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5/19
```
And a `txHash` of our successful transaction:

```bash
{
    "batchID": "0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5",
    "txHash": "0x298e80358b3257292752edb2535a1cd84440c074451b61f78fab349aea4962b7"
}
```

And finally we use the `/stamps` endpoint again to confirm the new `depth` and decreased `batchTTL`:

```bash
curl  http://localhost:1635/stamps
```

We can see the new `depth` of 19 decreased `batchTTL` of 519265.

```json
{
    "stamps": [
        {
            "batchID": "0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5",
            "utilization": 0,
            "usable": true,
            "label": "",
            "depth": 19,
            "amount": "10000000000",
            "bucketDepth": 16,
            "blockNumber": 29717348,
            "immutableFlag": false,
            "exists": true,
            "batchTTL": 519265,
            "expired": false
        }
    ]
}
```
## Stewardship

The <a href="/api/#tag/Stewardship" target="_blank">stewardship endpoint</a> in combination with [pinning](/docs/develop/access-the-swarm/pinning) can be used to guarantee that important content is always available. It is used for checking whether the content for a Swarm reference is retrievable and for re-uploading the content if it is not.

An HTTP GET request to the `stewardship` endpoint checks to see whether the content for the specified Swarm reference is retrievable:

```bash
curl "http://localhost:1633/stewardship/c0c2b70b01db8cdfaf114cde176a1e30972b556c7e72d5403bea32e
c0207136f"
```
```json
{
  "isRetrievable": true
}
```

If the content is not retrievable, an HTTP PUT request can be used to re-upload the content:

```bash
curl -X PUT "http://localhost:1633/stewardship/c0c2b70b01db8cdfaf114cde176a1e30972b556c7e72d5403bea32ec0207136f"
```



Note that for the re-upload to succeed, the associated content must be available locally, either pinned or cached. Since it isn't easy to predict if the content will be cached, for important content pinning is recommended. 