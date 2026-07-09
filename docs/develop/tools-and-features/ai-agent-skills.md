---
title: AI Agent Skills
id: ai-agent-skills
description: Interactive Claude Code skills that guide you through setting up Bee and building on Swarm.
---

[Swarm Quickstart Skills](https://github.com/ethersphere/swarm-quickstart-skills)
is a set of interactive guides ("skills") that run inside
[Claude Code](https://claude.com/product/claude-code). Instead of copying commands from
the docs by hand, the skills check your prerequisites first, run real commands
against your Bee node, and explain what is happening at each step. Type `/swarm`
and you are routed to the right next step for your current setup — installing a
node, buying a postage stamp, uploading files, or scaffolding a dApp.

## Requirements

- [Claude Code](https://claude.com/product/claude-code)
- Node.js 18+
- A running Bee light node at `http://localhost:1633` (for most skills)
  - The
  easiest way to install is to run `/swarm` in Claude Code, which installs and starts a
  light node for you. 
  - Alternatively, check out the
  [quick start](./../../bee/installation/quick-start.md)

## Install

Clone the repo and copy the `.claude/` folder into your project:

```bash
git clone https://github.com/ethersphere/swarm-quickstart-skills.git
cp -r swarm-quickstart-skills/.claude/ /path/to/your-project/
```

Then open Claude Code in your project and start with the entry point:

```bash
cd your-project && claude
```

Type `/swarm` to begin. See the
[swarm-quickstart-skills repository](https://github.com/ethersphere/swarm-quickstart-skills)
for the full list of available skills.

For a programmatic alternative aimed at agents, see the
[swarm-mcp](https://github.com/ethersphere/swarm-mcp) MCP server.
