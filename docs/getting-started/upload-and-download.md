---
title: Upload and Download Files
id: upload-and-download
---

Bee provides a convenient way of uploading your data into the Swarm. Once your data has been uploaded, it will be distributed and stored by a worldwide network of p2p nodes, and made available from Swarm's [web gateways](https://gateway.ethswarm.org).

### Quick Upload

Once your Bee node is running, a HTTP API is enabled for you to interact with. The command line utility [curl](https://ec.haxx.se/http/http-multipart) is a great way to interact with a Bee node's API.

First, let's check to see if the API is running as expected...

```sh
curl http://localhost:1633
> Ethereum Swarm Bee
```

Once running, a file can be uploaded by making an HTTP POST request to the `files` endpoint of the Bee API.

```sh
curl -F file=@bee.jpg http://localhost:1633/files
```

We may also pass the appropriate mime type in the `Content-Type` header, and a file name to the `name` query parameter so that the file will be correctly handled by web browsers and other applications.

```sh
curl --data-binary @bee.jpg  -H "Content-Type: video/jpg" "http://localhost:1633/files?name=bee.jpg"
```

:::danger
Data uploaded to the swarm is always public. In Swarm, sensitive files must be [encrypted](/docs/getting-started/store-with-encryption) before uploading to ensure their contents always remains private.
:::

When succesful, a json formatted response will be returned, containing a **swarm reference** or **hash** which is the *address* of the uploaded file, for example:

```json
{"reference":"042d4fe94b946e2cb51196a8c136b8cc335156525bf1ad7e86356c2402291dd4"}
```
Keep this *address* safe, as we'll use it to retrieve our content later on.

In Swarm, every piece of data has a unique *address* which is a unique and reproducible cryptographic hash digest. If you upload the same file twice, you will always receive the same hash. This makes working with data in Swarm super secure!

:::info
If you are uploading a large file it is useful to track the status of your upload as it is processed into the network. Head over to the advanced usage section to learn how to [follow the status of your upload](/docs/advanced/tags). 

Once your file has been **completely synced with the network**, you will be able to turn off your computer and other nodes will take over to serve the data for you!
:::

## Download

Once your file is uploaded into Swarm, it can be retrieved with a simple HTTP GET request.

Substitute the *hash* in the last part of the url to be the reference to your own data.

```sh
curl -OJ http://localhost:1633/files/042d4fe94b946e2cb51196a8c136b8cc335156525bf1ad7e86356c2402291dd4
```

You may even simply navigate to the URL in your browser:

[http://localhost:1633/files/042d4fe...2291dd4](http://localhost:1633/files/042d4fe94b946e2cb51196a8c136b8cc335156525bf1ad7e86356c2402291dd4)

## Public Gateways

To share files with someone who isn't running a Bee node yet, simply change the host in the link to be one of our public gateways. Send the link to your friends, and they will be able to download the file too!

[https://gateway.ethswarm.org/files/042d4fe...2291dd4](https://gateway.ethswarm.org/files/042d4fe94b946e2cb51196a8c136b8cc335156525bf1ad7e86356c2402291dd4)

<!-- If you are unable to download your file from a different Bee node, you may be experiencing connection issues, see [troubleshooting connectivity](/docs/troubleshooting/connectivitiy) for assistance. -->