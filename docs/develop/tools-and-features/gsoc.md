---
title: GSOC
id: gsoc
---

## Section 1: Introduction

The GSOC (Graffiti Single Owner Chunk) feature allows for multiple Bee nodes to update the same [SOC (Single Owner Chunk)](https://docs.ethswarm.org/docs/develop/tools-and-features/chunk-types/#single-owner-chunks) as long as they follow the defined rules for updating that chunk. Essentially, GSOC is the many-to-one communication feature which complements SOC's one-to-many communication functionality. It works by emitting an event once a node with an established GSOC connection receives a matching SOC - allowing it to act as a many-to-one notification system.

:::info
GSOC grew out of the previously developed [Graffiti feeds](https://github.com/fairDataSociety/FIPs/blob/master/text/0062-graffiti-feed.md), and you may wish to familiarize yourself with them as well as [feeds](https://docs.ethswarm.org/docs/develop/tools-and-features/feeds/) in general for a better understanding of the background of GSOC's development.
:::

:::warning
The GSOC feature introduced in Bee v2.3.0 as well as the [GSOC JS library](https://www.npmjs.com/package/@anythread/gsoc) are in the experimental stage and should not be used in production applications.  
:::


This opens up a wide range of new potential applications on Swarm for any use case which requires multiple writers to be able to update the content.

### Data Types on Swarm

Normally, when storing data in Swarm, there are two basic types of chunks:

1. **Content-Addressed Chunks (CAC)**: These chunks are immutable, and their address hash is based on the content itself, so once uploaded, they can’t be changed. 

2. **Single Owner Chunks (SOC)**: These chunks can be updated by a **single user** who owns the chunk. 


GSOC differs from each of the above methods of storing data on Swarm in that it **allows multiple users to write to the same SOC**. It was initially introduced in a [SWIP](https://github.com/nugaon/SWIPs/blob/graffiti-soc/SWIPs/swip-draft_graffiti-soc.md) which provided the core concepts and implementation details.


## Section 2: GSOC Overview


### GSOC Details


* GSOC allows for a node to subscribe to an events stream as a way of receiving messages from other nodes. 

* The GSOC feature is ***neighborhood scoped***, meaning only nodes within the same neighborhood of the GSOC can receive the updates to that GSOC. 

* A GSOC connection is established through a Websocket connection where a node subscribes to a stream of updates on an SOC (Single Owner Chunk) which allows them to ***receive messages from any other node*** in the Swarm (as long as the node follows the rules for writing to the GSOC AKA, the "consensus").


### GSOC Roles

There are two main roles for interacting with GSOC, the **service node** and the **writer node**. Generally speaking, there will be a single service node set up to receive messages from many writer nodes.

:::info
A node can act as a service node or writer node, or as ***both service and writer node*** at the same time.

***Only full nodes*** can act as service nodes, but a light node can act as a writer node.
:::

The service node establishes the GSOC in their neighborhood and listens for updates to the GSOC.

Only the service node and other nodes in the same neighborhood as the service node can listen for updates to the GSOC, but those updates can come from any node on the network, regardless of their neighborhood. 

A writer node is any node which sends an update request to the GSOC listened to by the service node.

:::info
Currently as of Bee v2.4.0, only the **most recent update** to a GSOC can be retrieved. When [the SWIP](https://github.com/ethersphere/SWIPs/pull/41) is fully implemented, the retrieval of past updates will also be possible. 

Furthermore, ***only nodes which are in the same neighborhood as the GSOC chunk can listen for updates***, updates ***cannot*** be retrieved by nodes from different neighborhoods. 
:::

GSOC is used by interacting with the GSOC websocket subscription endpoint in the Bee API. However, due to the complexity of interacting directly with the API, most users are recommended to use the [GSOC library](https://github.com/anythread/gsoc) which abstracts away the process, and is also available as an [npm package](https://www.npmjs.com/package/@anythread/gsoc). In the future, this library's functionality will be added to Bee JS.  


## Section 3: Using GSOC 

While it is possible to use GSOC by interacting directly with the newly added `/gsoc/subscribe/{address}` endpoint, it is recommended for most users to employ the [GSOC library](https://github.com/anythread/gsoc) which streamlines the process. The library is also available as an [npm package](https://www.npmjs.com/package/@anythread/gsoc).

The GSOC library provides the `InformationSignal` class which is used to establish a WebSocket connection with a specified consensus for a GSOC and to read/write the GSOC over that connection.

A **service node** uses the `InformationSignal` to set up a WebSocket subscription for listening to updates, while a **writer node** uses the `InformationSignal` in order to send updates that the service node can receive.

The sections below describe how to use the GSOC library to set  up both a service node and writer node.

**Requirements:**
1. A full Bee node and a second light Bee node
2. A small amount of xBZZ and xDAI for purchasing postage stamp batches and uploading to Swarm
3. NodeJS & NPM
4. Mutable batches 

:::warning
***Mutable batches should be used with GSOC*** since every GSOC message will increment one slot of the postage batch *within the same [bucket](https://docs.ethswarm.org/docs/concepts/incentives/postage-stamps#batch-utilisation) each time*. In other words, when an immutable batch is used, the batch will become fully utilized very rapidly (for example, at batch depth 18, it would become fully utilized after 4 GSOC messages). With a mutable batch, you can continue to send GSOC messages indefinitely, as the newer updates will simply overwrite the older ones without causing the batch to become fully utilized and no longer usable.
:::

## Section 3A: Using GSOC - Service Node

The instructions in the steps below use snippets of code from the complete [service node script](https://gist.github.com/NoahMaizels/8485bf71bb734a82fc423115688cc1c1). 

### 1. Install the GSOC Library

Set up the project and install the library using `npm`:

```bash
npm init -y
npm install @anythread/gsoc --save
```

### 2. Import and Config

First, import `InformationSignal` from the gsoc library:

```javascript=
import { InformationSignal } from '@anythread/gsoc';
```

Next, declare global config variables:

```javascript=
// Configuration
const BEE_API = 'http://localhost:1633';
const GSOC_ID = 'comments-v1';
const TARGET_OVERLAY = '7570000000000000000000000000000000000000000000000000000000000000';
const STORAGE_DEPTH = 16; // Number of leading bits to match
```

The config includes: 
- The Bee node's API endpoint (`BEE_API`).
- The `GSOC_ID`, `TARGET_OVERLAY`, and `STORAGE_DEPTH` which are used to generate the GSOC address.

### 3. Initialize *informationSignal* Object

Use the `InformationSignal` class we imported and the `BEE_API` and `GSOC_ID` values we just defined to initialize the `informationSignal` object:

```javascript
// Initialize informationSignal object
const informationSignal = new InformationSignal(BEE_API, {
    consensus: {
      id: GSOC_ID,
      assertRecord: value => {
        if (
          typeof value === 'object' &&
          value !== null &&
          'text' in value &&
          'timestamp' in value
        ) {
          return;
        }
        throw new Error('Invalid GSOC record format: "text" and "timestamp" fields are required');
      },
    },
  });
```

Also note the `assertRecord` function. This optional function can be used to filter out updates by defining an accepted update format. If omitted, the default validation will enforce a string value for the payload.

### 4. Mine *resourceId*

Use the `informationSignal` to mine a `resourceId` such that it can be used to derive a GSOC address which falls into our node's neighborhood:

```javascript=
const minedResult = await informationSignal.mine(TARGET_OVERLAY, STORAGE_DEPTH);
const resourceId = minedResult.resourceId;
```
The `TARGET_OVERLAY` defines the leading bits (in hex format) we wish to target that match our own node's overlay, and the `STORAGE_DEPTH` defines how many leading bits we will mine. 

We should make sure to mine at least as deep as we expect the storage depth to reach during the duration we will use the GSOC.

We can also optionally log the GSOC address (converted to hex format using our helper utility function `uint8ArrayToHex`):

```javascript=
// Log GSOC address in hex format 
const gsocAddress = minedResult.gsocAddress;
console.log(`Mined resourceId for GSOC address: ${uint8ArrayToHex(gsocAddress)}`)
```

### 5. Set Up WebSocket Subscription

Set up GSOC subscription using `resourceId` mined in previous step:

```javascript=
const subscription = informationSignal.subscribe(
    {
        onMessage: payload => console.log('Received GSOC update:', payload),
        onError: err => console.error('Error in subscription:', err),
    },
    resourceId
);
```
This sets up a subscription that listens for updates to the GSOC address in our neighborhood derived from the `resourceId` we mined. 


Here we listen for and log GSOC updates. This is where we could also add other logic for handling updates (such as saving them, storing them on Swarm, or forwarding them elsewhere.)


## Section 3B: Using GSOC - Writer Node

The guide below uses code snippets from [this script for a GSOC writer node](https://gist.github.com/NoahMaizels/8d00e57af5089f43376b1d6380ab166a).

With the service node running and our subscription set up, we can now set up a writer node on another machine in order to send updates to the GSOC. 

Unlike the Service Node, the Writer Node does not need to be a full node, a light node will suffice. 

To get started we start by following steps 1 through 4 from the Service Node instructions described in Section 3.

### 1. Update Config

We need to make small change to the config from step 2:

```javascript=
// Configuration
const BEE_API = 'http://localhost:1633';
const GSOC_ID = 'comments-v1';
const TARGET_OVERLAY = '7570000000000000000000000000000000000000000000000000000000000000';
const STORAGE_DEPTH = 16; // Number of leading bits to match
const BATCH_ID = '17caba8ae704c356f50cb4f3e14568d3462423448334bd7df032298d88d83bb9';
```

The only change is that we added a `BATCH_ID` for a valid mutable postage batch. [Buy a batch](https://docs.ethswarm.org/docs/develop/access-the-swarm/buy-a-stamp-batch) if you don't already have one. 

### 2. Write Data to the GSOC

To send an update, simply call the `write` method on the `informationSignal` object. The payload must follow the rules defined in the consensus:

```typescript
async function writeToGsoc() {
  const payload = { text: 'Hello, Swarm!', timestamp: Date.now() }
  console.log('Writing to GSOC:', payload)
  await informationSignal.write(payload, resourceId)
  console.log('GSOC updated successfully')
}
```

## Section 4: Two Way Communication

The examples above are helpful for understanding the minimal possible GSOC setup, however they are limited in that they allow for only incoming communication by listening over a single GSOC.

For to enable both incoming and outgoing messages, we can employ a setup using multiple GSOC subscriptions. 

In [this example project](https://github.com/NoahMaizels/gsoc-demo), two nodes can use the same script to set up their own GSOC "inbox" for receiving messages, and then send each other messages to each other's respective inbox.

While not covered in detail in this post, this project is a good next step if you are looking for a more in-depth example of GSOC usage.

## Summary

The GSOC feature is like an inbox which is open to receive messages from anyone who knows the rules for messaging. It acts like a messaging system where an event is emitted every time a matching SOC lands in the neighborhood of a service node which is monitoring a GSOC through a websocket connection.

### Key Features Recap:

1. Consensus: The "consensus" refers to the rules for updating the GSOC defined by the service node.
2. Multiple Writers: Anyone who knows the consensus can update the GSOC.
3. Validation Rules: The consensus ensures all updates follow the agreed-upon format.
4. Dynamic Updates: Only the latest update is stored (for now).
5. Neighborhood Scoped Updates: Updates can be listened to only by nodes operating in the neighborhood of the GSOC.
6. One Way Messaging: A single GSOC connection allows for incoming messages only. Combining multiple GSOC connections allows for incoming and outgoing back and forth messages among multiple nodes.


