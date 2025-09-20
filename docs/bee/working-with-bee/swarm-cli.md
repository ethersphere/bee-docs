---
title: Swarm CLI
id: swarm-cli
---

**Swarm‑CLI** is a command‑line tool powered by `bee-js` that makes it easy to interact with your Bee node directly from the command line. It’s friendlier than working with the raw Bee HTTP API and faster than writing a custom `bee-js` script when you just want to perform an action from the terminal.

:::tip
`swarm-cli` is the recommended method for interaction with your Bee node from the command line. Unless you have explicit need to use the Bee API directly, `swarm-cli` is generally the better option.
:::

Common uses:

* Check your node: `swarm-cli status`
* Add stake: 
* Upload files or a static site: `swarm-cli upload <path>` (will prompt to pick or create a postage batch)
* Download content: `swarm-cli download <reference> -o <output>`
* Inspect and manage postage batches: `swarm-cli ...` (use `--help` to see stamp-related commands)

**Why use it?**

* **No scaffolding needed** — run direct commands without creating a project
* **Interactive prompts** — it guides you through common tasks such as stamp purchasing and selection using interactive prompts 
* **Smart option inference** — it infers options based on your input (e.g., batch selection, index page, content type) so you don’t need deep Bee API knowledge
* **Powered by `bee-js`** — stays aligned with the latest Bee features

It also greatly simplifies certain more complex tasks, such as as the management of [feeds](/docs/develop/tools-and-features/feeds).  

For installation and usage instructions, [see the README](https://github.com/ethersphere/swarm-cli/blob/master/README.md).

To check the latest version, see the Swarm CLI [releases page](https://github.com/ethersphere/swarm-cli/releases).

For further support and information, [join the Swarm Discord server](https://discord.com/invite/GU22h2utj6).


