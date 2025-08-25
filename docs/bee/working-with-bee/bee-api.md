---
title: Bee API
id: bee-api
---

The Bee HTTP API is the primary interface to a running Bee node. API-endpoints can be queried using familiar HTTP requests, and will respond with semantically accurate [HTTP status and error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) as well as data payloads in [JSON](https://www.json.org/json-en.html) format where appropriate.

The Bee API provides full access to all core functionalities of a Bee node, including uploading, downloading, staking, postage stamp batch purchasing and management, and node monitoring. By default, it runs on port `:1633`.

:::danger
Make sure that your api-addr (default 1633) is never exposed to the internet. If you do not have a firewall or other security measures in place, manually setting your Bee API address from the default `1633` to `127.0.0.1:1633` is strongly recommended to prevent unauthorized access.

You may also consider using the [Gateway Proxy tool](/docs/develop/tools-and-features/gateway-proxy) to protect your node's API endpoint.
:::

Detailed information about Bee API endpoints can be found in the [API reference docs](/api/).

## Interacting With the API

You can interact with the Bee API using standard HTTP requests, allowing you to programmatically access all of your Bee node's various functions such as [purchasing stamp batches](/docs/develop/access-the-swarm/buy-a-stamp-batch), [uploading and downloading](/docs/develop/access-the-swarm/upload-and-download), [staking](/docs/bee/working-with-bee/staking), and more.

### Alternatives for Working with the API

For developers, the [Bee JS library](/docs/develop/tools-and-features/bee-js) offers a more convenient way to interact with the API in a NodeJS environment.

For many other common use cases, you may prefer to make use of the [Swarm CLI](/docs/bee/working-with-bee/swarm-cli) tool, as it offers a convenient command line based interface for interacting with your node's API.

## Exploring Node Status

After installing and starting up your node, we can begin to understand the node's status by interacting with the API.

For example, to determine how many nodes your Bee node is currently connected to, run:

```bash
curl -s http://localhost:1633/peers | jq '.peers | length'
```

```
23
```

Great! We can see that we are currently connected with 23 other nodes!

:::info
Here we are using the `jq` command line utility to count the amount of objects in the `peers` array in the JSON response we have received from our API, learn more about how to install and use `jq` [here](https://stedolan.github.io/jq/).
:::

Let's review a handful of endpoints which will provide you with important information relevant to detecting and diagnosing problems with your nodes.

### _/status_

The `/status` endpoint returns a quick summary of some important metrics for your node.

```bash
  curl -s  http://localhost:1633/status | jq
```

```bash
{
  "overlay": "1e2054bec3e681aeb0b365a1f9a574a03782176bd3ec0bcf810ebcaf551e4070",
  "proximity": 256,
  "beeMode": "full",
  "reserveSize": 3215597,
  "reserveSizeWithinRadius": 3215806,
  "pullsyncRate": 1.5622222222222222,
  "storageRadius": 10,
  "connectedPeers": 89,
  "neighborhoodSize": 12,
  "batchCommitment": 11615207424,
  "isReachable": true,
  "lastSyncedBlock": 41786200,
  "committedDepth": 10,
  "isWarmingUp": false
}
```

- `"overlay"` - Your node's overlay address.
- `"proximity"` - The proximity order (PO), representing how closely related this node is to your own node in Swarm's Kademlia network.
- `"beeMode"` - The mode of your node, can be `"full"`, `"light"`, or `"ultraLight"`.
- `"reserveSize"` - The number of chunks your node is currently storing in its reserve. This value should be roughly similar across nodes in the network. It should be identical for nodes within the same neighborhood.
- `"reserveSizeWithinRadius"` - The number of chunks your node is currently storing which fall within its storage radius.
- `"pullsyncRate"` - The rate at which your node is currently syncing chunks from other nodes in the network.
- `"storageRadius"` - The storage radius (radius of responsibility ) is the proximity order of chunks for which your node is responsible for storing. It should generally match the radius shown on [Swarmscan](https://swarmscan.io/neighborhoods).
- `"connectedPeers"` - The number of peers your node is connected to.
- `"neighborhoodSize"` - The number of total neighbors in your neighborhood, not including your own node. The more nodes in your neighborhood, the lower your chance of winning rewards as a staking node.
- `"batchCommitment"` - The total number of chunks which would be stored on the Swarm network if 100% of all postage batches were fully utilised.
- `"isReachable"` - Whether or not your node is reachable on the p2p API by other nodes on the Swarm network (port 1634 by default).
- `"lastSyncedBlock"` - The last block number from the connected blockchain that your node has synced up to.
- `"committedDepth"` - The storage depth currently committed by your node, which defines how much of your reserve is actually being used to store chunks. Is equal to `"storageRadius"` plus the [doubling factor](/docs/bee/working-with-bee/staking/#reserve-doubling) specified in the `reserve-capacity-doubling` option (which is zero by default).
- `"isWarmingUp"` - Indicates whether your node is still in the warm-up phase (building up its reserve and syncing with the network) or has reached normal operation.

### _/status/peers_

The `/status/peers` endpoint returns information about all the peers of the node making the request. The type of the object returned is the same as that returned from the `/status` endpoint. This endpoint is useful for diagnosing syncing / availability issues with your node.

The list is sorted by Kademlia proximity, not geographical distance. Nodes with lower PO values are further away, while higher PO values indicate closer neighbors. The most distant nodes with PO (proximity order) of zero are at the top of the list and the closest nodes with higher POs at the bottom of the list. The nodes at the bottom of the list with a PO equal or greater than the storage depth make up the nodes in your own node's neighborhood. It's possible that not all nodes in your neighborhood will appear in this list each time you call the endpoint if the connection between your nodes and the rest of the nodes in the neighborhood is not stable.

Here are the last 12 entries:

```bash
 curl -s http://localhost:1633/status/peers | jq
```

```bash
 ...
  {
      "overlay": "1e1547d0d629469ff0d8fd2cbb6435df8fd913f2e948f177d733356d784b7ea4",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3217677,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 153,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e09531ee3d8031b130b1c7d530dac26f57d2b9cfd368a979ef227331deb2ae5",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3215934,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 166,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e1ad7975d88430b8ede359ca231e73aaffaeefe35d6f32e709ff37dc3028eaa",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3215364,
      "reserveSizeWithinRadius": 3215344,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 150,
      "neighborhoodSize": 12,
      "batchCommitment": 11614158848,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e30c8fe93339f8637a339b5d4d85ec42731a193be8987c6457f4ea72c93cfb7",
      "proximity": 11,
      "beeMode": "full",
      "reserveSize": 3218783,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 165,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e3c168d12e0f590640454c01e2825522ca60eb0a1c7dfaac9da2329e9d87300",
      "proximity": 11,
      "beeMode": "full",
      "reserveSize": 3215635,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 169,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e3f2e9b0f6d45aa1fd710e7fca4a7890d2cbde829cd2722674ab120544e3772",
      "proximity": 11,
      "beeMode": "full",
      "reserveSize": 3215645,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 163,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e288371f2e3c3325c1a3af5008d7c81fa4ab1d176e1c6bbb3f9ace4655dc05d",
      "proximity": 12,
      "beeMode": "full",
      "reserveSize": 3215644,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 165,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e2c2b11a118a0be240af19421a8a323610869247625fa28a7590d765a21c566",
      "proximity": 12,
      "beeMode": "full",
      "reserveSize": 3215633,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 172,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786370,
      "committedDepth": 10,
      "isWarmingUp": false
    },
    {
      "overlay": "1e20ef01ddab9112a9a26618d901c761f20d8bcb8328c143ab13e9846be9ad82",
      "proximity": 16,
      "beeMode": "full",
      "reserveSize": 3215652,
      "reserveSizeWithinRadius": 3215613,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 164,
      "neighborhoodSize": 12,
      "batchCommitment": 11615207424,
      "isReachable": true,
      "lastSyncedBlock": 41786375,
      "committedDepth": 10,
      "isWarmingUp": false
    }
  ]
}
```

And we can compare these entries to our own node's `/status` results for diagnostic purposes:

```bash
 curl -s http://localhost:1633/status | jq
```

```bash
{
  "overlay": "1e2054bec3e681aeb0b365a1f9a574a03782176bd3ec0bcf810ebcaf551e4070",
  "proximity": 256,
  "beeMode": "full",
  "reserveSize": 3215597,
  "reserveSizeWithinRadius": 3215806,
  "pullsyncRate": 1.5622222222222222,
  "storageRadius": 10,
  "connectedPeers": 89,
  "neighborhoodSize": 12,
  "batchCommitment": 11615207424,
  "isReachable": true,
  "lastSyncedBlock": 41786200,
  "committedDepth": 10,
  "isWarmingUp": false
}
```

From the results we can see that our node's neighborhood size and batch commitment are generally in line with other nodes in the same neighborhood. Any significant discrepancy may indicate a problem with your node.

### _/redistributionstate_

    This endpoint provides an overview of values related to storage fee redistribution game (in other words, staking rewards). You can use this endpoint to check whether or not your node is participating properly in the redistribution game.

    ```bash
    curl -s http://localhost:1633/redistributionstate | jq
    ```

    ```bash
    {
      "minimumGasFunds": "11080889201250000",
      "hasSufficientFunds": true,
      "isFrozen": false,
      "isFullySynced": true,
      "phase": "claim",
      "round": 212859,
      "lastWonRound": 207391,
      "lastPlayedRound": 210941,
      "lastFrozenRound": 210942,
      "lastSelectedRound": 212553,
      "lastSampleDuration": 491687776653,
      "block": 32354719,
      "reward": "1804537795127017472",
      "fees": "592679945236926714",
      "isHealthy": true
    }
    ```

    * `"minimumGasFunds"` - The minimum required xDAI denominated in wei (1 xDAI = 10^18 wei) required for a node to participate in the redistribution game.
    * `"hasSufficientFunds"` - Whether your node has at least the `"minimumGasFunds"` amount of xDAI.
    * `"isFrozen"` - Indicates if your node is frozen, which may occur for [several reasons](/docs/bee/working-with-bee/staking/#diagnosing-freezing-issues).
    * `"isFullySynced"` - Whether your node has fully synced all the chunks in its `"storageRadius"` (the value returned from the `/reservestate` endpoint.)
    * `"phase"` - The current phase of the redistribution game (this does not indicate whether or not your node is participating in the current phase).
    * `"round"` - The current number of the round of the redistribution game.
    * `"lastWonRound"` - The last round number in which your node won the redistribution game.
    * `"lastPlayedRound"` - The last round number in which your node participating in the redistribution game. If this number matches the number of the current round shown in `"round"`, then your node is participating in the current round.
    * `"lastFrozenRound"` - The last round in which your node was frozen.
    * `"lastSelectedRound"` - The last round in which your node's neighborhood was selected. Note that it is possible for your node's neighborhood to be selected without your node playing in the redistribution game. This may potentially indicate your node's hardware is not sufficient to calculate the commitment hash fast enough. See [section on the `/rchash` endpoint](#) for more information.
    * `"lastSampleDuration"` - The time it took for your node to calculate the sample commitment hash in nanoseconds.
    * `"block"` - current Gnosis block number
    * `"reward"` - The total all-time reward in PLUR earned by your node.
    * `"fees"` - The total amount in fees paid by your node denominated in xDAI wei.
    * `"isHealthy"` - a check of whether your node’s storage radius is the same as the most common radius from among its peer nodes

### _/reservestate_

    This endpoint shows key information about the reserve state of your node. You can use it to identify problems with your node related to its reserve (whether it is syncing chunks properly into its reserve for example).

    ```bash
        curl -s  http://localhost:1633/reservestate | jq
    ```
    ```bash
        {
          "radius": 15,
          "storageRadius": 10,
          "commitment": 134121783296
        }
    ```

    Let's take a look at each of these values:
    * `"radius"` - Represents the maximum storage radius assuming all postage stamp batches are fully utilized.
    * `"storageRadius"` - The radius of responsibility - the proximity order of chunks for which your node is responsible for storing. It should generally match the radius shown on [Swarmscan](https://swarmscan.io/neighborhoods).
    * `"commitment"` - The total number of chunks which would be stored on the Swarm network if 100% of all postage batches were fully utilised.

### _/chainstate_

    This endpoint relates to your node's interactions with the Swarm Smart contracts on the Gnosis Chain.

    ```bash
     curl -s http://localhost:1633/chainstate | jq

    {
      "chainTip": 41786513,
      "block": 41786505,
      "totalAmount": "293796491451",
      "currentPrice": "56774"
    }
    ```
    * `"chainTip"` - The latest Gnosis Chain block number. Should be as high as or almost as high as the block number shown at [GnosisScan](https://gnosisscan.io/).
    * `"block"` -  The latest block your node has fully synced from Gnosis Chain. If significantly behind `"chainTip"`, your node may still be catching up. Should be very close to `"chainTip"` if your node has already been operating for a while.
    * `"totalAmount"` - Cumulative value of all prices per chunk in PLUR for each block.
    * `"currentPrice"` - The price in PLUR to store a single chunk for each Gnosis Chain block.

### _/topology_

    This endpoint allows you to explore the topology of your node within the Kademlia network. The results are split into 32 bins from bin_0 to bin_32. Each bin represents the nodes in the same neighborhood as your node at each proximity order from PO 0 to PO 32.

    As the output of this file can be very large, we save it to the `topology.json` file for easier inspection:

    ```bash
     curl -s http://localhost:1633/topology | jq '.' > topology.json
    ```
    We open the file in vim for inspection:
    ```bash
    vim topology.json
    ```

    The `/topology` endpoint provides insights into how your node is positioned within the Swarm network. The response starts with global network statistics, followed by detailed bin-by-bin peer connections (for 32 bins). Lets first look at the global stats:

    ```json
      "baseAddr": "da7e5cc3ed9a46b6e7491d3bf738535d98112641380cbed2e9ddfe4cf4fc01c4",
      "population": 20514,
      "connected": 176,
      "timestamp": "2024-02-08T20:57:03.815537925Z",
      "nnLowWatermark": 3,
      "depth": 10,
      "reachability": "Public",
      "networkAvailability": "Available",
        ...
    ```

- `"baseAddr"` - Your node's overlay address.
- `"population"` - The total number of nodes your node has collected information about. This number should be around ####. If it is far higher or lower it likely indicates a problem.
- `"connected"` - The total number of nodes your node is currently connected to.
- `"timestamp"` - The time at which this topology snapshot was taken.
- `"nnLowWatermark"` - ???
- `"depth"` -
- `"reachability"`
- `"networkAvailability"`
  After the first section are 32 sections, one for each bin. At the front of each of these sections is a summary of information about the respective bin followed two list, one of disconnected peers and the other of connected peers. Let's take a look at bin_10 as an example:

```json
...
  "bin_10": {
      "population": 3, // The total number of peers in this bin including both connected and disconnected peers.
      "connected": 2, // Number of connected peers
      "disconnectedPeers": [ //List of all disconnected peers
        {
          "address": "3e06e4667260c761f1b6a8539a99621c1af1f945e97667376c13b5f84984bcbc",
          "metrics": {
            "lastSeenTimestamp": 1707426772,
            "sessionConnectionRetry": 2,
            "connectionTotalDuration": 104619,
            "sessionConnectionDuration": 72,
            "sessionConnectionDirection": "outbound",
            "latencyEWMA": 849,
            "reachability": "Public",
            "healthy": true
          }
        }
      ],
      "connectedPeers": [ // List of all connected peers
        {
          "address": "3e09deca28d24a4c6dab9350dd0fb27a2333f03120b9f92f0ac0fd245707c9e3",
          "metrics": {
            "lastSeenTimestamp": 1707426766,
            "sessionConnectionRetry": 2,
            "connectionTotalDuration": 105059,
            "sessionConnectionDuration": 33,
            "sessionConnectionDirection": "outbound",
            "latencyEWMA": 899,
            "reachability": "Public",
            "healthy": true
          }
        },
        {
          "address": "3e1cdf7b1072fcde264c75f70635b9c1e9c1623eab2de55a0380f17b07751955",
          "metrics": {
            "lastSeenTimestamp": 1707426741,
            "sessionConnectionRetry": 1,
            "connectionTotalDuration": 109216,
            "sessionConnectionDuration": 59,
            "sessionConnectionDirection": "outbound",
            "latencyEWMA": 948,
            "reachability": "Public",
            "healthy": true
          }
        }
      ]
    },
```

### _/node_

    This endpoint returns info about options related to your node type and also displays your current node type.

    ```bash
    curl -s http://localhost:1633/node | jq
    ```
    ```bash
    {
      "beeMode": "full",
      "chequebookEnabled": true,
      "swapEnabled": true
    }
    ```
    * `"beeMode"` - The mode of your node, can be `"full"`, `"light"`, or `"ultraLight"`.
    * `"chequebookEnabled"` - Whether or not your node's `chequebook-enable` option is set to `true`.
    * `"swapEnabled"` - Whether or not your node's `swap-enable` option is set to `true`.

    If your node is not operating in the correct mode, this can help you to diagnose whether you have set your options correctly.

### _/rchash_

Calling the `/rchash` endpoint triggers the generation of a reserve commitment hash, which is used in the [redistribution game](/docs/concepts/incentives/redistribution-game), and will report the amount of time it took to generate the hash. This is useful for getting a performance benchmark to ensure that your node's hardware is sufficient.

The `/rchash` endpoint has 3 parameters: `depth` and `anchor_01` and `anchor_02`. For both of the anchor parameters, you should use the first 4 digits from your node's overlay address (which you can find from the `/addresses` endpoint). For depth, you should use the current storage depth of your node which you can find using the `/status` endpoint (storage depth is equivalent to the `storageRadius` value returned from `/status`):

```
/rchash/{depth}/{anchor_01}/{anchor_02}
```

:::info anchor parameter details

- The anchor parameters must match the prefix bits of the node's overlay address up to at least the current storage depth (with each hex digit equal to 4 bits).
- The anchor parameters also must have an even number of digits.

Therefore you can use the first four digits of your node's overlay address since it will work for depths up to depth 16, which will not be approached unless the depth increases up to depth 17, which is not likely to happen in the near future. If it does increase to depth 17, then the first 6 overlay digits should be used.
:::

```bash
sudo curl -sX GET http://localhost:1633/rchash/10/1e20/1e20 | jq
```

It should not take much longer than 6 minutes at most for results to be returned:

```bash
{
  "hash": "a1d6e1700dff0c5259029c8a58904251855911eb298b45fab4b0c26d4de0fa5f",
  "proofs": {
    "proof1": {
      "proofSegments": [
        "00001099542c8958b2a3a0f7803ee0c07a34de91dd34d4567bf16b367686a387",
        "75b51d98c9346a9cb2120bd3a10c0febb43a1d900ff1e4247a29e46974cd4e02",
        "d3e289937aa2e2a49e27c9b525580002cbcab4e4d4a972a97ef8e272e0bafebb",
        "2215b68c492114e3b4f78080f924bf9cdb3b7da9d5f4e811631f50d2ac45af14",
        "c115c46c632fcefea88def9a241fb37acaf222bbbd74a4435d3cde48b6210436",
        "0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d",
        "887c22bd8750d34016ac3c66b5ff102dacdd73f6b014e710b51e8022af9a1968"
      ],
      "proveSegment": "1e09adea90a0935fdcd03b5b8193b95767f2f40308d4ea29323845de1270cdd7",
      "proofSegments2": [
        "74656e656666656b74000c4469676974616c20636f707900052e63616c6c000d",
        "b5d06699c843bc0cc39abd993553865a01c1366174e9e87539ac491dce0a3b77",
        "1513dd5a4a3633ecf370ef6f27af99b0f23d73d4773e504314bbf2c690887999",
        "a16bdb02905d76eb17965eca8a32f303f0a6129a125c30767a097f80a9e30ded",
        "ec01379e1a2ae10fd4e0ee4e4fc4b0d3f6f9ac55038ced386fc7f4294d4bb103",
        "456189653d7fdcd3f1ef6b27d00cb8700cd3abb59a1d60b08b61af1d77c74a13",
        "4f5384191e60b983ee26b2d42bdcce3fba7041f4cde80b78d808a893d2dc8e79"
      ],
      "proveSegment2": "436f6465706167652039353000054f72626f7400064d50432d4843000c536569",
      "chunkSpan": 4096,
      "proofSegments3": [
        "74656e656666656b74000c4469676974616c20636f707900052e63616c6c000d",
        "d99a7bf301af141ce9e1acb909c631975c2f7bc60984bbfb9d4097415d2ea723",
        "f77855426ebacca7833d31b559f8ef0f5909849e8604856ef7c2344e536252bd",
        "273b259e9fb51852d8bbfe409c648605f60fcdaec7fff4ec20120d6f5898f412",
        "7d0e379980bf75f76e9a128eb05fdfb8d9db7da40060eff06629ee48465b3a70",
        "1be5155660d125ee125cceaf3ea81313321b9ac36aefb6b7b3b35c4a4c0fd5b2",
        "8b1a6990327bfb0738025c57b6f06d7255e49b89a2d5f4bed1aed202816843ae"
      ],
      "postageProof": {
        "signature": "d13f85223e1fe47f3689e31471f322d61b10b25231db5319819c8f68548fdc907acf17a0341ba81114d1667693b1e6f35f37c50b4365474baa03f8b233566fa51b",
        "postageId": "9af1b37f38d4af75dbee9ba713b95bcc6d03e1c759ac774ec8bd4864e68d2c03",
        "index": "1e0900000e13",
        "timeStamp": "17ca57481e839b79"
      },
      "socProof": null
    },
    "proof2": {
      "proofSegments": [
        "0000336f98de7901000b056246b5b105611a56a9e45c452fe65288751f90de2e",
        "55f65e720d9d53fc7f6d73c87e9a7fd1ad73343b96bd4fc679fdb0d188fe872c",
        "7a753e4aa045cc1ce5834a669755bd43f6344ade1890f0080e5c50c23489f098",
        "4081e7d623e62c35a17a1167f7f295a26cbf7705a443ed06dfb8fcc416dfc2e4",
        "306564763d673ca314aaa072d79ac4b888b69aad80da3ca387aafd2752afce8e",
        "0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d",
        "887c22bd8750d34016ac3c66b5ff102dacdd73f6b014e710b51e8022af9a1968"
      ],
      "proveSegment": "1e1b2adb768e9d05021c514914292acc56a8273a4f2ea196f50add7c3e5bff45",
      "proofSegments2": [
        "cf19af651fdc9ae2aab3c240860b11156691c6561e0291633cc00aea719c3db5",
        "91afb2735a5f002134c31fbf4f1b0c2b99b47ea1d84da75a3d8da597e1d27034",
        "9b9e75f236b13ae250a9cf3ae59655054583166c6f6379871c5f2c9b1fdcdb1d",
        "4cad5229b21c2f1ca0e5dcf34e61253709dcef1d11e9346c9daf6d6a7a7d6ea2",
        "ca49b26daaaffb849045d55f25f3a05c942f8b5844c71a8fcc2172c1ba5e2f86",
        "3bbf39b295aa2a01a8b6de929d85cb3fc375bddeaf70ac0ad9ff17f64bca3892",
        "3a8343e42db633b929473ccbd90e36320cf0bb6a19474c8a3a01dbbc9ebc99ad"
      ],
      "proveSegment2": "4cb106406558d74c99ed246e22f73f55abd96f633c1e00025511b98930faafb4",
      "chunkSpan": 4096,
      "proofSegments3": [
        "cf19af651fdc9ae2aab3c240860b11156691c6561e0291633cc00aea719c3db5",
        "8d4665ad0c7ba6a24fe285613057e6289c3b341887fedba9a4190d236f62f31e",
        "5fdf57b41fb119b29275edcb55a00b7a0ea5119e1ad78dc97ea615236f9112cb",
        "32bc2d3b400b6837117f7720af512913d85388cafe365e06f96172531a59622f",
        "d393a441a2dcabfe6ae7a5da201badcd1da877f33092e1f823b816fa826879ac",
        "557d9f4ca3655f6bc06f4d13b87da1ddc5c2f7b6eb60b043a7a5a989bb4b2b5f",
        "f81cf8329547445e4427e91f8682ef05e482c7b8219adc34066bd9942aec6d05"
      ],
      "postageProof": {
        "signature": "efae95247cae78db875194de1851a6866456f9cb881079676289bd3b72f27af53d783441bc1992f5439e1815179afb05b1a12c7a86b36b41fd411fa29529f1981c",
        "postageId": "922b7387276adeea51df5aeb80f597a62c7c236b4387f7f06ced2883762f8fef",
        "index": "1e1b0000006a",
        "timeStamp": "17ad450de2b34084"
      },
      "socProof": null
    },
    "proofLast": {
      "proofSegments": [
        "00003dbfed587dc866be862e65ebf4da79b54397c6dee4cefa2754e8e0ad2f37",
        "0b6fa766b60f03b9efec530413243318f277adccdd974d316cf7b52b5f072681",
        "1629dad7244d3efcfb5bddcc794cbd42eb5d6e81ecd47711a7ef08ea9c80c405",
        "4081e7d623e62c35a17a1167f7f295a26cbf7705a443ed06dfb8fcc416dfc2e4",
        "306564763d673ca314aaa072d79ac4b888b69aad80da3ca387aafd2752afce8e",
        "0eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d",
        "887c22bd8750d34016ac3c66b5ff102dacdd73f6b014e710b51e8022af9a1968"
      ],
      "proveSegment": "1e2fbcf6d9a79786ce93970536eb4f18ec148cefd2f5e7e15a203f99ad2b1d0a",
      "proofSegments2": [
        "1a00fb8c44cf0f65d12d2aed8fcde9517684dd7afc6e3a488cc5a882a92e8cbf",
        "5936e75eea7818850651a3e50fab30826766f9777c9099b045c1e6454355111c",
        "0ed1fbde9703139dcf9aa8c008c64ac8a85fea8fcfb237986c4652844b49c318",
        "f1904237d00d889455695fe711b3f4c7a6e0c40b5e85ae66eefcbf34631b9802",
        "19a4dcef98735175b96c675fb1ffd5c59a2fa1a3515724d3d3c2849fa2b75672",
        "1449ca5c3b4a701dde9a4dd38f8db6216a5fe8c72e8701dd20263622b3375c77",
        "1160eaff3f42ad8c90f8d95fdee20daa5f1fece84947e265878be9db543c4651"
      ],
      "proveSegment2": "57b3f11f2fe2ba52d0897d936901db164d04fa5a9684009a17a39aa718b2b1c8",
      "chunkSpan": 4096,
      "proofSegments3": [
        "1a00fb8c44cf0f65d12d2aed8fcde9517684dd7afc6e3a488cc5a882a92e8cbf",
        "5f99524dc31e7bf8ca75011c74f739b30bcb855c3ad7e46701d30dc6901cb563",
        "0fc1e41481afc47ae70056c780149a50ab9c48630eb44607b9100dfda0ba9dfe",
        "e4d7e158b9a446e8f2bad51acf26fc1874013dc23352471ba945fbec0a97d910",
        "dddc32e1f2ac86aa4bb711bb6b812afa5d6ca9405d04816e2dcfefd303eb8294",
        "e5384c29f838e85b71bc2eb5cb14d59201e8e1997a9779d193a6a9b327637693",
        "6f08720c155d4a53fd94ed403fb4476a4c7e6058bf021df23efdfdca1746027d"
      ],
      "postageProof": {
        "signature": "8039da66b4b6e45d5559d0d060f968ccfa11b052234b5645d90d396a0069b6ff40aecb62e9c45d13a68dda0b1fd68dee1de575e28f72c3766d64e824e7c9f9211b",
        "postageId": "9af1b37f38d4af75dbee9ba713b95bcc6d03e1c759ac774ec8bd4864e68d2c03",
        "index": "1e2f000038a3",
        "timeStamp": "17dd336464f4f0bc"
      },
      "socProof": null
    }
  },
  "durationSeconds": 1191.652640831
}
```

If the `Time` value is much longer than 6 minutes then it likely means that the node's hardware performance is not sufficient. In the example above, it took almost 20 minutes to complete, indicating that the hardware is not sufficient. In such cases, consider upgrading to use faster memory or processor.

If while running the `/rchash` command there is an evictions related error such as the one below, try running the call to the `/rchash` endpoint again.

```
error: "level"="error" "logger"="node/storageincentives" "msg"="make sample" "error"="sampler: failed creating sample: sampler stopped due to ongoing evictions"
```

While evictions are a normal part of Bee's standard operation, the event of an eviction will interrupt the sampler process.

### _/health_

The `/health` endpoint provides a quick status check for your Bee node which simply indicates whether the node is operating or not. It is often used in tools like Docker and Kubernetes.

```bash
    curl -s http://localhost:1633/health | jq
```

```bash
    {
      "status": "ok",
      "version": "2.6.0-d0aa8b93",
      "apiVersion": "7.3.0"
    }
```

- `"status"` - "ok" if the server is responsive.
- `"version"` - The version of your Bee node. You can find latest version by checking the [Bee github repo](https://github.com/ethersphere/bee).
- `"apiVersion"`
