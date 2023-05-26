---
title: Ultra Light Nodes
id: ultra-light-nodes
---

:::danger
When running without a blockchain connections, bandwidth incentive payments (SWAP) cannot be made so there is a risk of getting blocklisted by other peers for unpaid services.
:::

#### Configuration

In order to run an ultra-light node use the same configurations as for the [light node](/docs/bee/working-with-bee/light-nodes) but leave the `blockchain-rpc-endpoint` configuration param value to empty (or just comment it out).

:::caution
Make sure you set the `swap-enable` configuration parameter to `false`, otherwise you will get an error.
:::

#### Mode of Operation

The target audience for this mode of operations are users who want to try out running a node but don't
want to go through the hassle of blockchain onboarding. Ultra-light nodes will be able to download data as long as the data consumed does not exceed the payment threshold (`payment-threshold` in [configuration](/docs/working-with-bee/configuration)) set by peers they connect to.

Running Bee without a connected blockchain backend, however, imposes some limitations:

- Can't do overlay verification
- Can't do SWAP settlements

Since we can't buy postage stamps:

- Can't send PSS messages
- Can't upload data to the network

