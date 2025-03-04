---
title: Redistribution Game
id: redistribution-game
---

The redistribution game distributes xBZZ collected from [postage stamp](/docs/concepts/incentives/postage-stamps) purchases, rewarding nodes for providing storage. Redistribution rewards incentivize nodes to continue providing storage to the network. The game is designed so that the most profitable strategy for participants is to store their assigned data honestly.

### Redistribution Game Details

Uploading data to Swarm requires purchasing postage stamp batches with xBZZ. The collected xBZZ is later redistributed as rewards to storage nodes. Every 152 Gnosis Chain blocks ***a single [neighborhood](/docs/concepts/DISC/neighborhoods)*** is selected to play the redistribution game. For each round of the game, one node from the selected neighborhood will have the chance to win a reward which is paid out from the accumulated xBZZ. 

The game has 3 phases, `commit`, `reveal`, and `claim`. In the `reveal` phase of a previous game, an "anchor" address is randomly generated and used to determine the neighborhood for the current round. 

In the `commit` phase, nodes issue an on-chain transaction including an encrypted hash of the data they are storing (the unencrypted hash is known as the "reserve commitment") along with the [depth](/docs/references/glossary#2-area-of-responsibility-related-depths) for which they are reporting. This serves as an attestation of the data they are storing without revealing any other information.

In the `reveal` phase, each node reveals the decryption key for their encrypted hashes thereby publishing the hash. The winner is chosen at random among the honest nodes, but it is weighted in proportion to each node's stake density. Stake density is calculated as so:

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


