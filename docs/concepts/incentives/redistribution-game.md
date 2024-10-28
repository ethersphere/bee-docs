---
title: Redistribution Game
id: redistribution-game
---


## Redistribution Game

The redistribution game is used to redistribute the xBZZ which is accumulated by the [postage stamp](/docs/concepts/incentives/postage-stamps) contract when postage stamp batches are purchased in order to pay for uploading data to Swarm. The reward paid out in the redistribution game serve as incentive for nodes to continue providing their disk space to the network. The game is designed in such a way that the optimal strategy for participants is to honestly store the data for which they are responsible.

### Redistribution Game Details

When someone wants to upload data to Swarm, they do so by buying postage stamp batches with xBZZ. The xBZZ is collected and later paid out to storage provider nodes as a part of the redistribution game. Every 152 Gnosis Chain blocks a single [neighborhood](/docs/concepts/DISC/neighborhoods) is selected to play the redistribution game. For each round of the game, one node from the selected neighborhood will have the chance to win a reward which is paid out from the accumulated xBZZ. 

The game has 3 phases, `commit`, `reveal`, and `claim`. In the `reveal` phase of a previous game, an "anchor" address is randomly generated and used to determine the neighborhood for the current round. 

In the `commit` phase, nodes issue an on-chain transaction including an encrypted hash of the data they are storing (the unencrypted hash is known as the "reserve commitment") along with the [depth](/docs/references/glossary#2-area-of-responsibility-related-depths) for which they are reporting. This serves as an attestation of the data they are storing without revealing any other information.

In the `reveal` phase, each node reveals the decryption key for their encrypted hashes thereby publishing the hash. One of the nodes is chosen as the honest node, and from among the honest nodes, one node is chosen as the winner. The winner is chosen at random among the honest nodes, but it is weighted in proportion to each node's stake density. Stake density is calculated as so:

$$
\text{stake density} = \text{stake(xBZZ)} \times {2}^\text{storage depth}
$$


### Penalties

During the `reveal` phase if a nodes' revealed hash does not match the honest nodes' hash, that node will be temporarily frozen and will not be able to participate in a number of upcoming rounds. Currently the freeze period is defined in the [redistribution smart contract](https://github.com/ethersphere/storage-incentives/blob/master/src/Redistribution.sol#L536C1-L536C100) as:


$$
152 \times 2^\text{storage radius} \text{ blocks (at 5s per block)}
$$

So for example at a storage radius of 10:

$$
152 \times 2^{10} \text{ blocks (at 5s per block)} ≈ \text{ 9 days}
$$


