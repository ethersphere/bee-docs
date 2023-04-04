---
title: Ultra Light Nodes
id: ultra-light-nodes
---

:::danger
When running without a blockchain we can't do settlements thus risking getting blocklisted by other peers.
:::

#### Configuration

In order to run an ultra-light node use the same configurations as for the [light node](/docs/operate/working-with-bee/light-nodes) but leave the `blockchain-rpc-endpoint` configuration param value to empty (or just comment it out).

:::caution
Make sure you set the `swap-enable` configuration parameter to `false`, otherwise you will get an error.
:::

#### Mode of Operation

The target audience for this mode of operations are users who want to try out running a node but don't
want to go through the hassle of blockchain onboarding. The user will be able to download data as long as
the connected peers will allow this `freeriding`.

Running Bee without a connected blockchain backend, however, imposes some limitations:

- we can't do overlay verification
- we can't do settlements

Since we can't buy postage stamps - we can not:

- send pss messages
- upload data to the network

#### Switching On and Off

It is safe to switch between ultra light mode and other modes of operation.
