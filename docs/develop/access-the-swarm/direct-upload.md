---
title: Direct upload
id: direct-upload
---


#### Deferred and Direct Uploads

By default your bee instance will handle uploads in a _deferred_ manner, meaning that the data will be completely uploaded to your node locally before being then being uploaded to the Swarm network. 

In contrast, for a direct upload, the data will be completely uploaded to the Swarm network directly.

If you want to upload directly to the network you have to set the `swarm-deferred-upload` header value to "false" in your request.

```bash
curl \
	-X POST \
	-H "swarm-deferred-upload: false" \
	-H "Content-Type: application/x-tar" \
	-H "swarm-postage-batch-id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
	--data-binary @my_data.tar http://localhost:1633/bzz
```

