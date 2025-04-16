---
title: Track Upload Status
id: syncing
---

When you are uploading data to Swarm, it can take some time until this is completed. In order to help you validate whether the upload is completed or to estimate how long it will take, you can use the `tags` feature.


### Generate the tag 

While the automatically-generated tag is convenient, with big uploads it might take a while until the Bee API returns the headers. What you want to do in this case is to pre-generate the tag and pass this tag along with the upload command.

Generate a tag:

```bash
curl -X POST http://localhost:1633/tags
```

The `uid` value is your tag:

```json
 {
    "split": 0,
    "seen": 0,
    "stored": 0,
    "sent": 0,
    "synced": 0,
    "uid": 5,
    "address": "",
    "startedAt": "2023-08-31T06:46:41.574003454Z"
}
```

:::info
Before you progress to the next step, you must buy stamps so you can pay for uploads! See this guide on how to [purchase an appropriate batch of stamps](/docs/develop/access-the-swarm/buy-a-stamp-batch).
:::

Pass the tag along with the upload:

```bash
curl --data-binary @bee.jpg \
  -H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
  -H "Swarm-Tag: 5" \
  "http://localhost:1633/bzz?name=bee.jpg"
```

### Ask for the Current Status

To get the current status of an upload, send a GET request to the `tag/<Swarm-Tag>` API endpoint.

```bash
curl http://localhost:1633/tags/5 | jq
```

The response contains all the information that you need to follow the status of your file as it is synced with the network.

:::info
The numbers that the `tags` endpoint returns under `total`, `processed` and `synced` are denominated in [*chunks*](/docs/concepts/DISC/#chunks), i.e. Swarm's 4kb data units.
:::
