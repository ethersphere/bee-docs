---
title: Track Upload Status
id: syncing
---

When you are uploading data to Swarm, it can take some time until this is completed. In order to help you validate whether the upload is completed or to estimate how long it will take, you can use the `tags` feature. 

### Generate the tag automatically
A tag identifier is automatically created for you on each upload. You can find the tag in the `Swarm-Tag` header response. You can view this header response with curl when passing the `--verbose` flag to an upload:

```console
curl --data-binary @bee.jpg -verbose  "http://localhost:1633/files?name=bee.jpg"
```

### Generate the tag manually
While the automatically-generated tag is convenient, with big uploads it might take a while until the Bee API returns the headers. What you want to do in this case is to pre-generate the tag and pass this tag along with the upload command.

Generate a tag:
```console
curl -X POST http://localhost:1633/tags
> {"uid":1278066217,"startedAt":"2021-02-04T15:10:47.260477637+01:00","total":0,"processed":0,"synced":0}
```

:::info
In order to upload your data to Swarm, you must agree to burn some of your gBZZ to signify to storer and fowarder nodes that the content is important. Before you progress to the next step, you must buy stamps! See this guide on how to [purchase an appropriate batch of stamps](/docs/access-the-swarm/keep-your-data-alive).
:::


Pass the tag along with the upload:
```console
curl --data-binary @bee.jpg \
  -H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
  -H "Swarm-Tag: 1278066217" \
  "http://localhost:1633/files?name=bee.jpg"
```

:::info
When you manually create the tag, you will be able to view the status of chunks being prepared for upload (`processed`) as well as the status of uploading to the network (`synced`).
:::

### Ask for the Current Status

To get the current status of an upload, send a GET request to the `tag/<Swarm-Tag>` API endpoint.

```console
curl http://localhost:1633/tags/1278066217 | jq
```

The response contains all the information that you need to follow the status of your file as it is synced with the network.

:::info
The number that the `tags` endpoint returns under `total`, `processed` and `synced` are the number of *chunks*. Swarm's has a canonical data unit of 4kb.
:::
