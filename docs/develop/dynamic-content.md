---
title: Dynamic Content
id: dynamic-content
sidebar_label: Dynamic Content
description: Learn how to use feeds to create updateable content on Swarm — with a complete example project that builds a dynamic note board.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Every upload to Swarm produces a unique content hash — change one byte and you get a different address. This is great for data integrity, but it means there is no built-in way to give someone a single, stable link that always shows the latest version of your content. Feeds solve this problem. A feed acts as a mutable pointer on top of Swarm's immutable storage, giving you a permanent address that always resolves to whatever content you last pointed it at.

If you followed the [Host a Webpage](/docs/develop/host-your-website) guide, you already used feeds to enable seamless website updates without changing your ENS content hash. This guide explains how feeds actually work under the hood and walks through building a simple dynamic application from scratch.

## Prerequisites

* A running Bee node ([install guide](/docs/bee/installation/quick-start))
* A valid postage stamp batch ([how to get one](/docs/develop/tools-and-features/buy-a-stamp-batch))
* Node.js 18+ and `@ethersphere/bee-js` installed (for `bee-js` examples)
* [`swarm-cli` installed](https://docs.ethswarm.org/docs/bee/working-with-bee/swarm-cli) (for `swarm-cli` examples)


## The Immutability Problem

To see why feeds are necessary, try uploading the same content twice with a small change:

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "<BATCH_ID>";

const upload1 = await bee.uploadFile(batchId, "Hello Swarm - version 1", "note.txt");
console.log("Version 1:", upload1.reference.toHex());

const upload2 = await bee.uploadFile(batchId, "Hello Swarm - version 2", "note.txt");
console.log("Version 2:", upload2.reference.toHex());
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
echo "Hello Swarm - version 1" > note-v1.txt
swarm-cli upload note-v1.txt --stamp <BATCH_ID>
# Swarm hash: a1b2c3d4...

echo "Hello Swarm - version 2" > note-v2.txt
swarm-cli upload note-v2.txt --stamp <BATCH_ID>
# Swarm hash: e5f6a7b8... (different!)
```

</TabItem>
</Tabs>

Each upload returns a different hash. If you shared the first hash with someone, they would always see "version 1" — there is no way to redirect them to "version 2" using content addressing alone. Feeds provide the missing layer of indirection.

## Feeds — Mutable Pointers on Immutable Storage

A feed is identified by two things: an **owner** (an Ethereum address derived from a private key) and a **topic** (a human-readable string that you choose, like `"my-website"` or `"notes"`). Together, these uniquely identify a feed on the network. 

The feed owner can write Swarm references to the feed sequentially — first at index 0, then index 1, and so on. Anyone who knows the owner and topic can read the feed and retrieve the latest reference. The feed itself does not store your content directly; it stores a *pointer* (a Swarm reference) to content that you uploaded separately.

:::info
Feeds are built on top of [single-owner chunks](/docs/develop/tools-and-features/chunk-types#single-owner-chunks), a special chunk type in Swarm where the address is derived from an identity rather than the content. For a deeper look at how this works, see the [bee-js SOC and Feeds documentation](https://bee-js.ethswarm.org/docs/soc-and-feeds/).
:::

:::warning Always use immutable stamp batches with feeds
When a mutable batch fills up, new chunks overwrite the oldest chunks in each bucket. If feed entry chunks get overwritten, the sequential indexing scheme that feeds depend on breaks — lookups will fail because earlier indices are no longer reachable. Always use an immutable batch when working with feeds.
:::

### Create a Publisher Key

Before creating a feed, you need a dedicated private key that will sign feed updates. Anyone with this key can publish to your feed, so store it securely.

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
import crypto from "crypto";
import { PrivateKey } from "@ethersphere/bee-js";

const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);

console.log("Private key:", pk.toHex());
console.log("Address:", pk.publicKey().address().toHex());
```

Example output:

```
Private key: 0x634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd
Address: 0x8d3766440f0d7b949a5e32995d09619a7f86e632
```

Save the private key somewhere secure. You will use it for all future feed updates.

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
swarm-cli identity create publisher
```

Example output:

```
Name: publisher
Type: V3 Wallet
Private key: 0x634fb5a872396d9693e5c9f9d7233cfa93f395c093371017ff44aa9ae6564cdd
Public key: 0x218c79f8dfb26d077b6379eb56aa9c6e71edf74d...
Address: 0x8d3766440f0d7b949a5e32995d09619a7f86e632
```

Record this output in a secure location. If you need to view it later:

```bash
swarm-cli identity export publisher
```

</TabItem>
</Tabs>


### Write and Read a Feed

Now upload some content and write its reference to a feed, then read it back:

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "<BATCH_ID>";
const pk = new PrivateKey("<YOUR_PRIVATE_KEY>");
const owner = pk.publicKey().address();

// Choose a topic for this feed
const topic = Topic.fromString("notes");

// Upload content to Swarm
const upload = await bee.uploadFile(batchId, "My first note", "note.txt");
console.log("Content hash:", upload.reference.toHex());

// Write the content reference to the feed
const writer = bee.makeFeedWriter(topic, pk);
await writer.upload(batchId, upload.reference);
console.log("Feed updated at index 0");

// Read the latest reference from the feed
const reader = bee.makeFeedReader(topic, owner);
const result = await reader.download();
console.log("Current index:", result.feedIndex.toBigInt());
console.log("Feed is readable - you can access it via the feed manifest URL");
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
# Upload content and update feed in one step
swarm-cli feed upload note.txt \
  --identity publisher \
  --topic-string notes \
  --stamp <BATCH_ID>

# Read the feed
swarm-cli feed print \
  --identity publisher \
  --topic-string notes
```

The `feed print` command displays the current feed state, including the Swarm reference it points to and the feed manifest URL.

</TabItem>
</Tabs>


### Update the Feed

When you have new content, upload it and write the new reference to the feed. The writer automatically uses the next sequential index:

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
// Upload updated content
const upload2 = await bee.uploadFile(batchId, "My updated note", "note.txt");
console.log("New content hash:", upload2.reference.toHex());

// Update the feed — writer auto-discovers the next index
await writer.upload(batchId, upload2.reference);
console.log("Feed updated at index 1");

// Reading the feed now returns the updated state
const result2 = await reader.download();
console.log("Current index:", result2.feedIndex.toBigInt()); // 1n
console.log("Feed manifest URL still serves the latest content");
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
# Update the note
echo "My updated note" > note.txt

# Upload to the same feed — reuse the same identity and topic
swarm-cli feed upload note.txt \
  --identity publisher \
  --topic-string notes \
  --stamp <BATCH_ID>
```

The feed now points to the new content. The feed manifest URL (printed in the output) remains the same.

</TabItem>
</Tabs>


## Feed Manifests — Stable URLs

So far, reading a feed requires knowing the owner address and topic. A **feed manifest** packages these two values into a single Swarm hash that acts as a permanent URL. When Bee resolves a feed manifest through the `/bzz/` endpoint, it automatically looks up the latest feed entry and serves whatever content it points to.

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
// Create a feed manifest (one-time operation)
const manifest = await bee.createFeedManifest(batchId, topic, owner);
console.log("Feed manifest:", manifest.toHex());
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

The `feed upload` command creates the manifest automatically and prints the `Feed Manifest URL` in its output:

```bash
swarm-cli feed upload note.txt \
  --identity publisher \
  --topic-string notes \
  --stamp <BATCH_ID>
```

Example output:

```
Swarm hash: 387dc3cf98419dcb20c68b284373bf7d9e8dcb27...
URL: http://localhost:1633/bzz/387dc3cf98419dcb.../
Feed Manifest URL: http://localhost:1633/bzz/6c30ef2254ac1565.../
```

The hash in the `Feed Manifest URL` (`6c30ef2254ac1565...`) is your permanent reference.

</TabItem>
</Tabs>

You can now access the content through a stable URL:

```
http://localhost:1633/bzz/<FEED_MANIFEST_HASH>/
```

Every time you update the feed, the same URL serves the new content — no URL change needed. This is also the hash you would register in ENS as your content hash (see [Host a Webpage - Connect to ENS](/docs/develop/host-your-website#connect-site-to-ens-domain)).

:::tip
A feed manifest only needs to be created once. After that, just update the feed and the manifest URL will always resolve to the latest content.
:::


## How It All Fits Together

The resolution chain when someone accesses your feed manifest URL:

```
GET /bzz/<manifestHash>/
  → Bee downloads the manifest, extracts {topic, owner}
  → Looks up the latest feed entry for that topic/owner
  → Reads the Swarm content reference from the latest entry
  → Retrieves and serves the content at that reference
```

From the outside, a feed manifest URL behaves exactly like a regular Swarm URL — except the content behind it can change whenever the feed owner publishes an update.


## Example Project — Dynamic Note Board

This section puts everything together into a minimal but complete project: a **dynamic note board** that lives on Swarm. It is a single HTML page that displays a list of notes. The publisher can add notes and the page updates at a single stable URL.

:::info
This project follows the same architectural pattern used by [Etherjot](https://github.com/ethersphere/etherjot), a full-featured blogging platform on Swarm. Etherjot regenerates and re-uploads the entire blog site each time a post is added, then updates a single feed to point to the new version. Our note board does the same thing in a simplified form.
:::

:::info Content Deduplication
When you regenerate and re-upload the entire note board with a new note added, Bee automatically deduplicates content. It checks the content hash of each chunk and reuses references to chunks that already exist in storage. Only the new content is stored as new chunks. This makes the regenerate-and-append approach efficient, even though it regenerates everything each time.
:::

### Project Setup

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create a new directory and initialize the project:

```bash
mkdir swarm-noteboard && cd swarm-noteboard
npm init -y
npm install @ethersphere/bee-js dotenv
```

Add `"type": "module"` to your `package.json` to use ES module imports.

Create a `.env` file with your configuration:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<YOUR_BATCH_ID>
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create a new directory:

```bash
mkdir swarm-noteboard && cd swarm-noteboard
mkdir noteboard
```

Make sure you have a `swarm-cli` identity ready:

```bash
swarm-cli identity create noteboard-publisher
```

</TabItem>
</Tabs>


### Project Structure

<Tabs>
<TabItem value="bee-js" label="bee-js">

```
swarm-noteboard/
├── .env               # Bee URL and batch ID
├── config.json        # Created by init.js — stores keys and manifest hash
├── notes.json         # Created by init.js — stores the list of notes
├── init.js            # Initialize the note board (run once)
├── publish.js         # Add a note and update the board
└── read.js            # Read the feed (demonstrates reader access)
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```
swarm-noteboard/
├── noteboard/
│   └── index.html     # The note board HTML page
├── notes.json         # Tracks notes locally (optional helper)
└── generate.sh        # Helper script to regenerate HTML and upload
```

</TabItem>
</Tabs>


### Initialize the Note Board

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create `init.js` — this generates a publisher key, creates an empty note board, uploads it, sets up the feed, and saves the configuration:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import crypto from "crypto";
import { writeFileSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;

// Generate publisher key
const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);
const owner = pk.publicKey().address();
const topic = Topic.fromString("noteboard");

// Create initial empty note board
const notes = [];
writeFileSync("notes.json", JSON.stringify(notes, null, 2));

const html = generateHTML(notes);
const upload = await bee.uploadFile(batchId, html, "index.html", {
  contentType: "text/html",
});

// Set up feed and manifest
const writer = bee.makeFeedWriter(topic, pk);
await writer.upload(batchId, upload.reference);
const manifest = await bee.createFeedManifest(batchId, topic, owner);

// Save config
const cfg = {
  privateKey: pk.toHex(),
  owner: owner.toHex(),
  topic: "noteboard",
  manifest: manifest.toHex(),
};
writeFileSync("config.json", JSON.stringify(cfg, null, 2));

console.log("Note board initialized!");
console.log("Feed manifest:", manifest.toHex());
console.log("View your board:", `${process.env.BEE_URL}/bzz/${manifest.toHex()}/`);

function generateHTML(notes) {
  const noteItems = notes
    .map(
      (n) => `
    <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
      <p style="margin:0 0 4px 0;">${n.text}</p>
      <small style="color:#888;">${n.date}</small>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Note Board</title></head>
<body style="max-width:600px; margin:40px auto; font-family:sans-serif;">
  <h1>Note Board</h1>
  <p>${notes.length} note${notes.length !== 1 ? "s" : ""}</p>
  ${noteItems || "<p><em>No notes yet.</em></p>"}
</body>
</html>`;
}
```

Run it once:

```bash
node init.js
```

Example output:

```
Note board initialized!
Feed manifest: caa414d70028d14b0bdd9cbab18d1c1a0a3bab1b...
View your board: http://localhost:1633/bzz/caa414d70028d14b.../
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create the initial HTML page at `noteboard/index.html`:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Note Board</title></head>
<body style="max-width:600px; margin:40px auto; font-family:sans-serif;">
  <h1>Note Board</h1>
  <p>0 notes</p>
  <p><em>No notes yet.</em></p>
</body>
</html>
```

Upload it to a feed:

```bash
swarm-cli feed upload ./noteboard \
  --identity noteboard-publisher \
  --topic-string noteboard \
  --stamp <BATCH_ID> \
  --index-document index.html
```

Example output:

```
Swarm hash: 387dc3cf98419dcb20c68b284373bf7d9e8dcb27...
URL: http://localhost:1633/bzz/387dc3cf.../
Feed Manifest URL: http://localhost:1633/bzz/6c30ef22.../
```

Save the `Feed Manifest URL` hash — this is your board's permanent address. Open it in a browser to see the empty note board.

</TabItem>
</Tabs>


### Add a Note

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create `publish.js` — this loads the config, appends a new note, regenerates the HTML, uploads it, and updates the feed:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import { readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
config();

const noteText = process.argv[2];
if (!noteText) {
  console.error('Usage: node publish.js "Your note text"');
  process.exit(1);
}

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;

// Load config and existing notes
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));
const notes = JSON.parse(readFileSync("notes.json", "utf-8"));

// Add new note
notes.push({ text: noteText, date: new Date().toISOString() });
writeFileSync("notes.json", JSON.stringify(notes, null, 2));

// Regenerate HTML
const html = generateHTML(notes);

// Upload and update feed
const pk = new PrivateKey(cfg.privateKey);
const topic = Topic.fromString(cfg.topic);
const writer = bee.makeFeedWriter(topic, pk);

const upload = await bee.uploadFile(batchId, html, "index.html", {
  contentType: "text/html",
});
await writer.upload(batchId, upload.reference);

console.log(`Note added! (${notes.length} total)`);
console.log("View:", `${process.env.BEE_URL}/bzz/${cfg.manifest}/`);

function generateHTML(notes) {
  const noteItems = notes
    .map(
      (n) => `
    <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
      <p style="margin:0 0 4px 0;">${n.text}</p>
      <small style="color:#888;">${n.date}</small>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Note Board</title></head>
<body style="max-width:600px; margin:40px auto; font-family:sans-serif;">
  <h1>Note Board</h1>
  <p>${notes.length} note${notes.length !== 1 ? "s" : ""}</p>
  ${noteItems}
</body>
</html>`;
}
```

Run it:

```bash
node publish.js "This is my first note"
node publish.js "Here is another one"
```

Each time you run this, the same feed manifest URL serves the updated page with all notes.

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Edit `noteboard/index.html` with your new note content:

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Note Board</title></head>
<body style="max-width:600px; margin:40px auto; font-family:sans-serif;">
  <h1>Note Board</h1>
  <p>1 note</p>
  <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
    <p style="margin:0 0 4px 0;">This is my first note</p>
    <small style="color:#888;">2025-06-15</small>
  </div>
</body>
</html>
```

Then re-upload to the same feed:

```bash
swarm-cli feed upload ./noteboard \
  --identity noteboard-publisher \
  --topic-string noteboard \
  --stamp <BATCH_ID> \
  --index-document index.html
```

The feed manifest URL stays the same. The page now shows the updated content. Repeat for each new note.

:::tip
You can automate the HTML generation with a simple shell or Node.js script that reads notes from a local JSON file and writes the HTML before uploading. The key point is that the Swarm side of things is always the same: regenerate content, upload, update feed.
:::

</TabItem>
</Tabs>

### Read the Feed

This demonstrates how anyone can read the feed without the publisher's private key — only the owner address and topic (or the manifest hash) are needed:

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create `read.js`:

```js
import { Bee, Topic, EthAddress } from "@ethersphere/bee-js";
import { readFileSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));

const topic = Topic.fromString(cfg.topic);
const owner = new EthAddress(cfg.owner);
const reader = bee.makeFeedReader(topic, owner);

const result = await reader.download();
console.log("Feed index:", result.feedIndex.toBigInt());
console.log("Feed is accessible at:");
console.log(`  ${process.env.BEE_URL}/bzz/${cfg.manifest}/`);
```

Run it:

```bash
node read.js
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
swarm-cli feed print \
  --identity noteboard-publisher \
  --topic-string noteboard
```

Or simply open the feed manifest URL in a browser:

```
http://localhost:1633/bzz/<FEED_MANIFEST_HASH>/
```

</TabItem>
</Tabs>


## Summary

Feeds add a mutable pointer layer on top of Swarm's immutable storage. The core pattern is: upload content → write its reference to a feed → use a feed manifest as a stable URL. The same manifest URL always serves the latest content.

This is the same pattern that [Etherjot](https://github.com/ethersphere/etherjot) uses to power fully decentralized blogs — regenerate the site, re-upload, and update the feed. The difference is only in scale and features (markdown rendering, categories, media management), not in the underlying feed mechanics.

Key takeaways:

- Every upload to Swarm is immutable and produces a unique hash.
- A feed is a sequence of updates identified by an **owner** and a **topic**.
- Each feed update stores a Swarm reference pointing to your content.
- A **feed manifest** wraps the feed identity into a single permanent hash that resolves through `/bzz/`.
- Only the feed owner (holder of the private key) can publish updates, but anyone can read the feed.
