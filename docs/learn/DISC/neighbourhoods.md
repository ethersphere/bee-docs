---
title: Neighbourhoods
id: neighbourhoods
---

In Swarm, a neighbourhood refers to an area of responsibility within the network, where nodes in proximity to one another share the task of storing and maintaining data chunks. It is defined by the [proximity order (PO)](/docs/learn/glossary#proximity-order-po) of nodes' addresses. Nodes within a neighbourhood replicate data chunks to ensure that if one node goes offline, other nodes in the neighbourhood can still retrieve and serve the content.


:::info
To see neighborhood populations and the current storage depth / storage radius navigate to the ["Neighborhoods" page of Swarmscan.io](https://swarmscan.io/neighborhoods).
:::

:::info
The terms "depth" and "radius" are often used interchangeably when discussing neighborhoods. Both refer to number of shared leading bits of node and chunk addresses used to determine the nodes and chunks which fall into which neighborhoods.
:::

## Neighborhood Formation

A Swarm neighborhood is determined by the proximity order (PO) of node addresses, which is calculated based on the number of leading bits shared between the addresses of nodes in the network. Nodes in the same neighborhood share the same prefix of their addresses, and the neighborhood expands or contracts depending on the availability of nearby nodes. As a result, each node is responsible for interacting with other nodes within its neighborhood to store and replicate data chunks, ensuring data availability and redundancy. The neighborhood depth dynamically adjusts as peers join or leave the network, maintaining a healthy distribution of storage responsibility across nodes.

### Example Neighbourhood

Let's take a closer look at an example. Below is a neighbourhood of six nodes at depth 10. Each node is identified by its Swarm address, which is a 256 bit hexadecimal number derived from the node's Gnosis Chain address, the Swarm network id, and a random nonce.  

> da4cb0d125bba638def55c0061b00d7c01ed4033fa193d6e53a67183c5488d73
> da5d39a5508fadf66c8665d5e51617f0e9e5fd501e429c38471b861f104c1504
> da7a974149543df1b459831286b42b302f22393a20e9b3dd9a7bb5a7aa5af263
> da76f8fccc3267b589d822f1c601b21b525fdc2598df97856191f9063029d21e
> da7b6439c8d3803286b773a56c4b9a38776b5cd0beb8fd628b6007df235cf35c
> da7fd412b79358f84b7928d2f6b7ccdaf165a21313608e16edd317a5355ba250

Since we are only concerned with the leading binary bits close to the neighbourhood depth, for the rest of this example we will abbreviate the addresses to the first four prefixed hexadecimal digits only. Below are listed the hex prefixes and their binary representation, with the first ten leading bits underlined:

| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>1101101001</u>001100|
| da5d       | <u>1101101001</u>011101|
| da76       | <u>1101101001</u>110110|
| da7a       | <u>1101101001</u>111010|
| da7b       | <u>1101101001</u>111011|
| da7f       | <u>1101101001</u>111111|

### Chunk Neighbourhood Assignment

Chunks are assigned to neighbourhoods based on their addresses, which are in the same 256 bit format as node addresses. Here are two example chunks which fall within our example neighbourhood:

> Chunk A address: `da49a42926015cd1e2bc552147c567b1ca13e8d4302c9e6026e79a24de328b65`   
> Chunk B address: `da696a3dfb0f7f952872eb33e0e2a1435c61f111ff361e64203b5348cc06dc8a`   

As the address of the chunk shown above shares the same ten leading binary bits as the nodes in our example neighbourhood, it falls into that neighbourhood's [area of responsibility](/docs/learn/glossary#2-area-of-responsibility-related-depths), and all the nodes in that neighbourhood are required to store that chunk:

> da49 --> <u>1101101001</u>001001  
> da69 --> <u>1101101001</u>101001 


*As with the example for nodes, we've abbreviated the chunk addresses to their leading four hexadecimal digits only and converted them to binary digits.*

### Neighbourhood Doubling 

As more and more chunks are assigned to neighbourhoods, the chunk reserves of the nodes in that neighbourhood will begin to fill up. Once the nodes' reserves in a neighbourhood become full and can no longer store additional chunks, that neighbourhood will split, with each half of the neighbourhood taking responsibility for half of the chunks. This event is referred to as a "doubling", as it results in double the number of neighbourhoods. The split is done by increasing the storage depth by one, so that the number of shared leading bits is increased by one. This results in a binary splitting of the neighbourhood and associated chunks into two new neighbourhoods and respective groups of chunks.

:::info
Note that when chunks begin to expire and new chunks are not uploaded to Swarm, it is possible for node's reserves to empty out, once they fall below a certain threshold, a "halving" will occur in which the storage depth will be decreased by one and two neighbourhoods will merge to make a new one so that they are responsible for a wider set of chunks.
:::

Using our previous example neighbourhood, during a doubling, the storage depth would increase from 10 to 11, and the neighbourhood would be split based on the 11th leading bit.


**Neighbourhood A:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>11011010010</u>01100|
| da5d       | <u>11011010010</u>11101|


**Neighbourhood B:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da76       | <u>11011010011</u>10110|
| da7a       | <u>11011010011</u>11010|
| da7b       | <u>11011010011</u>11011|
| da7f       | <u>11011010011</u>11111|


Each of our two example chunks will also be split amongst the two new neighbourhoods based on their 11th leading bit:


**Neighbourhood A:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da4c       | <u>11011010010</u>01100|
| da5d       | <u>11011010010</u>11101|
|da49 (chunk)| <u>11011010010</u>01001|


**Neighbourhood B:**
| Hex prefix | Binary Bits     |
|------------|-----------------|
| da76       | <u>11011010011</u>10110|
| da7a       | <u>11011010011</u>11010|
| da7b       | <u>11011010011</u>11011|
| da7f       | <u>11011010011</u>11111|
|da69 (chunk)| <u>11011010011</u>01001|


#### Doubling Implications for Node Operators

One of the implications of doubling for node operators is that the reward chances for a node depends in part on how many other nodes are in its neighbourhood. If it is in a neighbourhood with fewer nodes, its chances of winning rewards are greater. Therefore node operators should make certain to place their nodes into less populated neighbourhoods, and also should look ahead to neighbourhoods at the next depth after a doubling. For more details about how to adjust node placement, see [the section on setting a target neighbourhood](/docs/bee/installation/install#set-target-neighborhood-optional) in the installation guide.