---
title: Gateway Proxy
id: gateway-proxy
---

The [Swarm Gateway](https://github.com/ethersphere/swarm-gateway) is the standard way to expose a Bee node over HTTP.

:::info
Another tool which is currently popular for running Bee in gateway mode is [Gateway Proxy](https://github.com/ethersphere/gateway-proxy). It offers several features not yet included in Swarm Gateway. However, since it is set for deprecation, unless you have a specific need, it is recommended to use Swarm Gateway instead.
:::

It acts as a reverse proxy that runs in front of a Bee node, allowing you to expose your node publicly. It proxies the Bee HTTP API and content endpoints, while optionally adding access control, postage batch auto-buy, and other optional features.

### Public Access to Swarm

A gateway can be used to run a public endpoint that allows users to:

* Access content stored on Swarm using standard HTTP URLs
* Browse websites hosted on Swarm
* Interact with Swarm through a familiar web interface

This makes Swarm content accessible to any web client, even if the user is not running a Bee node locally.

### Authentication, Access Control, and Policy

The Swarm Gateway also acts as an access control and content moderation layer in front of a Bee node.

Rather than exposing a Bee node directly to the public internet, the gateway allows operators to place a managed HTTP interface in front of it. Through this interface, the gateway can:

* Expose a Bee node through a single public HTTP endpoint
* Restrict or control uploads and other sensitive operations
* Require authentication for selected endpoints or request types
* Apply basic access control and usage policies before requests reach the Bee node

This makes it possible to run public, private, or semi-public gateways while retaining control over how the underlying Bee node is used.

For production deployments, the gateway is typically run behind an HTTPS-terminating reverse proxy to ensure encrypted connections.

### Stamp Management

The Swarm Gateway can optionally manage postage stamps on behalf of the operator, including:

* Automatically buying new batches
* Monitoring batch usage and expiration
* Keeping batches alive based on specified TTL

This is especially useful for gateways that accept uploads from users or applications.


## Setting up a Gateway

For a step by step guide on setting up a gateway yourself, refer to the guide in the Develop on Swarm section.