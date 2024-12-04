---
title: Staking
id: staking
---

In order to participate in the redistribution of xBZZ from uploaders to storers, storers must first deposit a non-refundable xBZZ stake with a smart contract. Then, they are going to be chosen for payout with a probability proportional to their stake in their neighborhood, as long as they can log storing the part of the content that they are supposed to be storing according to protocol rules.

In order to participate in redistribution, storers need to do the following:

- Join the network and download all the data that the protocol assigns to them. They can only participate if they are fully synchronised with the network.
- Deposit a stake with the staking contract. There is a minimum staking requirement, presently 10 xBZZ. It can change in the future.
- Stay online and fully synced, so that when a redistribution round comes, their node can check whether their neighborhood (nodes that are assigned the same content to store) has been selected and if so, they can perform a certain calculation (a random sampling) on their content and submit the result to the redistribution contract. This happens in two phases (commit and reveal), so that the nodes cannot know the results of others’ calculations when committing to their own.
- Round length is estimated around 15 minutes (152 blocks to be precise), though it can be extended.

Amongst the nodes that agree with the correct result, one is chosen — with a probability in proportion to their stake — as the winner. The winner must execute an on-chain transaction claiming their reward, which is the entire pot of storage rent paid since the previous round, or even more, if the previous pot has not been claimed at that time.

## Add stake

Bee has builtin endpoints for depositing the stake. Currently the minimum staking requirement is 10 xBZZ, so make sure that there is enough tokens in the node's wallet and you must have some native token as well for paying the gas.

Then you can run the following command to stake 10 xBZZ. The amount is given in PLUR which is the smallest denomination of xBZZ and `1 xBZZ == 1e16 PLUR`.

```bash
curl -X POST localhost:1633/stake/100000000000000000
```

If the command executed successfully it returns a transaction hash that you can use to verify on a block explorer.

It is possible to deposit more by repeatedly using the command above.

You can also check the amount staked with the following command:

```bash
curl localhost:1633/stake
```

## Check redistribution status

Use the <a href="/api/#tag/RedistributionState" target="_blank" rel="noopener noreferrer">RedistributionState</a> endpoint of the API to get more information about the redistribution status of the node.

```bash
curl -X GET http://localhost:1633/redistributionstate | jq
```

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
* `"minimumFunds": <integer>` - The minimum xDAI needed to play a single round of the redistribution game (the unit is 1e-18 xDAI).
* `"hasSufficientFunds": <bool>` - Shows whether the node has enough xDAI balance to submit at least five storage incentives redistribution related transactions.  If `false` the node will not be permitted to participate in next round.
* `"isFrozen": <bool>` - Shows node frozen status.
* `"isFullySynced": <bool>` - Shows whether node's localstore has completed full historical syncing with all connected peers.
* `"phase": <string>` - Current phase of [redistribution game](/docs/concepts/incentives/redistribution-game) (`commit`, `reveal`, or `claim`).
* `"round": <integer>` - Current round of redistribution game. The round number is determined by dividing the current Gnosis Chain block height by the number of blocks in one round. One round takes 152 blocks, so using the "block" output from the example above we can confirm that the round number is 176319 (block 26800488 / 152 blocks = round 176319).   
* `"lastWonRound": <integer>` - Number of round last won by this node.
* `"lastPlayedRound": <integer>` - Number of the last round where node's neighborhood was selected to participate in redistribution game.
* `"lastFrozenRound": <integer>` The number the round when node was last frozen. 
* `"block": <integer>` - Gnosis block of the current redistribution game.
* `"reward": <string (BigInt)>` - Record of total reward received in [PLUR](/docs/references/glossary#plur).
* `"fees": <string (BigInt)>` - Record of total spent in 1E-18 xDAI on all redistribution related transactions.


:::warning
Nodes should not be shut down or updated in the middle of a round they are playing in as it may cause them to lose out on winnings or become frozen. To see if your node is playing the current round, check if `lastPlayedRound` equals `round` in the output from the [`/redistributionstate` endpoint](/api/#tag/RedistributionState/paths/~1redistributionstate/get).
:::

:::info
If your node is not operating properly such as getting frozen or not participating in any rounds, see the [troubleshooting section](#troubleshooting).
:::


## Partial Stake Withdrawals

In cases that the price of xBZZ rises so much that it is more than enough to act as collateral, a partial withdrawal will be allowed down to the minimum required stake:

### Check for withdrawable stake



```bash
curl http://localhost:1633/stake/withdrawable | jq
```
If there is any stake available for withdrawal, the amount will be displayed in PLUR:

```bash
{
  "withdrawableStake": "18411"
}
```

### Withdraw available stake

If there is any stake available for withdrawal, you can withdraw it using the `DELETE` method on `/stake/withdrawable`:

```bash
curl -X DELETE http://localhost:1633/stake/withdrawable
```

## Reserve Doubling

The reserve doubling feature enables nodes to store chunks from a neighboring "sister" area, effectively increasing their reserve capacity twofold. By maintaining chunks from this sister neighborhood, a node becomes eligible to join the redistribution game whenever the sister neighborhood is chosen, effectively doubling its chances of participating.

Although reserve doubling demands twice the disk storage and increases bandwidth usage for chunk syncing (with no additional bandwidth needed for chunk forwarding), its effect on CPU and RAM consumption remains minimal. This feature provides node operators with greater flexibility to optimize their nodes, aiming to achieve a higher reward-to-resource usage ratio.

### Step by Step Guide

In order to double a node's reserve which has previously been operating without doubling, the `reserve-capacity-doubling` option must be updated from the default of `0` to `1` and restarted. There is also an increase in the xBZZ stake requirement from the minimum of 10 xBZZ to 20 xBZZ. 

#### **Step 1**: Stake at least 20 xBZZ 

For doubling the reserve of a node which was previously operating which already has 10 xBZZ staked, simply stake an additional 10 xBZZ for a total of 20 xBZZ stake:

:::info
As always, make sure that to properly convert the stake parameter to PLUR where 1 PLUR is equal to 1e-16 xBZZ. As in our example below, we have converted from 10 xBZZ to 100000000000000000  PLUR.
:::

```bash
curl -X POST localhost:1633/stake/100000000000000000
```

Or for a new node with zero staked xBZZ, the entire 20 xBZZ can be staked at once:

```bash
curl -X POST localhost:1633/stake/200000000000000000
```

We can use the `GET /stake` endpoint to confirm the total stake for our node:

```bash
curl -s  http://localhost:1633/stake | jq
```

```bash
{
  "stakedAmount": "200000000000000000"
}
```
#### **Step 2**: Set `reserve-capacity-doubling` to `1`.

The reserve doubling feature can be enabled by setting the new `reserve-capacity-doubling` config option to `1`  using the [configuration method](/docs/bee/working-with-bee/configuration#configuration-methods-and-priority) of your choice. 

#### **Step 3**: Restart node 

After ensuring the node has at least 20 xBZZ staked and the `reserve-capacity-doubling` option has been set to `1`, restart the node.

After restarting your node, it should then begin syncing chunks from its sister neighborhood. 

The `/status/neighborhoods` endpoint can be used to confirm that the node has doubled its reserve and is now syncing with its sister neighborhood:

```bash
{
  "neighborhoods": [
    {
      "neighborhood": "01111101011",
      "reserveSizeWithinRadius": 1148351,
      "proximity": 10
    },
    {
      "neighborhood": "01111101010",
      "reserveSizeWithinRadius": 1147423,
      "proximity": 11
    }
  ]
}
```

The expected output should contain two neighborhoods, the node's original neighborhood along with its sister neighborhood. 

We can also check the `/status` endpoint to confirm our node is syncing new chunks:

```bash
curl -s  http://localhost:1633/status | jq
```

```bash
{
  "overlay": "be177e61b13b1caa20690311a909bd674a3c1ef5f00d60414f261856a8ad5c30",
  "proximity": 256,
  "beeMode": "full",
  "reserveSize": 4192792,
  "reserveSizeWithinRadius": 2295023,
  "pullsyncRate": 1.3033333333333332,
  "storageRadius": 10,
  "connectedPeers": 18,
  "neighborhoodSize": 1,
  "batchCommitment": 388104192,
  "isReachable": true,
  "lastSyncedBlock": 6982430
}
```

We can see that the `pullsyncRate` value is above zero, meaning that our node is currently syncing chunks, as expected.

### Reserve Doubling Reversing & Withdrawable Stake

Due to certain [implementation details](https://github.com/ethersphere/storage-incentives/blob/20bf3c0e3fcf1e98dedcbf16cd82fb4d337fdaf7/src/Staking.sol#L136), the order in which a node's reserve is doubled and then reversed can have an impact on the amount of withdrawable stake.

When doubling a node's reserve, stake should be added AFTER 
setting `reserve-capacity-doubling` to 1. If instead, xBZZ is first staked with `reserve-capacity-doubling` set to 0, and the reserve is then doubled by increasing from 0 to 1 without the addition of more stake, this will prevent stake from being withdrawable when the doubling is reversed.  

In order to maximize the amount of withdrawable stake after reversing a reserve doubling, follow the step from the previous section in the exact order described when doubling.

#### How to free up withdrawable stake from a node with >= 20 xBZZ stake that currently has zero withdrawable stake:

In the case that a node with 20 xBZZ stake was doubled directly by increasing `reserve-capacity-doubling` from 0 to 1, the surplus xBZZ over the minimum required 10 xBZZ cannot be made withdrawable by simply reversing the `reserve-capacity-doubling` from 1 back to 0. 

In this case, you will need to first send a very small staking transaction of a single PLUR while `reserve-capacity-doubling` is set to 1, and after that, change `reserve-capacity-doubling` from 1 to 0. This works because every time any amount of stake is added, it forces to staking contract to redo its calculations.  

The detailed steps are:

1. Issue a staking transaction for 1 PLUR while `reserve-capacity-doubling` is set to 1.
    ```bash
    curl -X POST localhost:1633/stake/1
    ```
2. Stop node and set `reserve-capacity-doubling` to 0.
3. Restart node. The 10 xBZZ should now be withdrawable.

## Maximize rewards

There are two main factors which determine the chances for a staking node to win a reward — neighborhood selection and stake density. Both of these should be considered together before starting up a Bee node for the first time. See the [incentives page](/docs/concepts/incentives/redistribution-game) for more context.

### Neighborhood selection 

By default when running a Bee node for the first time an overlay address will be generated and used to assign the node to a random [neighborhood](/docs/concepts/DISC/neighborhoods). However, by using the `target-neighborhood` config option, a specific neighborhood can be selected in which to generate the node's overlay address. This is an excellent tool for maximizing reward chances as generally speaking running in a less populated neighborhood will increase the chances of winning a reward. See the [config section](/docs/bee/installation/install#set-target-neighborhood-optional) on the installation page for more information on how to set a target neighborhood.


### Stake density

Stake density is defined as:

$$
\text{stake density} = \text{staked xBZZ} \times {2}^\text{storageDepth}
$$
  
*To learn more about stake density and the mechanics of the incentives system, see the [incentives page](/docs/concepts/incentives/redistribution-game).*

Stake density determines the weighted chances of nodes within a neighborhood of winning rewards. The chance of winning within a neighborhood corresponds to stake density. Stake density can be increased by depositing more xBZZ as stake (note that stake withdrawals are not currently possible, so any staked xBZZ is not currently recoverable). 

Generally speaking, the minimum required stake of 10 xBZZ is sufficient, and rewards can be better maximized by operating more nodes over a greater range of neighborhoods rather than increasing stake. However this may not be true for all node operators depending on how many different neighborhoods they operate nodes in, and it also may change as network dynamics continue to evolve (join the `#node-operators` [Discord channel](https://discord.com/channels/799027393297514537/811553590170353685) to stay up to date with the latest discussions about staking and network dynamics).

## Neighborhood Hopping

:::warning 
While you may update your neighborhood freely as you wish, it takes significant time for to fully sync chunks and become eligible for playing in the redistribution game, so it is not advised to hop too frequently. 
:::

You can use the option `target-neighborhood` to switch your node over to a new neighborhood. You may wish to use this option if your node's neighborhood becomes overpopulated. 


### Checking neighborhood population

For a quick check of your node's neighborhood population, we can use the `/status` endpoint: 

```bash
curl -s http://localhost:1633/status | jq
{
  "peer": "e7b5c1aac67693268fdec98d097a8ccee1aabcf58e26c4512ea888256d0e6dff",
  "proximity": 0,
  "beeMode": "full",
  "reserveSize": 1055543,
  "reserveSizeWithinRadius": 1039749,
  "pullsyncRate": 42.67013868148148,
  "storageRadius": 11,
  "connectedPeers": 140,
  "neighborhoodSize": 6,
  "batchCommitment": 74463051776,
  "isReachable": false
}
```

Here we can see that at the current `storageRadius` of 11, our node is in a neighborhood with size 6 from the `neighborhoodSize` value.


Using the [Swarmscan neighborhoods tool](https://swarmscan.io/neighborhoods) we can see there are many neighborhoods with fewer nodes, so it would benefit us to move to less populated neighborhood:

![](/img/staking-swarmscan.png)
 
While you might be tempted to simply pick one of these less populated neighborhoods, it is best practice to use the neighborhood suggester API instead, since it will help to prevent too many node operators rapidly moving to the same underpopulated neighborhoods, and also since the suggester takes a look at the next depth down to make sure that even in case of a neighborhood split, your node will end up in the smaller neighborhood. 

```bash
curl -s https://api.swarmscan.io/v1/network/neighborhoods/suggestion
```

Copy the binary number returned from the API:

```bash
{"neighborhood":"01100011110"}
```

Use the binary number you just copied and set it as a string value for the `target-neighborhood` option in your config. 

```bash
## bee.yaml
target-neighborhood: "01100011110"
```
    
:::info 
Depending on your setup, you may need change the `target-neighborhood` option by updating your `bee.yaml` file, adding the `--target-neighborhood` command line flag, or edit a `.env` file, among several possible common options. 
:::

## Troubleshooting

In this section we cover several commonly seen issues encountered for staking nodes participating in the redistribution game. If you don't see your issue covered here or require additional guidance, check out the `#node-operators` [Discord channel](https://discord.com/channels/799027393297514537/811553590170353685) where you will find support from other node operators and community members.

### Frozen node

A node will be frozen when the reserve commitment hash it submits in its [`commit` transaction](/docs/concepts/incentives/redistribution-game) does not match the correct hash. The reserve commitment hash is used as proof that a node is storing the chunks it is responsible for. It will not be able to play in the redistribution game during the freezing period. See the  [penalties](/docs/concepts/incentives/redistribution-game) section for more information.

#### Check frozen status

You can check your node's frozen status using the `/redistributionstate` endpoint:

```bash
curl -X GET http://localhost:1633/redistributionstate | jq
```

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

The relevant fields here are `isFrozen` and `lastFrozenRound`, which respectively indicate whether the node is currently frozen and the last round in which the node was frozen. 

#### Diagnosing freezing issues

In order to diagnose the cause of freezing issues we must compare our own node's status to that of other nodes within the same neighborhood by comparing the results from our own node returned from the `/status` endpoint to the other nodes in the same neighborhood which can be found from the `/status/peers` endpoint.

First we check our own node's status: 

  ```bash
   curl -s localhost:1633/status | jq
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
  And next we will find the status for all the other nodes in the same neighborhood as our own.  
 
  ```bash
   curl -s  localhost:1633/status/peers | jq
  ```

  The `/status/peers` endpoint returns all the peers of our node, but we are only concerned with peers in the same neighborhood as our own node. Nodes whose `proximity` value is equal to or greater than our own node's `storageRadius` value all fall into the same neighborhood as our node, so the rest have been omitted in the example output below:

  ```bash
  { 
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

Now that we have the status for our own node and all its neighborhood peers we can begin to diagnose the issue through a series of checks outlined below:

:::info
If you are able to identify and fix a problem with your node from the checklist below, it's possible that your node's reserve has become corrupted. Therefore, after fixing the problem, stop your node, and repair your node according to the instructions in the section following the checklist.
:::

1. Compare `reserveSize` with peers

    The `reserveSize` value is the number of chunks stored by a node in its reserve. The value for `reserveSize` for a healthy node should be around +/- 1% the size of most other nodes in the neighborhood. In our example, for our node's `reserveSize` of 3747532, it falls within that normal range. This does not guarantee our node has no missing or corrupted chunks, but it does indicate that it is generally storing the same chunks as its neighbors. If it falls outside this range, see the next section for instructions on repairing reserves.

2. Compare `batchCommitment` with peers 

    The `batchCommitment` value shows how many chunks would be stored if all postage batches were fully utilised. It also represents whether the node has fully synced postage batch data from on-chain. If your node's `batchCommitment` value falls below that of its peers in the same neighborhood, it could indicate an issue with your blockchain RPC endpoint that is preventing it from properly syncing on-chain data. If you are running your own node, check your setup to make sure it is functioning properly, or check with your provider if you are using a 3rd party service for your RPC endpoint. 

3. Check `pullsyncRate`

    The `pullsyncRate` value measures the speed at which a node is syncing chunks from its peers. Once a node is fully synced, `pullsyncRate` should go to zero. If `pullsyncRate` is above zero it indicates that your node is still syncing chunks, so you should wait until it goes to zero before doing any other checks. If `pullsyncRate` is at zero but your node's `reserveSize` does not match its peers, you should check whether your network connection and RPC endpoint are stable and functioning properly. A node should be fully synced after several hours at most.

4. Check most recent `block` number

    The `block` value returned from the `/redistributionstate` endpoint shows the most recent block a node has synced. If this number is far behind the actual more recent block then it indicates an issue with your RPC endpoint or network. If you are running your own node, check your setup to make sure it is functioning properly, or check with your provider if you are using a 3rd party service for your RPC endpoint. 

    ```bash
    curl -X GET http://localhost:1633/redistributionstate | jq
    ```

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
5. Check peer connectivity

    Compare the value of your node's `neighborhoodSize` from the `/status` endpoint and the `neighborhoodSize` of its peers in the same neighborhood from the `/status/peers` endpoint. The figure should be generally the same (although it may fluctuate slightly up or down at any one point in time). If your node's `neighborhoodSize` value is significantly different and remains so over time then your node likely has a connectivity problem. Make sure to [check your network environment](/docs/bee/installation/connectivity) to ensure your node is able to communicate with the network.


If no problems are identified during these checks it likely indicates that your node was frozen in error and there are no additional steps you need to take. 

### Repairing corrupt reserve 

If you have identified and fixed a problem causing your node to become frozen or have other reason to believe that your node's reserves are corrupted then you should repair your node's reserve using the `db repair-reserve` command.

First stop your node, and then run the following command:

:::caution
Make sure to replace `/home/bee/.bee` with your node’s data directory if it differs from the one shown in the example. Make sure that the directory you specify is the root directory for your node’s data files, not the localstore directory itself. This is the same directory specified using the `data-dir` option in your node’s [configuration](/docs/bee/working-with-bee/configuration/).
:::

```bash
bee db repair-reserve --data-dir=/home/bee/.bee
```

After the command has finished running, you may restart your node.

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


