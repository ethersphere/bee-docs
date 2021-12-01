---
title: Direct upload
id: direct-upload
---

:::caution
We recommend turning the encryption *ON* when using this feature. Otherwise the uniformity assumption will be broken.
If the encryption is *OFF* then uploading the same content multiple times using the same postage stamp will lead to its value decreasing faster.
:::

#### Configuration

By default your bee instance will handle uploads in a _deferred_ manner.
If you want to upload directly to the network you have to set the `Swarm-Deferred-Upload` header value to "false" in your request.

```bash
curl \
	-X POST \
	-H "Swarm-Deferred-Upload: false" \
	-H "Content-Type: application/x-tar" \
	-H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
	--data-binary @my_data.tar http://localhost:1633/bzz
```

#### Mode of Operation

You have the option to push data directly onto the network while still allowing buffered uploads as it was traditionally allowed.
With this new mode of operation, the root hash of an upload will only be received once all chunks have been safely uploaded into the network.
