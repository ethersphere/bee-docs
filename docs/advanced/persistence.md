---
title: Persistence
id: persistence
---

The storage capacity of the whole Swarm network equals the the sum of the storage capacity of all connected nodes. As nobody is restricted to upload content to Swarm, eventually the storage capacity of the Swarm network reaches its limits and nodes face the choice to either stop accepting new chunks or delete content which is there already for a while. 

As Swarm nodes are programmed to behave economically, they won't stop accepting new chunks. The reasoning for this is that newly uploaded chunks are most likely to be accessed, offering the node an opportunity for profit. Instead, they will delete some chunks to make space for the new ones. The chunks that are deleted are the ones which were uploaded or accessed furthest away in the past.

:::info
The garbage collection queue deletes chunks which were uploaded or **accessed** furthest away in the past. This means that you can persist your chunks by regularly accessing it (or making it super duper awesome, so other people access it)
:::

## Persistence on your own node by local pinning
It is possible to instruct your node never to delete certain chunks, by locally pinning the chunks. Locally pinning chunks means that you will always be able to access these chunks via your node. However, it doesn't does mean that those chunks always be available in the network.

Locally pinning a chunk is best done upon upload by passing the `swarm-pin` header to the upload you are doing. As an example, you can upload a file and pin it at the same time by using

```sh
curl -H "Content-Type: image/x-jpeg" -H "swarm-pin: true" --data-binary @kitten.jpg localhost:8080/files\?name=cat.jpg
```

## Persistence in the network by global pinning
Global pinning adds a mechanism such that chunks which are locally pinned become globally available to the network. 

### Become a global pinner
To become a global pinner, you must:

1. start your node in `global-pinning` mode;
2. make sure that you persist the files. 
3. advertise that you are a global pinner;


#### Start your node in global pinning mode
Starting a node in global pinning mode is done with our standard configuration options (see [start](/docs/getting-started/start-your-node)). The flag which you pass to the command line is `--global-pinning-enable`.

This mode makes your node to listen to PSS (Postal Service over Swarm) messages, containing requests for repair. If your node receives a request for repair and you store the chunk for which repair is requested, your node will re-upload this chunk to its natural location in the network.

#### Persist the files
Persisting the files is advertised to be done in the `local pinning` feature. However, this is not obligatory; As long as you make sure that you persist the files and have them available at the moment that the recovery mechanism is set in motion (after receiving a PSS message) all is fine.

#### Advertise as a global pinner
By only starting your node in global pinning mode, nodes will still not know that they need to reach out to you for repair. You must somehow report that you are globally pinning the files (and this information must be picked up by any person who downloads the content you are globally pinning). 

The Swarm team envisions multiple ways how this is possible: via smart-contracts, via special gateways to the Swarm network, via Manifests, as data in the root chunk, via a feed or many other ways. 

We deliberately didn't force a specific pattern to the user, and we also don't aim to do so in the future. However, when a certain pattern to advertise yourself as a global pinner becomes the de-facto standard, we will report it here.

:::info
As a global pinner, you don't need to advertise your full overlay address. You only need to advertise your overlay addres as a *target* which is the first n characters of your overlay address, where n increases if the number of nodes in the network increases. (see "what is a target").
:::


### Request files which are globally pinned
To make use of the global pinning feature (and request a repair if a chunk not found), you need to pass a `targets` query parameter to your download request. The value of this parameter is a reference to the address of the global pinner node. You don't need to pass his whole address, just the first n characters is sufficient (where n increases if the number of nodes in the network increases). Please see "What is a target" below.

An example of a request to download a file with the targets query parameter passed in:

```sh
curl http://localhost:8080/files/3b2791985f102fe645d1ebd7f51e522d277098fcd86526674755f762084b94ee?targets=<target comes here>
```

If your chunk is not found in the network, but you sent a request to the passed-in target for repair then you get a `202` response back, indicating that the request has been accepted for processing.

After few seconds, You can retry to download the chunk again and this time the network will respond back with the repaired chunk. If you still don't get the chunk back, try downloading the chunk with another target.

#### How to find out which targets to pass
Just as there is no set way how to advertise that your node is a global pinner, there is no set way on how to figure out which nodes are global pinners for which content. The burden to pass targets in a request should ultimately not be borne by the user; we envision that the code that interacts with the bee client handles finding the target and passing it in with the request.

### What is a target
A target is defined as the first n-characters of an overlay address. In order for PSS to guarantee delivery to the destination, the bit-length of the target must be longer than the neighborhood depth of the node. As the neighborhood depth is defined as log2(N/R), where N is the amount of nodes in the network and R is the neighborhood size or redundancy factor.

:::info
For a few hundred of nodes in the network, we advice the length of the target to be 2 bytes. From about 50000 nodes onwards, you should start considering a target length of 3 bytes. 
:::

To understand this a deeper, you should realize that a recipient node is only guaranteed to receive a message if the chunk, containing the message falls into the neighborhood of the recipient. Falling into the recipients's neighbourhood means the recipient's overlay address matches the chunk's address on a prefix with bit-length greater or equal to the neighbourhood depth of the recipient.  The neighbourhood depth is logarithmic in the network size.  Its expected value  is log2(N/R)  where R is the neighbourhood  size or redundancy factor. Now if the network has a thousand nodes (N=2^10) and a redundancy factor of 4 (R=4=2^2), the expected depth is 8. However, due to variance some nodes will have depth of 9, which means that a trojan generated with a one-byte target (guaranteed 8 bits matching) will only have 50% chance of hitting the node's neighbourhood.

The conclusion  is that already at a good few hundred  nodes, one needs  2-byte targets.