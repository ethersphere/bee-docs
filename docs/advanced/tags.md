---
title: Track Upload Status
id: tags
---

In Swarm, an instruction to upload data to the network goes through 3 consecutive stages before it is completed:

- Splitting
- Storing
- Sending

In the splitting state, the file is deconstructed in *chunks* (Swarms canonical data unit) and packaged in a [*Binary Merkle Tree*](https://en.wikipedia.org/wiki/Merkle_tree). After splitting, the chunks are stored in your local database where they enter a queue, to be sent to the network.

Sending starts immediately when the first chunks are split and stored. After the chunk is sent, your node will receive a receipt from the node that has stored the chunk, marking the completion of the upload for that chunk. After a receipt has been received for all chunks, the upload is complete.

## How to track the status of your upload
The status of your upload can be followed by using `tags`. A `tag` is a label given to all chunks that belong to the same upload instruction. 

:::info
The tag label is only known to your node. It is **not** communicated to the network, only your node will known that a set of chunks belong together.
:::

### Generate the tag identifier
To get the status of an upload, we can:

Generate the tag before the upload and pass this tag on upload

:::info
To follow the status of your upload while it is splitting you must generate the tag yourself beforehand since the tag-uid is usually communicated only after splitting is complete.
:::

Create a tag by sending a POST request to the `tag` API endpoint:

```console
curl -s -XPOST http://localhost:8080/tags | jq .uid
> 4074122506
```

Use the returned UID to instruct your POST upload request to track this upload using the `Swarm-Tag-UID` header:

```console
curl -F file=@bee.jpg -H "Swarm-Tag-UID: 4074122506" http://localhost:8080/files
```

:::info
If you don't want to track the *splitting* stage, you may omit the `Swarm-Tag-UID` header, and a new tag will be automatically created and returned in the HTTP response header after splitting is complete.

You can use `curl --verbose` to view the HTTP response headers such as the `Swarm-Tag-UID` header.
:::

### Ask for the Current Status

To get the current status of an upload, send a GET request to the `tag/<Swarm-Tag-UID>` API endpoint.

```console
curl http://localhost:8080/tags/4074122506 | jq
```

The response contains all the information that you need to follow the status of your file as it is synced with the network.

```json
{
  "total": 36, //the total number of chunks, 0 if the upload is still splitting
  "split": 36, //the current number of chunks which have been split and packed in the Binary Merkle Tree
  "seen": 0, //chunks already seen by the network
  "stored": 36, //the total number of chunks stored and queued for sending (if not seen before)
  "sent": 36, //the total number of chunks sent to the network
  "synced": 0, //the total number of receipts received
  "uid": 4074122506,
  "name": "unnamed_tag_1598627762",
  "address": "",
  "startedAt": "2020-08-28T16:16:02.071929+01:00" //when the tag was created (ISO 8601 format)
}
```