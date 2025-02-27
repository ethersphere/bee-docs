---
title: GSOC
id: gsoc
---

## Introduction

The Graffiti Single Owner Chunk (GSOC) feature enables a single Bee *service* node to receive messages from multiple Bee *writer* nodes. It is based on a [Single Owner Chunk (SOC)](/docs/develop/tools-and-features/chunk-types/#single-owner-chunks) with an address which is derived so that it falls within the neighborhood of the service node, ensuring updates are automatically synced as part of the normal full node syncing process. 

The service node determines the data used to derive the GSOC private key. Any node with access to this data can derive the same private key and update the GSOC in order to send messages to the service node. Since only full nodes sync neighborhood chunks, the service node *must be a full node to receive GSOC updates*.  

To receive messages in real time, the service node establishes a WebSocket connection to listen for GSOC update events. When a matching SOC update reaches a node with an active GSOC connection, an event is emitted, enabling the service node to dynamically receive messages as part of a many-to-one notification system.  

:::info  
GSOC was initially introduced in a [SWIP](https://github.com/ethersphere/SWIPs/blob/99e6cf90a4768b24d27e5339b205c18825b53322/SWIPs/swip-draft_graffiti-soc.md#gsoc-identifier), which outlines its core concepts and implementation details, and it is an evolution of the earlier [Graffiti feed](https://github.com/fairDataSociety/FIPs/blob/master/text/0062-graffiti-feed.md) feature.  
:::  

## *bee-js* GSOC Methods

While you can interact with GSOC directly via the `/gsoc/subscribe/{address}` endpoint, the [bee-js](/docs/develop/tools-and-features/bee-js/) library is the recommended way for most users. The library includes three methods which make it easy to get started with GSOC:

### `Bee.gsocMine()`

The `Bee.gsocMine` method mines a GSOC private key corresponding to a specific overlay address: 

- The service node uses this method to generate the private key for a GSOC in its own neighborhood, and then uses it with the `gsocSubscribe` method to listen for updates from writer nodes. 
- A writer node uses this method to generate the private key it uses to send messages to the service node with the `gsocSend()` method. 

#### Parameters

- **`targetOverlay`** (`PeerAddress | Uint8Array | string`) – The overlay address of the service node.
- **`identifier`** (`Identifier | Uint8Array | string`) – A unique, arbitrary value that can be modified to mine a GSOC private key derived from a specific value.
- **`proximity`** (`number`, default: `16`) – Determines the neighborhood depth, i.e., how many prefix bits match between `targetOverlay` and the mined GSOC overlay address.

The function returns a mined private key, which corresponds to a GSOC overlay address that falls within the `targetOverlay` neighborhood.

#### Functionality:

1. Mines and returns a private key that generates a GSOC overlay address within the specified `proximity` of `targetOverlay`.
2. The service node uses this method to mine a GSOC chunk whose overlay falls within its own neighborhood, and shares the values used as input with the writer node (`targetOverlay`, `identifier`, and `proximity`). 
3. The writer node uses this method with the input values shared from the service node to generate the private key that allows it to send messages as updates to the mined GSOC. 

This function allows users to derive a GSOC overlay address that aligns with a target node’s network neighborhood.

### `Bee.gsocSend()`

The `Bee.gsocSend` method is used by a writer node for sending GSOC messages. It creates an update for the GSOC using the provided `data` as the message, signs the update with the private key mined by the `gsocMine()` method, and uploads it to Swarm. 

#### Parameters:

- **`postageBatchId`** (`BatchId | Uint8Array | string`) – The ID of the postage batch used to pay for the upload.
- **`signer`** (`PrivateKey | Uint8Array | string`) – The private key used to sign the chunk.
- **`identifier`** (`Identifier | Uint8Array | string`) – A unique identifier for the GSOC.
- **`data`** (`string | Uint8Array`) – The payload to be sent.
- **`options`** (`UploadOptions`, optional) – Additional upload configuration.
- **`requestOptions`** (`BeeRequestOptions`, optional) – Custom request options.

#### Functionality:

1. Used by the writer node to send a GSOC message using the private key returned from `gsocMine()`.
2. Requires the `postageBatchId` for a valid postage stamp batch (ideally [mutable](/docs/develop/tools-and-features/gsoc#script-requirements)) to send messages.


### `Bee.gsocSubscribe()`

The `Bee.gsocSubscribe` method is used by the service node to establish a WebSocket connection to listen for GSOC messages. It subscribes to messages associated with a specific `address` and `identifier`. 

#### Parameters:

- **`address`** (`EthAddress | Uint8Array | string`) – The Gnosis Chain address associated with the private key returned by the `gsocMine()` function.
- **`identifier`** (`Identifier | Uint8Array | string`) – A unique identifier used to track the messages.
- **`handler`** (`GsocMessageHandler`) – A callback function to handle incoming messages.

#### Functionality:

1. The function is used by the service node to construct a GSOC address using the provided `identifier` and `address`.
2. A WebSocket connection is opened to subscribe to update events for this GSOC address.
3. Incoming messages are processed by the `handler` function.
4. The function returns a `GsocSubscription` object with a `cancel` method to terminate the subscription.

## Example Scripts

The service node and writer node scripts below are a minimalistic example of how to use `bee-js` to set up a service node to listen for GSOC messages, and a writer node to send GSOC messages.

### Script Requirements

To run both nodes and send messages from the writer node to the service node you will need:

1. A fully synced Bee full node for the service node and a second Bee light node for the writer node (they do not both need to be running on the same machine) 
2. A small amount of xDAI (~0.01) and xBZZ (~0.01)
3. [NodeJS](https://nodejs.org/en) & [NPM](https://www.npmjs.com/)  
4. A mutable stamp batch (*set the* [`immutable` header parameter](/api/#tag/Postage-Stamps/paths/~1stamps~1%7Bamount%7D~1%7Bdepth%7D/post) *to `false` when* [buying a batch](/docs/develop/access-the-swarm/buy-a-stamp-batch#buying-a-stamp-batch))  

:::warning  
Only ***mutable*** postage stamp batches should be used for GSOC.

Since each GSOC update utilizes one slot within the ***same*** [postage batch bucket](/docs/concepts/incentives/postage-stamps#batch-utilisation), immutable batches will fill up very quickly (e.g., at depth 18, four GSOC messages exhaust the batch).  

Mutable batches allow updates to overwrite older ones, preventing full utilization and enabling indefinite GSOC messaging as long as the batch still has remaining TTL.  
:::  


### Service Node Script

✅ For your service node project, you must use a ***full node***.

❌ A service node does not need a postage stamp batch.

#### Initialize Project

First, initialize the service node project on a machine running a full Bee node in the background:

```bash
mkdir service-node
cd service-node
npm init -y && npm pkg set type="module" && cat package.json
npm install @upcoming/bee-js --save
```
The command first creates the `service-node` directory, moves into that directory, initializes a `package.json` file, sets `"type": "module"` in the file, and finally installs the `bee-js` library.

Next create a file named `index.js` which will hold the code for our service node.

```bash
touch index.js
```

Then open in your editor of choice:

```bash
vi index.js
```

Copy the completed code below for a service node into our newly created `index.js` file:

:::tip
Read through the code and code comments for a more in-depth understanding of how the service node works.
:::

```javascript
import { Bee, NULL_IDENTIFIER } from '@upcoming/bee-js';

// Configuration
const BEE_HOST = 'http://localhost:1633'; // Change this if necessary
const BEE_PROXIMITY = 12 // Mining depth of the GSOC overlay - modified from the default of 16 for a shorter mining time

const BEE = new Bee(BEE_HOST, {});
async function mineGsocKey() {
    console.log('Fetching node addresses...');
    const addresses = await BEE.getNodeAddresses();
    const privateKey = BEE.gsocMine(addresses.overlay, NULL_IDENTIFIER, BEE_PROXIMITY); // `NULL_IDENTIFIER` is a constant `Uint8Array(32)` imported from `bee-js` for use as a default identifier
    console.log('Mining completed. Public Key:', privateKey.publicKey().toCompressedHex());
    return privateKey;
}

async function createGsocListener() {
    try {
        const privateKey = await mineGsocKey();
        // Subscribe to GSOC messages
        const subscription = BEE.gsocSubscribe(privateKey.publicKey().address(), NULL_IDENTIFIER, {
            onMessage: message => console.log('Received GSOC update:', message.toJSON()),
            onError: err => console.error('Error in subscription:', err),
        });

        console.log('Listening for GSOC updates...');

        return { privateKey, subscription };
    } catch (err) {
        console.error('Error:', err.message);
    }
}

(async () => {
    await createGsocListener();
})();
```

#### Update Configuration

Update the constants in the configuration section with your own information:

* Update `BEE_HOST` if your node is not using the default `http://localhost:1633`. 

#### Run Service Node Script

Start the service node:

```bash
node index.js
```

If everything is working correctly, after a few seconds you should see output like this:

```bash
Fetching node addresses...
Node overlay address:  75703155f54cbb899a359a7e3daec75da7722baef9286522e58e86ccbfcd7f13
Mining completed. Public Key: e82d2c98a92a3b0c690f6ba28070c59e3e0cd0a2a384d3b03cba9d1fded41a9831e73a3232d85b3614833d344c7d502dd09d7ecd0614b06095c86be0c8501460
Listening for GSOC updates...
```

This means the service node has successfully mined a GSOC chunk that it falls into its own neighborhood, and is now listening for updates on that chunk. Copy the `Node overlay address:` value (`75703155f54cbb899a359a7e3daec75da7722baef9286522e58e86ccbfcd7f13` from the example output) and save it - we will need it for our writer node's configuration.

### Writer Node Script
 
✅ For your writer node, either a light or a full node can be used

✅ A writer node needs a valid ***mutable*** (not technically required, but [strongly recommended](/docs/develop/tools-and-features/gsoc#script-requirements)) postage stamp batch in order to send GSOC messages 

#### Initialize Project

We initialize our writer node using almost the same command as our service node, only the directory name has been changed.

```bash
mkdir writer-node
cd writer-node
npm init -y && npm pkg set type="module" && cat package.json
npm install @upcoming/bee-js --save
```
The command first creates the `writer-node` directory, moves into that directory, initializes a `package.json` file, sets `"type": "module"` in the file, and finally installs the `bee-js` library.

Next create a file named `index.js` which will hold the code for our writer node.

```bash
touch index.js
```

Then open in your editor of choice:

```bash
vi index.js
```

Copy the completed code below for a writer node into our newly created `index.js` file:

:::tip
Read through the code and code comments for a more in-depth understanding of how the writer node works.
:::

```javascript
import { Bee, NULL_IDENTIFIER } from '@upcoming/bee-js';

// Configuration
const BEE_HOST = 'http://localhost:1643'; // Change this if necessary
const BEE_BATCH = '42a10176596ecc73dcd24b91a16fb77d874ebd108fe8bc7fb896c8e89e8cb06e'; // Ensure this is a valid hex string
const TARGET_OVERLAY = '75703155f54cbb899a359a7e3daec75da7722baef9286522e58e86ccbfcd7f13'; // Overlay of service node writer node wants to message
const BEE_PROXIMITY = 12  // Mining depth of the GSOC overlay - modified from the default of 16 for a shorter mining time

const BEE = new Bee(BEE_HOST, {});

async function mineGsocKey() {
    const privateKey = BEE.gsocMine(TARGET_OVERLAY, NULL_IDENTIFIER, BEE_PROXIMITY); // `NULL_IDENTIFIER` is a constant `Uint8Array(32)` imported from `bee-js` for use as a default identifier
    console.log('Mining completed. Public Key:', privateKey.publicKey().toCompressedHex());
    return privateKey;
}

async function sendGsocMessage(privateKey, name, body) {
    if (!privateKey) {
        console.error('Error: Private key is not available');
        return;
    }

    if (!/^[0-9a-fA-F]{64}$/.test(BEE_BATCH)) {
        console.error('Error: Invalid BEE_BATCH. It must be a 64-character hex string.');
        return;
    }

    const message = JSON.stringify({ name, body });
    await BEE.gsocSend(BEE_BATCH, privateKey, NULL_IDENTIFIER, message); 
    console.log('Message sent:', message);
}

(async () => {
    const privateKey = await mineGsocKey();

    // Example: Sending a message after a delay (simulate user input)
    setTimeout(() => {
        sendGsocMessage(privateKey, 'Alice', 'Hello from Node.js!');
    }, 5000);
})();
```

#### Update Configuration

Update the configuration section constants with your own information:

* Set `BEE_HOST` to your writer node's API endpoint
* Set `BEE_BATCH` to the batch id of a valid, *mutable* postage stamp batch - [buy a batch](/docs/develop/access-the-swarm/buy-a-stamp-batch) if needed
* Set `TARGET_OVERLAY` to the service node overlay value we copied from the output of the service node script 

After updating the configuration, run the writer node script (before running the writer node script, make sure the service node script has already been started and is currently listening for GSOC updates):

#### Run Writer Node Script

```bash
node index.js
```

If everything is working correctly, after a few moments on your writer node you should see output like this:

```bash
Mining completed. Public Key: e82d2c98a92a3b0c690f6ba28070c59e3e0cd0a2a384d3b03cba9d1fded41a9831e73a3232d85b3614833d344c7d502dd09d7ecd0614b06095c86be0c8501460
Message sent: {"name":"Alice","body":"Hello from Node.js!"}
```

While in the output from our service node, we should receive the update: 

```bash
Received GSOC update: { name: 'Alice', body: 'Hello from Node.js!' }
```

Congratulations! You've just sent your first GSOC message.


