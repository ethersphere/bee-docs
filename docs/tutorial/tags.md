---
title: Follow the status of your upload
id: tags
---

# Follow the status of your upload
## The different stages of your upload

In Swarm, an instruction to upload data to the network goes through 3 con consecutive stages before it is completed:

- Splitting
- Storing
- Sending

In the splitting state, the file is deconstructed in *chunks* (Swarms canonical data unit) and packaged in a [*Binary Merkle Tree*](https://en.wikipedia.org/wiki/Merkle_tree). After splitting, the chunks are stored in your local database, where they directly enter a queue, to be sent to the network.
Sending starts immediately when the first chunks are split and stored. After the chunk is sent, you node will get a receipt from the node that stores the chunk, marking the completion of the upload for that chunk. After a receipt is received for all chunks, the upload is complete.

## How to track the status of your upload
The status of your upload can be followed by using `tags`. A `tag` is a label, given to all chunks that belong to the same upload instruction. 

:::info
The tag label is only known to your node. It is **not** communicated to the network, hence, only your node will known that a set of chunks belong together
:::

### Get the tag identifier
To get the status of an upload, we can:

1. Generate the tag before the upload and pass this tag upon upload
2. Let the Bee node generate a tag automatically

The disadvantage of the second option is that you won't be able to follow the status of your upload while it is splitting (the tag-uid is communicated after splitting is done). To follow the status of splitting, you need to generate the tag yourself beforehand.

Creating a tag is done by calling the `tag` API:

```console
curl -XPOST http://localhost:8080/tags`
```

Pass the returned uid to your next upload as:

```console
curl -H "swarm-tag-uid: <tag-uid-here>"  -H "Content-Type: image/x-jpeg" --data-binary @kitten.jpg localhost:8080/files?name=cat.jpg`
```
If don't want to create the tag yourself, you can just do your upload as you would normally do. The `swarm-tag-uid` is communicated as part of the response header.

:::info
You can view the response headers, including the swarm-tag-uid with curl by passing the `--verbose` flag with your upload instruction
:::

### Ask for the status
The swarm-tag-uid is used in the GET `tag/<swarm-tag-uid>` API endpoint to get the status of your upload.

You can call into this endpoint by using cURL:

```console
curl http://localhost:8080/tags/<swarm-tag-uid> | jq
```

Which responds with all information that you need to follow the status of your tag.

```json
 "total": "the total number of chunks, 0 if the upload is still splitting",
  "split": "the current number of chunks which are split and packed in the Binary Merkle Tree",
  "seen": "starts incrementing if the chunk is already seen before and sent to the network",
  "stored": "the total number of chunks stored and queued for sending (if not seen before)",
  "sent": "the total number of chunks sent to the network",
  "synced": "the total number of receipts received",
  "uid": "the swarm-tag-uid",
  "anonymous": "TODO",
  "name": "TODO",
  "address": "the address of the root chunk. Only available if splitting is done",
  "startedAt": "when the upload started (ISO 8601 format)"
```