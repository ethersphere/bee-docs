---
title: Dynamic Content
id: dynamic-content
sidebar_label: Dynamic Content
---


## Using Feeds for Dynamic Content

:::info
Although all data on Swarm is immutable, feeds provide an updatable reference that enables dynamic content, simulating a mutable resource which always resolves to its latest update through a static feed manifest reference.
:::

:::tip
This guide relies heavily on the use of Swarm feeds. If you are not already familiar with feeds, it's recommended to familiarize yourself with them. See the [bee-docs feeds section](/docs/develop/tools-and-features/feeds/) for a high level overview and then check the [bee-js-docs feeds section](https://bee-js.ethswarm.org/docs/soc-and-feeds/#feeds) for a more detailed explanation and example implementation.
:::


This guide shows how to create **per-asset feeds** so you can update individual files (header images, CSS, JS bundles, logos, site config, etc.) without re-uploading the entire website. 

This technique effectively turns Swarm into a **decentralized CDN**:  
each asset gets its own permanent reference, and updates flow atomically through feeds.

### Why Use Per-Asset Feeds?

Traditional upload-and-replace workflows require re-deploying everything, even if only one asset changes. With Swarm feeds:

- Every file can have its own independent "channel" (feed topic).
- Each feed has a **stable manifest hash** that never changes.
- When you update an asset, only that feed is updated.  

This gives you:

- Faster and smaller updates  
- Zero ENS updates  
- No-downtime asset changes  
- A decentralized CDN-like architecture

### Architecture Overview

For a typical site:

| Asset           | Feed Topic        | Purpose |
|----------------|-------------------|---------|
| Main website   | `website`         | Full site HTML/JS/CSS bundle |
| Header image   | `header-image`    | Frequently changed graphic |
| CSS theme      | `main-css`        | Style updates |
| JS bundle      | `main-js`         | Client logic |
| Config JSON    | `site-config`     | Dynamic data |

Each of these gets:

- its own private key  
- its own topic  
- its own feed manifest  
- its own permanent URL  


### Generate Publisher Keys

Every feed should have its own publishing key.

```js
import crypto from "crypto";
import { PrivateKey } from "@ethersphere/bee-js";

const hexKey = '0x' + crypto.randomBytes(32).toString('hex');
const pk = new PrivateKey(hexKey);

console.log("Private key:", pk.toHex());
console.log("Address:", pk.publicKey().address().toHex());
```

### Create a Feed Per Asset

Example: header image.

```js
import { Bee, PrivateKey, Topic } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "<BATCH_ID>";

const pk = new PrivateKey("<HEADER_PRIVATE_KEY>");
const topic = Topic.fromString("header-image");
const owner = pk.publicKey().address();

const writer = bee.makeFeedWriter(topic, pk);
```

### Upload Asset + Publish Feed Update

```js
const upload = await bee.uploadFile(batchId, "./assets/header.jpg");
await writer.uploadReference(batchId, upload.reference);

const manifest = await bee.createFeedManifest(batchId, topic, owner);
console.log("Header Manifest:", manifest.toHex());
```

Stable URL:

```
bzz://<HEADER_MANIFEST_HASH>/
```


### Updating the Asset

```js
const newUpload = await bee.uploadFile(batchId, "./assets/header-new.jpg");
await writer.uploadReference(batchId, newUpload.reference);
```

Manifest stays the same.


### Reference Asset Feeds in HTML

```html
<img src="bzz://<HEADER_MANIFEST_HASH>/" alt="Header" />
<link rel="stylesheet" href="bzz://<CSS_MANIFEST_HASH>/" />
<script src="bzz://<JS_MANIFEST_HASH>/"></script>
```


## ENS Integration

Optional: map each feed to ENS.

```
header.mysite.eth → bzz://<HEADER_MANIFEST>
```

### Visual Diagram

```
                ┌─────────────────────────┐
                │        Website          │
                │ (HTML references feeds) │
                └──────────────┬──────────┘
                               │
               Uses feed manifests instead of static hashes
                               │
        ┌──────────────────────┼─────────────────────────────┐
        │                      │                             │
┌──────────────┐     ┌────────────────┐            ┌────────────────┐
│ Main Site    │     │ Header Image   │            │ CSS Stylesheet │
│ Feed         │     │ Feed           │            │ Feed           │
└──────┬───────┘     └──────┬─────────┘            └──────┬─────────┘
       │                    │                              │
Updates only when    Updates only when               Updates only when
full site changes     header changes                 CSS changes
       │                    │                              │
       ▼                    ▼                              ▼                
┌──────────────┐   ┌────────────────┐            ┌────────────────┐
│ Feed Entry    │  │ Feed Entry     │            │ Feed Entry     │
│ Latest Hash   │  │ Latest Hash    │            │ Latest Hash    │
└──────┬────────┘  └──────┬─────────┘            └──────┬─────────┘
       │                    │                              │
       ▼                    ▼                              ▼
┌──────────────┐   ┌────────────────┐            ┌────────────────┐
│ Feed Manifest│   │ Feed Manifest  │            │ Feed Manifest  │
│ (Stable URL) │   │ (Stable URL)   │            │ (Stable URL)   │
└──────┬────────┘  └──────┬─────────┘            └──────┬─────────┘
       │                    │                              │
       ▼                    ▼                              ▼
 ENS Contenthash       ENS Subdomain                 ENS Subdomain
 e.g. mysite.eth       header.mysite.eth             css.mysite.eth
```


## Decentralized CDN Architecture for Bee-JS

Swarm enables a CDN-like architecture where each asset is versioned and independently updatable via feeds.

### Advantages

- Atomic updates  
- Zero downtime  
- Scalable  
- ENS-friendly  
- Secure per-asset keys  

### Pattern

```js
const upload = await bee.uploadFile(batchId, "./file");
await writer.uploadReference(batchId, upload.reference);
```

Updates later:

```js
await writer.uploadReference(batchId, newUpload.reference);
```

While the manifest stays constant.

