---
title: Multi-Author Blog
id: multi-author-blog
sidebar_label: Multi-Author Blog
description: Build a decentralized multi-author blog on Swarm using linked feeds — each author has their own feed, and a master index feed ties them together.
---


This guide extends the [Dynamic Content](/docs/develop/dynamic-content) pattern into a multi-author system. Instead of a single publisher managing one feed, each author independently controls their own feed, and an admin maintains an index feed that links them all together. This demonstrates the core architectural pattern needed for decentralized networks: **feeds that reference other feeds**.

The key insight is that a feed entry does not have to point to HTML content — it can point to any Swarm data, including a JSON manifest that describes other feeds. This creates a composable, decentralized publishing network without any central coordinator beyond a shared index feed.

## Prerequisites

* A running Bee node ([install guide](/docs/bee/installation/quick-start))
* A valid postage stamp batch ([how to get one](/docs/develop/tools-and-features/buy-a-stamp-batch))
* Node.js 18+ and `@ethersphere/bee-js` installed
* Familiarity with the [Dynamic Content](/docs/develop/dynamic-content) guide and feeds

## Architecture

The multi-author blog consists of four feed layers:

```
Index Feed (admin key, topic: "blog-index")
  └─ points to → authors.json
       ├─ { name: "Alice", topic: "alice-posts", owner: "0xAlice...", feedManifest: "3fa19c..." }
       └─ { name: "Bob",   topic: "bob-posts",   owner: "0xBob...",   feedManifest: "7c244b..." }

Alice's Feed (alice key, topic: "alice-posts")
  └─ points to → alice's blog page HTML

Bob's Feed (bob key, topic: "bob-posts")
  └─ points to → bob's blog page HTML

Homepage Feed (admin key, topic: "blog-home")
  └─ points to → index.html (aggregated view reading all author feeds)
```

Each author publishes independently to their own feed. The admin reads from all author feeds, assembles an aggregated homepage, and publishes it. The index feed stores the master list of authors — any new reader can discover all authors by reading the index.

## Feeds Referencing Feeds

The Simple Blog example in the [Dynamic Content guide](/docs/develop/dynamic-content#example-project--simple-blog) demonstrated regenerate-and-publish: upload content, point a feed to it, update the feed manifest URL. The multi-author blog adds a new dimension: **feeds as data structures**.

When you store a JSON document inside a feed that contains the `topic` and `owner` of other feeds, you've created a directory of feeds — a linked network. The `authors.json` file is not just content; it's a data structure that enumerates other feeds and their stable references (feed manifest hashes).

:::tip
A feed manifest hash is a stable, permanent reference to a feed. You can store feed manifest hashes inside your index feed's JSON payload, and readers just need that manifest hash to follow the link — they don't need the topic string or owner address separately. Manifest hashes are your "URLs" between feeds.
:::

This pattern scales. You can have hundreds of author feeds, all discovered through a single index feed. Add a new author by appending their entry to `authors.json` and re-uploading to the index feed. Readers polling the index automatically discover the new author — no out-of-band notification needed.


## Example Scripts

The complete project is in the [`multi-author-blog`](https://github.com/ethersphere/examples/tree/main/multi-author-blog) directory of the [examples](https://github.com/ethersphere/examples) repo:

* [`init.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/init.js) — One-time setup: create all feeds and manifests
* [`add-post.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/add-post.js) — Author publishes a new post
* [`update-index.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/update-index.js) — Admin aggregates author feeds and updates homepage
* [`add-author.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/add-author.js) — Add a new author to the blog
* [`read.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/read.js) — Read the feeds without private keys

Clone the repo and set up the project:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/multi-author-blog
npm install
cp .env.example .env
```

Fill in your `BATCH_ID` in `.env`:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<YOUR_BATCH_ID>
```

## Example Project — Multi-Author Blog

This section builds a complete runnable project: a blog where multiple authors publish independently, and an admin maintains a homepage that aggregates all posts.

### Project Setup

Use the cloned examples repo (see [Example Scripts](#example-scripts) above):

```bash
cd examples/multi-author-blog
npm install
cp .env.example .env
# Fill in BEE_URL and BATCH_ID in .env
```


### Project Structure

```
swarm-multiblog/
├── .env
├── config.json          # Created by init.js — all keys and manifest hashes
├── authors.json         # Created by init.js — directory of authors
├── alice-posts.json     # Created by add-post.js — Alice's post list
├── bob-posts.json       # Created by add-post.js — Bob's post list
├── init.js              # One-time setup: create all feeds and manifests
├── add-post.js          # Author publishes a new post
├── update-index.js      # Admin aggregates author feeds and updates homepage
└── read.js              # Read the feeds without private keys
```


### Initialize the Blog

This step generates keys for all authors and the admin, creates feeds for each author and for the homepage, builds the index feed with an `authors.json` manifest, and saves everything to `config.json`.

Create `init.js`:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import crypto from "crypto";
import { writeFileSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;

function makeKey() {
  const hex = "0x" + crypto.randomBytes(32).toString("hex");
  return new PrivateKey(hex);
}

// Generate keys for admin, Alice, and Bob
const adminKey = makeKey();
const aliceKey = makeKey();
const bobKey   = makeKey();

const adminOwner = adminKey.publicKey().address();
const aliceOwner = aliceKey.publicKey().address();
const bobOwner   = bobKey.publicKey().address();

// Topics — each feed has a unique topic
const aliceTopic = Topic.fromString("alice-posts");
const bobTopic   = Topic.fromString("bob-posts");
const indexTopic = Topic.fromString("blog-index");
const homeTopic  = Topic.fromString("blog-home");

// --- Step 1: Upload initial author pages ---
const aliceHTML = generateAuthorHTML("Alice", []);
const bobHTML   = generateAuthorHTML("Bob",   []);

const aliceUpload = await bee.uploadFile(batchId, aliceHTML, "index.html", {
  contentType: "text/html",
});
const bobUpload = await bee.uploadFile(batchId, bobHTML, "index.html", {
  contentType: "text/html",
});

// --- Step 2: Create author feeds ---
const aliceWriter = bee.makeFeedWriter(aliceTopic, aliceKey);
const bobWriter   = bee.makeFeedWriter(bobTopic,   bobKey);

await aliceWriter.upload(batchId, aliceUpload.reference);
await bobWriter.upload(batchId, bobUpload.reference);

// --- Step 3: Create author feed manifests (stable references) ---
const aliceManifest = await bee.createFeedManifest(batchId, aliceTopic, aliceOwner);
const bobManifest   = await bee.createFeedManifest(batchId, bobTopic,   bobOwner);

console.log("Alice feed manifest:", aliceManifest.toHex());
console.log("Bob feed manifest:  ", bobManifest.toHex());

// --- Step 4: Build and upload the authors.json index ---
const authors = [
  {
    name: "Alice",
    topic: "alice-posts",
    owner: aliceOwner.toHex(),
    feedManifest: aliceManifest.toHex(),
  },
  {
    name: "Bob",
    topic: "bob-posts",
    owner: bobOwner.toHex(),
    feedManifest: bobManifest.toHex(),
  },
];
const authorsJson = JSON.stringify(authors, null, 2);
writeFileSync("authors.json", authorsJson);

const indexUpload = await bee.uploadFile(batchId, authorsJson, "authors.json", {
  contentType: "application/json",
});

// --- Step 5: Create the index feed ---
const indexWriter = bee.makeFeedWriter(indexTopic, adminKey);
await indexWriter.upload(batchId, indexUpload.reference);
const indexManifest = await bee.createFeedManifest(batchId, indexTopic, adminOwner);

console.log("Index feed manifest:", indexManifest.toHex());

// --- Step 6: Generate and upload the homepage ---
const homeHTML = generateHomepageHTML(authors, []);
const homeUpload = await bee.uploadFile(batchId, homeHTML, "index.html", {
  contentType: "text/html",
});

const homeWriter = bee.makeFeedWriter(homeTopic, adminKey);
await homeWriter.upload(batchId, homeUpload.reference);
const homeManifest = await bee.createFeedManifest(batchId, homeTopic, adminOwner);

// --- Step 7: Save config ---
const cfg = {
  admin: { privateKey: adminKey.toHex(), owner: adminOwner.toHex() },
  alice: { privateKey: aliceKey.toHex(), owner: aliceOwner.toHex() },
  bob:   { privateKey: bobKey.toHex(),   owner: bobOwner.toHex()   },
  topics: {
    alice: "alice-posts",
    bob:   "bob-posts",
    index: "blog-index",
    home:  "blog-home",
  },
  manifests: {
    alice: aliceManifest.toHex(),
    bob:   bobManifest.toHex(),
    index: indexManifest.toHex(),
    home:  homeManifest.toHex(),
  },
};
writeFileSync("config.json", JSON.stringify(cfg, null, 2));

console.log("\nBlog initialized!");
console.log("Homepage:      " + `${process.env.BEE_URL}/bzz/${homeManifest.toHex()}/`);
console.log("Alice's feed:  " + `${process.env.BEE_URL}/bzz/${aliceManifest.toHex()}/`);
console.log("Bob's feed:    " + `${process.env.BEE_URL}/bzz/${bobManifest.toHex()}/`);

function generateAuthorHTML(name, posts) {
  const items = posts
    .map(
      (p) => `
    <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
      <h2 style="margin:0 0 4px 0;">${p.title}</h2>
      <small style="color:#888;">${p.date}</small>
      <p>${p.body}</p>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${name}'s Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>${name}'s Blog</h1>
  <p>${posts.length} post${posts.length !== 1 ? "s" : ""}</p>
  ${items || "<p><em>No posts yet.</em></p>"}
</body>
</html>`;
}

function generateHomepageHTML(authors, latestPosts) {
  const cards = authors
    .map(
      (a) => {
        const latest = latestPosts.find((p) => p.author === a.name);
        const preview = latest
          ? `<p><strong>${latest.title}</strong> — ${latest.date}</p><p>${latest.body.slice(0, 120)}…</p>`
          : `<p><em>No posts yet.</em></p>`;
        return `<div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
      <h2 style="margin:0 0 8px 0;"><a href="/bzz/${a.feedManifest}/">${a.name}</a></h2>
      ${preview}
    </div>`;
      }
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Multi-Author Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Multi-Author Blog</h1>
  <p>${authors.length} author${authors.length !== 1 ? "s" : ""}</p>
  ${cards || "<p><em>No authors yet.</em></p>"}
</body>
</html>`;
}
```

Run it once to initialize the blog:

```bash
node init.js
# or: npm run init
```

Example output:

```
Alice feed manifest: 3fa19c...
Bob feed manifest:   7c244b...
Index feed manifest: a10be5...

Blog initialized!
Homepage:      http://localhost:1633/bzz/d991f2.../
Alice's feed:  http://localhost:1633/bzz/3fa19c.../
Bob's feed:    http://localhost:1633/bzz/7c244b.../
```


### Add a Post

Authors publish independently. Each author regenerates their blog page with the new post, uploads it, and updates their feed. The admin can then aggregate the latest posts into the homepage.

Create `add-post.js`:

```js
import { Bee, Topic, PrivateKey } from "@ethersphere/bee-js";
import { readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
config();

const [,, authorArg, title, ...bodyWords] = process.argv;
const body = bodyWords.join(" ");

if (!authorArg || !title || !body) {
  console.error('Usage: node add-post.js <alice|bob> "Post title" "Post body"');
  process.exit(1);
}

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));

const author = cfg[authorArg];
if (!author) {
  console.error(`Unknown author: ${authorArg}`);
  process.exit(1);
}

const pk    = new PrivateKey(author.privateKey);
const topic = Topic.fromString(cfg.topics[authorArg]);

// Load or initialize the author's post list
const postsFile = `${authorArg}-posts.json`;
let posts = [];
try {
  posts = JSON.parse(readFileSync(postsFile, "utf-8"));
} catch {
  // First post — file doesn't exist yet
}

const newPost = { title, body, date: new Date().toISOString() };
posts.push(newPost);
writeFileSync(postsFile, JSON.stringify(posts, null, 2));

// Regenerate the author's page HTML
const html = generateAuthorHTML(
  authorArg.charAt(0).toUpperCase() + authorArg.slice(1),
  posts
);

// Upload and update the author's feed
const upload = await bee.uploadFile(batchId, html, "index.html", {
  contentType: "text/html",
});
const writer = bee.makeFeedWriter(topic, pk);
await writer.upload(batchId, upload.reference);

console.log(`Post published by ${authorArg}! (${posts.length} total)`);
console.log("View: " + `${process.env.BEE_URL}/bzz/${cfg.manifests[authorArg]}/`);

function generateAuthorHTML(name, posts) {
  const items = posts
    .map(
      (p) => `
    <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
      <h2 style="margin:0 0 4px 0;">${p.title}</h2>
      <small style="color:#888;">${p.date}</small>
      <p>${p.body}</p>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${name}'s Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>${name}'s Blog</h1>
  <p>${posts.length} post${posts.length !== 1 ? "s" : ""}</p>
  ${items}
</body>
</html>`;
}
```

Run it:

```bash
node add-post.js alice "Hello Swarm" "My first post on a decentralized blog."
node add-post.js bob "Why Swarm?" "Censorship resistance matters."
# or: npm run add-post -- alice "Hello Swarm" "My first post on a decentralized blog."
```

:::tip
Authors are fully independent. Bob can publish a post without Alice's involvement, without any coordination, and without running any admin script. Each author controls only their own private key and topic. The admin (homepage aggregator) runs separately and at their own discretion.
:::


### Update the Homepage

The admin aggregates all author feeds and publishes an updated homepage with previews of their latest posts. This is the key demonstration of feeds referencing feeds: the aggregator reads the index feed to discover authors, then reads each author's feed to fetch their latest content.

Create `update-index.js`:

```js
import { Bee, Topic, EthAddress, PrivateKey } from "@ethersphere/bee-js";
import { readFileSync, writeFileSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const batchId = process.env.BATCH_ID;
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));
const authors = JSON.parse(readFileSync("authors.json", "utf-8"));

// Read each author's latest feed entry to confirm their feed is live
const latestPosts = [];
for (const author of authors) {
  const topic  = Topic.fromString(author.topic);
  const owner  = new EthAddress(author.owner);
  const reader = bee.makeFeedReader(topic, owner);

  try {
    const result = await reader.download();
    console.log(`${author.name}: feed index ${result.feedIndex.toBigInt()}`);

    // Load the local post sidecar to get post data for the preview
    const postsFile = `${author.name.toLowerCase()}-posts.json`;
    const posts = JSON.parse(readFileSync(postsFile, "utf-8"));
    const latest = posts.at(-1);
    if (latest) {
      latestPosts.push({ author: author.name, ...latest });
    }
  } catch {
    console.log(`${author.name}: no feed entries yet`);
  }
}

// Regenerate homepage with latest post previews from all authors
const homeHTML = generateHomepageHTML(authors, latestPosts);
const homeUpload = await bee.uploadFile(batchId, homeHTML, "index.html", {
  contentType: "text/html",
});

const adminKey  = new PrivateKey(cfg.admin.privateKey);
const homeTopic = Topic.fromString(cfg.topics.home);
const homeWriter = bee.makeFeedWriter(homeTopic, adminKey);
await homeWriter.upload(batchId, homeUpload.reference);

console.log("\nHomepage updated!");
console.log("View: " + `${process.env.BEE_URL}/bzz/${cfg.manifests.home}/`);

function generateHomepageHTML(authors, latestPosts) {
  const cards = authors
    .map(
      (a) => {
        const latest = latestPosts.find((p) => p.author === a.name);
        const preview = latest
          ? `<p><strong>${latest.title}</strong> — ${latest.date}</p><p>${latest.body.slice(0, 120)}…</p>`
          : `<p><em>No posts yet.</em></p>`;
        return `<div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
      <h2 style="margin:0 0 8px 0;"><a href="/bzz/${a.feedManifest}/">${a.name}</a></h2>
      ${preview}
    </div>`;
      }
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Multi-Author Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Multi-Author Blog</h1>
  <p>${authors.length} author${authors.length !== 1 ? "s" : ""}</p>
  ${cards}
</body>
</html>`;
}
```

Run it after authors publish:

```bash
node update-index.js
# or: npm run update-index
```

The homepage now displays previews of the latest posts from all authors. The homepage feed manifest URL (`cfg.manifests.home`) always serves the aggregated view.

:::info
The `update-index.js` script reads local JSON sidecars (`alice-posts.json`, `bob-posts.json`) to populate post previews. In a production system, each post would be a separate Swarm upload, and the author's feed would store a JSON post-list reference (topic + manifest hash) instead of raw HTML. See [Etherjot](https://github.com/ethersphere/etherjot) for a full-featured example of this approach.
:::


### Read the Blog

Any third party can read the blog and discover all authors using only the index feed manifest hash. No private keys are needed.

Create `read.js`:

```js
import { Bee, Topic, EthAddress } from "@ethersphere/bee-js";
import { readFileSync } from "fs";
import { config } from "dotenv";
config();

const bee = new Bee(process.env.BEE_URL);
const cfg = JSON.parse(readFileSync("config.json", "utf-8"));

// Read the index feed to get the current authors manifest
const indexTopic = Topic.fromString(cfg.topics.index);
const indexOwner = new EthAddress(cfg.admin.owner);
const indexReader = bee.makeFeedReader(indexTopic, indexOwner);
const indexResult = await indexReader.downloadReference();
console.log("Index feed at index:", indexResult.feedIndex.toBigInt());

// Download the authors.json manifest
const authorsData = await bee.downloadFile(indexResult.reference);
const authors = JSON.parse(authorsData.data.toUtf8());

console.log(`\n${authors.length} authors in blog:\n`);

// For each author, read their feed
for (const author of authors) {
  const topic  = Topic.fromString(author.topic);
  const owner  = new EthAddress(author.owner);
  const reader = bee.makeFeedReader(topic, owner);
  try {
    const result = await reader.download();
    console.log(`${author.name}`);
    console.log(`  Feed index: ${result.feedIndex.toBigInt()}`);
    console.log(`  URL: ${process.env.BEE_URL}/bzz/${author.feedManifest}/`);
  } catch {
    console.log(`${author.name}: feed not yet populated`);
  }
}

// Read the homepage feed
const homeTopic  = Topic.fromString(cfg.topics.home);
const homeOwner  = new EthAddress(cfg.admin.owner);
const homeReader = bee.makeFeedReader(homeTopic, homeOwner);
const homeResult = await homeReader.downloadReference();
console.log(`\nHomepage feed at index: ${homeResult.feedIndex.toBigInt()}`);
console.log(`Homepage URL: ${process.env.BEE_URL}/bzz/${cfg.manifests.home}/`);
```

Run it:

```bash
node read.js
# or: npm run read
```


### Adding a New Author

Extending the system with a new author is straightforward. The new author gets their own key and topic. Their entry is appended to `authors.json`. Readers automatically discover them.

The [`add-author.js`](https://github.com/ethersphere/examples/blob/main/multi-author-blog/add-author.js) script from the examples repo handles everything in one step. From the project directory (after running `init.js`):

```bash
node add-author.js charlie
# or: npm run add-author -- charlie
```

This will:
1. Generate a new private key for Charlie
2. Upload an initial empty blog page for them
3. Create their feed and feed manifest
4. Append their entry to `authors.json` and re-upload to the index feed
5. Update `config.json` so Charlie can use `add-post.js`

Then run `update-index.js` to refresh the homepage with the new author.


:::info
Because the index feed always points to the *latest* `authors.json`, any reader who polls the index feed automatically discovers newly added authors. You don't need to notify readers through a separate channel — the feed is the notification channel.
:::

## Summary

The multi-author blog demonstrates the key architectural pattern of large-scale Swarm applications: **composable feeds**.

Key takeaways:

- A feed entry can point to any Swarm content — HTML, JSON, images, or even the feed manifest hash of another feed.
- Storing topic + owner + manifest hashes in a JSON document creates a directory of feeds — a linked feed network.
- Feed manifest hashes are stable, permanent references. Use them as links between feeds.
- Authors are independent. Each controls their own key and topic. Publishing a new post requires no coordination with other authors or the admin.
- The homepage aggregator is a separate concern. It reads the index to discover authors, queries each author's feed for their latest content, and publishes the aggregated result.
- Adding new authors does not break existing URLs. The index feed is updatable; readers poll it and automatically discover new entries.

This architecture scales to hundreds of feeds and can represent complex data structures (threaded discussions, version hierarchies, category trees) — all composed from simple feed primitives and content-addressed storage.
