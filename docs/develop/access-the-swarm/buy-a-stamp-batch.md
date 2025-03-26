---
title: Buy a Batch of Stamps
id: buy-a-stamp-batch
---

import VolumeAndDurationCalc from '@site/src/components/VolumeAndDurationCalc.js';
import AmountAndDepthCalc from '@site/src/components/AmountAndDepthCalc.js';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A postage batch is required to upload data to Swarm. Postage stamp batches represent _right to write_ data on Swarm's [DISC (Distributed Immutable Store of Chunks)](/docs/concepts/DISC/). The parameters which control the duration and quantity of data that can be stored by a postage batch are `depth` and `amount`, with `depth` determining data volume that can be uploaded by the batch and `amount` determining storage duration of data uploaded with the batch.

:::info
The storage volume and duration are both non-deterministic. Volume is non-deterministic due to the details of how [postage stamp batch utilization](/docs/concepts/incentives/postage-stamps#batch-utilisation) works. While duration is non-deterministic due to price changes made by the [price oracle contract](/docs/concepts/incentives/price-oracle).

      **Storage volume and `depth`:**

      When purchasing stamp batches for larger volumes of data (by increasing the `depth` value), the amount of data which can be stored becomes increasingly more predictable. For example, at `depth` 22 a batch can store between 4.93 GB and 17.18 GB, while at `depth` 28, a batch can store between 1.0 and 1.1 TB of data, and at higher depths the difference between the minimum and maximum storage volumes approach the same value.

      **Storage duration and `amount`:**

      The duration of time for which a batch can store data is also non-deterministic since the price of storage is automatically adjusted over time by the [price oracle contract](/docs/concepts/incentives/price-oracle). However, limits have been placed on how swiftly the price of storage can change, so there is no danger of a rapid change in price causing postage batches to unexpectedly expire due to a rapid increase in price. You can view a history of price changes by inspecting [the events emitted by the oracle contract](https://gnosisscan.io/address/0x47EeF336e7fE5bED98499A4696bce8f28c1B0a8b#events), or also through the [Swarmscan API](https://api.swarmscan.io/v1/events/storage-price-oracle/price-update). As you can see, if and when postage batch prices are updated, the updates are quite small. Still, since it is not entirely deterministic, it is important to monitor your stamp batch TTL (time to live) as it will change along with price oracle changes. You can inspect your batch's TTL using the `/stamps` endpoint of the API:

      ```bash
      root@noah-bee:~# curl -s  localhost:1633/stamps | jq
      {
        "stamps": [
          {
            "batchID": "f56af59cc2c785a3b45bbf3e46c3c4b20f80379339ef337b5bbf45ebe5629a66",
            "utilization": 0,
            "usable": true,
            "label": "",
            "depth": 17,
            "amount": "432072000",
            "bucketDepth": 16,
            "blockNumber": 38498819,
            "immutableFlag": true,
            "exists": true,
            "batchTTL": 82943
          }
        ]
      }
      ```
      Here we can see from the `batchTTL` that `82943` seconds remain, or approximately 23 hours.
      :::

For a deeper understanding of how `depth` and `amount` parameters determine the data volume and storage duration of a postage batch, see the [postage stamp page](/docs/concepts/incentives/postage-stamps/).

## Fund your node's wallet.

In order to purchase a postage stamp batch, your node's Gnosis Chain address needs to be funded with sufficient xDAI to pay gas for transaction fees on Gnosis Chain as well as sufficient xBZZ to pay for the cost of the postage stamp batch itself.

xBZZ can be obtained from a variety of different centralized and decentralized exchanges. You can find more information on [where to obtain xBZZ](https://www.ethswarm.org/get-bzz#how-to-get-bzz) on the Ethswarm homepage.

xDAI can be obtained from a wide range of centralized and decentralized exchanges. See [this list of exchanges](https://docs.gnosischain.com/about/tokens/xdai) from the Gnosis Chain documentation to get started.

You can learn more details from the [Fund Your Node](/docs/bee/installation/fund-your-node/) section.

## Buying a stamp batch

When interacting with Swarm CLI, the parameters amount and depth are set using option flags:

```bash
swarm-cli stamp buy --depth <depth value> --amount <amount value>
```

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

:::info
Once your batch has been purchased, it will take a few minutes for other Bee nodes in the Swarm to catch up and register your batch. Allow some time for your batch to propagate in the network before proceeding to the next step.
:::

## Setting stamp batch parameters and options

When purchasing a batch of stamps there are several parameters and options which must be considered. The `depth` parameter will control how many chunks can be uploaded with a batch of stamps. The `amount` parameter determines how much xBZZ will be allocated per chunk, and therefore also controls how long the chunks will be stored. While the `immutable` header option sets the batch as either mutable or immutable, which can significantly alter the behavior of the batch utilisation (more details below).

### Choosing `depth`

:::caution
The minimum value for `depth` is 17, however a higher depth value is recommended for most use cases due to the [mechanics of stamp batch utilisation](/docs/concepts/incentives/postage-stamps/#batch-utilisation). See [the depths utilisation table](/docs/concepts/incentives/postage-stamps/#effective-utilisation-table) to help decide which depth is best for your use case.
:::

One notable aspect of batch utilisation is that the entire batch is considered fully utilised as soon as any one of its buckets are filled. This means that the actual amount of chunks storable by a batch is less than the nominal maximum amount.

See the [postage stamp page](/docs/concepts/incentives/postage-stamps) for a more complete explanation of how batch utilisation works and a [table](/docs/concepts/incentives/postage-stamps#effective-utilisation-table) with the specific amounts of data which can be safely uploaded for each `depth` value.

### Choosing `amount`

:::caution
The minimum `amount` value for purchasing stamps is required to be at least enough to pay for 24 hours of storage. To find this value multiply the lastPrice value from the postage stamp contract times 17280 (the number of blocks in 24 hours). You can also use the [calculator](#calculators) below. This requirement is in place in order to prevent spamming the network.
:::

The `amount` parameter determines how much xBZZ is assigned per chunk for a postage stamp batch. You can use the calculators below to find the appropriate `amount` value for your target duration of storage and can also preview the price. For more information see the [postage stamp](/docs/concepts/incentives/postage-stamps#batch-depth-and-batch-amount) page where a more complete description is included.

### Mutable or Immutable?

Depending on the use case, uploaders may desire to use mutable or immutable batches. The fundamental difference between immutable and mutable batches is that immutable batches become unusable once their capacity is filled, while for mutable batches, once their capacity is filled, they may continue to be used, however older chunks of data will be overwritten with the newer once over capacity. The default batch type is immutable. In order to set the batch type to mutable, the `immutable` header should be set to `false`. See [this section on postage stamp batch utilisation](/docs/concepts/incentives/postage-stamps#which-type-of-batch-to-use) to learn more about mutable vs immutable batches, and about which type may be right for your use case.

## Calculators

The following postage batch calculators allow you to conveniently find the depth and amount values for a given storage duration and storage volume, or to find the storage duration and storage volume for a given depth and amount. The results will display the cost in xBZZ for the postage batch. The current pricing information is sourced from the Swarmscan API and will vary over time.

:::info
The 'effective volume' is the volume of data that can safely stored for each storage depth. The 'theoretical max volume' is significantly lower than the effective volume at lower depths and the two values trend towards the same value at higher depths. The lowest depth with an effective volume above zero is 22, with an effective depth of 4.93 GB. Lower depth values can be used for smaller uploads but do not come with the same storage guarantees. [Learn more here](/docs/concepts/incentives/postage-stamps#effective-utilisation-table).
:::

### Depth & Amount to Time & Volume Calculator

<VolumeAndDurationCalc />

### Time & Volume to Depth & Amount Calculator

The recommended depth in this calculator's results is the lowest depth value whose [effective volume](/docs/concepts/incentives/postage-stamps#effective-utilisation-table) is greater than the entered volume.

<AmountAndDepthCalc />

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

:::info
It is not possible to reupload unencrypted content which was stamped using an expired postage stamp.
:::

## Checking the remaining TTL (time to live) of your batch

:::info
At present, TTL is a primitive calculation based on the current storage price and the assumption that storage price will remain static in the future. As more data is uploaded into Swarm, the price of storage will begin to increase. For data that it is important to keep alive, make sure your batches have plenty of time to live!
:::

In order to make sure your _batch_ has sufficient _remaining balance_ to be stored and served by nodes in its [_area of responsibility_](/docs/references/glossary#2-area-of-responsibility-related-depths), you must regularly check on its _time to live_ and act accordingly. The _time to live_ is the number of seconds before the chunks will be considered for garbage collection by nodes in the network.

The remaining _time to live_ in seconds is shown in the API in the returned json object as the value for `batchTTL`, and with Swarm CLI you will see the formatted TTL as the `TTL` value.

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

## Top up your batch

:::danger
Don't let your batch run out! If it does, you will need to restamp and resync your content.
:::

If your batch is starting to run out, or you would like to extend the life of your batch to protect against storage price rises, you can increase the batch TTL by topping up your batch using the stamps endpoint, passing in the relevant batchID into the HTTP PATCH request.

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

## Dilute your batch

In order to store more data with a batch of stamps, you must "dilute" the batch. Dilution simply refers to increasing the depth of the batch, thereby allowing it to store a greater number of chunks. As dilution only increases the the depth of a batch and does not automatically top up the batch with more xBZZ, dilution will decrease the TTL of the batch. Therefore if you wish to store more with your batch but don't want to decrease its TTL, you will need to both dilute and top up your batch with more xBZZ.

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
