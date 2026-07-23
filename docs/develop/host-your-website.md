---
title: Host a Webpage
id: host-your-website
description: Comprehensive guide for uploading and hosting websites on Swarm with content addressing.
---


In the [Upload and Download](/docs/develop/upload-and-download) guide you uploaded individual files and got back Swarm reference hashes. A website is just a collection of files — an HTML page, a stylesheet, maybe an image. When you upload a directory, Bee automatically builds a [manifest](/docs/develop/tools-and-features/manifests) that maps each relative path to its content. Set an `indexDocument` and the root URL resolves to your homepage.

This guide shows how to upload a static site and open it through `/bzz/<reference>/`.

:::info Example project
The example website used in this guide is in [`examples/website`](https://github.com/ethersphere/examples/tree/main/website). Clone the repo, copy `.env.example` to `.env`, fill in your values, and run `npm install && npm run upload`.
:::


## Prerequisites

* A running Bee node (either a [standard installation](./../bee/installation/quick-start.md) or [Swarm Desktop](./../desktop/install.md))
* A valid postage stamp batch
* Node.js (18+) and `@ethersphere/bee-js` installed in your project
* Static website files (HTML, CSS, etc.) — feel free to use the [provided example site](https://github.com/ethersphere/examples/tree/main/website)

## Upload and Access by Hash

Install bee-js:

```bash
npm install @ethersphere/bee-js
```

Website upload script:

```js
import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");

const batchId = "<BATCH_ID>"; // Replace with your actual postage batch ID

const result = await bee.uploadFilesFromDirectory(batchId, "./website", {
  indexDocument: "index.html",
  errorDocument: "404.html"
});

console.log("Swarm hash:", result.reference.toHex());
```

```bash
Swarm hash: 6c45eae389b3bffce21443316d0bd47c4101545092b7c72c313a33ee7d003475
```

After running the script, copy the Swarm hash output to the console and then use it to open your Swarm hosted website in the browser:

```bash
http://localhost:1633/bzz/<SWARM_HASH>/
```


## Advanced: Keep Your URL Stable Across Updates

:::note Prerequisite
This section uses feeds — the concept of a mutable pointer on top of Swarm's immutable storage. Feeds are explained from scratch in the [Dynamic Content](/docs/develop/dynamic-content) guide. You can complete this guide without this section and come back after you have worked through Dynamic Content.
:::

Every time you re-upload a site to Swarm, you get a new reference hash. If you want a single stable URL that always points to the latest version of your site — useful for ENS integration or sharing a permanent link — publish each upload as a feed entry and share the feed manifest hash instead of the content hash.

:::tip
You will need a publisher key to use for setting up your website feed.

You can use the `PrivateKey` class to generate a dedicated publisher key:

```js
const crypto = require('crypto');
const { PrivateKey } = require('@ethersphere/bee-js');

// Generate 32 random bytes and construct a private key
const hexKey = '0x' + crypto.randomBytes(32).toString('hex');
const privateKey = new PrivateKey(hexKey);

console.log('Private key:', privateKey.toHex());
console.log('Public address:', privateKey.publicKey().address().toHex());
````

Example output:

```bash
Private key: 634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd
Public address: 8d3766440f0d7b949a5e32995d09619a7f86e632
```

Store this key securely.

Anyone with access to it can publish to your feed.

*It is recommended to use a separate publishing key for each feed.*
:::

### Example Script

:::tip
The script below refers to some core feed concepts such as the feed "topic" and "writer". To learn more about these concepts and feeds in general, refer to the [bee-js documentation](https://bee-js.ethswarm.org/docs/soc-and-feeds/#feeds).
:::

The script performs these steps:

1. **Connects to your Bee node** and loads your postage batch + publisher private key.
2. **Creates a feed topic and writer** for publishing website updates.
3. **Uploads the `./website` directory** to Swarm and logs the resulting content hash.
4. **Publishes that hash to the feed** so it becomes the latest feed entry.
5. **Creates a feed manifest** and logs its reference — this is the permanent hash you use for ENS or stable URLs.


```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
const bee = new Bee("http://localhost:1633");
const batchId =  "<BATCH_ID>" // Replace with your batch id
const privateKey = new PrivateKey("<PUBLISHER_KEY>"); // Replace with your publisher private key
const owner = privateKey.publicKey().address();

// Upload and Create Feed Manifest

const topic = Topic.fromString("website");
const writer = bee.makeFeedWriter(topic, privateKey);

const upload = await bee.uploadFilesFromDirectory(batchId, "./website", {
  indexDocument: "index.html",
  errorDocument: "404.html"
});

console.log("Website Swarm Hash:", upload.reference.toHex())

await writer.uploadReference(batchId, upload.reference);

const manifestRef = await bee.createFeedManifest(batchId, topic, owner);
console.log("Feed Manifest:", manifestRef.toHex());
```

Upon the successful execution of the script, the hash of the uploaded website will be logged along feed manifest hash. Copy the "Feed Manifest" hash to be used in the next step: 

```bash
Website Swarm Hash: 6c45eae389b3bffce21443316d0bd47c4101545092b7c72c313a33ee7d003475
Feed Manifest: caa414d70028d14b0bdd9cbab18d1c1a0a3bab1b20a56cf06937a6b20c7e7377
```

Follow the [official ENS guide](https://support.ens.domains/en/articles/12275979-how-do-i-add-a-decentralised-website-to-my-ens-name) for registering a content hash adding your content hash in the ENS UI (see [guide](#optional-connect-site-to-ens-domain)). However, rather than registering your website's hash directly, register the feed manifest hash we saved from the previous step from our example above.

```
bzz://<manifestRef>
```

Future updates just re-run:

```js
await writer.upload(batchId, newUpload.reference);
```

Your ENS domain will always point to the latest upload via the feed manifest.

You’ve now got a programmatic way to deploy and update your Swarm-hosted site with ENS support using `bee-js`!

## Optional: Connect Site to ENS Domain

Once your site is uploaded to Swarm, you can make it accessible via an easy to remember ENS domain name rather than its Swarm hash:

```
https://yourname.eth.limo/
https://yourname.bzz.link/
```

or through your own node:

```
http://localhost:1633/bzz/yourname.eth/
```

### Using the Official ENS Guide

ENS provides a clear walkthrough with screenshots showing how to add a content hash to your domain with their [easy to use app](https://app.ens.domains/):

[How to add a Decentralized website to an ENS name](https://support.ens.domains/en/articles/12275979-how-do-i-add-a-decentralised-website-to-my-ens-name)

The guide covers:

* Opening your ENS domain in the ENS Manager
* Navigating to the Records tab
* Adding a Content Hash
* Confirming the transaction


### Swarm-Specific Step

When you reach Step 2 in the ENS guide (“Add content hash record”), enter your Swarm reference in the following format:

:::tip
For the content hash, you can use a Swarm-hosted website's hash directly, or — as recommended in the [Advanced: Keep Your URL Stable Across Updates](#advanced-keep-your-url-stable-across-updates) section above — publish your site to a feed and use the feed manifest hash instead. By using a feed manifest as the content hash, you can avoid repeated ENS registry updates.
:::

:::tip If ENS does not resolve on localhost
If the site doesn't load from `http://localhost:1633/bzz/yourname.eth/`, the issue is usually the ENS resolver RPC. Free public endpoints like `https://cloudflare-eth.com` [may not resolve reliably](https://developers.cloudflare.com/web3/reference/migration-guide/?utm_source=chatgpt.com). Reliable alternatives include `https://mainnet.infura.io/v3/<infura-api-key>` and `https://eth-mainnet.public.blastapi.io`, or run your own Ethereum node.
:::

```
bzz://<SWARM_HASH>
```

Example:

```
bzz://cf50756e6115445fd283691673fa4ad2204849558a6f3b3f4e632440f1c3ab7c
```

This works across:

* eth.limo and bzz.link
* localhost (with a compatible RPC)
* any ENS-compatible Swarm resolver

You do not need to encode the hash or use any additional tools. `bzz://<hash>` is sufficient.

---

**Next:** [Manage Files](/docs/develop/files) — learn how manifests provide filesystem-like path mapping and how to add, move, or remove files without re-uploading everything.
