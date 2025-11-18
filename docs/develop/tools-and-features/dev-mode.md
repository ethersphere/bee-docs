---
title: Developer mode
id: bee-dev-mode
---

:::warning
Bee developer mode is deprecated and set to be removed. Consider using [fdp-play](github.com/fairDataSociety/fdp-play) as an alternative or [Beekeeper](https://github.com/ethersphere/beekeeper) for more complex use cases.
::: 

You can start the bee in `dev` mode by running the command:

```bash
bee dev
```

It will start an instance with volatile persistence all back-ends mocked.

As a developer you interact with all the usual HTTP endpoints, for instance you can buy postage stamps and use them to upload files, which will be saved to memory.

## Configuration options

It accepts the same configuration options as a normal bee but it will ignore the ones that are not relevant (accounting, networking, blockchain etc).
