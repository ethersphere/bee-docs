---
title: Staking
id: staking
---

In order to participate in the redistribution of BZZ from uploaders to storers, storers must first deposit a non-refundable BZZ stake with a smart contract. Then, they are going to be chosen for payout with a probability proportional to their stake in their neighbourhood, as long as they can log storing the part of the content that they are supposed to be storing according to protocol rules.

In order to participate in redistribution, storers need to do the following:

- Join the network and download all the data that the protocol assigns to them. They can only participate if they are fully synchronised with the network.
- Deposit a stake with the staking contract. There is a minimum staking requirement, presently 10 BZZ. It can change in the future.
- Stay online and fully synced, so that when a redistribution round comes, their node can check whether their neighbourhood (nodes that are assigned the same content to store) has been selected and if so, they can perform a certain calculation (a random sampling) on their content and submit the result to the redistribution contract. This happens in two phases (commit and reveal), so that the nodes cannot know the results of others’ calculations when committing to their own.
- Round length is estimated around 15 minutes (152 blocks to be precise), though it can be extended.

Amongst the nodes that agree with the correct result, one is chosen — with a probability in proportion to their stake — as the winner. The winner must execute an on-chain transaction claiming their reward, which is the entire pot of storage rent paid since the previous round, or even more, if the previous pot has not been claimed at that time.

## Stake your node with Bee

Bee has builtin endpoints for depositing the stake. Currently the minimum staking requirement is 10 BZZ, so make sure that there is enough tokens in the node's wallet and you must have some native token as well for paying the gas.

Then you can run the following command to stake 10 BZZ. The amount is given in PLURs which is the smallest denomination of BZZ and `1 BZZ == 1e16 PLUR`.

```bash
curl -XPOST localhost:1635/stake/100000000000000000
```

If the command executed successfully it returns a transaction hash that you can use to verify on a block explorer.

It is possible to deposit more by repeatedly using the command above.

You can also check the amount staked with the following command:

```bash
curl localhost:1635/stake
```

## Check redistribution status

Use the <a href="/debug-api/#tag/RedistributionState" target="_blank" rel="noopener noreferrer">RedistributionState</a> endpoint of the API to get more information about the redistribution status of the node.

```
curl -X GET http://localhost:1635/redistributionstate | jq
```

```json
{ 
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

* `"hasSufficientFunds": <bool>` - Shows whether the node has enough xDAI balance to submit at least five storage incentives redistribution related transactions.  If `false` the node will not be permitted to participate in next round.

* `"isFrozen": <bool>` - Shows node frozen status.
* `"isFullySynced": <bool>` - Shows whether node's localstore has completed full historical syncing with all connected peers.
* `"phase": <string>` - Current phase of redistribution game.
* `"round": <integer>` - Current round of redistribution game. The round number is determined by dividing the current Gnosis Chain block height by the number of blocks in one round. One round takes 152 blocks, so using the "block" output from the example above we can confirm that the round number is 176319 (block 26800488 / 152 blocks = round 176319).   
* `"lastWonRound": <integer>` - Number of round last won by this node.
* `"lastPlayedRound": <integer>` - Number of the last round where node's neighborhood was selected to participate in redistribution game.
* `"lastFrozenRound": <integer>` The number the round when node was last frozen. 
* `"block": <integer>` - Gnosis block of the current redistribution game.
* `"reward": <string (BigInt)>` - Record of total reward received in [PLUR](/docs/introduction/terminology#plur).
* `"fees": <string (BigInt)>` - Record of total spent in 1E-18 xDAI on all redistribution related transactions.
