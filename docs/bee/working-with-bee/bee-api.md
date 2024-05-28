---
title: Bee API
id: bee-api
---

The Bee HTTP API is the primary interfaces to a running Bee node. API-endpoints can be queried using familiar HTTP requests, and will respond with semantically accurate [HTTP status and error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) as well as data payloads in [JSON](https://www.json.org/json-en.html) format where appropriate.

The Bee API-endpoint exposes all functionality to upload and download content to and from the Swarm network. By default, it runs on port `:1633`.

Detailed information about Bee API endpoints can be found in the [API reference docs](/api/).

:::danger
Your API should not be exposed to the public Internet, make sure that your network has a firewall which blocks port `1633`. You may also consider using the [Gateway Proxy tool](/docs/develop/tools-and-features/gateway-proxy) to protect your node's API endpoint.
:::

## Exploring the API

After [installing](/docs/bee/installation/install) and starting up your node, we can begin to understand the node's status by interacting with the API.

First, let's check how many nodes we are currently connected to.

```bash
curl -s http://localhost:1633/peers | jq '.peers | length'
```

```
23
```

Great! We can see that we are currently connected and sharing data with 23 other nodes!

:::info
Here we are using the `jq` command line utility to count the amount of objects in the `peers` array in the JSON response we have received from our API, learn more about how to install and use `jq` [here](https://stedolan.github.io/jq/).
:::

#### Inspect Network Topology

We can gain even more insight into how your Bee is becoming a part of
the global network using the `topology` endpoint.

```bash
curl -X GET http://localhost:1633/topology | jq
```

In this example, our node is beginning to form a healthy network. We hope to see our node adding and
connecting to nodes in as many bins as possible. Learn more about proximity order bins and how your
Bee node becomes part of the ordered p2p network in [The Book of Swarm](https://www.ethswarm.org/the-book-of-swarm-2.pdf).

```json
{
  "baseAddr": "793cdae71d51b0ffc09fecd1c5b063560150cf2e1d55058bad4a659be5894ab1",
  "population": 159,
  "connected": 19,
  "timestamp": "2020-08-27T19:24:16.451187+01:00",
  "nnLowWatermark": 2,
  "depth": 4,
  "bins": {
    "bin_0": {
      "population": 77,
      "connected": 4,
      "...": "..."
    },
    "bin_1": {
    	"population": 37,
      	"connected": 4,
    	}
    }
  }
}
```

To learn more about how to use the API to better understand the state of your node and diagnose problems, see the [guide to status related endpoints](/docs/bee/working-with-bee/troubleshooting/#guide-to-status-related-endpoints) in the troubleshooting section.


## Debug API Removal Notice

:::info
The Debug API endpoints have been merged into the Bee API in the Bee version 2.1.0 release, and will be fully removed in the 2.2.0 release. The [Debug API reference docs](/debug-api/) are still available until the 2.2.0 release for your reference.
:::