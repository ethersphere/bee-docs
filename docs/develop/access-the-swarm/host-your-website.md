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

You can download the example website files from the [ethersphere/examples](https://github.com/ethersphere/examples) repository.


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
http://localhost:1633/bzz/<your-hash>/
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
https://mainnet.infura.io/v3/<your-api-key>
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
bzz://<your-Swarm-hash>
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

## Summary

* Upload your website using `swarm-cli`.
* Access it directly with the Swarm hash or through your local Bee node.
* Link it to an ENS name by adding a `bzz://<hash>` content hash in the ENS Manager.
* Use a reliable RPC such as `https://eth-mainnet.public.blastapi.io` or `https://rpc.ankr.com/eth` or your own Ethereum node RPC if you want localhost resolution to work.

This setup gives you a fully decentralized website hosted on Swarm and accessible through ENS without relying on centralized infrastructure.
