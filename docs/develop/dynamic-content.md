---
title: Dynamic Content
id: dynamic-content
sidebar_label: Dynamic Content
description: Learn how to use feeds to create updateable content on Swarm — with a complete example project that builds a simple blog.
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
```

Update the `BATCH_ID` in the `.env` file with a valid batch ID, and make sure `BEE_URL` points to your Bee node:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=BATCH_ID
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

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "BATCH_ID";

const upload1 = await bee.uploadFile(batchId, "Hello Swarm - version 1", "note.txt");
console.log("Version 1:", upload1.reference.toHex());

const upload2 = await bee.uploadFile(batchId, "Hello Swarm - version 2", "note.txt");
console.log("Version 2:", upload2.reference.toHex());
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
echo "Hello Swarm - version 1" > note-v1.txt
swarm-cli upload note-v1.txt --stamp BATCH_ID
# Swarm hash: a1b2c3d4...

echo "Hello Swarm - version 2" > note-v2.txt
swarm-cli upload note-v2.txt --stamp BATCH_ID
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
When a [mutable batch](/docs/concepts/incentives/postage-stamps#mutable-batches) fills up, new chunks overwrite the oldest chunks in each bucket. If feed entry chunks get overwritten, the sequential indexing scheme that feeds depend on breaks — lookups will fail because earlier indices are no longer reachable. Always use an **immutable** batch when working with feeds.
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

Now upload some content and write its reference to a feed, then read it back ([`script-02.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-02.js)):

<Tabs>
<TabItem value="bee-js" label="bee-js">

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

// Read the latest reference from the feed
const reader = bee.makeFeedReader(topic, owner);
const result = await reader.downloadReference();
console.log("Latest reference:", result.reference.toHex());
console.log("Current index:", result.feedIndex.toBigInt());
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
# Upload content and update feed in one step
swarm-cli feed upload note.txt \
  --identity publisher \
  --topic-string notes \
  --stamp BATCH_ID

# Read the feed
swarm-cli feed print \
  --identity publisher \
  --topic-string notes
```

The `feed print` command displays the current feed state, including the Swarm reference it points to and the feed manifest URL.

</TabItem>
</Tabs>


### Update the Feed

When you have new content, upload it and write the new reference to the feed. The writer automatically uses the next sequential index (this continues from the previous snippet — both are combined in [`script-02.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-02.js)):

<Tabs>
<TabItem value="bee-js" label="bee-js">

```js
// Upload updated content
const upload2 = await bee.uploadFile(batchId, "My updated note", "note.txt");
console.log("New content hash:", upload2.reference.toHex());

// Update the feed — writer auto-discovers the next index
await writer.upload(batchId, upload2.reference);
console.log("Feed updated at index 1");

// Reading the feed now returns the updated reference
const result2 = await reader.downloadReference();
console.log("Latest reference:", result2.reference.toHex());
console.log("Current index:", result2.feedIndex.toBigInt()); // 1n
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
  --stamp BATCH_ID
```

The feed now points to the new content. The feed manifest URL (printed in the output) remains the same.

</TabItem>
</Tabs>


## Feed Manifests — Stable URLs

So far, reading a feed requires knowing the owner address and topic. A **feed manifest** packages these two values into a single Swarm hash that acts as a permanent URL. When Bee resolves a feed manifest through the `/bzz/` endpoint, it automatically looks up the latest feed entry and serves whatever content it points to ([`script-03.js`](https://github.com/ethersphere/examples/blob/main/dynamic-content/script-03.js)).

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
  --stamp BATCH_ID
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

<Tabs>
<TabItem value="bee-js" label="bee-js">

Clone the [examples](https://github.com/ethersphere/examples) repo (if you haven't already) and navigate to the blog project:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/simple-blog
npm install
```

Update the `BATCH_ID` in the `.env` file with a valid batch ID, and make sure `BEE_URL` points to your Bee node:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=YOUR_BATCH_ID
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create a new directory:

```bash
mkdir swarm-blog && cd swarm-blog
mkdir site
```

Make sure you have a `swarm-cli` identity ready:

```bash
swarm-cli identity create blog-publisher
```

</TabItem>
</Tabs>


### Project Structure

<Tabs>
<TabItem value="bee-js" label="bee-js">

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

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```
swarm-blog/
├── site/
│   ├── index.html       # Blog index page (listing of all posts)
│   └── posts/
│       └── <slug>.html  # Individual post pages
└── posts.json           # Tracks posts locally
```

</TabItem>
</Tabs>


### Initialize the Blog

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create `init.js` — this generates a publisher key, creates an empty blog, uploads it, sets up the feed, and saves the configuration:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import crypto from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;

// Generate publisher key
const hex = "0x" + crypto.randomBytes(32).toString("hex");
const pk = new PrivateKey(hex);
const owner = pk.publicKey().address();
const topic = Topic.fromString("blog");

// Create initial empty blog
const posts = [];
writeFileSync("posts.json", JSON.stringify(posts, null, 2));

// Generate site files and upload
mkdirSync("site/posts", { recursive: true });
writeSiteFiles(posts);

const upload = await bee.uploadFilesFromDirectory(batchId, "./site", {
  indexDocument: "index.html",
});

// Set up feed and manifest
const writer = bee.makeFeedWriter(topic, pk);
await writer.upload(batchId, upload.reference);
const manifest = await bee.createFeedManifest(batchId, topic, owner);

// Save config
const cfg = {
  privateKey: pk.toHex(),
  owner: owner.toHex(),
  topic: "blog",
  manifest: manifest.toHex(),
};
writeFileSync("config.json", JSON.stringify(cfg, null, 2));

console.log("Blog initialized!");
console.log("Feed manifest:", manifest.toHex());
console.log("View your blog:", `${process.env.BEE_URL}/bzz/${manifest.toHex()}/`);

// --- HTML generation ---

function writeSiteFiles(posts) {
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
  <p><a href="../">← Back</a></p>
  <h1>${esc(post.title)}</h1>
  <small style="color:#888;">${post.date}</small>
  <div style="margin-top:16px; line-height:1.6;">${esc(post.body)}</div>
</body></html>`;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
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

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create the initial site structure:

```bash
mkdir -p site/posts
```

Create `site/index.html`:

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>My Blog</title></head>
<body style="max-width:640px; margin:40px auto; font-family:sans-serif;">
  <h1>My Blog</h1>
  <p>0 posts</p>
  <p><em>No posts yet.</em></p>
</body></html>
```

Upload it to a feed:

```bash
swarm-cli feed upload ./site \
  --identity blog-publisher \
  --topic-string blog \
  --stamp BATCH_ID \
  --index-document index.html
```

Example output:

```
Swarm hash: 387dc3cf98419dcb20c68b284373bf7d9e8dcb27...
URL: http://localhost:1633/bzz/387dc3cf.../
Feed Manifest URL: http://localhost:1633/bzz/6c30ef22.../
```

Save the `Feed Manifest URL` hash — this is your blog's permanent address.

</TabItem>
</Tabs>


### Create, Edit, and Delete Posts

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create `post.js` — a single script that handles creating, editing, and deleting posts. Each operation modifies the local `posts.json`, regenerates the entire site, uploads it, and updates the feed:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { config } from "dotenv";
config();

const [action, ...args] = process.argv.slice(2);

if (!action || !["create", "edit", "delete"].includes(action)) {
  console.log(`Usage:
  node post.js create <slug> <title> <body>
  node post.js edit   <slug> <title> <body>
  node post.js delete <slug>`);
  process.exit(1);
}

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));
const posts = JSON.parse(readFileSync("posts.json", "utf-8"));

// Apply the action
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

// Save updated posts
writeFileSync("posts.json", JSON.stringify(posts, null, 2));

// Regenerate entire site
rmSync("site", { recursive: true, force: true });
mkdirSync("site/posts", { recursive: true });
writeFileSync("site/index.html", generateIndex(posts));
for (const post of posts) {
  writeFileSync(`site/posts/${post.slug}.html`, generatePost(post));
}

// Upload and update feed
const pk = new PrivateKey(cfg.privateKey);
const topic = Topic.fromString(cfg.topic);
const writer = bee.makeFeedWriter(topic, pk);

const upload = await bee.uploadFilesFromDirectory(batchId, "./site", {
  indexDocument: "index.html",
});
await writer.upload(batchId, upload.reference);

console.log(`Blog updated! (${posts.length} post${posts.length !== 1 ? "s" : ""})`);
console.log(`View: ${process.env.BEE_URL}/bzz/${cfg.manifest}/`);

// --- HTML generation ---

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
  <p><a href="../">← Back</a></p>
  <h1>${esc(post.title)}</h1>
  <small style="color:#888;">${post.date}</small>
  <div style="margin-top:16px; line-height:1.6;">${esc(post.body)}</div>
</body></html>`;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
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

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

With `swarm-cli`, you manage the site files manually (or with a helper script), then re-upload:

#### Create a post

Add a new post file at `site/posts/hello-world.html`:

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Hello World</title></head>
<body style="max-width:640px; margin:40px auto; font-family:sans-serif;">
  <p><a href="../">← Back</a></p>
  <h1>Hello World</h1>
  <small style="color:#888;">2025-06-15</small>
  <div style="margin-top:16px; line-height:1.6;">This is my first blog post on Swarm.</div>
</body></html>
```

Update `site/index.html` to link to it:

```html
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>My Blog</title></head>
<body style="max-width:640px; margin:40px auto; font-family:sans-serif;">
  <h1>My Blog</h1>
  <p>1 post</p>
  <article style="margin:16px 0; padding:16px; border:1px solid #ddd; border-radius:4px;">
    <h2 style="margin:0 0 4px 0;"><a href="posts/hello-world.html">Hello World</a></h2>
    <small style="color:#888;">2025-06-15</small>
  </article>
</body></html>
```

Upload to the feed:

```bash
swarm-cli feed upload ./site \
  --identity blog-publisher \
  --topic-string blog \
  --stamp BATCH_ID \
  --index-document index.html
```

#### Edit a post

Edit the HTML file at `site/posts/hello-world.html` with the updated title and body, then re-upload with the same command above.

#### Delete a post

Remove the post file from `site/posts/` and update `site/index.html` to remove the link, then re-upload.

In every case, the operation is the same on the Swarm side: modify local files, then re-upload the `site/` folder to the feed. The feed manifest URL remains unchanged.

:::tip
You can automate the HTML generation with a simple shell or Node.js script that reads posts from a local JSON file and writes the HTML before uploading. The key point is that the Swarm side of things is always the same: regenerate content, upload, update feed.
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

const result = await reader.downloadReference();
console.log("Latest content reference:", result.reference.toHex());
console.log("Feed index:", result.feedIndex.toBigInt());
console.log("View:", `${process.env.BEE_URL}/bzz/${cfg.manifest}/`);
```

Run it:

```bash
node read.js
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```bash
swarm-cli feed print \
  --identity blog-publisher \
  --topic-string blog
```

Or simply open the feed manifest URL in a browser:

```text
http://localhost:1633/bzz/FEED_MANIFEST_HASH/
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
- "Editing" and "deleting" content on Swarm means regenerating your site without the removed or changed content, re-uploading, and updating the feed. Old versions remain on Swarm at their original hashes, but the feed always points to the latest.
