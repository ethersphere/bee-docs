---
title: Swarm Gateways
id: gateway
---

Swarm is a p2p network application, like a Blockchain, and in order to access it, you must run a node which will connect you directly to other user's computers.

At present it is not yet possible to run a fully p2p node directly in the browser and some other scenarios, although this is feasible and will be supported in the future.

In the meantime, Swarm provides **HTTP Gateways** which can be accessed directly with a traditional web browser or any other software that is able to interact with HTTP. These, however, provide only some of the functionality that Swarm has to offer.

We recommend you [run your own node](/docs/installation/install) in order to access the network. If you would like to try Swarm out, limited public gateways are provided. 

For advanced users, you may be interested in [running your own gateway](/docs/installation/gateways).

## Gateway Features

A gateway can be used to:

1. Browse websites hosted on the Swarm network, using ENS, eg. [https://swarm.bzz.link](https://swarm.bzz.link).
2. Provide a Swarm API endpoint, which can be used to power decentralised applications (Dapps). 

## Public Gateways

The Swarm Foundation currently provides access to these public gateways.

### Swarm Foundation Gateway

The [Swarm Gateway](https://gateway.ethswarm.org/) is an application that allows you to try out Swarm, you are able to upload up to 10 MB at a time for free. You can upload files, directories, or even folders containing websites to host them on Swarm.

After uploading, you will receive a link that you can share with others who will be able to retrieve the data from any gateway, or directly from the network using their own node.

[https://gateway.ethswarm.org/](https://gateway.ethswarm.org/)

### Swarm Foundation Gateway API

For Dapp builders, the API Gateway provides limited access to some elements of a Bee node's API. You can use this to run your Swarm applications against, if they are able to function within the [limitations](/docs/access-the-swarm/gateway#limitations) imposed by the gateway. 

[https://api.gateway.ethswarm.org/](https://api.gateway.ethswarm.org/)

### BZZ.link

The [BZZ.link](https://bzz.link/) service allows you to access ENS domains and swarm references (encoded as CIDs) as subdomains under `bzz.link`, providing secure context for web applications, such as `https://swarm.bzz.link`.

BZZ link also provides limited access to a Swarm Gateway API.

[https://bzz.link](https://bzz.link)

### Fair Data Society

[https://gateway.fairdatasociety.org/](https://gateway.fairdatasociety.org/)

### Limitations

#### Rate and Filesize Limits

To ensure everyone is able to try out the Swarm network, rate and filesize limitations are imposed on these public gateways. If you require that yourself, or the users of your Dapp require access which exceeds these limits, you must [run your own gateway.](/docs/installation/gateway)

#### Postage Stamps

When uploading chunks to Swarm, you must provide each with an attached signed postage stamp. When using a public gateway or API, chunks are automatically stamped with random batches that last for about 2 weeks. There is no way to extend the lifespan of these stamps.

If you want to be able to control the amount of time your content stays in Swarm, you must upload your data using a [light node](/docs/access-the-swarm/light-nodes), or [run your own gateway.](/docs/installation/gateway).

#### Encryption

Bee features built in [encryption](/docs/access-the-swarm/store-with-encryption). However, if you want to store or retrieve files encrypted using Bee, you must [run your own node](/docs/installation/install). Some Swarm Dapps do provide e2e encryption implmeneted at the application layer, and these are safe to use, even via gateways.

#### Privacy

Running a Swarm node is private by design. Running even a [light node](/docs/access-the-swarm/light-nodes) offers much more privacy than can be achieved when accessing the swarm using a gateway. Even if your Dapp is e2e encrypted, the gateway still has full knowledge of the chunks you are requesting from your IP.

When running a light node, the knowledge of which chunks are requested are spread over many nodes, which may provide some obsfucation of requested traffic. For full privacy features, including completely leak proof messaging using [PSS](/docs/dapps-on-swarm/pss), you must run a full node, where forwarding traffic adds a further degree of obsfucation.