---
title: Price Oracle
id: price-oracle
---

The job of the Oracle is to use Swarm network data to set the price of Postage Stamps. The oracle contract uses data from the Postage Stamp smart contract in order to set the appropriate price for Postage Stamps. The data in the Postage Stamp contract is used to calculate a “utilization signal”. This signal is an indicator of how much the Swarm network’s data storage capacity is being utilized. Specifically, the signal is a measure of data redundancy on the network. Redundancy is a measure of how many copies of each piece of data can be stored by the network. The protocol targets a fourfold level of data redundancy as a safe minimum. 

As more and more data storers purchase stamps while the number of nodes remains constant, the data redundancy level will begin to fall as data storers’ available space begins to become reserved. If too many postage stamps are purchased without an equivalent increase in disk space shared by storage providers, the redundancy level may fall below four. In this case, the oracle will increase the price of postage stamps so that it becomes more expensive to store data on Swarm. The higher cost of storage will then lead to less Postage Stamps being purchased, and will push the redundancy level back up towards four. 

Conversely, if the amount of Stamps being purchased decreases while the number of storage provider nodes remains constant, the redundancy level will increase as there are fewer chunks of data to be distributed amongst the same number of nodes. In this case, the oracle will decrease the Postage Stamp price in order to promote more data storers to store their data on Swarm. The lower cost of storage will then lead to more Postage Stamps being purchased and push the redundancy level back down towards four.

