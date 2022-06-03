---
title: Swarm Gateways
id: gateway
---

Swarm is a p2p network, like a Blockchain, and in order to access it, you must run a node, which will connect you directly to other user's computers across the globe.

We recommend you run your own node in order to access the network. If you would like to try Swarm out, limited public gateways are provided. For advanced users, you may be interested in [running your own gateway](/docs/installation/gateways).

## Public Gateways

The Swarm Foundation currently provides access to these public gateways.

### Swarm Foundation Gateway

The [Swarm Gateway](https://gateway.ethswarm.org/) is an application that allows you to try out Swarm, you are able to upload up to 10 MB at a time for free. Upload files, directories, or even folders containing websites to host them on Swarm.

You will receive a link that you can share with others who will be able to retrieve the data from any gateway, or directly from the network using their own node.

`https://gateway.ethswarm.org/`

### Swarm Foundation Gateway API

For Dapp builders, the API Gateway provides limited access to some elements of a Bee node's API. You can use this to run your Swarm applications against, if they are able to operate within the limitations stated below. 

`https://api.gateway.ethswarm.org/`

### BZZ.link

The [BZZ.link](https://bzz.link/) service allows you to access ENS domains with websites that are hosted on [Swarm](https://swarm.bzz.link/) such as `https://swarm.bzz.link`. 

BZZ link also provides limited access to a Swarm Gateway API.

`https://bzz.link`

### Limitations

#### Rate and Filesize Limits

To ensure everyone is able to try out the Swarm network, rate and filesize limitations are imposed on these public gateways. If you require that yourself, or the users of your Dapp require access which exceeds these limits, you must *run your own gateway*.

#### Postage Stamps

When uploading chunks to Swarm, you must provide each with an attached signed postage stamp. Using our public gateway or API, chunks are automatically stamped with random batches that last for about 2 weeks. There is no way to extend or enlarge these batches, or to pick which one you will use.

If you want to be able to control the amount of time your content stays in Swarm, you must have knowledge of your *Batch ID*. In order to choose which chunks are stamped with which batches, you must have access to the relevant key material. Since browser based chunk stamping is not yet implemented in javascript, Gateway Proxy must handle stamping chunks.
