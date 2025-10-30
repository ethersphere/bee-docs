---
title: Host a Webpage
id: host-your-website
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hosting a Website on Swarm and Linking it to ENS

This guide explains how to host a static website on Bee using `swarm-cli` and make it accessible through [Ethereum Name Service (ENS)](https://ens.domains/).

Part one covers uploading and accessing your site through the raw Swarm hash.

Part two shows how to register your Swarm hash with your ENS domain so it can be easily accessed by anyone through public ENS gateways like `eth.limo`, `bzz.link`, or `localhost` on a Bee node.

## 1. Hosting and Accessing Your Website on Swarm

### Prerequisites

* A running Bee node (either a [standard installation](/docs/bee/installation/quick-start) or [Swarm Desktop](/docs/desktop/install))
* A valid postage batch
* [`swarm-cli` installed](https://docs.ethswarm.org/docs/bee/working-with-bee/swarm-cli)
* A valid postage stamp batch
* Your static website files (you can also use the example website files provided below)  

You can download the example website files from the [ethersphere/examples](https://github.com/ethersphere/examples/tree/main/basic-static-website) repository.


### Uploading the Website

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
  --stamp 3d98a22f522377ae9cc2aa3bca7f352fb0ed6b16bad73f0246b0a5c155f367bc `
  --index-document index.html `
  --error-document index.html
````

</TabItem>

<TabItem value="bash">

```bash
swarm-cli upload . \
  --stamp 3d98a22f522377ae9cc2aa3bca7f352fb0ed6b16bad73f0246b0a5c155f367bc \
  --index-document index.html \
  --error-document index.html
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

Copy this and save it. You’ll need it for both direct access and ENS integration.


### Accessing the Website

Anyone with a Bee node can now access the site using the Swarm hash you just saved:

```
http://localhost:1633/bzz/<swarm-hash>/
```


## 2. Connecting Your Website to ENS

Once the site is uploaded, you can make it accessible via an easy to remember ENS domain name:

```
https://yourname.eth.limo/
https://yourname.bzz.link/
```

or through your own node:

```
http://localhost:1633/bzz/yourname.eth/
```

:::tip
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

### Using the Official ENS Guide

The ENS team provides a clear walkthrough with screenshots showing how to add a content hash to your domain with their [easy to use app](https://app.ens.domains/):

[How to add a Decentralized website to an ENS name](https://support.ens.domains/en/articles/12275979-how-to-add-a-decentralized-website-to-an-ens-name)

The guide covers:

* Opening your ENS domain in the ENS Manager
* Navigating to the Records tab
* Adding a Content Hash
* Confirming the transaction


### Swarm-Specific Step

When you reach Step 2 in the ENS guide (“Add content hash record”), enter your Swarm reference in the following format:

```
bzz://<swarm-hash>
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


## 3. (Recommended) Host Your Website via a Feed Instead of a Raw Hash

If you plan to update your website in the future, you should publish your website hash to a **feed** rather than pointing ENS directly to the raw content hash.

Why:

* ENS only needs to be set once
* You can push new website versions later
* Your ENS name always resolves to the latest upload

In this section, you will:

1. Create a publisher identity  
2. Upload your site to a feed (this automatically creates the feed manifest)  
3. Copy the feed manifest reference  
4. Use that manifest reference as your ENS contenthash  

This ensures future website updates require no ENS changes.

### Prerequisite: Have your initial site hash

From Part One you should already have uploaded your site and seen something like:

```
Reference: 1c686dee5891aae4ea97db397165ce511efdfc40b64846ac6f00f7330a0ed65f
```

We will refer to this as `<site-hash>` in the examples below.

> In the next step we will re-upload the site using a feed so that ENS can always track updates.


### Step 1: Create a dedicated publisher identity

This key will sign feed updates.  
**Do not** use your Bee wallet key.

```bash
swarm-cli identity create website-publisher
```

Record the output — you will need this identity for future updates.

If you need to view/export it later:

```bash
swarm-cli identity export website-publisher
```


### Step 2: Upload your website to a feed (creates the manifest automatically)

<Tabs>
<TabItem value="linux" label="Linux / macOS">

```bash
swarm-cli feed upload ./website \
  --identity website-publisher \
  --topic-string website \
  --stamp <postage-batch-id> \
  --index-document index.html \
  --error-document 404.html
```

</TabItem>
<TabItem value="powershell" label="Windows PowerShell">

```powershell
swarm-cli feed upload .\website `
  --identity website-publisher `
  --topic-string website `
  --stamp <postage-batch-id> `
  --index-document index.html `
  --error-document 404.html
```
</TabItem>
</Tabs>

You will see output that includes your **feed manifest reference**, for example:

```
Reference: 2d9ab1e827e2ac3e6f940e8d949125734897b55cc1b7aae23af882ed92f3b726
```

This is your **permanent website reference**.


### Step 3: Use the feed reference as the ENS contenthash

Under construction.