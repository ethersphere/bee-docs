---
title: Multi-Author Blog
id: multi-author-blog
sidebar_label: Multi-Author Blog
description: Build a decentralized multi-author blog on Swarm using linked feeds — each author has their own feed, and a master index feed ties them together.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide extends the [Dynamic Content](/docs/develop/dynamic-content) pattern into a multi-author system. Instead of a single publisher managing one feed, each author independently controls their own feed, and an admin maintains an index feed that links them all together. This demonstrates the core architectural pattern needed for decentralized networks: **feeds that reference other feeds**.

The key insight is that a feed entry does not have to point to HTML content — it can point to any Swarm data, including a JSON manifest that describes other feeds. This creates a composable, decentralized publishing network without any central coordinator beyond a shared index feed.

## Prerequisites

* A running Bee node ([install guide](/docs/bee/installation/quick-start))
* A valid postage stamp batch ([how to get one](/docs/develop/tools-and-features/buy-a-stamp-batch))
* Node.js 18+ and `@ethersphere/bee-js` installed (for `bee-js` examples)
* [`swarm-cli` installed](https://docs.ethswarm.org/docs/bee/working-with-bee/swarm-cli) (for `swarm-cli` examples)
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

The Dynamic Note Board demonstrated regenerate-and-publish: upload content, point a feed to it, update the feed manifest URL. The multi-author blog adds a new dimension: **feeds as data structures**.

When you store a JSON document inside a feed that contains the `topic` and `owner` of other feeds, you've created a directory of feeds — a linked network. The `authors.json` file is not just content; it's a data structure that enumerates other feeds and their stable references (feed manifest hashes).

:::tip
A feed manifest hash is a stable, permanent reference to a feed. You can store feed manifest hashes inside your index feed's JSON payload, and readers just need that manifest hash to follow the link — they don't need the topic string or owner address separately. Manifest hashes are your "URLs" between feeds.
:::

This pattern scales. You can have hundreds of author feeds, all discovered through a single index feed. Add a new author by appending their entry to `authors.json` and re-uploading to the index feed. Readers polling the index automatically discover the new author — no out-of-band notification needed.

## Example Project — Multi-Author Blog

This section builds a complete runnable project: a blog where multiple authors publish independently, and an admin maintains a homepage that aggregates all posts.

### Project Setup

<Tabs>
<TabItem value="bee-js" label="bee-js">

Create a new directory and install dependencies:

```bash
mkdir swarm-multiblog && cd swarm-multiblog
npm init -y
npm install @ethersphere/bee-js dotenv
```

Add `"type": "module"` to your `package.json` to use ES module imports.

Create a `.env` file:

```bash
BEE_URL=http://localhost:1633
BATCH_ID=<YOUR_BATCH_ID>
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create the project directory and author folders:

```bash
mkdir swarm-multiblog && cd swarm-multiblog
mkdir -p blog/alice blog/bob blog/home
```

Set up three identities — one for each author and one for the admin:

```bash
swarm-cli identity create blog-admin
swarm-cli identity create alice
swarm-cli identity create bob
```

Keep the output of each command — you'll need the owner addresses and any other identity information for later steps.

</TabItem>
</Tabs>

### Project Structure

<Tabs>
<TabItem value="bee-js" label="bee-js">

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

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

```
swarm-multiblog/
├── blog/
│   ├── alice/
│   │   └── index.html       # Alice's latest blog page
│   ├── bob/
│   │   └── index.html       # Bob's latest blog page
│   └── home/
│       └── index.html       # Homepage with aggregated posts
├── authors.json             # Directory of authors (manifest hashes, topics, owners)
├── alice-posts.json         # Local tracking of Alice's posts
└── bob-posts.json           # Local tracking of Bob's posts
```

</TabItem>
</Tabs>

### Initialize the Blog

This step generates keys for all authors and the admin, creates feeds for each author and for the homepage, builds the index feed with an `authors.json` manifest, and saves everything to `config.json`.

<Tabs>
<TabItem value="bee-js" label="bee-js">

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

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create initial HTML files for each author. Start with Alice:

```bash
cat > blog/alice/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Alice's Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Alice's Blog</h1>
  <p><em>No posts yet.</em></p>
</body>
</html>
EOF
```

Do the same for Bob:

```bash
cat > blog/bob/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bob's Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Bob's Blog</h1>
  <p><em>No posts yet.</em></p>
</body>
</html>
EOF
```

Upload Alice's initial page to her feed and save the manifest hash:

```bash
swarm-cli feed upload ./blog/alice \
  --identity alice \
  --topic-string alice-posts \
  --stamp <BATCH_ID> \
  --index-document index.html
```

This outputs a `Feed Manifest URL`. Extract the hash and save it as `ALICE_MANIFEST`. Do the same for Bob and save as `BOB_MANIFEST`.

Now create `authors.json` with your manifest hashes and owner addresses (from your `swarm-cli identity` output earlier):

```json
[
  {
    "name": "Alice",
    "topic": "alice-posts",
    "owner": "<ALICE_ADDRESS>",
    "feedManifest": "<ALICE_MANIFEST>"
  },
  {
    "name": "Bob",
    "topic": "bob-posts",
    "owner": "<BOB_ADDRESS>",
    "feedManifest": "<BOB_MANIFEST>"
  }
]
```

Upload `authors.json` to the index feed:

```bash
swarm-cli feed upload authors.json \
  --identity blog-admin \
  --topic-string blog-index \
  --stamp <BATCH_ID>
```

Save the `Feed Manifest URL` hash as `INDEX_MANIFEST`.

Finally, create the homepage and upload it to the home feed:

```bash
cat > blog/home/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Multi-Author Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Multi-Author Blog</h1>
  <p>2 authors</p>
  <div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
    <h2 style="margin:0 0 8px 0;"><a href="/bzz/<ALICE_MANIFEST>/">Alice</a></h2>
    <p><em>No posts yet.</em></p>
  </div>
  <div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
    <h2 style="margin:0 0 8px 0;"><a href="/bzz/<BOB_MANIFEST>/">Bob</a></h2>
    <p><em>No posts yet.</em></p>
  </div>
</body>
</html>
EOF
```

Upload it:

```bash
swarm-cli feed upload ./blog/home \
  --identity blog-admin \
  --topic-string blog-home \
  --stamp <BATCH_ID> \
  --index-document index.html
```

Save the `Feed Manifest URL` hash as `HOME_MANIFEST`. This is your permanent blog URL.

:::info
In the swarm-cli workflow, `authors.json` and all state tracking is maintained manually or by local shell scripts. The swarm-cli commands handle uploads and feed updates; local file organization is left to you. For automation, you could write a shell script that regenerates `blog/home/index.html` and re-runs the feed upload.
:::

</TabItem>
</Tabs>

### Add a Post

Authors publish independently. Each author regenerates their blog page with the new post, uploads it, and updates their feed. The admin can then aggregate the latest posts into the homepage.

<Tabs>
<TabItem value="bee-js" label="bee-js">

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
```

:::tip
Authors are fully independent. Bob can publish a post without Alice's involvement, without any coordination, and without running any admin script. Each author controls only their own private key and topic. The admin (homepage aggregator) runs separately and at their own discretion.
:::

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Edit `blog/alice/index.html` to include the new post:

```bash
cat > blog/alice/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Alice's Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Alice's Blog</h1>
  <p>1 post</p>
  <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
    <h2 style="margin:0 0 4px 0;">Hello Swarm</h2>
    <small style="color:#888;">2025-06-15</small>
    <p>My first post on a decentralized blog.</p>
  </div>
</body>
</html>
EOF
```

Re-upload to Alice's feed:

```bash
swarm-cli feed upload ./blog/alice \
  --identity alice \
  --topic-string alice-posts \
  --stamp <BATCH_ID> \
  --index-document index.html
```

The Feed Manifest URL stays the same. Alice's page now shows the new post. Do the same for Bob:

```bash
cat > blog/bob/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Bob's Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Bob's Blog</h1>
  <p>1 post</p>
  <div style="border:1px solid #ddd; padding:12px; margin:8px 0; border-radius:4px;">
    <h2 style="margin:0 0 4px 0;">Why Swarm?</h2>
    <small style="color:#888;">2025-06-15</small>
    <p>Censorship resistance matters.</p>
  </div>
</body>
</html>
EOF

swarm-cli feed upload ./blog/bob \
  --identity bob \
  --topic-string bob-posts \
  --stamp <BATCH_ID> \
  --index-document index.html
```

Each author's feed manifest URL always serves their latest posts.

</TabItem>
</Tabs>

### Update the Homepage

The admin aggregates all author feeds and publishes an updated homepage with previews of their latest posts. This is the key demonstration of feeds referencing feeds: the aggregator reads the index feed to discover authors, then reads each author's feed to fetch their latest content.

<Tabs>
<TabItem value="bee-js" label="bee-js">

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
```

The homepage now displays previews of the latest posts from all authors. The homepage feed manifest URL (`cfg.manifests.home`) always serves the aggregated view.

:::info
The `update-index.js` script reads local JSON sidecars (`alice-posts.json`, `bob-posts.json`) to populate post previews. In a production system, each post would be a separate Swarm upload, and the author's feed would store a JSON post-list reference (topic + manifest hash) instead of raw HTML. See [Etherjot](https://github.com/ethersphere/etherjot) for a full-featured example of this approach.
:::

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

After authors have published posts, update the homepage HTML to include previews and links:

```bash
cat > blog/home/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Multi-Author Blog</title></head>
<body style="max-width:680px; margin:40px auto; font-family:sans-serif;">
  <h1>Multi-Author Blog</h1>
  <p>2 authors</p>
  <div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
    <h2 style="margin:0 0 8px 0;"><a href="/bzz/<ALICE_MANIFEST>/">Alice</a></h2>
    <p><strong>Hello Swarm</strong> — 2025-06-15</p>
    <p>My first post on a decentralized blog.</p>
  </div>
  <div style="border:1px solid #ddd; padding:16px; margin:12px 0; border-radius:4px;">
    <h2 style="margin:0 0 8px 0;"><a href="/bzz/<BOB_MANIFEST>/">Bob</a></h2>
    <p><strong>Why Swarm?</strong> — 2025-06-15</p>
    <p>Censorship resistance matters.</p>
  </div>
</body>
</html>
EOF
```

Re-upload the homepage to its feed:

```bash
swarm-cli feed upload ./blog/home \
  --identity blog-admin \
  --topic-string blog-home \
  --stamp <BATCH_ID> \
  --index-document index.html
```

The homepage feed manifest URL (your permanent blog URL) now displays aggregated posts. The `<a>` links point to each author's feed manifest hash — stable, permanent URLs that always resolve to the latest version of each author's page.

:::tip
Notice: you did not edit the links to Alice or Bob's feeds. They are permanent feed manifest hashes. When Alice publishes a new post, her feed manifest URL automatically serves the new content. No link updates needed.
:::

</TabItem>
</Tabs>

### Read the Blog

Any third party can read the blog and discover all authors using only the index feed manifest hash. No private keys are needed.

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

// Read the index feed to get the current authors manifest
const indexTopic = Topic.fromString(cfg.topics.index);
const indexOwner = new EthAddress(cfg.admin.owner);
const indexReader = bee.makeFeedReader(indexTopic, indexOwner);
const indexResult = await indexReader.download();
console.log("Index feed at index:", indexResult.feedIndex.toBigInt());

// Download the authors.json manifest
const authorsData = await bee.downloadFile(indexResult.reference);
const authors = JSON.parse(new TextDecoder().decode(authorsData.data));

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
const homeResult = await homeReader.download();
console.log(`\nHomepage feed at index: ${homeResult.feedIndex.toBigInt()}`);
console.log(`Homepage URL: ${process.env.BEE_URL}/bzz/${cfg.manifests.home}/`);
```

Run it:

```bash
node read.js
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Print the state of all feeds:

```bash
# Read the index feed
swarm-cli feed print \
  --identity blog-admin \
  --topic-string blog-index

# Read each author's feed
swarm-cli feed print \
  --identity alice \
  --topic-string alice-posts

swarm-cli feed print \
  --identity bob \
  --topic-string bob-posts

# Read the homepage feed
swarm-cli feed print \
  --identity blog-admin \
  --topic-string blog-home
```

:::info
The `swarm-cli feed print` command requires the identity (key file) to be available locally. To read another author's feed without their key, use Bee's HTTP API directly:

```bash
curl http://localhost:1633/bzz/<FEED_MANIFEST_HASH>/
```

This fetches the latest content published to that feed manifest, without needing the author's private key.
:::

</TabItem>
</Tabs>

### Adding a New Author

Extending the system with a new author is straightforward. The new author gets their own key and topic. Their entry is appended to `authors.json`. Readers automatically discover them.

<Tabs>
<TabItem value="bee-js" label="bee-js">

Generate a key for the new author, upload their initial page, create their feed manifest, and append to `authors.json`:

1. Add the new author to your `config.json` (or generate a new key using `makeKey()`)
2. Create a new author feed topic
3. Upload their initial empty page
4. Create their feed manifest
5. Read `authors.json`, append the new entry, re-upload
6. Re-run `update-index.js` to refresh the homepage

```js
// Example: Adding Charlie
const charlieKey = makeKey();
const charlieOwner = charlieKey.publicKey().address();
const charlieTopic = Topic.fromString("charlie-posts");

// Upload initial page, create feed and manifest (same pattern as init.js)
// ...

// Update authors.json
const authors = JSON.parse(readFileSync("authors.json", "utf-8"));
authors.push({
  name: "Charlie",
  topic: "charlie-posts",
  owner: charlieOwner.toHex(),
  feedManifest: charlieManifest.toHex(),
});
writeFileSync("authors.json", JSON.stringify(authors, null, 2));

// Re-upload to the index feed
const indexUpload = await bee.uploadFile(batchId, JSON.stringify(authors), "authors.json", {
  contentType: "application/json",
});
const indexWriter = bee.makeFeedWriter(indexTopic, adminKey);
await indexWriter.upload(batchId, indexUpload.reference);
```

</TabItem>
<TabItem value="swarm-cli" label="swarm-cli">

Create the new author's identity and directory:

```bash
swarm-cli identity create charlie
mkdir blog/charlie
```

Upload their initial page:

```bash
# Create blog/charlie/index.html (empty page template)

swarm-cli feed upload ./blog/charlie \
  --identity charlie \
  --topic-string charlie-posts \
  --stamp <BATCH_ID> \
  --index-document index.html
```

Save the Feed Manifest URL hash as `CHARLIE_MANIFEST`. Update `authors.json`:

```json
[
  { "name": "Alice", "topic": "alice-posts", "owner": "<ALICE_ADDRESS>", "feedManifest": "<ALICE_MANIFEST>" },
  { "name": "Bob",   "topic": "bob-posts",   "owner": "<BOB_ADDRESS>",   "feedManifest": "<BOB_MANIFEST>"   },
  { "name": "Charlie", "topic": "charlie-posts", "owner": "<CHARLIE_ADDRESS>", "feedManifest": "<CHARLIE_MANIFEST>" }
]
```

Re-upload `authors.json` to the index feed:

```bash
swarm-cli feed upload authors.json \
  --identity blog-admin \
  --topic-string blog-index \
  --stamp <BATCH_ID>
```

The index feed now points to the updated manifest.

</TabItem>
</Tabs>

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
