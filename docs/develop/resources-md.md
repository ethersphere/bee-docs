---
title: Developer Resources
id: resources
sidebar_label: Developer Resources
hide_table_of_contents: false
description: A curated list of Swarm developer resources — docs, SDKs, example projects, gateways, network tools, and community links.
---

## Learn

### Get Started

- [What is Swarm](/docs/concepts/what-is-swarm) — Introduction to the decentralised storage network
- [Developer introduction](/docs/develop/introduction) — Overview of building on Swarm
- [Bee node quickstart](/docs/bee/installation/quick-start) — Get a node running in minutes
- [Full installation guide](/docs/bee/installation/getting-started) — Step-by-step setup for all platforms
- [Swarm papers ↗](https://papers.ethswarm.org) — Technical whitepapers and research
- [The Book of Swarm ↗](https://docs.ethswarm.org/the-book-of-swarm.pdf) — Full technical book on Swarm's architecture and design
- [Swarm Protocol Specification ↗](https://papers.ethswarm.org/p/swarm-protocol-spec/) — Formal spec for developers building clients or integrations

### Key Concepts

- [DISC](/docs/concepts/DISC/) — How data is stored and retrieved across the network
- [Incentives & BZZ](/docs/concepts/incentives/overview) — Economic model and token mechanics
- [Postage stamps](/docs/develop/tools-and-features/buy-a-stamp-batch) — Pay for storage with stamp batches
- [Feeds](/docs/develop/tools-and-features/feeds) — Mutable content pointers for updatable data
- [Manifests](/docs/develop/tools-and-features/manifests) — Directory and routing structure on Swarm
- [Chunk types](/docs/develop/tools-and-features/chunk-types) — Content-addressed and single-owner chunks
- [Node types](/docs/bee/working-with-bee/node-types) — Full, light, and ultra-light participation levels

### Developer Guides

- [Upload and download files](/docs/develop/upload-and-download) — Basic file operations via the API
- [Host a website on Swarm](/docs/develop/host-your-website) — Deploy static sites to decentralised storage
- [Work with files and directories](/docs/develop/files) — Manifest operations for virtual paths
- [Routing manifests for SPAs](/docs/develop/routing) — Single-page app routing on Swarm
- [Dynamic content with feeds](/docs/develop/dynamic-content) — Build updatable content with feed primitives
- [Multi-author blog](/docs/develop/multi-author-blog) — Combine per-author feeds with a shared index
- [Access control (ACT)](/docs/develop/act) — Restrict who can read your uploaded content
- [PSS messaging](/docs/develop/tools-and-features/pss) — Send encrypted messages over the network
- [GSOC messaging](/docs/develop/tools-and-features/gsoc) — Graffiti single-owner chunk messaging
- [Encrypt uploads](/docs/develop/tools-and-features/store-with-encryption) — Client-side encryption before uploading
- [Erasure coding](/docs/develop/tools-and-features/erasure-coding) — Redundant storage for fault tolerance
- [Pinning content](/docs/develop/tools-and-features/pinning) — Keep content locally pinned to your node
- [Run a local gateway proxy](/docs/develop/tools-and-features/gateway-proxy) — Serve Swarm content over HTTP
- [Start a private test network](/docs/develop/tools-and-features/starting-a-test-network) — Local multi-node dev environment
- [bee-factory](/docs/develop/tools-and-features/bee-dev-mode) — Local Swarm dev stack, no real funds needed

## Examples

### Publishing & Websites

- [Cafe137/etherjot ↗](https://github.com/Cafe137/etherjot) — Static blog generator, live at etherjot.eth.limo
- [ethersphere/examples ↗](https://github.com/ethersphere/examples) — Collection of example apps and starters
- [examples/simple-blog ↗](https://github.com/ethersphere/examples/tree/main/simple-blog) — Minimal feed-backed blog, one publisher, updatable content
- [examples/multi-author-blog ↗](https://github.com/ethersphere/examples/tree/main/multi-author-blog) — Multi-author blog using per-author feeds and a shared index
- [examples/website ↗](https://github.com/ethersphere/examples/tree/main/website) — Upload a static website to Swarm, publish it to a feed for a stable URL, and resolve it via ENS
- [examples/routing-manifest ↗](https://github.com/ethersphere/examples/tree/main/routing-manifest) — Manifest-based routing demo for single-page apps

### Streaming

- [Solar-Punk-Ltd/swarm-stream-js ↗](https://github.com/Solar-Punk-Ltd/swarm-stream-js) — Core streaming library for Swarm
- [Solar-Punk-Ltd/swarm-hls-stream ↗](https://github.com/Solar-Punk-Ltd/swarm-hls-stream) — HLS streaming over Swarm
- [Solar-Punk-Ltd/swarm-stream-aggregator-js ↗](https://github.com/Solar-Punk-Ltd/swarm-stream-aggregator-js) — Stream aggregation layer
- [Solar-Punk-Ltd/swarm-stream-react-example ↗](https://github.com/Solar-Punk-Ltd/swarm-stream-react-example) — React media player consuming Swarm streams
- [Solar-Punk-Ltd/swarm-ingestion-stream-react-example ↗](https://github.com/Solar-Punk-Ltd/swarm-ingestion-stream-react-example) — React app for live stream ingest to Swarm

### Messaging & Chat

- [Solar-Punk-Ltd/swarm-chat-js ↗](https://github.com/Solar-Punk-Ltd/swarm-chat-js) — Core chat library for Swarm
- [Solar-Punk-Ltd/swarm-chat-aggregator-js ↗](https://github.com/Solar-Punk-Ltd/swarm-chat-aggregator-js) — Chat message aggregation layer
- [Solar-Punk-Ltd/swarm-chat-react-example ↗](https://github.com/Solar-Punk-Ltd/swarm-chat-react-example) — React chat application on Swarm
- [Solar-Punk-Ltd/swarm-comment-js ↗](https://github.com/Solar-Punk-Ltd/swarm-comment-js) — Core comments library
- [Solar-Punk-Ltd/swarm-comment-react-example ↗](https://github.com/Solar-Punk-Ltd/swarm-comment-react-example) — React comments component
- [Solar-Punk-Ltd/comment-system ↗](https://github.com/Solar-Punk-Ltd/comment-system) — Deployable comment system on Swarm
- [Solar-Punk-Ltd/comment-system-ui ↗](https://github.com/Solar-Punk-Ltd/comment-system-ui) — UI for the Swarm comment system
- [Solar-Punk-Ltd/swarm-collaborative-docs ↗](https://github.com/Solar-Punk-Ltd/swarm-collaborative-docs) — Real-time collaborative document editing on Swarm
- [Cafe137/gsoc-group-chat ↗](https://github.com/Cafe137/gsoc-group-chat) — Group chat using GSOC (Graffiti Single Owner Chunks)

## Tools

### SDKs & APIs

- [bee-js ↗](https://bee-js.ethswarm.org/docs/) — Official JavaScript / TypeScript SDK
- [bee-js getting started ↗](https://bee-js.ethswarm.org/docs/getting-started/) — Quickstart for bee-js integration
- [Bee HTTP API reference ↗](https://docs.ethswarm.org/api/) — Full REST API documentation
- [swarm-cli](/docs/bee/working-with-bee/swarm-cli/) — Command-line interface for uploads, feeds, and more
- [swarm-mcp ↗](https://github.com/ethersphere/swarm-mcp) — MCP server for AI agents to read and write Swarm
- [Swarm Actions ↗](https://github.com/ethersphere/swarm-actions) — Deploy to Swarm from GitHub CI/CD workflows
- [Swarm Quickstart Skills ↗](https://github.com/ethersphere/swarm-quickstart-skills) — Interactive Claude Code skills for guided Swarm onboarding

### Libraries & Primitives

- [Solar-Punk-Ltd/file-manager-lib ↗](https://github.com/Solar-Punk-Ltd/file-manager-lib) — High-level file management primitives for Swarm
- [Cafe137/feed-helper ↗](https://github.com/Cafe137/feed-helper) — Utility library for working with Swarm feeds
- [fairDataSociety/fdp-storage ↗](https://github.com/fairDataSociety/fdp-storage) — Serverless web3 filesystem, Fair Data Protocol reference implementation

### Developer Tools

- [ethersphere/create-swarm-app ↗](https://github.com/ethersphere/create-swarm-app) — Boilerplate for building Swarm apps with JavaScript
- [Cafe137/fdp-play ↗](https://github.com/Cafe137/fdp-play) — Docker-based local Bee cluster and FDP dev environment
- [Cafe137/pss-gsoc-learning-material ↗](https://github.com/Cafe137/pss-gsoc-learning-material) — Learning material for PSS and GSOC primitives
- [examples/dynamic-content ↗](https://github.com/ethersphere/examples/tree/main/dynamic-content) — Content addressing and feeds, introduction example
- [examples/filesystem ↗](https://github.com/ethersphere/examples/tree/main/filesystem) — Filesystem-style operations using bee-js
- [agazso/swarm-cid-converter ↗](https://github.com/agazso/swarm-cid-converter) — Convert Swarm hashes or links to CID and vice versa
- [Solar-Punk-Ltd/ipfs-to-swarm ↗](https://github.com/Solar-Punk-Ltd/ipfs-to-swarm) — Migrate data from IPFS to Swarm

### Gateways & Deploy

- [Beeport ↗](https://beeport.ethswarm.org) — Upload without running a node
- Public content gateway — Access any content by hash (`https://<hash>.bzz.link`)
- ENS gateway — Resolve ENS names to Swarm content (`https://<name>.eth.limo`)
- [ENS name management ↗](https://app.ens.domains) — Register and manage ENS names
- [ethersphere/gateway-proxy ↗](https://github.com/ethersphere/gateway-proxy) — Production gateway proxy server
- [ethersphere/swarm-gateway ↗](https://github.com/ethersphere/swarm-gateway) — Official Swarm HTTP content gateway
- [Swarmy ↗](https://swarmy.cloud) — Swarm as a service, upload and retrieve without running a node

### Network Tools

- [SwarmScan ↗](https://swarmscan.io/) — Network explorer and node statistics
- [Swarm Gateway ↗](https://gateway.ethswarm.org/) — Share files via URL
- [Swarm Desktop ↗](https://ethswarm.org/build/desktop) — GUI node for non-technical users
- [Bee Dashboard ↗](https://github.com/ethersphere/bee-dashboard) — Web UI for node management

## Community

### Community & Support

- [Discord ↗](https://discord.ethswarm.org) — Community chat and support
- [GitHub — Ethersphere org ↗](https://github.com/ethersphere) — All official repositories
- [Awesome Swarm ↗](https://github.com/ethersphere/awesome-swarm) — Curated ecosystem list
- [Blog ↗](https://blog.ethswarm.org) — News, updates, and deep dives
- [Website ↗](https://ethswarm.org) — Main Swarm website
- [FAQ](/docs/references/faq/) — Frequently asked questions
- [SWIPs ↗](https://github.com/ethersphere/SWIPs) — Swarm Improvement Proposals, follow or contribute to protocol direction
