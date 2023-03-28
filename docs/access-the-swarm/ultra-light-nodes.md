---
title: Ultra Light Nodes
id: ultra-light-nodes
---

:::danger
When running without a blockchain connections, bandwidth payments cannot be made so there is a risk of getting blocklisted by other peers for unpaid services.
:::

#### Configuration

To run Bee as an ultra-light node `full-node` and `swap-enable` must both be set to `false`, and the `blockchain-rpc-endpoint` value should be set to an empty string `""` or commented out in the [configuration](/docs/working-with-bee/configuration).

#### Mode of Operation

The target audience for this mode of operations are users who want to try out running a node but don't
want to go through the hassle of blockchain onboarding. Ultra-light nodes will be able to download data as long as the data consumed does not exceed the payment threshold (`payment-threshold` in [configuration](/docs/working-with-bee/configuration)) set by peers they connect to.

Running Bee without a connected blockchain backend, however, imposes some limitations:

- Can't do overlay verification
- Can't do SWAP settlements

Since we can't buy postage stamps:

- Can't send PSS messages
- Can't upload data to the network

