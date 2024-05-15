---
title: Staking
id: staking
---

In order to participate in the redistribution of xBZZ from uploaders to storers, storers must first deposit a non-refundable xBZZ stake with a smart contract. Then, they are going to be chosen for payout with a probability proportional to their stake in their neighbourhood, as long as they can log storing the part of the content that they are supposed to be storing according to protocol rules.

In order to participate in redistribution, storers need to do the following:

- Join the network and download all the data that the protocol assigns to them. They can only participate if they are fully synchronised with the network.
- Deposit a stake with the staking contract. There is a minimum staking requirement, presently 10 xBZZ. It can change in the future.
- Stay online and fully synced, so that when a redistribution round comes, their node can check whether their neighbourhood (nodes that are assigned the same content to store) has been selected and if so, they can perform a certain calculation (a random sampling) on their content and submit the result to the redistribution contract. This happens in two phases (commit and reveal), so that the nodes cannot know the results of others’ calculations when committing to their own.
- Round length is estimated around 15 minutes (152 blocks to be precise), though it can be extended.

Amongst the nodes that agree with the correct result, one is chosen — with a probability in proportion to their stake — as the winner. The winner must execute an on-chain transaction claiming their reward, which is the entire pot of storage rent paid since the previous round, or even more, if the previous pot has not been claimed at that time.

## Adding stake

Bee has builtin endpoints for depositing the stake. Currently the minimum staking requirement is 10 xBZZ, so make sure that there is enough tokens in the node's wallet and you must have some native token as well for paying the gas.

Then you can run the following command to stake 10 xBZZ. The amount is given in PLUR which is the smallest denomination of xBZZ and `1 xBZZ == 1e16 PLUR`.

```bash
curl -XPOST localhost:1633/stake/100000000000000000
```

If the command executed successfully it returns a transaction hash that you can use to verify on a block explorer.

It is possible to deposit more by repeatedly using the command above.

You can also check the amount staked with the following command:

```bash
curl localhost:1633/stake
```

## Check redistribution status

Use the <a href="/debug-api/#tag/RedistributionState" target="_blank" rel="noopener noreferrer">RedistributionState</a> endpoint of the API to get more information about the redistribution status of the node.

```
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
* `"phase": <string>` - Current phase of [redistribution game](/docs/learn/technology/incentives#storage-incentives-details) (`commit`, `reveal`, or `claim`).
* `"round": <integer>` - Current round of redistribution game. The round number is determined by dividing the current Gnosis Chain block height by the number of blocks in one round. One round takes 152 blocks, so using the "block" output from the example above we can confirm that the round number is 176319 (block 26800488 / 152 blocks = round 176319).   
* `"lastWonRound": <integer>` - Number of round last won by this node.
* `"lastPlayedRound": <integer>` - Number of the last round where node's neighborhood was selected to participate in redistribution game.
* `"lastFrozenRound": <integer>` The number the round when node was last frozen. 
* `"block": <integer>` - Gnosis block of the current redistribution game.
* `"reward": <string (BigInt)>` - Record of total reward received in [PLUR](/docs/learn/glossary#plur).
* `"fees": <string (BigInt)>` - Record of total spent in 1E-18 xDAI on all redistribution related transactions.


:::warning
Nodes should not be shut down or updated in the middle of a round they are playing in as it may cause them to lose out on winnings or become frozen. To see if your node is playing the current round, check if `lastPlayedRound` equals `round` in the output from the [`/redistributionstate` endpoint](/debug-api/#tag/RedistributionState/paths/~1redistributionstate/get).
:::

For issues relating to your node not participating in redistribution properly, see the [troubleshooting section](troubleshooting).

## Maximizing Staking Rewards

There are two main factors which determine the chances for a staking node to win a reward — neighborhood selection and stake density. Both of these should be considered together before starting up a Bee node for the first time. See the [incentives page](/docs/learn/technology/incentives/) for more context.

### Neighborhood Selection 

By default when running a Bee node for the first time an overlay address will be generated and used to assign the node to a random [neighborhood](/docs/learn/technology/disc#neighborhoods). However, by using the `target-neighborhood` config option, a specific neighborhood can be selected in which to generate the node's overlay address. This is an excellent tool for maximizing reward chances as generally speaking running in a less populated neighborhood will increase the chances of winning a reward. See the [config section](/docs/bee/installation/install#set-target-neighborhood-optional) on the installation page for more information on how to set a target neighborhood.


### Stake Density

Stake density is defined as:

$$
\text{stake density} = \text{staked xBZZ} \times {2}^\text{storageDepth}
$$
  
*To learn more about stake density and the mechanics of the incentives system, see the [incentives page](/docs/learn/technology/incentives/).*

Stake density determines the weighted chances of nodes within a neighborhood of winning rewards. The chance of winning within a neighborhood corresponds to stake density. Stake density can be increased by depositing more xBZZ as stake (note that stake withdrawals are not currently possible, so any staked xBZZ is not currently recoverable). 

Generally speaking, the minimum required stake of 10 xBZZ is sufficient, and rewards can be better maximized by operating more nodes over a greater range of neighborhoods rather than increasing stake. However this may not be true for all node operators depending on how many different neighborhoods they operate nodes in, and it also may change as network dynamics continue to evolve (join the `#node-operators` [Discord channel](https://discord.com/channels/799027393297514537/811553590170353685) to stay up to date with the latest discussions about staking and network dynamics).








