---
title: Neighborhoods
id: neighborhoods
---

In Swarm, a neighborhood refers to an area of responsibility within the network, where nodes in proximity to one another share the task of storing and maintaining data chunks. Nodes within a neighborhood replicate chunks to ensure that if one node goes offline, other nodes in the neighborhood can still retrieve and serve the content.

:::info
To see current neighborhood populations and the current storage depth / storage radius navigate to the ["Neighborhoods" page of Swarmscan.io](https://swarmscan.io/neighborhoods).

The terms "depth" and "radius" are often used interchangeably when discussing neighborhoods. Both refer to number of shared leading bits of node and chunk addresses used to determine the nodes and chunks which fall into which neighborhoods.
:::

## Key Concepts

### Proximity Order (PO)
The PO measures how close a node is to a particular chunk of data or another node. It is defined as the number of shared leading bits between two addresses. Proximity order plays a role in how neighborhoods are defined, as a node’s neighborhood extends up to its storage depth, covering all nodes within that proximity​.

### Reserve Depth

The reserve depth is the shallowest PO at which neighborhoods are able to store all of the chunks which have been paid for through [postage stamp batch](/docs/concepts/incentives/overview#postage-stamps) purchases.

### Storage Depth

Storage depth is the shallowest PO at which neighborhoods are able to store all the chunks which have been *uploaded*. If 100% of all all chunks which have been paid for have been stamped and uploaded to the network, then storage depth will equal reserve depth. However, it is common that stamp batches are not always fully utilized, meaning that it is possible for the storage depth to be shallower than the reserve depth.

Storage depth is the proximity order of chunks for which a node must synchronize and store chunks, and it is determined by nodes' reserve sizes in combination with the amount of chunks actually uploaded. 

### Neighborhood Depth

Neighborhood depth for a node is the highest (deepest) PO *`d`* where the node has at least 3 peers which share the same *`d`* number of leading binary prefix bits in their addresses.


### Neighborhood

A neighborhood is a set of nodes in close proximity to each other based on their proximity order (PO). Each node within a storage-depth-defined neighborhood interacts with other nodes to store and replicate data chunks, ensuring availability and redundancy.


## Example neighborhood

Let's take a closer look at an example. Below is a neighborhood of six nodes at depth 10. Each node is identified by its Swarm address, which is a 256 bit hexadecimal number derived from the node's Gnosis Chain address, the Swarm network id, and a random nonce.  

> da4cb0d125bba638def55c0061b00d7c01ed4033fa193d6e53a67183c5488d73
> da5d39a5508fadf66c8665d5e51617f0e9e5fd501e429c38471b861f104c1504
> da7a974149543df1b459831286b42b302f22393a20e9b3dd9a7bb5a7aa5af263
> da76f8fccc3267b589d822f1c601b21b525fdc2598df97856191f9063029d21e
> da7b6439c8d3803286b773a56c4b9a38776b5cd0beb8fd628b6007df235cf35c
> da7fd412b79358f84b7928d2f6b7ccdaf165a21313608e16edd317a5355ba250

Since we are only concerned with the leading binary bits close to the neighborhood depth, for the rest of this example we will abbreviate the addresses to the first four prefixed hexadecimal digits only. Below are listed the hex prefixes and their binary representation, with the first ten leading bits underlined:

| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>1101101001</u>001100|
| da5d       | <u>1101101001</u>011101|
| da76       | <u>1101101001</u>110110|
| da7a       | <u>1101101001</u>111010|
| da7b       | <u>1101101001</u>111011|
| da7f       | <u>1101101001</u>111111|

### Area of Responsibility

Storer nodes are responsible for storing chunks with addresses whose leading bits match their own up to the storage depth. Here are two example chunks which fall within our example neighborhood:

> Chunk A address: `da49a42926015cd1e2bc552147c567b1ca13e8d4302c9e6026e79a24de328b65`   
> Chunk B address: `da696a3dfb0f7f952872eb33e0e2a1435c61f111ff361e64203b5348cc06dc8a`   

As the address of the chunk shown above shares the same ten leading binary bits as the nodes in our example neighborhood, it falls into that neighborhood's [area of responsibility](/docs/references/glossary#2-area-of-responsibility-related-depths), and all the nodes in that neighborhood are required to store that chunk:

> da49 --> <u>1101101001</u>001001  
> da69 --> <u>1101101001</u>101001 


*As with the example for nodes, we've abbreviated the chunk addresses to their leading four hexadecimal digits only and converted them to binary digits.*

### Neighborhood Doubling 

As more and more chunks are assigned to neighborhoods, the chunk reserves of the nodes in that neighborhood will begin to fill up. Once the nodes' reserves in a neighborhood become full and can no longer store additional chunks, that neighborhood will split, with each half of the neighborhood taking responsibility for half of the chunks. This event is referred to as a "doubling", as it results in double the number of neighborhoods. The split is done by increasing the storage depth by one, so that the number of shared leading bits is increased by one. This results in a binary splitting of the neighborhood and associated chunks into two new neighborhoods and respective groups of chunks.

:::info
Note that when chunks begin to expire and new chunks are not uploaded to Swarm, it is possible for node's reserves to empty out, once they fall below a certain threshold, a "halving" will occur in which the storage depth will be decreased by one and two neighborhoods will merge to make a new one so that they are responsible for a wider set of chunks.
:::

Using our previous example neighborhood, during a doubling, the storage depth would increase from 10 to 11, and the neighborhood would be split based on the 11th leading bit.


**neighborhood A:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>11011010010</u>01100|
| da5d       | <u>11011010010</u>11101|


**neighborhood B:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da76       | <u>11011010011</u>10110|
| da7a       | <u>11011010011</u>11010|
| da7b       | <u>11011010011</u>11011|
| da7f       | <u>11011010011</u>11111|


Each of our two example chunks will also be split amongst the two new neighborhoods based on their 11th leading bit:


**neighborhood A:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>11011010010</u>01100|
| da5d       | <u>11011010010</u>11101|
|da49 (chunk)| <u>11011010010</u>01001|


**neighborhood B:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da76       | <u>11011010011</u>10110|
| da7a       | <u>11011010011</u>11010|
| da7b       | <u>11011010011</u>11011|
| da7f       | <u>11011010011</u>11111|
|da69 (chunk)| <u>11011010011</u>01001|


#### Doubling Implications for Node Operators

One of the implications of doubling for node operators is that the reward chances for a node depends in part on how many other nodes are in its neighborhood. If it is in a neighborhood with fewer nodes, its chances of winning rewards are greater. Therefore node operators should make certain to place their nodes into less populated neighborhoods, and also should look ahead to neighborhoods at the next depth after a doubling. For more details about how to adjust node placement, see [here](/docs/bee/installation/set-target-neighborhood).