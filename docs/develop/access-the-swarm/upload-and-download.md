---
title: Upload and Download
id: upload-and-download
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

When you upload your files to the Swarm, they are split into 4kb
_chunks_ and then distributed to nodes in the network that are
responsible for storing and serving these parts of your content. 
To learn more about how Swarm's decentralized storage solution works,
check out the ["Learn" section](/docs/concepts/what-is-swarm).

In order for you to be able to upload any data to the network,
you must first purchase [postage stamps](/docs/concepts/incentives/postage-stamps)
and then use those stamps to upload your data. Keep on reading below to learn how.

## Uploads and Download Endpoints Overview

There are three endpoints which can be used for uploading and downloading data from Swarm, and each endpoint has different usage. 

1. [`/bytes`](/api/#tag/Bytes) - Used for uploading raw data, lacks convenience features present in the `/bzz` endpoint but allows for greater customization for advanced use cases.
1. [`/bzz`](/api/#tag/BZZ) - Used for general download and uploads of files or collections of files.
1. [`/chunks`](/api/#tag/Chunk) - Used for downloading and uploading individual chunks, and also for uploading streams of chunks.

Generally speaking, the `/bzz` endpoint is appropriate for general common use cases such as uploading websites, sharing files, etc., while the `/chunks` and `bytes` endpoints allow for more complex uses cases. In this guide, we focus on the usage of the `/bzz` endpoint. 

## Upload a File

To upload data to the swarm, you must perform the following steps:

1. Fund your node's wallet with xBZZ.
2. Purchase a _batch_ of stamps with your xBZZ.
3. Wait for the batch to propagate across the network.
4. Upload your content, specifying the _batch id_ so that Bee can attach stamps to your chunks.
5. Download your content using your content's hash.

## Purchasing Your Batch of Stamps

In order to upload your data to swarm, you must agree to burn (spend)
some of your xBZZ to signify to storer and fowarder nodes that this
content is valued. Before you proceed to the next step, you must buy
stamps! See this guide on how to [purchase an appropriate batch of stamps](/docs/develop/access-the-swarm/buy-a-stamp-batch).

## Using Stamps to Upload a File

Once your Bee node is running, a HTTP API is enabled for you to interact with. The command line utility [curl](https://ec.haxx.se/http/http-multipart) is a great way to interact with a Bee node's API. Swarm CLI alternative commands are also included as a more user-friendly way of interacting with your Bee node's API.


<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API

First, let's check to see if the API is running as expected...

```bash
curl http://localhost:1633
```

```
Ethereum Swarm Bee
```

Once running, a file can be uploaded by making an HTTP POST request to the `bzz` endpoint of the Bee API.

Here, you must specify your _Batch ID_ in the `Swarm-Postage-Batch-Id` header, the file name in the `name` query parameter, and also pass the appropriate mime type in the `Content-Type` header.

You may also wish to employ the erasure coding feature to add greater protection for your data, see [erasure coding page](/docs/develop/access-the-swarm/erasure-coding) for more details on its usage.

```bash
 curl -X POST -H "Swarm-Postage-Batch-Id: 54ba8e39a4f74ccfc7f903121e4d5d0fc40732b19efef5c8894d1f03bdd0f4c5" -H "Content-Type: text/plain" -H "Swarm-Encrypt: false" -v --data-binary "@test.txt" localhost:1633/bzz
```

:::danger
Data uploaded to Swarm is always public. In Swarm, sensitive files
must be [encrypted](/docs/develop/access-the-swarm/store-with-encryption)
before uploading to ensure their contents always remains private.
:::

When succesful, a JSON formatted response will be returned, containing
a **swarm reference** or **hash** which is the _address_ of the
uploaded file, for example:

```json
{
  "reference": "22cbb9cedca08ca8d50b0319a32016174ceb8fbaa452ca5f0a77b804109baa00"
}
```

Keep this _address_ safe, as we'll use it to retrieve our content later on.

</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI
We have a `test.txt` file we wish to upload, let's check its contents.

```bash
cat test.txt
This is a test file
It will be used to test uploading and downloading from Swarm
```

Check that our node is operating normally.  

```bash
swarm-cli status
```

```bash
Bee
API: http://localhost:1633 [OK]

Version: 2.0.0-50fcec7b
Mode: full

Topology
Connected Peers: 175
Population: 13614
Depth: 9

Wallet
xBZZ: 85.5638752768932272
xDAI: 4.753393401487287091

Chequebook
Available xBZZ: 0.0000000000018
Total xBZZ: 0.0000000000018

Staking
Staked xBZZ: 10

Redistribution
Reward: 831386836533248000
Has sufficient funds: true
Fully synced: true
Frozen: false
Last selected round: 202266
Last played round: 202266
Last won round: 186776
Minimum gas funds: 101250000000000000
```

List our stamps.

```bash
swarm-cli stamp list
```

Copy the ID of the stamp we wish to use.

```bash
Stamp ID: daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
Usage: 7%
Remaining Capacity: 7.50 GB
TTL: 91 days 1 hour 45 minutes 28 seconds
Expires: 2024-02-01
```
Use the stamp ID to upload our file.

```bash
swarm-cli upload test.txt --stamp daa8c5b36e1cf481b10118a8b02430a6f22618deaa6ba5aa4ea660de66aa62db
```

If successful, we will receive the hash of the uploaded file and the URL where it is reachable.

```bash
Swarm hash: 1ffd2b67c8f34596a0b8375be29423c2d47e7995fcac8dd83fbd34e3d839b5a2
URL: http://localhost:1633/bzz/1ffd2b67c8f34596a0b8375be29423c2d47e7995fcac8dd83fbd34e3d839b5a2/
Stamp ID: daa8c5b3
Usage: 7%
Remaining Capacity: 7.50 GB 
```

Let's check that the file is downloadable.

```bash
swarm-cli download 1ffd2b67c8f34596a0b8375be29423c2d47e7995fcac8dd83fbd34e3d839b5a2
test.txt OK
```

And let's confirm that the contents of the file are correct.

```bash
cat test.txt
This is a test file
It will be used to test uploading and downloading from Swarm
```
</TabItem>
</Tabs>


In Swarm, every piece of data has a unique _address_ which is a unique and reproducible cryptographic hash digest. If you upload the same file twice, you will always receive the same hash. This makes working with data in Swarm super secure!

:::info
If you are uploading a large file it is useful to track the status of your upload as it is processed into the network. To improve the user experience, learn how to [follow the status of your upload](/docs/develop/access-the-swarm/syncing).

Once your file has been **completely synced with the network**, you will be able to turn off your computer and other nodes will take over to serve the data for you!
:::

## Download a File

Once your file is uploaded to Swarm it can be easily downloaded. 


<Tabs
defaultValue="api"
values={[
{label: 'API', value: 'api'},
{label: 'Swarm CLI', value: 'swarm-cli'},
]}>
<TabItem value="api">

#### API

Uploaded files can be retrieved with a simple HTTP GET request.

Substitute the _hash_ in the last part of the URL with the reference
to your own data.

:::tip
Make sure to include the trailing slash after the hash.
:::
```bash
curl -OJL http://localhost:1633/bzz/c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d/
```

You may even simply navigate to the URL in your browser:

[http://localhost:1633/bzz/22cb...aa00](http://localhost:1633/bzz/22cbb9cedca08ca8d50b0319a32016174ceb8fbaa452ca5f0a77b804109baa00)


</TabItem>

<TabItem value="swarm-cli">

#### Swarm CLI
Simply use the `swarm-cli download` command followed by the hash of the file you wish to download. 

```bash
swarm-cli download 1ffd2b67c8f34596a0b8375be29423c2d47e7995fcac8dd83fbd34e3d839b5a2
test.txt OK
```
And let's print out the file contents to confirm it was downloaded properly.

```bash
cat test.txt
This is a test file
It will be used to test uploading and downloading from Swarm
```
</TabItem>
</Tabs>


## Upload a Directory 

It is possible to use Bee to upload directories of files all at once.

:::tip
Comfortable with nodeJS and JavaScript? Check out [swarm-cli](https://github.com/ethersphere/swarm-cli), a command line tool you can use to easily interact with your Bee node!
:::

:::info
If an uploaded directory contains an `index.html` file, when you navigate to the directory in a web browser it will automatically be served to users from our [Swarm gateways](https://gateway.ethswarm.org) as if it were a website hosted by a normal web server. Use this feature to host your unstoppable website on Swarm!
:::

This feature makes use of the [tar](https://www.gnu.org/software/tar/) command line utility to package the directory into a single file that can then be uploaded to the Bee API for processing and distributed into the swarm for later retrieval.

:::caution
GZIP compression is not supported in the current version of Bee, so make sure not to use the `-z` flag when using the `tar` command!
:::

### Upload the Directory Containing Your Website

First, use the `tar` command line utility to create an archive containing all the files of your directory. If uploading a website, we must take care to ensure that the `index.html` file is at the root of the directory tree.

```bash
tree my_website
>
my_website
├── assets
│   └── style.css
├── index.html
└── error.html
```

Use the following command to ensure that the `tar` package maintains the correct directory structure:

```bash
cd my_website
tar -cf ../my_website.tar .
cd ..
```

Next, simply POST the `tar` file as binary data to Bee's `dir` endpoint, taking care to include the header `Content Type: application/x-tar`.

:::info
In order to upload your data to swarm, you must agree to burn some of your xBZZ to signify to storer and fowarder nodes that the content is important. Before you progress to the next step, you must buy stamps! See this guide on how to [purchase an appropriate batch of stamps](/docs/develop/access-the-swarm/buy-a-stamp-batch).
:::

```bash
curl \
	-X POST \
	-H "Content-Type: application/x-tar" \
	-H "Swarm-Index-Document: index.html" \
	-H "Swarm-Error-Document: error.html" \
	-H "Swarm-Collection: true" \
	-H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
	--data-binary @my_website.tar http://localhost:1633/bzz
```

:::info
For instances where a single page app has a JavaScript router that handles url queries itself, simply pass `index.html` as the error document. Bee will pass over control to the JavaScript served by the `index.html` file in the circumstance that a path does not yield a file from the manifest.
:::

When the upload is successful, Bee will return a JSON document containing the Swarm Reference.

```json
{
  "reference": "b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b"
}
```

Now, simply navigate your browser to view the reference using the `bzz` endpoint and your website will be served!

[http://localhost:1633/bzz/b25c89a...214917b/](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/)

Other files are served at their relative paths, e.g:

[http://localhost:1633/bzz/b25c89a...214917b/assets/style.css](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/assets/style.css)

Once your data has been [fully processed into the network](/docs/develop/access-the-swarm/syncing), you will then be able to retrieve it from any Bee node.

[https://gateway.ethswarm.org/bzz/b25c89a...214917b/index.html](https://gateway.ethswarm.org/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/)

If you are not able to download your file from a different Bee node, you may be experiencing connection issues, see [troubleshooting connectivity](/docs/bee/installation/connectivity) for assistance.



## Public Gateways

To share files with someone who isn't running a Bee node yet, simply change the host in the link to be one of our public gateways. Send the link to your friends, and they will be able to download the file too!

[https://download.gateway.ethswarm.org/bzz/22cb...aa00/](https://download.gateway.ethswarm.org/bzz/22cbb9cedca08ca8d50b0319a32016174ceb8fbaa452ca5f0a77b804109baa00/)

<!-- If you are unable to download your file from a different Bee node, you may be experiencing connection issues, see [troubleshooting connectivity](/docs/troubleshooting/connectivitiy) for assistance. -->


## Deferred and Direct Uploads

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

