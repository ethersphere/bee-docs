---
title: Dynamic Content
id: dynamic-content
sidebar_label: Dynamic Content
description: Learn how to use feeds to create updateable content on Swarm — with a complete example project that builds a simple blog.
---


Every upload to Swarm produces a unique content hash — change one byte and you get a different address. This is great for data integrity, but it means there is no built-in way to give someone a single, stable link that always shows the latest version of your content. Feeds solve this problem. A feed acts as a mutable pointer on top of Swarm's immutable storage, giving you a permanent address that always resolves to whatever content you last pointed it at.

If you followed the [Host a Webpage](/docs/develop/host-your-website) guide, you already used feeds to enable seamless website updates without changing your ENS content hash. This guide explains how feeds actually work under the hood and walks through building a simple dynamic application from scratch.

## Prerequisites

* A running Bee node ([install guide](/docs/bee/installation/quick-start))
* A valid postage stamp batch ([how to get one](/docs/develop/tools-and-features/buy-a-stamp-batch))
* Node.js 18+ and `@ethersphere/bee-js` installed


## Example Scripts and Projects

The `bee-js` code snippets throughout this guide are available as runnable scripts in the [examples](https://github.com/ethersphere/examples) repo. The guide also includes a complete blog project that puts all the concepts together.

The full working scripts are available in the [examples](https://github.com/ethersphere/examples) repo:

* [`script-01.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-01.js) — The Immutability Problem
* [`script-02.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-02.js) — Write, Read, and Update a Feed
* [`script-03.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-03.js) — Feed Manifests — Stable URLs

The complete blog project is in the [`simple-blog`](https://github.com/ethersphere/examples/tree/main/simple-blog) directory.

Clone the repo and set up the example scripts:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/dynamic-content
npm install
cp .env.example .env
```

Fill in your `BATCH_ID` and verify `BEE_URL` in `.env`:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<YOUR_BATCH_ID>
```

You can then run any script with:

```bash
node script-01.js
node script-02.js
node script-03.js
```

The blog project has its own setup — see [Example Project — Simple Blog](#example-project--simple-blog) below.


## The Immutability Problem

To see why feeds are necessary, try uploading the same content twice with a small change ([`script-01.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-01.js)):

```js
import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "BATCH_ID";

const upload1 = await bee.uploadFile(batchId, "Hello Swarm - version 1", "note.txt");
console.log("Version 1:", upload1.reference.toHex());

const upload2 = await bee.uploadFile(batchId, "Hello Swarm - version 2", "note.txt");
console.log("Version 2:", upload2.reference.toHex());
```


Each upload returns a different hash. If you shared the first hash with someone, they would always see "version 1" — there is no way to redirect them to "version 2" using content addressing alone. Feeds provide the missing layer of indirection.

## Feeds — Mutable Pointers on Immutable Storage

A feed is identified by two things: an **owner** (an Ethereum address derived from a private key) and a **topic** (a human-readable string that you choose, like `"my-website"` or `"notes"`). Together, these uniquely identify a feed on the network. 

The feed owner can write Swarm references to the feed sequentially — first at index 0, then index 1, and so on. Anyone who knows the owner and topic can read the feed and retrieve the latest reference. The feed itself does not store your content directly; it stores a *pointer* (a Swarm reference) to content that you uploaded separately.

:::info
Feeds are built on top of [single-owner chunks](/docs/develop/tools-and-features/chunk-types#single-owner-chunks), a special chunk type in Swarm where the address is derived from an identity rather than the content. For a deeper look at how this works, see the [bee-js SOC and Feeds documentation](https://bee-js.ethswarm.org/docs/soc-and-feeds/).
:::

:::warning Always use immutable stamp batches with feeds
When a [mutable batch](/docs/concepts/incentives/postage-stamps#mutable-batches) fills up, new chunks overwrite the oldest chunks in each bucket. If feed entry chunks get overwritten, the sequential indexing scheme that feeds depend on breaks — lookups will fail because earlier indices are no longer reachable. Always use an **immutable** batch when working with feeds.
:::

### Create a Publisher Key

Before creating a feed, you need a dedicated private key that will sign feed updates. Anyone with this key can publish to your feed, so store it securely.

```js
import crypto from "crypto";
import { PrivateKey } from "@ethersphere/bee-js";

const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);

console.log("Private key:", pk.toHex());
console.log("Address:", pk.publicKey().address().toHex());
```

Save the private key somewhere secure. You will use it for all future feed updates.



### Write and Read a Feed

Now upload some content and write its reference to a feed, then read it back ([`script-02.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-02.js)):

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "BATCH_ID";
const pk = new PrivateKey("YOUR_PRIVATE_KEY");
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

// Brief pause to allow the node to index the feed chunk
await new Promise((r) => setTimeout(r, 1000));

// Read the latest reference from the feed
const reader = bee.makeFeedReader(topic, owner);
const result = await reader.downloadReference();
console.log("Latest reference:", result.reference.toHex());
console.log("Current index:", result.feedIndex.toBigInt());
```



### Update the Feed

When you have new content, upload it and write the new reference to the feed. The writer automatically uses the next sequential index (this continues from the previous snippet — both are combined in [`script-02.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-02.js)):

```js
// Upload updated content
const upload2 = await bee.uploadFile(batchId, "My updated note", "note.txt");
console.log("New content hash:", upload2.reference.toHex());

// Update the feed — writer auto-discovers the next index
await writer.upload(batchId, upload2.reference);
console.log("Feed updated at index 1");

// Brief pause to allow the node to index the new entry
await new Promise((r) => setTimeout(r, 1000));

const result2 = await reader.downloadReference();
console.log("Latest reference:", result2.reference.toHex());
console.log("Current index:", result2.feedIndex.toBigInt()); // 1n
```



## Feed Manifests — Stable URLs

So far, reading a feed requires knowing the owner address and topic. A **feed manifest** packages these two values into a single Swarm hash that acts as a permanent URL. When Bee resolves a feed manifest through the `/bzz/` endpoint, it automatically looks up the latest feed entry and serves whatever content it points to ([`script-03.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-03.js)).

```js
// Create a feed manifest (one-time operation)
const manifest = await bee.createFeedManifest(batchId, topic, owner);
console.log("Feed manifest:", manifest.toHex());
```


You can now access the content through a stable URL:

```text
http://localhost:1633/bzz/FEED_MANIFEST_HASH/
```

Every time you update the feed, the same URL serves the new content — no URL change needed. This is also the hash you would register in ENS as your content hash (see [Host a Webpage - Connect to ENS](/docs/develop/host-your-website#connect-site-to-ens-domain)).

:::tip
A feed manifest only needs to be created once. After that, just update the feed and the manifest URL will always resolve to the latest content.
:::


## How It All Fits Together

The resolution chain when someone accesses your feed manifest URL:

```text
GET /bzz/MANIFEST_HASH/
  → Bee downloads the manifest, extracts the topic and owner
  → Looks up the latest feed entry for that topic/owner pair
  → Reads the Swarm content reference from the latest entry
  → Retrieves and serves the content at that reference
```

From the outside, a feed manifest URL behaves exactly like a regular Swarm URL — except the content behind it can change whenever the feed owner publishes an update.


## Example Project — Simple Blog

This section puts everything together into a minimal but complete project: a **simple blog** that lives on Swarm. It generates a static HTML site with an index page listing all posts and individual post pages. The publisher can create, edit, and delete posts — and readers always find the latest version at a single stable URL.

:::info
This project follows the same architectural pattern used by [Etherjot](https://github.com/ethersphere/etherjot), a full-featured blogging platform on Swarm. Etherjot regenerates and re-uploads the entire blog site each time a post is added, then updates a single feed to point to the new version. Our blog does the same thing in a simplified form.
:::

### Project Setup

Clone the [examples](https://github.com/ethersphere/examples) repo (if you haven't already) and navigate to the blog project:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/simple-blog
npm install
```

Copy `.env.example` to `.env` and fill in your `BATCH_ID`:

```bash
cp .env.example .env
```

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<YOUR_BATCH_ID>
```



### Project Structure

```
simple-blog/
├── .env               # Bee URL and batch ID
├── html.js            # Shared HTML generation utility
├── init.js            # Initialize the blog (run once)
├── post.js            # Create, edit, or delete a post and update the feed
├── read.js            # Read the feed (demonstrates reader access)
├── config.json        # Generated by init.js — stores keys and manifest hash
└── posts.json         # Generated by init.js — stores all blog posts
```

### The HTML Generation Module

The blog regenerates its site from `posts.json` every time a post is created, edited, or deleted. To keep that logic in one place, `init.js` and `post.js` both import a single helper from `html.js`:

```js
// html.js
import { writeFileSync, mkdirSync, rmSync } from "fs";

export function writeSiteFiles(posts) {
  rmSync("site", { recursive: true, force: true });
  mkdirSync("site/posts", { recursive: true });

  writeFileSync("site/index.html", generateIndex(posts));
  for (const post of posts) {
    writeFileSync(`site/posts/${post.slug}.html`, generatePost(post));
  }
}

function generateIndex(posts) {
  const items = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (p) => `
    <article style="margin:16px 0; padding:16px; border:1px solid #ddd; border-radius:4px;">
      <h2 style="margin:0 0 4px 0;"><a href="posts/${p.slug}.html">${esc(p.title)}</a></h2>
      <small style="color:#888;">${p.date}</small>
    </article>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>My Blog</title></head>
<body style="max-width:640px; margin:40px auto; font-family:sans-serif;">
  <h1>My Blog</h1>
  <p>${posts.length} post${posts.length !== 1 ? "s" : ""}</p>
  ${items || "<p><em>No posts yet.</em></p>"}
</body></html>`;
}

function generatePost(post) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${esc(post.title)}</title></head>
<body style="max-width:640px; margin:40px auto; font-family:sans-serif;">
  <p><a href="../">&larr; Back</a></p>
  <h1>${esc(post.title)}</h1>
  <small style="color:#888;">${post.date}</small>
  <div style="margin-top:16px; line-height:1.6;">${esc(post.body)}</div>
</body></html>`;
}

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

`writeSiteFiles(posts)` wipes the local `site/` directory and rebuilds it from the array of posts. The Swarm-side logic — uploading the regenerated directory and pointing the feed at the new reference — lives in `init.js` and `post.js`.

### Initialize the Blog

Create `init.js` — this generates a publisher key, creates an empty blog, uploads it, sets up the feed, and saves the configuration:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import crypto from "crypto";
import { writeFileSync } from "fs";
import { config } from "dotenv";
import { writeSiteFiles } from "./html.js";

config();

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;

// 1. Generate publisher key
const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);
const owner = pk.publicKey().address();
const topic = Topic.fromString("blog");

// 2. Create initial empty blog
const posts = [];
writeFileSync("posts.json", JSON.stringify(posts, null, 2));
writeSiteFiles(posts);

const upload = await bee.uploadFilesFromDirectory(batchId, "./site", {
  indexDocument: "index.html",
});

// 3. Set up feed and manifest
const writer = bee.makeFeedWriter(topic, pk);
await writer.upload(batchId, upload.reference);
const manifest = await bee.createFeedManifest(batchId, topic, owner);

// 4. Save config
const cfg = {
  privateKey: pk.toHex(),
  owner: owner.toHex(),
  topic: "blog",
  manifest: manifest.toHex(),
};
writeFileSync("config.json", JSON.stringify(cfg, null, 2));

console.log("Blog initialized!");
console.log(`View your blog: ${process.env.BEE_URL}/bzz/${manifest.toHex()}/`);
```

Run it once:

```bash
node init.js
```

Example output:

```
Blog initialized!
Feed manifest: caa414d70028d14b0bdd9cbab18d1c1a0a3bab1b...
View your blog: http://localhost:1633/bzz/caa414d70028d14b.../
```



### Create, Edit, and Delete Posts

Create `post.js` — a single script that handles creating, editing, and deleting posts. Each operation modifies the local `posts.json`, regenerates the entire site, uploads it, and updates the feed:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import { readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
import { writeSiteFiles } from "./html.js";

config();

const [action, ...args] = process.argv.slice(2);

if (!action || !["create", "edit", "delete"].includes(action)) {
  console.log(`Usage:
  node post.js create <slug> "<title>" "<body>"
  node post.js edit   <slug> "<title>" "<body>"
  node post.js delete <slug>`);
  process.exit(1);
}

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));
const posts = JSON.parse(readFileSync("posts.json", "utf-8"));

// --- Apply the action ---

if (action === "create") {
  const [slug, title, body] = args;
  if (!slug || !title || !body) {
    console.error('Usage: node post.js create <slug> "<title>" "<body>"');
    process.exit(1);
  }
  if (posts.find((p) => p.slug === slug)) {
    console.error(`Post "${slug}" already exists. Use "edit" to update it.`);
    process.exit(1);
  }
  posts.push({ slug, title, body, date: new Date().toISOString() });
  console.log(`Created post: ${slug}`);
}

if (action === "edit") {
  const [slug, title, body] = args;
  if (!slug || !title || !body) {
    console.error('Usage: node post.js edit <slug> "<title>" "<body>"');
    process.exit(1);
  }
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    console.error(`Post "${slug}" not found.`);
    process.exit(1);
  }
  posts[idx] = { ...posts[idx], title, body, date: new Date().toISOString() };
  console.log(`Edited post: ${slug}`);
}

if (action === "delete") {
  const [slug] = args;
  if (!slug) {
    console.error("Usage: node post.js delete <slug>");
    process.exit(1);
  }
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    console.error(`Post "${slug}" not found.`);
    process.exit(1);
  }
  posts.splice(idx, 1);
  console.log(`Deleted post: ${slug}`);
}

// --- Save, regenerate, upload, update feed ---

writeFileSync("posts.json", JSON.stringify(posts, null, 2));
writeSiteFiles(posts);

const pk = new PrivateKey(cfg.privateKey);
const topic = Topic.fromString(cfg.topic);
const writer = bee.makeFeedWriter(topic, pk);

const upload = await bee.uploadFilesFromDirectory(batchId, "./site", {
  indexDocument: "index.html",
});
await writer.upload(batchId, upload.reference);

console.log(`Blog updated! (${posts.length} post${posts.length !== 1 ? "s" : ""})`);
console.log(`View: ${process.env.BEE_URL}/bzz/${cfg.manifest}/`);
```

Usage:

```bash
# Create a post
node post.js create hello-world "Hello World" "This is my first blog post on Swarm."

# Create another post
node post.js create feeds-intro "Understanding Feeds" "Feeds provide mutable pointers on immutable storage."

# Edit a post
node post.js edit hello-world "Hello Swarm!" "Updated: this is my first post, now improved."

# Delete a post
node post.js delete feeds-intro
```

Each command regenerates the entire site and updates the feed. The same feed manifest URL always serves the latest version of the blog.

:::tip
Notice that editing and deleting work the same way as creating — modify the local data, regenerate the site, re-upload, update the feed. Swarm itself doesn't have "edit" or "delete" operations. The old versions of the site remain accessible via their direct Swarm hashes, but the feed manifest always resolves to the latest version.
:::


### Read the Feed

This demonstrates how anyone can read the feed without the publisher's private key — only the owner address and topic (or the manifest hash) are needed:

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

const result = await reader.downloadReference();
console.log("Latest content reference:", result.reference.toHex());
console.log("Feed index:", result.feedIndex.toBigInt());
console.log("View:", `${process.env.BEE_URL}/bzz/${cfg.manifest}/`);
```

Run it:

```bash
node read.js
```



## Summary

Feeds add a mutable pointer layer on top of Swarm's immutable storage. The core pattern is: upload content → write its reference to a feed → use a feed manifest as a stable URL. The same manifest URL always serves the latest content.

This is the same pattern that [Etherjot](https://github.com/ethersphere/etherjot) uses to power fully decentralized blogs — regenerate the site, re-upload, and update the feed. The difference is only in scale and features (markdown rendering, categories, media management), not in the underlying feed mechanics.

The `simple-blog` project you just built is a single-author blog. The next guide extends this into a multi-author system where each author controls their own feed and an admin maintains an index feed that links them all together.

Key takeaways:

- Every upload to Swarm is immutable and produces a unique hash.
- A feed is a sequence of updates identified by an **owner** and a **topic**.
- Each feed update stores a Swarm reference pointing to your content.
- A **feed manifest** wraps the feed identity into a single permanent hash that resolves through `/bzz/`.
- Only the feed owner (holder of the private key) can publish updates, but anyone can read the feed.
- "Editing" and "deleting" content on Swarm means regenerating your site without the removed or changed content, re-uploading, and updating the feed. Old versions remain on Swarm at their original hashes, but the feed always points to the latest.

---

**Next:** [Multi-Author Blog](/docs/develop/multi-author-blog) — extend feeds into a multi-publisher system where each author controls their own feed and a shared index links them together.