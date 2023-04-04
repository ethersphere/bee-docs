---
title: Pinning
id: pinning
---

Each Bee node is configured to reserve a certain amount of memory on your computer's hard drive to store and serve chunks within their _neighbourhood of responsibility_ for other nodes in the Swarm network. Once this alloted space has been filled, each Bee node deletes older chunks to make way for newer ones as they are uploaded by the network.

Each time a chunk is accessed, it is moved back to the end of the deletion queue, so that regularly accessed content stays alive in the network and is not deleted by a node's garbage collection routine.

Bee nodes provide a facility to **pin** important content so that it is not deleted by the node's garbage collection routine. Chunks can be _pinned_ either during upload, or retrospectively using the Swarm reference.


## Pin During Upload

To store content so that it will persist even when Bee's garbage collection routine is deleting old chunks, we simply pass the `Swarm-Pin` header set to `true` when uploading.

```bash
curl -H "Swarm-Pin: true" -H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264"  --data-binary @bee.mp4 localhost:1633/bzz\?bee.mp4
```

```json
{
  "reference": "1bfe7c3ce4100ae7f02b62e38d3e8d4c3a86ea368349614a87827402f20cbb30"
}
```

## Administer Pinned Content

To check what content is currently pinned on your node, query the `pins` endpoint of your Bee API:

```bash
curl localhost:1633/pins
```

```json
{
  "references": [
    "1bfe7c3ce4100ae7f02b62e38d3e8d4c3a86ea368349614a87827402f20cbb30"
  ]
}
```

or, to check for specific references:

```bash
curl localhost:1633/pins/1bfe7c3ce4100ae7f02b62e38d3e8d4c3a86ea368349614a87827402f20cbb30
```

A `404` response indicates the content is not available.

### Unpinning Content

We can unpin content by sending a `DELETE` request to the pinning endpoint using the same reference:

````bash
curl -XDELETE http://localhost:1633/pins/1bfe7c3ce4100ae7f02b62e38d3e8d4c3a86ea368349614a87827402f20cbb30
``

```json
{"message":"OK","code":200}
````

Now, when check again, we will get a `404` error as the content is no longer pinned.

```bash
curl localhost:1633/pins/1bfe7c3ce4100ae7f02b62e38d3e8d4c3a86ea368349614a87827402f20cbb30
```

```json
{ "message": "Not Found", "code": 404 }
```

:::info
Pinning and unpinning is possible for files (as in the example) and also the chunks, directories, and bytes endpoints. See the [API](/docs/api-reference/) documentation for more details.
:::

### Pinning Already Uploaded Content

The previous example showed how we can pin content upon upload. It is also possible to pin content that is already uploaded and present in the Swarm.

To do so, we can send a `POST` request including the swarm reference to the files pinning endpoint.

```bash
curl -XPOST http://localhost:1633/pin/7b344ea68c699b0eca8bb4cfb3a77eb24f5e4e8ab50d38165e0fb48368350e8f
```

```json
{ "message": "OK", "code": 200 }
```

The `pin` operation will attempt to fetch the content from the network if it is not available on the local node.

Now, if we query our files pinning endpoint again, the pin counter will once again have been incremented.

```bash
curl http://localhost:1633/pin/chunks/7b344ea68c699b0eca8bb4cfb3a77eb24f5e4e8ab50d38165e0fb48368350e8f
```

```json
{
  "address": "7b344ea68c699b0eca8bb4cfb3a77eb24f5e4e8ab50d38165e0fb48368350e8f",
  "pinCounter": 1
}
```

:::warning
While the pin operation will attempt to fetch content from the network if it is not available locally, we advise you to ensure that the content is available locally before calling the pin operation. If the content, for whatever reason, is only fetched partially from the network, the pin operation only partly succeeds and leaves the internal administration of pinning in an inconsistent state.
:::
