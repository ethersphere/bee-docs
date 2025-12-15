---
title: Manage Files
id: files
sidebar_label: Manage Files
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Manage Files

Swarm does not have a traditional filesystem — there are no mutable directories, in-place updates, or a built-in directory structure that defines relationships between files. Instead, these capabilities are provided through the use of [manifests](/docs/develop/tools-and-features/manifests), which map relative paths (such as `/images/cat.jpg`) to immutable Swarm content references. When you upload a directory, Bee creates a manifest automatically. This provides filesystem-like behavior for your data: files can be accessed by their path relative to the manifest reference, and the directory structure can be changed later by publishing a new version of the manifest with the desired updates.

## Usage and Example Scripts

This section walks through how to use manifests to provide filesystem-like features on Swarm, from uploading directories to adding or moving files by updating the manifest.

The full working scripts are available in the [examples](https://github.com/ethersphere/examples) repo:

* [`upload-directory.js`](https://github.com/ethersphere/examples/blob/main/utils/upload-directory.js)
* [`script-01.js`](https://github.com/ethersphere/examples/blob/main/filesystem/script-01.js)
* [`script-02.js`](https://github.com/ethersphere/examples/blob/main/filesystem/script-02.js)
* [`script-03.js`](https://github.com/ethersphere/examples/blob/main/filesystem/script-03.js)

:::info Website routing
Manifests are also used for website routing (index documents, clean URLs, error pages, redirects). If you are building a website, see the [Routing guide](/docs/develop/routing).
:::

### Prerequisites

* Node.js (v20+ recommended)
* npm
* A running Bee node (local or remote)
* A funded postage batch

Clone the [examples](https://github.com/ethersphere/examples) repo and navigate to the manifests directory:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/filesystem
npm install
```

Update the `<BATCH_ID>` in the `.env` file with a valid batch ID, and make sure that `BEE_URL` is set to the RPC endpoint for your Bee node:

```bash
BEE_URL=http://localhost:1633 # or http://127.0.0.1:1633  
BATCH_ID=<BATCH_ID>
UPLOAD_DIR=./folder
SCRIPT_02_MANIFEST=<MANIFEST_REFERENCE>
SCRIPT_03_MANIFEST=<MANIFEST_REFERENCE>
```

## Example 1: Upload Folder and Inspect Manifest

In this example, we simply upload a folder and print its manifest in a human readable format.

:::info
Uploading is handled by a utility script:
* [`upload-directory.js`](https://github.com/ethersphere/examples/blob/main/utils/upload-directory.js)

The script:
* Uploads a directory using `bee.uploadFilesFromDirectory`
* Returns the manifest reference and prints it to the terminal

The directory upload utility script itself looks like this:

```js
const { reference } = await bee.uploadFilesFromDirectory(batchId, path, options);
```

The returned `reference` is the **manifest hash**, not a file hash. Files must always be accessed *through* this manifest, not directly through file references shown in the manifest.
:::


Run the script:

```bash
node script-01.js
```

Script terminal output:

```bash
[dotenv@17.2.3] injecting env (3) from .env -- tip: ⚙️  override existing env vars with { override: true }

Uploaded directory: C:\Users\username\Documents\examples\filesystem\folder

Reference: http://127.0.0.1:1633/bzz/bf5fa30cf426fe9b646db8cb1dfcb8fd146096e6a86c1de2b266689346e703c8

Manifest reference: bf5fa30cf426fe9b646db8cb1dfcb8fd146096e6a86c1de2b266689346e703c8
root.txt: ROOT DIRECTORY
subfolder/nested.txt: NESTED DIRECTORY

--- Manifest Tree ---
{
  "path": "",
  "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "metadata": null,
  "forks": {
    "/": {
      "path": "/",
      "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "metadata": {
        "website-index-document": "disc.jpg"
      },
      "forks": {}
    },
    "disc.jpg": {
      "path": "disc.jpg",
      "target": "0xc4df63219e294cf412b4ad77169c8c6a30077af1b4160c3db6d536fdb7cc91df",
      "metadata": {
        "Content-Type": "image/jpeg",
        "Filename": "disc.jpg"
      },
      "forks": {}
    },
    "root.txt": {
      "path": "root.txt",
      "target": "0x45b3c65f9bcba9150247878baf9120836a51e62f61f7397270227a71ed94bfaf",
      "metadata": {
        "Content-Type": "text/plain; charset=utf-8",
        "Filename": "root.txt"
      },
      "forks": {}
    },
    "subfolder/nested.txt": {
      "path": "subfolder/nested.txt",
      "target": "0x7ca0eb93e9b5802fa5c62ca8e2ef84fffa73a0f589ef68fc457beccbb2b1f84f",
      "metadata": {
        "Content-Type": "text/plain; charset=utf-8",
        "Filename": "subfolder\\nested.txt"
      },
      "forks": {}
    }
  }
}
```

In the example output, you will find the following line (with your own unique manifest reference):

```bash
Manifest reference: bf5fa30cf426fe9b646db8cb1dfcb8fd146096e6a86c1de2b266689346e703c8
```

Update `SCRIPT_02_MANIFEST` in your `.env` file with the printed **manifest reference**:

```bash
SCRIPT_02_MANIFEST=bf5fa30cf426fe9b646db8cb1dfcb8fd146096e6a86c1de2b266689346e703c8
```

### Explanation

1. Get path

First we get the path to our upload directory as specified in the `.env` file by the `UPLOAD_DIR` variable:

```bash
const directoryPath = path.join(__dirname, process.env.UPLOAD_DIR);
```

2. Upload 

Then we upload the directory using our imported `uploadDirectory` utility function and set the index document to the "disc.jpg" in the root of our folder. Upon successful upload, the manifest reference is saved in `reference` and printed to the terminal:

```bash
const reference = await uploadDirectory(directoryPath, { indexDocument: "disc.jpg" });
console.log("Manifest reference:", reference.toHex());
```

3. Print manifest

After upload, the manifest is loaded and printed:

```js
const node = await MantarayNode.unmarshal(bee, reference)
await node.loadRecursively(bee)
printManifestJson(node)
```

This produces a tree showing how paths map to Swarm references. To better understand the tree shown in the terminal output, refer to the [Manifests](/docs/develop/tools-and-features/manifests) page.

In the next script, we see how to update the manifest tree.

## Adding a File to an Existing Manifest

The second script demonstrates how to add a new file without re-uploading the entire directory.

Full script:

* [`script-02.js`](https://github.com/ethersphere/examples/blob/main/manifests/directory/script-02.js)

:::tip
Before running the second script, make sure that you have updated your `.env` variable `SCRIPT_02_MANIFEST` with the manifest reference returned by the first script.
:::

```bash
node script-01.js
```

The terminal output will be similar to that from our first script except with several key differences:

1. Updated manifest reference

Since we've updated the manifest, we now have a new manifest reference:

```bash
Updated manifest hash: aaec0f55d6e9216944246f5adce0834c69b55ac2164ea1f5777dadf545b8f3bc
```

Update `SCRIPT_03_MANIFEST` in your `.env` file with the **Updated manifest hash**:

```bash
SCRIPT_03_MANIFEST=aaec0f55d6e9216944246f5adce0834c69b55ac2164ea1f5777dadf545b8f3bc
```

2. Modified directory tree

```bash
"new.txt": {
    "path": "new.txt",
    "target": "0x3515db2f5e3c075b7546d7dd7dea1680c3e0785c6584e66b7e4f56fc344a0a78",
    "metadata": {
      "Content-Type": "text/plain; charset=utf-8",
      "Filename": "new.txt"
    },
    "forks": {}
  }
```

### Explanation

1. Load the existing manifest returned from the first script:

```js
const node = await MantarayNode.unmarshal(bee, ROOT_MANIFEST)
await node.loadRecursively(bee)
```

2. Upload a new file we intend to add to the manifest (not a directory):

```js
const { reference } = await bee.uploadData(batchId, bytes)
```

3. Insert the file into the manifest:

```js
node.addFork(filename, reference, metadata)
```

4. Save the updated manifest:

```js
const updated = await node.saveRecursively(bee, batchId)
```

This produces a **new manifest reference** where the file is now accessible by path, for example:

```bash
swarm-cli download aaec0f55d6e9216944246f5adce0834c69b55ac2164ea1f5777dadf545b8f3bc/new.txt ./
new.txt OK
```
Print file contents to confirm:

```bash
cat .\new.txt
Hi, I'm new here.
```

Our new file is now accessible through the same manifest reference along with all our other files. 

## Moving a File by Editing the Manifest

The third script shows how to move a file by modifying paths in the manifest.

:::tip
Before running the third script, make sure that you have updated your `.env` variable `SCRIPT_03_MANIFEST` with the manifest reference returned by the second script (see terminal output from `Updated manifest hash:`).
:::

Full script:

* [`script-03.js`](https://github.com/ethersphere/examples/blob/main/manifests/directory/script-03.js)

This is done by:

1. Locating the existing file entry
2. Removing it from its current path
3. Re-adding it under a new path

Run the script:

```bash
node script-03.js
```

The output should look familiar, but again with several key changes:

1. Updated manifest reference

Since we've made another change to the manifest, we have a new manifest hash:

```bash
Updated manifest hash: 9a4a6305c811b2976498ef38270fffeb16966fc8719f745a4b18598d39e77ae0
```

2. Modified directory tree

We no longer see the entry for `new.txt` at the root directory, and we now have a new entry for the same file but now at an updated path in a nested directory:

```bash
"nested/deeper/new.txt": {
  "path": "nested/deeper/new.txt",
  "target": "0x3515db2f5e3c075b7546d7dd7dea1680c3e0785c6584e66b7e4f56fc344a0a78",
  "metadata": {
    "Content-Type": "text/plain; charset=utf-8",
    "Filename": "new.txt"
  },
  "forks": {}
}
```

### Explanation

1. Remove entry 

Remove the entry for `new.txt` which was added by the second script:

```js
node.removeFork("new.txt")
```

2. Add new entry 

Add a new entry for `new.txt` in a new location in a nested directory:

```js
node.addFork(
  "nested/deeper/new.txt",
  fileRef,
  metadata
)
```

3. Save and print

```bash
const updated = await node.saveRecursively(bee, batchId);
const newManifestRef = updated.reference.toHex();
```

After saving the manifest again, the file becomes accessible at:

```
/nested/deeper/new.txt
```

No data is duplicated, the `new.txt` file has not been modified, only the path mapping changes in the manifest.

## Key Takeaways

* Uploading a directory creates a manifest
* Files are accessed via the manifest, not directly by their internal hashes
* Manifests can be modified to add, move, or remove files
* Updating a manifest produces a new reference, but underlying data remains immutable
* This provides filesystem-like behavior without mutable storage

With these tools, you can treat Swarm directories much like a filesystem — while still preserving immutability and content addressing.

