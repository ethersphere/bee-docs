---
title: Troubleshooting
id: troubleshooting
---


## Common Issues (*Under construction*)

In this section we cover commonly seen problems encountered during the operation of a Bee node, and give an overview of suggested solutions.

### Node occupies unusually large space on disk

During normal operation of a Bee node, it should not take up more than ~30 GB of disk space. In the rare cases when the node's occupied disk space grows larger, you may need to use the compaction `db compact` command.

:::danger
To prevent any data loss, operators should run the compaction on a copy of the localstore directory and, if successful, replace the original localstore with the compacted copy. 
:::

The command is available as a sub-command under db as such (make sure to replace the value for `--data-dir` with the correct path to your bee node's data folder if it differs from the path shown in the example):


```bash
bee db compact --data-dir=/home/bee/.bee
```
### Node not participating in redistribution

First check that the node is fully synced, is not frozen, and has sufficient funds to participate in staking. To check node sync status, call the `redistributionstate` endpoint:

```
curl -X GET http://localhost:1633/redistributionstate | jq
```
Response:

```json
{ 
  "minimumFunds": "18750000000000000",
  "hasSufficientFunds": true,
  "isFrozen": false,
  "isFullySynced": true,
  "phase": "commit",
  "round": 176319,
  "lastWonRound": 176024,
  "lastPlayedRound": 176182,
  "lastFrozenRound": 0,
  "block": 26800488,
  "reward": "10479124611072000",
  "fees": "30166618102500000"
}
```
Confirm that `hasSufficientFunds` is `true`, and `isFullySynced` is `true` before moving to the next step. If `hasSufficientFunds` if `false`, make sure to add at least the amount of xDAI shown in `minimumFunds` (unit of 1e-18 xDAI). If the node was recently installed and `isFullySynced` is `false`, wait for the node to fully sync before continuing. After confirming the node's status, continue to the next step.


#### Run sampler process to benchmark performance

One of the most common issues affecting staking is the `sampler` process failing. The sampler is a resource intensive process which is run by nodes which are selected to take part in redistribution. The process may fail or time out if the node's hardware specifications aren't high enough. To check a node's performance the `/rchash/{depth}/{anchor_01}/{anchor_02}` endpoint of the API may be used. The `anchor_01` and `anchor_02` must be a hex string with an even number of digits. For simplicity, you can just use `aaaa` for both anchors as we do in the example further down. 

The `{anchor}` value can be set to any random hexadecimal string, while `{depth}` should be set to the current depth.

To get the current depth, call the `/reservestate` endpoint

```bash
sudo curl -sX GET http://localhost:1633/reservestate | jq
```
Copy the `storageRadius` value from the output (this represents the ACTUAL depth for your node, in other words, the depth to which your node is responsible for storing files. The `radius` value is the hypothetical depth your node would be at if every postage batch was fully utilised.)

```bash
{
  "radius": 15,
  "storageRadius": 10,
  "commitment": 128332464128
}
```

Call the endpoint like so:

```bash
sudo curl -sX GET http://localhost:1633/rchash/10/aaaa/aaaa | jq
```

If the sampler runs successfully, you should see output like this:

```bash
{
  "Sample": {
    "Items": [
      "000003dac2b2f75842e410474dfa4c1e6e0b9970d81b57b33564c5620667ba96",
      "00000baace30916f7445dbcc44d9b55cb699925acfbe157e4498c63bde834f40",
      "0000126f48fb1e99e471efc683565e4b245703c922b9956f89cbe09e1238e983",
      "000012db04a281b7cc0e6436a49bdc5b06ff85396fcb327330ca307e409d2a04",
      "000014f365b1a381dda85bbeabdd3040fb1395ca9e222e72a597f4cc76ecf6c2",
      "00001869a9216b3da6814a877fdbc31f156fc2e983b52bc68ffc6d3f3cc79af0",
      "0000198c0456230b555d5261091cf9206e75b4ad738495a60640b425ecdf408f",
      "00001a523bd1b688472c6ea5a3c87c697db64d54744829372ac808de8ec1d427"
    ],
    "Hash": "7f7d93c6235855fedc34e32c6b67253e27910ca4e3b8f2d942efcd758a6d8829"
  },
  "Time": "2m54.087909745s"
}
```

If the `Time` value is higher than 6 minutes, then the hardware specifications for the node may need to be upgraded. 

If there is an evictions related error such as the one below, try running the call to the `/rchash/` endpoint again.

```
error: "level"="error" "logger"="node/storageincentives" "msg"="make sample" "error"="sampler: failed creating sample: sampler stopped due to ongoing evictions"
```

While evictions are a normal part of Bee's standard operation, the event of an eviction will interrupt the sampler process.

If you are still experiencing problems, you can find more help in the [node-operators](https://discord.gg/kHRyMNpw7t) Discord channel (for your safety, do not accept advice from anyone sending a private message on Discord). 


## Guide to Status Related Endpoints

Your main tool for better understanding your node is the Bee API. The API has a handful of endpoints which will provide you with information relevant to detecting and diagnosing problems with your nodes.

### `/status`

    The `/status` endpoint will give you a bit more of a detailed view of the health of your node. It's a quick summary of some vital values for your node.
    ```bash
     curl -s  http://localhost:1633/status | jq
    
    ```
    * `"peer"` - Your node's overlay address.
    * `"proximity"`
    * `"beeMode"` - The mode of your node, can be `"full"`, `"light"`, or `"ultraLight"`.
    * `"reserveSize"` - The number of chunks your node is currently storing in its reserve. This value should be roughly similar across nodes in the network. It should be identical for nodes within the same neighborhood.
    * `"pullsyncRate"` - The rate at which your node is currently syncing chunks from other nodes in the network as measured in....
    * `"storageRadius"` - The radius of responsibility - the proximity order of chunks for which your node is responsible for storing. It should generally match the radius shown on [Swarmscan](https://swarmscan.io/neighborhoods.
    *  `"connectedPeers"` - The number of peers your node is connected to. A typical value is in the range of....
    *   `"neighborhoodSize"` - The number of total neighbors in your neighborhood, not including your own node. The more nodes in your neighborhood, the lower your chance of winning rewards as a staking node. 
    *    `"batchCommitment"` - The total number of chunks which would be stored on the Swarm network if 100% of all postage batches were fully utilised.
    *    `"isReachable"` - Whether or not your node is reachable on the p2p API by other nodes on the Swarm network (port 1634 by default).

### `/status/peers`

The `/status/peers` endpoint returns information about all the peers of the node making the request. The type of the object returned is the same as that returned from the `/status` endpoint. This endpoint is useful for diagnosing syncing / availability issues with your node. 

The nodes are ordered by distance (Kademlia distance, not spatial / geographic distance) to your node, with the most distant nodes with PO (proximity order) of zero at the top of the list and the closest nodes with higher POs at the bottom of the list. The nodes at the bottom of the list with a PO equal or greater than the storage depth make up the nodes in your own node's neighborhood. It's possible that not all nodes in your neighborhood will appear in this list each time you call the endpoint if the connection between your nodes and the rest of the nodes in the neighborhood is not stable. 

Here are the last 12 entries:

```bash
 curl -s http://localhost:1633/status/peers | jq
```

```bash
 ...
 {
      "peer": "da33f7a504a74094242d3e542475b49847d1d0f375e0c86bac1c9d7f0937acc0",
      "proximity": 9,
      "beeMode": "full",
      "reserveSize": 3782924,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 188,
      "neighborhoodSize": 11,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da4b529cc1aedc62e31849cf7f8ab8c1866d9d86038b857d6cf2f590604387fe",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3719593,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 176,
      "neighborhoodSize": 11,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da5d39a5508fadf66c8665d5e51617f0e9e5fd501e429c38471b861f104c1504",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3777241,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 198,
      "neighborhoodSize": 12,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da4cb0d125bba638def55c0061b00d7c01ed4033fa193d6e53a67183c5488d73",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3849125,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 181,
      "neighborhoodSize": 13,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da4b1cd5d15e061fdd474003b5602ab1cff939b4b9e30d60f8ff693141ede810",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3778452,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 183,
      "neighborhoodSize": 12,
      "batchCommitment": 133827002368,
      "isReachable": true
    },
    {
      "peer": "da49e6c6174e3410edad2e0f05d704bbc33e9996bc0ead310d55372677316593",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3779560,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 185,
      "neighborhoodSize": 12,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da4cdab480f323d5791d3ab8d22d99147f110841e44a8991a169f0ab1f47d8e5",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3778518,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 189,
      "neighborhoodSize": 11,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da4ccec79bc34b502c802415b0008c4cee161faf3cee0f572bb019b117c89b2f",
      "proximity": 10,
      "beeMode": "full",
      "reserveSize": 3779003,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 179,
      "neighborhoodSize": 10,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da69d412b79358f84b7928d2f6b7ccdaf165a21313608e16edd317a5355ba250",
      "proximity": 11,
      "beeMode": "full",
      "reserveSize": 3712586,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 189,
      "neighborhoodSize": 12,
      "batchCommitment": 133827002368,
      "isReachable": true
    },
    {
      "peer": "da61967b1bd614a69e5e83f73cc98a63a70ebe20454ca9aafea6b57493e00a34",
      "proximity": 11,
      "beeMode": "full",
      "reserveSize": 3780190,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 182,
      "neighborhoodSize": 13,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da7b6a268637cfd6799a9923129347fc3d564496ea79aea119e89c09c5d9efed",
      "proximity": 13,
      "beeMode": "full",
      "reserveSize": 3721494,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 188,
      "neighborhoodSize": 14,
      "batchCommitment": 133828050944,
      "isReachable": true
    },
    {
      "peer": "da7a974149543df1b459831286b42b302f22393a20e9b3dd9a7bb5a7aa5af263",
      "proximity": 13,
      "beeMode": "full",
      "reserveSize": 3852986,
      "pullsyncRate": 0,
      "storageRadius": 10,
      "connectedPeers": 186,
      "neighborhoodSize": 12,
      "batchCommitment": 133828050944,
      "isReachable": true
    }
  ]
}
```

The first entry has a proximity of 9, meaning that it is below the `storageRadius` (depth) of 10 and so does not fall into our node's neighborhood. All the other nodes further down the list have a proximity of 10 or greater with our node, meaning they fall into our node's neighborhood.

You may notice that there is some variation in `neighborhoodSize`, however they are all close to the same value. This could be due to temporary connection problems between nodes in the neighborhood, but is not considered a problem unless the neighborhood size is much lower than its peers or at zero. As long as each node is connected to most of the other nodes in its neighborhood, each node in the neighborhood will be able to sync the required chunks to its reserve.

And we can compare these entries to our own node's `/status` results for diagnostic purposes:

```bash
 curl -s http://localhost:1633/status | jq
``` 
 
```bash 
{
  "peer": "da7e5cc3ed9a46b6e7491d3bf738535d98112641380cbed2e9ddfe4cf4fc01c4",
  "proximity": 0,
  "beeMode": "full",
  "reserveSize": 3747532,
  "pullsyncRate": 0,
  "storageRadius": 10,
  "connectedPeers": 183,
  "neighborhoodSize": 12,
  "batchCommitment": 133828050944,
  "isReachable": true
}
```

From the results we can see that we have a healthy neighborhood size when compared with the other nodes in our neighborhood and also has the same `batchCommitment` value as it should.


### `/redistributionstate`
    This endpoint provides an overview of values related to storage fee redistribution game (in other words, staking rewards). You can use this endpoint to check whether or not your node is participating properly in the redistribution game. 
    ```bash
    curl -s http://localhost:1633/redistributionstate | jq
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
    * `"isFrozen"` - Whether your node is currently frozen. See [docs](#) for more information on freezing. 
    * `"isFullySynced"` - Whether your node has fully synced all the chunks in its `"storageRadius"` (the value returned from the `/reservestate` endpoint.)
    * `"phase"` - The current phase of the redistribution game (this does not indicate whether or not your node is participating in the current phase). 
    * `"round"` - The current number of the round of the redistribution game.
    * `"lastWonRound"` - The last round number in which your node won the redistribtuion game. 
    * `"lastPlayedRound"` - The last round number in which your node participating in the redistribution game. If this number matches the number of the current round shown in `"round"`, then your node is participating in the current round.
    * `"lastFrozenRound"` - The last round in which your node was frozen.
    * `"lastSelectedRound"` - The last round in which your node's neighborhood was selected. Note that it is possible for your node's neighborhood to be selected without your node playing in the redistribution game. This may potentially indicate your node's hardware is not sufficient to calculate the commitment hash fast enough. See [section on the `/rchash` endpoint](#) for more information.
    * `"lastSampleDuration"` - The time it took for your node to calculate the sample commitment hash in nanoseconds. 
    * `"block"` - current Gnosis block number
    * `"reward"` - The total all-time reward in PLUR earned by your node.
    * `"fees"` - The total amount in fees paid by your node denominated in xDAI wei.
    * `"isHealthy"` - a check of whether your node’s storage radius is the same as the most common radius from among its peer nodes

### `/reservestate`
    This endpoint shows key information about the reserve state of your node. You can use it to identify problems with your node related to its reserve (whether it is syncing chunks properly into its reserve for example).

    ```bash
        curl -s  http://localhost:1633/reservestate | jq

        {
          "radius": 15,
          "storageRadius": 10,
          "commitment": 134121783296
        }
    ```
    
    Let's take a look at each of these values:
    * `"radius"` - is what the storage radius would be if every available batch was 100% utilised, it is essentially the radius needed for the network to handle all of the batches at 100% utilisation. Radius is measured as a proximity order (PO).
    * `"storageRadius"` - The radius of responsibility - the proximity order of chunks for which your node is responsible for storing. It should generally match the radius shown on [Swarmscan](https://swarmscan.io/neighborhoods.
    * `"commitment"` - The total number of chunks which would be stored on the Swarm network if 100% of all postage batches were fully utilised.
    
### `/chainstate`

    This endpoint relates to your node's interactions with the Swarm Smart contracts on the Gnosis Chain.
    
	```bash
     curl -s http://localhost:1633/chainstate | jq

    {
      "chainTip": 32354482,
      "block": 32354475,
      "totalAmount": "25422512270",
      "currentPrice": "24000"
    }
    ```
    * `"chainTip"` - The latest Gnosis Chain block number. Should be as high as or almost as high as the block number shown at [GnosisScan](https://gnosisscan.io/).
    * `"block"` - The block to which your node has synced data from Gnosis Chain. This may be far behind the `"chainTip"` when you first start up your node as it takes some time to sync all the data from the blockchain (especially if you are not using the `snapshot` option). Should be very close to `"chainTip"` if your node has already been operating for a while.
    * `"totalAmount"` - Cumulative value of all prices per chunk in PLUR for each block.
    * `"currentPrice"` - The price in PLUR to store a single chunk for each Gnosis Chain block.

### `/topology`
    This endpoint allows you to explore the topology of your node within the Kademlia network. The results are split into 32 bins from bin_0 to bin_32. Each bin represents the nodes in the same neighborhood as your node at each proximity order from PO 0 to PO 32. 
    
    As the output of this file can be very large, we save it to the `topology.json` file for easier inspection:
    
    ```bash
     curl -s http://localhost:1633/topology | jq '.' > topology.json
    ```
    We open the file in vim for inspection:
    ```bash
    vim topology.json
    ```
    
    The `/topology` results begin with several values describing the entire topology and are followed by the details for each of the 32 bins. Lets first look at the values describing the total topology:
    
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
    
  * `"baseAddr"` - Your node's overlay address.
  *  `"population"` - The total number of nodes your node has collected information about. This number should be around ####. If it is far higher or lower it likely indicates a problem.
  *  `"connected"` - The total number of nodes your node is currently connected to.
  *  `"timestamp"` - The time at which this topology snapshot was taken.
  *  `"nnLowWatermark"` - ???
  *  `"depth"` - 
  *  `"reachability"`
  *  `"networkAvailability"`
      
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
    
### `/node`
    This API performs a simple check of node options related to your node type and also displays your current node type.

    ```bash
    curl -s http://localhost:1633/node | jq
    
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


### `/health`
       
  The /health endpoint is primarily used by infra tools such as Docker / Kubernetes to check whether the server is live, it's not an important diagnostic tool for node operators.
      
  ```bash
      curl -s http://localhost:1633/health | jq
      
      {
        "status": "ok",
        "version": "2.0.0-759f56f7",
        "apiVersion": "5.1.1",
      }           
  ```

  * `"status"` - "ok" if the server is responsive.
  * `"version"` - The version of your Bee node. You can find latest version by checking the [Bee github repo](https://github.com/ethersphere/bee).
  * `"apiVersion"` 


