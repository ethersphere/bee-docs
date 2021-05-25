---
title: Debug API
id: debug-api
---

Now that you have created your Swarm wallet and your Bee node has begun to participate in the global swarm network, we can use the Debug API to take a closer look at what's happening with your node.

The [Debug API](/docs/api-reference/api-reference) provides a privileged environment where you are able to interact with your Bee node to get more information about the status of your node.

:::danger
Never expose your Debug API to the public internet, make sure to use a firewall or bind to *localhost*, as we have in the example below.
:::

To use the Debug API we must first configure Bee to enable it, as it is disabled by default.

```bash
bee start --debug-api-enable --debug-api-addr=localhost:1635
```

#### Checking Connectivity

First, let's check how many nodes we are currently connected to.

```bash
curl -s http://localhost:1635/peers | jq '.peers | length'
```

```
23
```

Great! We can see that we are currently connected and sharing data with 23 other nodes!

:::info
Here we are using the `jq` command line utility to count the amount of objects in the `peers` array in the JSON response we have received from our Debug API, learn more about how to install and use `jq` [here](https://stedolan.github.io/jq/).
:::

#### Inspect Network Topology

We can gain even more insight into how your Bee client is becoming a part of the global network your using the `topology` endpoint.

```bash
curl -X GET http://localhost:1635/topology | jq
```

In this example, our node is beginning to form a healthy network. We hope to see our node adding and
connecting to nodes in as many bins as possible. Learn more about promiximity order bins and how your
Bee node becomes part of the ordered p2p network in
<a href="/the-book-of-swarm-viktor-tron-v1.0-pre-release7.pdf" target="_blank" rel="noopener noreferrer">The Book of Swarm</a> .

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

Find out more about what you can do with the Debug API [here](/docs/api-reference/api-reference).
