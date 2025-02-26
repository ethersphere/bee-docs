---
title: GSOC
id: gsoc
---

## Introduction

The Graffiti Single Owner Chunk (GSOC) feature enables a single Bee *service* node to receive messages from multiple Bee *writer* nodes. It is based on a [Single Owner Chunk (SOC)](/docs/develop/tools-and-features/chunk-types/#single-owner-chunks), but unlike a standard SOC, which can be updated only by a single owner, GSOC allows multiple nodes to make updates. The GSOC address is derived so that it falls within the neighborhood of the service node, ensuring updates are automatically synced as part of the normal full node syncing process.  

The service node determines the data used to derive the GSOC private key. Any node with access to this data can derive the same key and update the GSOC. The service node also defines a message format, filtering out non-conforming updates. Nodes which know both the GSOC key derivation data and the expected message format can send messages to the service node. Since only full nodes sync neighborhood chunks, the service node *must be a full node to receive GSOC updates*.  

To receive messages in real time, the service node establishes a WebSocket connection to listen for GSOC update events. When a matching SOC update reaches a node with an active GSOC connection, an event is emitted, enabling the service node to dynamically receive messages as part of a many-to-one notification system.  

:::info  
GSOC was initially introduced in a [SWIP](https://github.com/ethersphere/SWIPs/blob/99e6cf90a4768b24d27e5339b205c18825b53322/SWIPs/swip-draft_graffiti-soc.md#gsoc-identifier), which outlines its core concepts and implementation details, and it is an evolution of the earlier [Graffiti feed](https://github.com/fairDataSociety/FIPs/blob/master/text/0062-graffiti-feed.md) feature.  
:::  

:::warning  
The GSOC feature was introduced in Bee v2.3.0, along with the experimental [GSOC JS library](https://www.npmjs.com/package/@anythread/gsoc). Both are still in development and not recommended for production use.  
:::  

## GSOC Usage Guide

While GSOC can be used by interacting directly with the `/gsoc/subscribe/{address}` endpoint, most users should use the [experimental GSOC library](https://www.npmjs.com/package/@anythread/gsoc), which simplifies the process (GSOC support will soon be added to [bee-js](/docs/develop/tools-and-features/bee-js/) as well).  

The GSOC library provides the `InformationSignal` class, which establishes a WebSocket connection with a GSOC  and enables reading and writing to the GSOC over that connection.  

- A **service node** uses `InformationSignal` to subscribe to GSOC update events.  
- A **writer node** uses `InformationSignal` to update the GSOC in order to send messages that the service node can receive.  

### Requirements

To use GSOC, you need:  

1. A full Bee node and a second light Bee node  
2. A small amount of xBZZ and xDAI for postage stamp purchases and uploads  
3. NodeJS & NPM  
4. A mutable stamp batch (*set the* [`immutable` header parameter](/api/#tag/Postage-Stamps/paths/~1stamps~1%7Bamount%7D~1%7Bdepth%7D/post) *to `false` when* [buying a batch](/docs/develop/access-the-swarm/buy-a-stamp-batch#buying-a-stamp-batch))  

:::warning  
Only ***mutable*** postage stamp batches should be used for GSOC.

Since each GSOC update utilizes one slot within the ***same*** [postage batch bucket](/docs/concepts/incentives/postage-stamps#batch-utilisation), immutable batches will fill up very quickly (e.g., at depth 18, four GSOC messages exhaust the batch).  

Mutable batches allow updates to overwrite older ones, preventing full utilization and enabling indefinite GSOC messaging as long as the batch is still has remaining TTL.  
:::  


### GSOC Configuration  

A service node defines parameters for generating the GSOC private key. Writer nodes must use the same parameters to send GSOC messages.  

1. **`GSOC_ID`** – A unique identifier.  
2. **`TARGET_OVERLAY`** – The overlay address of the service node.  
3. **`STORAGE_DEPTH`** – Defines how many prefix bits in the `TARGET_OVERLAY` must match in the mined GSOC address.  

Additionally, the service node may define a message format to filter out unwanted messages. Writer nodes must follow this format to ensure their updates are accepted. In the code examples below, the format is enforced via the `assertRecord` function.  

## Service Node

✅ For your service node project, you must use a ***full node***.

❌ A service node does not need a postage stamp batch.

### Initialize Project

First initialize the service node project:

```bash
mkdir service-node
cd service-node
npm init -y && npm pkg set type="module" && cat package.json
npm install @anythread/gsoc --save
```
The command first creates the `service-node` directory, changes into that directory, initializes a `package.json` file and sets `"type": "module"` in the file.

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
import { InformationSignal } from '@anythread/gsoc';

// Configuration
const BEE_API = 'http://localhost:1633';
const GSOC_ID = 'identifier-abc';
const TARGET_OVERLAY = '75703155f54cbb899a359a7e3daec75da7722baef9286522e58e86ccbfcd7f13';
const STORAGE_DEPTH = 12; // Number of leading bits to match

// Utility: Convert Uint8Array to Hex String
function uint8ArrayToHex(uint8Array) {
  return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validation function for GSOC messages
const assertRecord = value => {
  if (typeof value === 'object' && value !== null && 'text' in value && 'timestamp' in value) return;
  throw new Error('Invalid GSOC record format: Only "text" and "timestamp" fields are allowed');
};

// Use assertRecord and configuration constants to initialize "informationSignal" 
async function createGsocListener(assertRecord)
{
  const informationSignal = new InformationSignal(BEE_API, {
    consensus: { id: GSOC_ID, assertRecord },
  });

  console.log('Mining resourceId...');
  // Mine a resourceId using TARGET_OVERLAY and STORAGE_DEPTH which is used to derive the GSOC address such that the GSOC chunk falls into the service node's neighborhood
  const minedResult = await informationSignal.mine(TARGET_OVERLAY, STORAGE_DEPTH);
  const resourceId = minedResult.resourceId;

  // Log GSOC address in hex format
  const gsocAddress = minedResult.gsocAddress;
  console.log(`Mined resourceId for GSOC address: ${uint8ArrayToHex(gsocAddress)}`);

  // Subscribe to the GSOC address
  const subscription = informationSignal.subscribe(
    {
      onMessage: payload => console.log('Received GSOC update:', payload),
      onError: err => console.error('Error in subscription:', err),
    },
    resourceId
  );

  console.log('Listening for GSOC updates...');
}

  

createGsocListener(assertRecord).catch(err => console.error('Error:', err.message));
```

### Update Configuration

Update the configuration section constants with your own information:

* Set `BEE_API` to your own node's endpoint
* Set `GSOC_ID` to a unique identifier string which will also be used by the writer node
* Set `TARGET_OVERLAY` to your own node's overlay [address](/api/#tag/Connectivity/paths/~1addresses/get)
* Set `STORAGE_DEPTH` to the [current network radius](https://swarmscan.io/neighborhoods) value (11 at time of writing) or higher. 

:::warning
If the network radius value raises past the `STORAGE_DEPTH` value then GSOC will not work properly (since it will no longer necessarily fall within the neighborhood of the storage node), so it's best practice to choose a `STORAGE_DEPTH` a little higher than the current network radius (such as network radius + 1 or +2). 
:::

### Run Service Node Script

Start the service node:

```bash
node index.js
```

If everything is working right you should see output like this:

```bash
Mining resourceId...
Mined resourceId for GSOC address: 757e53c46e1f97f57d82da743001d62dba65e756722b393e840cdfa754c2fb24
Listening for GSOC updates...
```

This means the service node has successfully mined a GSOC chunk that it falls into its own neighborhood, and is now listening for updates on that chunk.

:::tip
Note that the first 3 leading digits of the GSOC overlay address ("757) matches our own node's address (the address specified in the `TARGET_OVERLAY` constant). With each hexadecimal digit equal to 4 bits, this means the GSOC will still fall within our node's own neighborhood even if the storage radius raises to 12, but may fall out of our own node's neighborhood if it raises any further.
:::

## Writer Node
 
✅ For your writer node, either a light or a full node can be used 

✅ A writer node needs a valid ***mutable*** (not technically required, but strongly recommended) postage stamp batch in order to send GSOC messages 

### Initialize Project

We initialize our writer node using almost the same command as our service node.

```bash
mkdir writer-node
cd writer-node
npm init -y && npm pkg set type="module" && cat package.json
npm install @anythread/gsoc --save
```
The command first creates the `writer-node` directory, moves into that directory, initializes a `package.json` file and sets `"type": "module"` in the file.

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
import { InformationSignal } from '@anythread/gsoc';

// Configuration
const BEE_API = 'http://localhost:1643';
const BATCH_ID = '42a10176596ecc73dcd24b91a16fb77d874ebd108fe8bc7fb896c8e89e8cb06e';
const GSOC_ID = 'identifier-abc';
const TARGET_OVERLAY = '75703155f54cbb899a359a7e3daec75da7722baef9286522e58e86ccbfcd7f13';
const STORAGE_DEPTH = 12; // Number of leading bits to match

// Utility: Convert Uint8Array to Hex String
function uint8ArrayToHex(uint8Array) {
  return Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Validation function for GSOC messages
const assertRecord = value => {
  if (typeof value === 'object' && value !== null && 'text' in value && 'timestamp' in value) return;
  throw new Error('Invalid GSOC record format: Only "text" and "timestamp" fields are allowed');
};

async function sendGsocMessage(payload, description) {

  const informationSignal = new InformationSignal(BEE_API, {
    postage: BATCH_ID,
    consensus: { id: GSOC_ID, assertRecord },
  });

  console.log('Mining a new GSOC address...');

  // Mine a resourceId using TARGET_OVERLAY and STORAGE_DEPTH which is used to derive the GSOC address such that the GSOC chunk falls into the service node's neighborhood
  const minedResult = await informationSignal.mine(TARGET_OVERLAY, STORAGE_DEPTH);
  const resourceId = minedResult.resourceId;
  const gsocAddress = uint8ArrayToHex(minedResult.gsocAddress);

  console.log(`Mined GSOC Address: ${gsocAddress}`);

  try {
    const soc = await informationSignal.write(payload, resourceId);
    console.log(`Message sent successfully! SOC Address: ${uint8ArrayToHex(soc.address())}`);
  } catch (error) {
    console.error(`Failed to send ${description} message:`, error.message);
  }
}

async function main() {
  const payload = { text: 'Hello there, GSOC!', timestamp: Date.now() };

  console.log('Sending message...');
  await sendGsocMessage(payload, 'valid');

  console.log('Exiting after sending messages...');
}

main().catch(err => console.error('Error:', err.message));
```

### Update Configuration

Update the configuration section constants with your own information:

* Set `BEE_API` to your own node's endpoint 
* Set `BATCH_ID` to the batch id of a valid, *mutable* postage stamp batch - [buy a batch](/docs/develop/access-the-swarm/buy-a-stamp-batch) if needed
* Set `GSOC_ID` to a unique string - *this must be the same as the `GSOC_ID` used by the service node!*
* Set `TARGET_OVERLAY` to the *service node's* [overlay address](/api/#tag/Connectivity/paths/~1addresses/get) (so `TARGET_OVERLAY` should be the same for both our writer and service node)
* Set `STORAGE_DEPTH` to the same depth you used with the service node.

After updating the configuration, run the writer node script (before running the writer node script, make sure the service node script has already been started and is currently listening):

### Run Writer Node Script

```bash
node index.js
```

If everything is working properly, on your writer node you should see output like this:

```bash
Sending message...
Mining a new GSOC address...
Mined GSOC Address: 757e53c46e1f97f57d82da743001d62dba65e756722b393e840cdfa754c2fb24
Message sent successfully! SOC Address: 757e53c46e1f97f57d82da743001d62dba65e756722b393e840cdfa754c2fb24
Exiting after sending messages...
```

While on our service node, we should receive the update: 

```bash
Received GSOC update: { text: 'Hello there, GSOC!', timestamp: 1740542518302 }
```

Congratulations! You've just sent your first GSOC message.


