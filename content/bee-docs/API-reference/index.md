---
title: 'API and debug API'
date: 2018-11-28T15:14:39+10:00
weight: 6
summary: "Reference documentation for API and debug API. "
---

All interaction with a *running* Bee node happens via an HTTP API. Bee exposes two API endpoints: `API` and `debugAPI`, where the `API` endpoint by default runs on port `:8080` and the `debugAPI` on port `:6060`. The `API` endpoint is always open and cannot be disabled. The `debugAPI` is disabled by default, but can be opened by starting your node with the `--enable-debug-api` flag (see [CLI](/bee-docs/CLI.html))


The API endpoint exposes all endpoint for uploading and downloading files and chunks

Generated API reference documentation is published for your convenience:

- [API docs on web2](/bee-docs/API/index.html)
- [API docs on Swarm](https://gateway.ethswarm.org/files/703b0b22760556dc4a8526a100b09541f3e4bb1c517a1b21e67feb0dce8a294f)
- [debug API docs on web2](/bee-docs/debugAPI/index.html)
- [debug API docs on Swarm](https://gateway.ethswarm.org/files/df08ab860a6d0f0ee5597d4eee97ca8315c918112f78a265761ec45856333bbd)
