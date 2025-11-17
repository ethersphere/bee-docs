---
title: "Mutable" Content
id: mutable-content
sidebar_label: "Mutable" Content
---


:::information
While *all data uploaded to Swarm is technically immutable*, mutable functionality can be simulated using feeds. A feed is essentially an ordered series of Swarm uploads (feed updates) which always resolve to the latest update. We can then use a feed manifest to create a static reference to the feed, so that the reference will always resolve to the latest feed update. In this way mutable functionality is emulated on top of Swarm's immutable [DISC](/docs/concepts/DISC/).
:::

# Granular Asset Feeds (Advanced Website Architecture)

This guide extends the core website-hosting workflow by showing how to create **per-asset feeds** so you can update individual files (header images, CSS, JS bundles, logos, site config, etc.) without re-uploading the entire website.

This technique effectively turns Swarm into a **decentralized CDN**:  
each asset gets its own permanent reference, and updates flow atomically through feeds.

## 🧠 Why Use Per-Asset Feeds?

Traditional upload-and-replace workflows require re-deploying everything, even if only one asset changes. With Swarm feeds:

- Every file can have its own independent "channel" (feed topic).
- Each feed has a **stable manifest hash** that never changes.
- When you update an asset, only that feed is updated.
- Your website fetches each asset by its feed manifest, not by static hash.

This gives you:

- Faster updates  
- Zero ENS updates  
- Atomic, no-downtime asset changes  
- Modular deployments  
- A CDN-like architecture, but decentralized

---

## 🧩 Architecture Overview

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

---

## 🔐 Generate Publisher Keys

Every feed should have its own publishing key.

```js
import crypto from "crypto";
import { PrivateKey } from "@ethersphere/bee-js";

const hexKey = '0x' + crypto.randomBytes(32).toString('hex');
const pk = new PrivateKey(hexKey);

console.log("Private key:", pk.toHex());
console.log("Address:", pk.publicKey().address().toHex());
```

---

## 🛠️ Create a Feed Per Asset

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

---

## 📤 Upload Asset + Publish Feed Update

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

---

## 🔁 Updating the Asset

```js
const newUpload = await bee.uploadFile(batchId, "./assets/header-new.jpg");
await writer.uploadReference(batchId, newUpload.reference);
```

Manifest stays the same.

---

## 🔗 Reference Asset Feeds in HTML

```html
<img src="bzz://<HEADER_MANIFEST_HASH>/" alt="Header" />
<link rel="stylesheet" href="bzz://<CSS_MANIFEST_HASH>/" />
<script src="bzz://<JS_MANIFEST_HASH>/"></script>
```

---

## ⚙️ ENS Integration

Optional: map each feed to ENS.

```
header.mysite.eth → bzz://<HEADER_MANIFEST>
```

---

# Visual Diagram

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

---

# Template Website Referencing Feeds

`index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="bzz://<CSS_MANIFEST>/" />
    <script defer src="bzz://<JS_MANIFEST>/"></script>
  </head>
  <body>
    <header>
      <img src="bzz://<HEADER_MANIFEST>/" alt="Header" />
    </header>

    <main>
      <h1>Welcome to My Swarm-Powered Site</h1>
    </main>

    <footer>
      Loaded config:
      <span id="config-output"></span>
    </footer>
  </body>
</html>
```

`app.js`:

```js
async function loadConfig() {
  const url = "bzz://<CONFIG_MANIFEST>/";
  const res = await fetch(url);
  const json = await res.json();

  document.getElementById("config-output").innerText = JSON.stringify(json);
}
loadConfig();
```

`styles.css`:

```css
body {
  font-family: sans-serif;
  padding: 2rem;
}
header img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
```

---

# Decentralized CDN Architecture for Bee-JS

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

Manifest stays constant.

---

You're ready to build modular, feed-powered sites on Swarm!

