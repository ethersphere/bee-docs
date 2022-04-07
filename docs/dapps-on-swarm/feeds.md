---
title: Feeds
id: feeds
---

Swarm feeds cleverly combine
[single owner chunks](/docs/dapps-on-swarm/chunk-types)
into a data structure which enables you to have static addresses for
your mutable content. This means that you can signpost your data for
other Bees, and then update it at will.

:::info
Although it's possible to interact with feeds directly, it can involve
a little data juggling and crypto magic. For the easiest route, see
[the bee-js feeds functionality](/docs/dapps-on-swarm/bee-js) and
[swarm-cli](/docs/working-with-bee/bee-tools), or for the super 1337,
share your implementations in other languages in the
[#develop-on-swarm](https://discord.gg/C6dgqpxZkU) channel of our
[Discord Server](https://discord.gg/wdghaQsGq5).
:::

### What are Feeds?

A feed is a collection of Single Owner Chunks with predicatable addresses. This enables creators to upload pointers to data so that consumers of the feed are able to find the data in Swarm using only an _Ethereum address_ and _Topic ID_.

### Creating and Updating a Feed

In order to edit a feed, you will need to sign your chunks using an
Ethereum keypair. For the intrepid, check out the <a
href="/the-book-of-swarm.pdf" target="_blank" rel="noopener
noreferrer">The Book of Swarm</a> on precise details on how to do
this. For the rest of us, both [bee-js](/docs/dapps-on-swarm/bee-js)
and [swarm-cli](/docs/working-with-bee/bee-tools) provide facilities
to achieve this using JavaScript and a node-js powered command line
tool respectively.

### No More ENS Transaction Charges

Swarm's feeds provide the ability to update your immutable content in a mutable world. Simply reference your feed's `manifest address` as the `content hash` in your ENS domain's resolver, and Bee will automatically provide the latest version of your website.

### Use Cases for Feeds

Feeds are a hugely versatile data structure.

#### Key Value Store

Use [bee-js](/docs/dapps-on-swarm/bee-js) to use feeds to store values as a simple key value store in your JavaScript application. No more need for servers and databases!

#### Store the History of a File

Use [swarm-cli](/docs/working-with-bee/bee-tools) to store a file at the same location, and update whenever you like without changing the address.
