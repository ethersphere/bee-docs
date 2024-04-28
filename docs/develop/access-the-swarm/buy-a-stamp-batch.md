---
title: Buy a Batch of Stamps
id: buy-a-stamp-batch
---
import VolumeAndDurationCalc from '@site/src/components/VolumeAndDurationCalc.js';
import AmountAndDepthCalc from '@site/src/components/AmountAndDepthCalc.js';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



## Buying a stamp batch

A valid postage batch is required to upload data to Swarm. When purchasing a postage batch, the postage stamp batch purchase parameters can be adjusted to support the storage of differing amounts of data and duration. The parameters which control the duration and quantity of data that can be stored by a postage batch are the `depth` and `amount` parameters, with `depth` determining data size and `amount` determining storage duration. When interacting with the Bee API, a postage batch purchase follows this format:

```bash
curl -s -XPOST http://localhost:1635/stamps/<amount>/<depth>
```


<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API

```bash
curl -s -XPOST http://localhost:1635/stamps/100000000/20
```

```bash
{
  "batchID": "8fcec40c65841e0c3c56679315a29a6495d32b9ed506f2757e03cdd778552c6b",
  "txHash": "0x51c77ac171efd930eca8f3a77e3fcd5aca0a7353b84d5562f8e9c13f5907b675"
}
```

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

```bash
swarm-cli stamp buy --depth 20 --amount 100000000
```

```bash
Estimated cost: 0.010 BZZ
Estimated capacity: 4.00 GB
Estimated TTL: 5 hours 47 minutes 13 seconds
Type: Mutable
When a mutable stamp reaches full capacity, it still permits new content uploads. However, this comes with the caveat of overwriting previously uploaded content associated with the same stamp.
? Confirm the purchase Yes
Stamp ID: f4b9830676f4eeed4982c051934e64113dc348d7f5d2ab4398d371be0fbcdbf5
```
</TabItem>
</Tabs>


:::caution
The minimum `amount` value for purchasing stamps is required to be at least enough to pay for 24 hours of storage. To find this value multiply the `lastPrice` value from the postage stamp contract times 17280 (the number of blocks in 24 hours). This requirement is in place in order to prevent spamming the network.

The minimum value for `depth` is 24. This requirement is in place due [the mechanics of batch utilisation](/docs/learn/technology/contracts/postage-stamp#effective-utilisation-table). 
:::

:::info
Once your batch has been purchased, it will take a few minutes for other Bee nodes in the Swarm to catch up and register your batch. Allow some time for your batch to propagate in the network before proceeding to the next step.
:::

## Calculators

<VolumeAndDurationCalc />

<AmountAndDepthCalc />

## Viewing Stamps

To check on your stamps, send a GET request to the stamp endpoint.


<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API


```bash
curl http://localhost:1635/stamps
```

```bash
{
  "stamps": [
    {
      "batchID": "f4b9830676f4eeed4982c051934e64113dc348d7f5d2ab4398d371be0fbcdbf5",
      "utilization": 0,
      "usable": true,
      "label": "",
      "depth": 20,
      "amount": "100000000",
      "bucketDepth": 16,
      "blockNumber": 30643611,
      "immutableFlag": true,
      "exists": true,
      "batchTTL": 20588,
      "expired": false
    }
  ]
}
```

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

```bash
swarm-cli stamp list
```

```bash
Stamp ID: f4b9830676f4eeed4982c051934e64113dc348d7f5d2ab4398d371be0fbcdbf5
Usage: 0%
Remaining Capacity: 4.00 GB
TTL: 5 hours 42 minutes 18 seconds
Expires: 2023-10-26

```
</TabItem>
</Tabs>


:::info
When uploading content which has been stamped using an already expired postage stamp, the node will not attempt to sync the content. You are advised to use longer-lived postage stamps and encrypt your content to work around this. It is not possible to reupload unencrypted content which was stamped using an expired postage stamp. We're working on improving on this.
:::


Swarm comprises the sum total of all storage space provided by all of our nodes, called the DISC (Distributed Immutable Store of Chunks). The _right to write_ data into this distributed store is determined by the [postage stamps](/docs/learn/technology/contracts/postage-stamp) that have been attached.

## Fund your node's wallet.

To start up your node, you will already have provided your node with
xDAI for gas and xBZZ which was transferred into your chequebook when
your node was initialised. This will be used to interact with other
nodes using the _SWAP_ protocol. In order to access more funds to buy
batches of stamps, your wallet must be funded with xBZZ. The easiest
way to achieve this is to withdraw funds from your chequebook:



<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API

```bash
curl -XPOST "http://localhost:1635/chequebook/withdraw?amount=1000" 
```

```bash
{
  "transactionHash": "0xce73b9962e41ee0adcf5926663312093a3c292a8338ff641a70224ac32a04945"
}

```

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

```bash
swarm-cli cheque withdraw 1000
```

```bash
Tx: 0x2326d5b8e568bf2689d5a112427018c19858efcafadc7e5d3ddc7dae882d11f0
```
</TabItem>
</Tabs>


## What is a stamp batch?

Stamp batches must be purchased and then utilised in order to upload data to swarm. 

Stamp batches are created in buckets with a `bucket depth` of 16. The entire Swarm address space is divided into $$2^{bucketDepth} = 2^{16} = 65,536$$ different buckets. When uploaded, each of your files are split into 4kb chunks and assigned to a specific bucket based on its address. When a chunk gets assigned to a bucket, we can say that the chunk has been 'stamped', and that one stamp has been utilized from the postage stamp batch.

 When creating a batch there are two required parameters, `batch depth` and `amount`, which are explained below. 

You can learn more about stamp batches on the [postage stamp contract page](/docs/learn/technology/contracts/postage-stamp).

## Amount

The `amount` is the quantity of xBZZ in PLUR $$(1 \times 10^{16}PLUR = 1 \text{ xBZZ})$$ that is assigned per chunk in the batch. The total number of xBZZ that will be paid for the batch is calculated from this figure and the `batch depth` like so:

$$2^{batch \_ depth} \times {amount}$$

The paid xBZZ forms the `balance` of the batch. This `balance` is then slowly depleted as time ticks on and blocks are mined on Gnosis Chain.

:::warning
Although your stamp batch 'balance' slowly decrements as time goes on, there is no way to withdraw xBZZ from a batch.
:::

For example, with a `batch depth` of 24 and an `amount` of 1000000000 PLUR:
                                                    
$$
2^{24} \times 1000000000 = 16777216000000000 \text{ PLUR} = 1.6777216 \text{ xBZZ}
$$

## Batch Depth

The `batch depth` determines _how many chunks_ are allowed to be in each bucket. The number of chunks allowed in each bucket is calculated like so:
$$2^{batch \_ depth - bucket \_ depth}$$  $$=$$ $$2^{batch \_ depth - 16}$$. 


## Setting stamp batch parameters and options

When purchasing a batch of stamps there are several parameters and options which must be considered. The `depth` parameter will control how many chunks can be uploaded with a batch of stamps. The `amount` parameter determines how much xBZZ will be allocated per chunk, and therefore also controls how long the chunks will be stored. While the `immutable` header option sets the batch as either mutable or immutable, which can significantly alter the behavior of the batch utilisation (more details below).

### Choosing a `depth`

One notable aspect of batch utilization is that the entire batch is considered fully utilized as soon as any one of its buckets are filled. This means that the actual amount of chunks storable by a batch is less than the nominal maximum amount. 

See the [postage stamp contract page](/docs/learn/technology/contracts/postage-stamp#batch-utilisation) for a more complete explanation of how batch utilisation works and a [table](/docs/learn/technology/contracts/postage-stamp#effective-utilisation-table) with the specific amounts of data which can be safely uploaded for each `depth` value. 

### Calculating `amount` needed for desired TTL 

The `amount` you specify determines how much xBZZ denominated in PLUR will be assigned per chunk uploaded. This governs the amount of time your chunks live on Swarm. While stamp prices are currently set at 24000 PLUR / chunk / block, prices will become variable in the future. When this comes into effect it will not possible to predict with accuracy exactly when your chunks will run out of balance, however, it can be estimated based on the current price and the remaining batch balance. The desired `amount` can be easily estimated based on the current postage stamp price and the desired amount of storage time in seconds with the given Gnosis block time of 5 seconds and stamp price of 24000 PLUR / chunk / block:

$$
(\text{stamp price} \div \text{block time in seconds}) \times \text{storage time in seconds}
$$

There are 1036800 seconds in 12 days, so the `amount` value required to store for 12 days can be calculated:

$$
(\text{24000} \div \text{5}) \times \text{1036800} = 4976640000
$$

So we can use 4976640000 as our `amount` value in order for our postage batch to store data for 12 days.
 
:::info
The postage stamp price is currently set at 24000 PLUR, but may change to a dynamic pricing model in the future. Once a dynamic pricing model has been implement, TTL values can only be taken as estimates and may change over time.
:::

### Mutable of Immutable?

Depending on the use case, uploaders may desire to use mutable or immutable batches. The fundamental difference between immutable and mutable batches is that immutable batches become unusable once their capacity is filled, while for mutable batches, once their capacity is filled, they may continue to be used, however older chunks of data will be overwritten with the newer once over capacity. The default batch type is immutable. In order to set the batch type to mutable, the `immutable` header should be set to `false`. See [this section on postage stamp batch utilisation](/docs/learn/technology/contracts/postage-stamp#which-type-of-batch-to-use) to learn more about mutable vs immutable batches, and about which type may be right for your use case.


## Checking the remaining TTL (time to live) of your batch

:::info
At present, TTL is a primitive calculation based on the current storage price and the assumption that storage price will remain static in the future. As more data is uploaded into Swarm, the price of storage will begin to increase. For data that it is important to keep alive, make sure your batches have plenty of time to live!
:::

In order to make sure your *batch* has sufficient *remaining balance* to be stored and served by nodes in its [*area of responsibility*](/docs/learn/glossary#2-area-of-responsibility-related-depths), you must regularly check on its _time to live_ and act accordingly. The *time to live* is the number of seconds before the chunks will be considered for garbage collection by nodes in the network.

The remaining *time to live* in seconds is shown in the API in the returned json object as the value for `batchTTL`, and with Swarm CLI you will see the formatted TTL as the `TTL` value.


<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API


```bash
curl http://localhost:1635/stamps
```

```bash
{
  "stamps": [
    {
      "batchID": "f4b9830676f4eeed4982c051934e64113dc348d7f5d2ab4398d371be0fbcdbf5",
      "utilization": 0,
      "usable": true,
      "label": "",
      "depth": 20,
      "amount": "100000000",
      "bucketDepth": 16,
      "blockNumber": 30643611,
      "immutableFlag": true,
      "exists": true,
      "batchTTL": 20588,
      "expired": false
    }
  ]
}
```

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

```bash
swarm-cli stamp list
```

```bash
Stamp ID: f4b9830676f4eeed4982c051934e64113dc348d7f5d2ab4398d371be0fbcdbf5
Usage: 0%
Remaining Capacity: 4.00 GB
TTL: 5 hours 42 minutes 18 seconds
Expires: 2023-10-26

```
</TabItem>
</Tabs>

## Top up your batch

:::danger
Don't let your batch run out! If it does, you will need to restamp and resync your content.
:::

If your batch is starting to run out, or you would like to extend the life of your batch to protect against storage price rises, you can increase the batch TTL by topping up your batch using the stamps endpoint, passing in the relevant batchID into the HTTP PATCH request.



<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API

```bash
curl -X PATCH "http://localhost:1635/stamps/topup/6d32e6f1b724f8658830e51f8f57aa6029f82ee7a30e4fc0c1bfe23ab5632b27/10000000"
```

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

List available stamps.

```bash
swarm-cli stamp list
```

Copy stamp ID.
```bash
Stamp ID: daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
Usage: 13%
Remaining Capacity: 3.50 GB
TTL: 183 days 1 hour 37 minutes 8 seconds
Expires: 2024-05-02
```

Use `swarm-cli stamp topup` with the `--amount` and `--stamp` parameters set with the amount to topup in PLUR and the stamp ID.

```bash
swarm-cli stamp topup --amount 10000000  --stamp daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa
4ea660de66aa62db
```

Wait for topup transaction to complete.
```bash
⬡ ⬡ ⬢ Topup in progress. This may take a while.
Stamp ID: daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
Depth: 20
Amount: 100000001000
```

</TabItem>
</Tabs>


## Dilute your batch

In order to store more data with a batch of stamps, you must "dilute" the batch. Dilution simply refers to increasing the depth of the batch, thereby allowing it to store a greater number of chunks. As dilution only increases the the depth of a batch and does not automatically top up the batch with more xBZZ, dilution will decrease the TTL of the batch. Therefore if you wish to store more with your batch but don't want to decrease its TTL, you will need to both dilute and top up your batch with more xBZZ.



<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API


Here we call the `/stamps` endpoint and find a batch with `depth` 24 and a `batchTTL` of 2083223 which we wish to dilute:

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
            "depth": 24,
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

Next we call the [`dilute`](/api/#tag/Postage-Stamps/paths/~1stamps~1dilute~1{batch_id}~1{depth}/patch) endpoint to increase the `depth` of the batch using the `batchID` and our new `depth` of 26:

```bash
curl -s -XPATCH http://localhost:1635/stamps/dilute/0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5/26
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

We can see the new `depth` of 26 and a decreased `batchTTL` of 519265.

```json
{
    "stamps": [
        {
            "batchID": "0e4dd16cc435730a25ba662eb3da46e28d260c61c31713b6f4abf8f8c2548ae5",
            "utilization": 0,
            "usable": true,
            "label": "",
            "depth": 26,
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

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI

List available stamps, make sure to use the `--verbose` flag so that we can see the batch depth.

```bash
swarm-cli stamp list --verbose
```

We have a stamp batch with depth 20 we want to dilute. Copy stamp ID of that batch.

```bash
Listing postage stamps...
Stamp ID: daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
Usage: 13%
Remaining Capacity: 3.50 GB
Total Capacity (mutable): 4.00 GB
TTL: 182 days 4 hours 39 minutes 47 seconds
Expires: 2024-05-02
Depth: 20
Bucket Depth: 16
Amount: 100010002000
Usable: true
Utilization: 2
Block Number: 29734329
```

Use `swarm-cli stamp dilute` with the `--depth` and `--stamp` parameters set with the desired new depth and the stamp ID.

```bash
swarm-cli stamp dilute --depth 21 --stamp daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
```

```bash
⬡ ⬡ ⬢ Dilute in progress. This may take a while.
Stamp ID: daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
Depth: 20
Amount: 100010002000
```

</TabItem>
</Tabs>

## Stewardship

The <a href="/api/#tag/Stewardship" target="_blank">stewardship endpoint</a> in combination with [pinning](/docs/develop/access-the-swarm/pinning) can be used to guarantee that important content is always available. It is used for checking whether the content for a Swarm reference is retrievable and for re-uploading the content if it is not.

An HTTP GET request to the `stewardship` endpoint checks to see whether the content for the specified Swarm reference is retrievable:

:::info
`stewardship` is not currently supported by Swarm CLI
:::

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