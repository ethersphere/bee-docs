---
title: Dynamic Content
id: dynamic-content
sidebar_label: Dynamic Content
---

:::warning
Under construction, set for major revisions.
:::


## Feeds for Dynamic Content

:::info
Although all data on Swarm is immutable, feeds provide an updatable reference that lets you simulate dynamic content. A feed is an append‑only sequence of updates that always resolves to its latest entry through a stable feed manifest.
:::

:::tip
If you are not familiar with feeds, read:
- Bee docs: /docs/develop/tools-and-features/feeds/
- Bee-JS docs: https://bee-js.ethswarm.org/docs/soc-and-feeds/
:::

Single‑page applications (SPAs) deployed on Swarm work best when their static assets can be updated independently. Instead of reuploading the entire site when one file changes, you can create a separate feed manifest for each asset. Each asset feed provides a stable URL that always resolves to the latest version of that file.

## Why Use Per‑Asset Feeds

- Each React/Vite build artifact (HTML, JS, CSS, images) becomes individually updatable.
- Every asset has a dedicated feed manifest with its own stable Swarm URL.
- Updating a single file only updates its feed; the rest of the site stays untouched.
- This keeps deployments small, fast, and cost‑efficient.

## Architecture Overview

| Asset                | Feed Topic      | Purpose                     |
|----------------------|-----------------|-----------------------------|
| Main site bundle     | `website`       | HTML/JS/CSS entry point     |
| CSS theme            | `main-css`      | Global styling              |
| JS bundle            | `main-js`       | Application logic           |
| Images               | `img-*`         | Media resources             |

Each asset has:
- a private key  
- a feed topic  
- a feed manifest  
- a stable Swarm URL (`bzz://<MANIFEST_HASH>/`)

## Generate a Publisher Key

```js
import crypto from "crypto";
import { PrivateKey } from "@ethersphere/bee-js";

const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);

console.log("Private key:", pk.toHex());
console.log("Address:", pk.publicKey().address().toHex());
```

## Create a Feed for an Asset

```js
import { Bee, PrivateKey, Topic } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "<BATCH_ID>";

const pk = new PrivateKey("<ASSET_PRIVATE_KEY>");
const topic = Topic.fromString("main-js");
const owner = pk.publicKey().address();

const writer = bee.makeFeedWriter(topic, pk);
```

## Upload an Asset and Publish a Feed Update

```js
const upload = await bee.uploadFile(batchId, "./dist/assets/index-398a.js");
await writer.upload(batchId, upload.reference);

const manifest = await bee.createFeedManifest(batchId, topic, owner);
console.log("JS Manifest:", manifest.toHex());
```

Stable URL:

```
bzz://<JS_MANIFEST_HASH>/
```

This URL never changes, even when you replace the underlying file.

## Updating an Existing Asset

```js
const nextUpload = await bee.uploadFile(batchId, "./dist/assets/index-new.js");
await writer.upload(batchId, nextUpload.reference);
```

No new manifest is created. The old URL now resolves to the updated file.

## Referencing Asset Feeds in Your SPA

Rather than referencing a static build hash, point your SPA to feed manifests.

Example `index.html`:

```html
<script type="module" src="bzz://<JS_MANIFEST_HASH>/"></script>
<link rel="stylesheet" href="bzz://<CSS_MANIFEST_HASH>/" />
```

Example React image reference:

```jsx
<img src={`bzz://${IMG_MANIFEST_HASH}/`} alt="Hero" />
```

This makes your deployment resilient to Vite’s changing file names, because Swarm fetches the latest version through the feed instead of the literal file path.

## Example Deployment Workflow

1. Build Vite:
   ```
   npm run build
   ```

2. For each file in `dist/`:
   - assign (or reuse) a feed topic
   - upload the file
   - update its feed
   - store the feed manifest hash in a hard‑coded list inside your SPA

3. Rebuild your SPA to reference:
   - `bzz://<JS_FEED_MANIFEST>/`
   - `bzz://<CSS_FEED_MANIFEST>/`
   - `bzz://<IMAGE_FEED_MANIFEST>/`

4. Upload only the *main* SPA entrypoint (often a small static HTML + JS shell) using `swarm-cli feed upload`.

This gives you a fully working dynamic SPA with lightweight incremental updates.

## Summary

- Each build artifact gets its own updatable feed.
- Your SPA uses stable feed manifest URLs instead of build‑hashed filenames.
- Only changed files need to be uploaded.
- This keeps deployments fast while ensuring long‑lived URLs remain valid.

The next section (not included here) expands this into a registry‑based system for large dynamic sites.


