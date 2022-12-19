---
title: Staking
id: staking
---

In order to participate in the redistribution of BZZ from uploaders to storers, storers must first deposit a non-refundable BZZ stake with a smart contract. Then, they are going to be chosen for payout with a probability proportional to their stake in their neighbourhood, as long as they can log storing the part of the content that they are supposed to be storing according to protocol rules.

In order to participate in redistribution, storers need to do the following:

- Join the network and download all the data that the protocol assigns to them. They can only participate if they are fully synchronised with the network.
- Deposit a stake with the staking contract. There is a minimum staking requirement, presently 10 BZZ. It can change in the future.
- Stay online and fully synced, so that when a redistribution round comes, their node can check whether their neighbourhood (nodes that are assigned the same content to store) has been selected and if so, they can perform a certain calculation (a random sampling) on their content and submit the result to the redistribution contract. This happens in two phases (commit and reveal), so that the nodes cannot know the results of others’ calculations when committing to their own.
- Round length is estimated around 15 minutes, though it can be extended.

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
curl localhost:1635/stake/
```
