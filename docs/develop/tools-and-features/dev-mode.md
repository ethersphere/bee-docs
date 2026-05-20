---
title: bee-factory
id: bee-dev-mode
description: Documentation for bee-factory, the recommended local Swarm development stack for testing and prototyping Bee applications.
---

`bee-factory` is the recommended way to run a local Swarm development environment. It spins up 5 Bee nodes connected to a local Anvil blockchain — all wired together in a single command, with no real xBZZ required.

:::info
The `bee dev` command is no longer recommended. Please use `bee-factory` for local development instead.
:::

## Requirements

- Node.js ≥ 18
- Docker

## Installation

```sh
npm install -g @ethersphere/bee-factory
```

## Usage

```sh
bee-factory start               # Start the stack (uses bundled snapshot for fast boot)
bee-factory start --fresh       # Redeploy contracts from scratch, save new snapshot
bee-factory start --tag v2.7.1  # Build Bee from a specific git ref (default: master)

bee-factory stop                # Stop and remove all containers
```

The `--fresh` flag redeploys all contracts and saves a new snapshot; subsequent normal starts load from it instantly.

## Endpoints

Once running, the nodes are accessible at these addresses:

| Node     | API                     | P2P                     |
|----------|-------------------------|-------------------------|
| Queen    | http://localhost:1633   | http://localhost:1634   |
| Worker 1 | http://localhost:11633  | http://localhost:11634  |
| Worker 2 | http://localhost:21633  | http://localhost:21634  |
| Worker 3 | http://localhost:31633  | http://localhost:31634  |
| Worker 4 | http://localhost:41633  | http://localhost:41634  |

**Anvil RPC:** `http://localhost:8545` (chain ID 1337)

## Deployed contracts

The following contracts are deployed automatically on startup, with addresses printed to the console:

| Contract             | Role                      |
|----------------------|---------------------------|
| BzzToken             | ERC-20 BZZ token          |
| PostageStamp         | Postage stamp management  |
| PriceOracle          | Postage pricing           |
| StakeRegistry        | Node staking              |
| Redistribution       | Stake redistribution      |
| SimpleSwapFactory    | Swap contract factory     |
| SwapPriceOracle      | Swap pricing oracle       |

## Notes

- Each node is funded with 1 ETH and 100 BZZ.
- Node password: `bee-factory`
- Uses [Foundry test keys](https://www.getfoundry.sh/anvil#default-accounts) — never use in production.
