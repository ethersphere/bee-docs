---
title: Host a Webpage
id: host-your-website
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

There are two primary methods most developers should use for uploading a website to Swarm - `swarm-cli` and `bee-js`. Depending on the specific use case, it may make more sense to pick one or the other.

For a simple website such as a personal blog or company page, using `swarm-cli` is simplest and fastest way to get your site uploaded and accessible on Swarm.

However for developers who need finer grained control over the process or who wish to build a more complex application which require programmatically spinning up new pages, `bee-js` is required.

:::tip
The guides below assume you already have a registered ENS domain name. By using an ENS domain name, you can make your Swarm hosted website accessible through an easy to remember human-readable name rather than a Swarm hash. If you don't have an ENS domain name registered, you can get one using the official ENS application at [app.ens.domains](https://app.ens.domains/). Refer to their support section for a step-by-step guide to [register an ENS domain](https://support.ens.domains/en/articles/7882582-how-to-register-a-eth-name).
:::

:::tip FIX FOR ENS NOT WORKING ON LOCALHOST
If the site doesn’t load from localhost, it’s probably an with the resolver RPC (the RPC endpoint for the Ethereum node used to resolve your ENS domain name). 

Some endpoints, such as:

```
https://cloudflare-eth.com
```

may not resolve properly on localhost.

As of the writing of this guide, both of these free and public endpoints work reliably for localhost resolution:

```
https://mainnet.infura.io/v3/<infura-api-key>
https://eth-mainnet.public.blastapi.io
```

Alternatively, you can run your own Ethereum node and use that as the RPC.
:::

## Host a Site With **swarm-cli** 

This guide shows you how to get your website hosted on Swarm with just a few simple commands by using `swarm-cli` from your terminal. 

### Prerequisites

* A running Bee node (either a [standard installation](/docs/bee/installation/quick-start) or [Swarm Desktop](/docs/desktop/install))
* A valid postage batch
* [`swarm-cli` installed](https://docs.ethswarm.org/docs/bee/working-with-bee/swarm-cli)
* A valid postage stamp batch
* Your static website files (you can also use the example website files provided below)  
* (Optional for part one - "Upload & Access by Hash") An ENS domain which you [previously registered](https://support.ens.domains/en/articles/7882582-how-to-register-a-eth-name)

### Upload & Access by Hash


You can download the example website files from the [ethersphere/examples](https://github.com/ethersphere/examples/tree/main/basic-static-website) repository.


#### Uploading the Website

1. Go to the folder containing your website files.

The example website files look like this:

```
my-website/
├── index.html       # main landing page
├── 404.html         # custom error page
├── styles.css       # basic styling
├── script.js        # optional script
├── favicon.svg      # site icon
└── robots.txt       # default robots config
```

* `index.html` will be served by default when users visit the root URL.
* `404.html` will be served for non-existent paths.
* The other files are optional and can be customized.


2. Run:

<Tabs
defaultValue="powershell"
values={[
{label: 'PowerShell', value: 'powershell'},
{label: 'Linux / macOS', value: 'bash'},
]}>

<TabItem value="powershell">

```powershell
swarm-cli upload . `
  --stamp <BATCH_ID> `
  --index-document index.html `
  --error-document 404.html
````

</TabItem>

<TabItem value="bash">

```bash
swarm-cli upload . \
  --stamp <BATCH_ID> \
  --index-document index.html \
  --error-document 404.html
```

</TabItem>
</Tabs>


* Replace `<BATCH_ID>` with your postage batch ID.
* `--index-document` tells Bee which file to serve at the root.
* `--error-document` defines the fallback file for missing paths.

3. The upload will return a Swarm reference hash, for example:

```
cf50756e6115445fd283691673fa4ad2204849558a6f3b3f4e632440f1c3ab7c
```

Copy this and save it. You’ll need it for both direct access and [ENS integration](#connect-site-to-ens-domain).


#### Accessing the Website

Anyone with a Bee node can now access the site using the Swarm hash you just saved:

```
http://localhost:1633/bzz/<SWARM_HASH>/
```


### (Recommended) Use Feeds for Seamless Updates - swarm-cli

*If you have not already connected your site to your ENS domain, [do that now](#connect-site-to-ens-domain) before returning here.*

If you have an ENS domain and Swarm hosted website, you can make the site available through the domain by registering website's Swarm hash as a content hash through the [ENS domain management app](https://app.ens.domains/). However, if you ever edit and reupload your site to Swarm, you will need to re-register your new website hash to make it available at your ENS domain.  

Therefore, instead of directly using your website hash as the content hash for your ENS domain, upload your site as a feed update and use the feed manifest hash as the content hash. Then every time you update your site as a new feed update, the ENS domain will always resolve to the newest version of your site without the need to register a new hash each time.

:::tip
The examples below refer to core feed concepts such as "publisher identity", and "topic". To learn more about these concepts refer to the [bee-js documentation](https://bee-js.ethswarm.org/docs/soc-and-feeds/#feeds).
:::

In this section, you will:

1. Create a publisher identity  
2. Upload your site to a feed (this automatically creates the feed manifest)  
3. Copy the feed manifest reference  
4. Use that manifest reference as your ENS contenthash  


#### Step 1: Create a dedicated publisher identity

This key will sign feed updates.  

```bash
swarm-cli identity create website-publisher
```

Terminal output:

```bash
Name: website-publisher
Type: V3 Wallet
Private key: 0x22e918ef68c9bc975112ceaaee0ee0f147baa79da257873659bddbfd84a646fe
Public key: 0x218c79f8dfb26d077b6379eb56aa9c6e71edf74dde8ecd27dac5016528aea80ee121b9e5050adf3948c8b0d8cffda763d7fb1f5608250b5009c5d50e158ab4a5
Address: 0x2fb11d37a9913bd3258b9918c399f35fd842a232
```

Record the output in a secure location as a backup — you will need this identity for future updates.

If you need to view/export it later:

```bash
swarm-cli identity export website-publisher
```

#### Step 2: Upload your website to a feed (creates the manifest automatically)

<Tabs>
<TabItem value="linux" label="Linux / macOS">

```bash
swarm-cli feed upload ./website \
  --identity website-publisher \
  --topic-string website \
  --stamp <BATCH_ID> \
  --index-document index.html \
  --error-document 404.html
```

</TabItem>
<TabItem value="powershell" label="Windows PowerShell">

```powershell
swarm-cli feed upload .\website `
  --identity website-publisher `
  --topic-string website `
  --stamp <BATCH_ID> `
  --index-document index.html `
  --error-document 404.html
```
</TabItem>
</Tabs>

You will see output that includes your **feed manifest reference**, for example:

```bash
Swarm hash: 387dc3cf98419dcb20c68b284373bf7d9e8dcb27daadb67e1e6b6e0f17017f1f
URL: http://localhost:1633/bzz/387dc3cf98419dcb20c68b284373bf7d9e8dcb27daadb67e1e6b6e0f17017f1f/
Feed Manifest URL: http://localhost:1633/bzz/6c30ef2254ac15658959cb18dd123bcce7c16d06fa7d0d4550a1ee87b0a846a2/
Stamp ID: 3d98a22f
Usage: 50%
Capacity (mutable): 20.445 KB remaining out of 40.890 KB
```

You can find the manifest hash at `Feed Manifest URL` in the URL right after `/bzz/`: `6c30ef2254ac15658959cb18dd123bcce7c16d06fa7d0d4550a1ee87b0a846a2`

Save this hash, you will use it for the next step.

This is your **permanent website reference**. It is a reference to a feed manifest which points to the latest feed entry so that you can use it as a static, unchanging reference for your website even as you make multiple updates to the site. Every time you update the website through the feed, this manifest will point to the hash for the newest version of the website.


#### Step 3: Use the feed reference as the ENS contenthash

Follow the [official ENS guide](https://support.ens.domains/en/articles/12275979-how-to-add-a-decentralized-website-to-an-ens-name) for registering a content hash adding your content hash in the ENS UI (see [guide](#connect-site-to-ens-domain)). However, rather than registering your website's hash directly, register the feed manifest hash we saved from the previous step from our example above.

Example:

```
bzz://6c30ef2254ac15658959cb18dd123bcce7c16d06fa7d0d4550a1ee87b0a846a2
```

Now your ENS name will always point to a static reference which will always resolve to the latest version of your website.

#### Updating your site in the future

When you have a new version of your site, just run `feed upload` again using the same topic and identity:

<Tabs>
<TabItem value="linux" label="Linux / macOS">

```bash
swarm-cli feed upload ./website \
  --identity website-publisher \
  --topic-string website \
  --stamp <BATCH_ID> \
  --index-document index.html \
  --error-document 404.html
```

</TabItem>
<TabItem value="powershell" label="Windows PowerShell">

```powershell
swarm-cli feed upload .\website `
  --identity website-publisher `
  --topic-string website `
  --stamp <BATCH_ID> `
  --index-document index.html `
  --error-document 404.html
```

</TabItem>
</Tabs>

* The **feed manifest reference stays the same**.
* The feed now points to the newly uploaded site version.
* No ENS changes needed.


## Host a Website with **bee-js**

This guide explains how to host a website on Swarm using the `bee-js` JavaScript SDK instead of the CLI.

For developers building apps, tools, or automated deployments, `bee-js` offers programmatic control over uploading and updating content on Swarm.  

### Prerequisites

* A running Bee node (either a [standard installation](/docs/bee/installation/quick-start) or [Swarm Desktop](/docs/desktop/install))
* A valid postage stamp batch
* Node.js (18+) and `@ethersphere/bee-js` installed in your project
* Static website files (HTML, CSS, etc.) - feel free to use the [provided example site](https://github.com/ethersphere/examples/tree/main/basic-static-website)
* (Optional for part one - "Upload & Access by Hash") An ENS domain which you [previously registered](https://support.ens.domains/en/articles/7882582-how-to-register-a-eth-name)


### Upload and Access by Hash

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


### (Recommended) Use Feeds for Seamless Updates - bee-js

*If you have not already connected your site to your ENS domain, [do that now](#connect-site-to-ens-domain) before returning here.*

If you have an ENS domain and Swarm hosted website, you can make the site available through the domain by registering website's Swarm hash as a content hash through the [ENS domain management app](https://app.ens.domains/). However, if you ever edit and reupload your site to Swarm, you will need to re-register your new website hash to make it available at your ENS domain.  

Therefore, instead of directly using your website hash as the content hash for your ENS domain, upload your site as a feed update and use the feed manifest hash as the content hash. Then every time you update your site as a new feed update, the ENS domain will always resolve to the newest version of your site without the need to register a new hash each time.

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

#### Example Script

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

Follow the [official ENS guide](https://support.ens.domains/en/articles/12275979-how-to-add-a-decentralized-website-to-an-ens-name) for registering a content hash adding your content hash in the ENS UI (see [guide](#2-connecting-your-website-to-ens)). However, rather than registering your website's hash directly, register the feed manifest hash we saved from the previous step from our example above.

```
bzz://<manifestRef>
```

Future updates just re-run:

```js
await writer.upload(batchId, newUpload.reference);
```

Your ENS domain will always point to the latest upload via the feed manifest.

You’ve now got a programmatic way to deploy and update your Swarm-hosted site with ENS support using `bee-js`!

## Connect Site to ENS Domain 

Once your site is uploaded to Swarm, you can make it accessible via an easy to remember ENS domain name rather than its Swarm hash:

```
https://yourname.eth.limo/
https://yourname.bzz.link/
```

or through your own node:

```
http://localhost:1633/bzz/yourname.eth/
```

#### Using the Official ENS Guide

ENS provides a clear walkthrough with screenshots showing how to add a content hash to your domain with their [easy to use app](https://app.ens.domains/):

[How to add a Decentralized website to an ENS name](https://support.ens.domains/en/articles/12275979-how-to-add-a-decentralized-website-to-an-ens-name)

The guide covers:

* Opening your ENS domain in the ENS Manager
* Navigating to the Records tab
* Adding a Content Hash
* Confirming the transaction


#### Swarm-Specific Step

When you reach Step 2 in the ENS guide (“Add content hash record”), enter your Swarm reference in the following format:

:::tip
For the content hash, you can use a Swarm hosted website's hash directly, or as is recommended in the [`swarm-cli`](#recommended-use-feeds-for-seamless-updates---swarm-cli) and [`bee-js`](#recommended-use-feeds-for-seamless-updates---bee-js) guides above, publish your site to a feed and use the feed manifest hash instead. By using a feed manifest as the content hash, you can avoid repeated ENS registry updates. 
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

