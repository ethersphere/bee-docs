---
title: Manifests ("Virtual Filesystem")
id: manifests
sidebar_label: Manifests ("Virtual Filesystem")
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Bee nodes — along with tools used for working with them like `bee-js` and `swarm-cli` — let you upload whole folders of files to Swarm.

Swarm doesn’t technically have a filesystem, but can *act like one* using **manifests**, which map readable paths (like `/images/cat.jpg`) to immutable Swarm references.

:::info
The `bee-js` [`MantarayNode` class](https://github.com/ethersphere/bee-js?tab=readme-ov-file#swarm-primitives) is the main way to work with manifests in NodeJS.

The name comes from an older (now deprecated) library, so you may still see manifests referred to as **“Mantaray manifests.”**
:::

A manifest is stored as a compact, binary-encoded **prefix trie**. Each node in the trie represents part of a file path and may contain:

- a path segment
- a trie fork
- a reference to the root chunk of the file’s Swarm hash
- file metadata (content type, filename, etc.)

:::info
A **trie** is a special type of tree that stores data based on **shared prefixes**.  
This makes lookups fast and avoids repeating long path segments.
:::

Manifests give Swarm two powerful features:

- A **filesystem-like structure** that preserves the directory layout of uploaded folders.
- **Clean, customizable website routing**, such as mapping `/about`, `/about/`, and `/about.html` to the same file or redirecting old paths to new ones.

:::info
Manifests are stored on Swarm as raw binary data.  
To work with them, these bytes must be **unmarshalled** (decoded) into a structured form.

Although `bee-js` provides this functionality through the `MantarayNode` class, although in theory could be done with any language as long as it preserves the trie data.

After unmarshalling, the data is still quite low-level (for example, many fields are `Uint8Array` values) and usually needs additional processing to make it human-readable. You can find a [script for this in the `ethersphere/examples` repo](https://github.com/ethersphere/examples/blob/main/manifests/printManifestJson.js).
:::

## Introduction to Manifests

Whenever you upload a folder using Bee’s `/bzz` endpoint (and tools built on top of it such as `bee-js` and `swarm-cli`), Bee automatically creates a manifest that records:

- every file inside the folder
- the file’s relative path
- metadata (content type, filename, etc.)
- optional website metadata (index document, error document)

Uploads made through the Bee API using `/bytes` or `/chunks` **do not** create manifests.  
However, most developers rarely use these endpoints directly unless they’re building for some custom use-case.

Because `bee-js` and `swarm-cli` call `/bzz` when appropriate, **you get a manifest automatically** whenever you upload a directory.

:::important
Although working with a manifest may _feel_ like moving or deleting files in a regular filesystem, **no data on Swarm is ever changed**, because all content is immutable.

When you "modify" a manifest, you’re actually creating a _new_ manifest based on the previous one.  
Removing an entry only removes it from the manifest — the underlying file remains available as long as its postage batch is valid.
:::

:::tip
You can find complete examples of all manifest scripts in the ethersphere/examples repo under  
[`/manifests`](https://github.com/ethersphere/examples/tree/main/manifests).

The `bee-js` [`cheatsheet.ts`](https://github.com/ethersphere/bee-js/blob/master/cheatsheet.ts) and  
[manifest source code](https://github.com/ethersphere/bee-js/blob/master/src/manifest/manifest.ts)  
are also excellent references.
:::

## Manifest Structure Explained

The printed output below shows a **decoded Mantaray manifest** (printed using the `printManifestJson` method from the [`manifestToJson.js` script in the examples repo](https://github.com/ethersphere/examples/blob/main/manifests/manifestToJson.js)), represented as a tree of nodes and forks. Each part plays a specific role in describing how file paths map to Swarm content. Here’s what each piece means.

```json
{
    "path": "/",
    "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "metadata": null,
    "forks": {
        "folder/": {
            "path": "folder/",
            "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "metadata": null,
            "forks": {
                "nested.txt": {
                    "path": "nested.txt",
                    "target": "0x9442e445c0d58adea58e0a8afcdcc28ed7642d7a4ff9a253e8f1595faafbb808",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "nested.txt"
                    },
                    "forks": {}
                },
                "subfolder/deep.txt": {
                    "path": "subfolder/deep.txt",
                    "target": "0x6aa935879ad2a547e57ea6350338bd04ad758977b542e86b31c159f31834b8fc",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "deep.txt"
                    },
                    "forks": {}
                }
            }
        },
        "root.txt": {
            "path": "root.txt",
            "target": "0x98e63f7e826a01634881874246fc873cdf06bb5409ff5f9ec61d1e2de1dd3bf6",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "root.txt"
            },
            "forks": {}
        }
    }
}

```

#### **Node:**

A **Node** represents a position within the manifest trie.
Each node corresponds to a **path prefix**—a segment of the full file path.

For example:

- A node with `path: folder/` represents the prefix `"folder/"`.
- A node with `path: nested.txt` represents a leaf for the file `"nested.txt"`.

Every node may contain:

- a path segment (`path`)
- zero or more child connections (`forks`)
- optional metadata (e.g., content-type, filename)
- a `target` (if the node corresponds to an actual file)

#### **Forks:**

A **fork** is an edge from one node to another.
It is how the trie branches when file paths diverge.

For example, under `folder/`, you see:

```bash
forks:
  nested.txt/
  subfolder/deep.txt/
```

This means:

- the `folder/` node has two children
- those children represent different path continuations (i.e., different files)

Forks are how shared prefixes are stored only once. Everything that starts with `"folder/"` branches from the same node.

#### **Path:**

`path` is the **path segment stored at that node**.

Examples:

- `path: root.txt`
- `path: nested.txt`
- `path: subfolder/deep.txt`

These are _not_ full paths.
They represent only the part needed at that position in the trie.
The full path is reconstructed by walking from the root down through forks.

#### **Target:**

The `target` field holds the **Swarm hash of the file the node points to**.

Example:

```
target: 0x9442e445c0d58a...
```

This hash is the immutable reference of the actual content uploaded to Swarm.

**Why is the target sometimes `0x000000...000`?**

Because **not every node corresponds to a file**.

Nodes represent **prefixes**, not necessarily files.

For example:

- The root node (`Node:` at the top) has no file associated so its `target` is zero.
- The node for `folder/` also has no file associated → target is zero.
  It is just an internal directory-like prefix.

Only **leaf nodes**, where a file actually exists, have a non-zero target (the file’s Swarm reference).

So:

| Node type               | Example       | Has file? | Target        |
| ----------------------- | ------------- | --------- | ------------- |
| Internal directory node | `folder/`     | No        | `0x000...000` |
| Leaf node               | `nested.txt`  | Yes       | real hash     |
| Root node               | (top of tree) | No        | `0x000...000` |

:::warning
The `target` field in a manifest points to the raw file root chunk, not a manifest. `bee-js` and `swarm-cli` file download functions expect a file manifest, even for single-file uploads, so downloading using the raw target hash will not work properly.
Instead, download files by using the top-level directory manifest and the file’s path within it.

Example:

```bash
curl http://127.0.0.1:1633/bzz/4d5e6e3eb532131e128b1cd0400ca249f1a6ce5d4005c0b57bf848131300df9d/folder/subfolder/deep.txt
```

Terminal output:

```bash
DEEP
```
:::

**Metadata:**

Metadata stores information about a file, such as:

- Content-Type
- Filename
- Website index/error docs (if configured)

Example:

```yaml
metadata:
  Content-Type: text/plain; charset=utf-8
  Filename: nested.txt
```

Only **file nodes** (leaf nodes) normally have metadata.
Internal nodes generally do not.

Metadata helps:

- gateways set HTTP headers (e.g., correct MIME type)
- browsers display files correctly
- filesystem-like behavior

#### **Putting it together:**

Let’s interpret a branch:

```
folder/
  nested.txt
```

This means:

1. There is a prefix node representing `"folder/"`.
2. Inside it, there is a file `"nested.txt"`.
3. The file node has:

   - a target (its Swarm content hash)
   - metadata (filename + content-type)

Meanwhile, `"folder/"` has **no file itself**, so its target is zero.

## Manipulating Directories 

In this section we explain how to inspect and modify manifests for non-website directories. You can find the completed [example scripts on GitHub](https://github.com/ethersphere/examples/tree/main/manifests).

In the following guides we will explain how to:

1. Upload a directory and print its manifest
2. Add a new file 
3. Move a file (delete + add new entry)

#### Pre-requisites:

- NodeJS and npm
- Linux or WSL preferred but most commands should work from windows Powershell with slight modifications
- git
- The RPC endpoint for a currently running Bee node (either on your machine or remote, try [Swarm Desktop](https://www.ethswarm.org/build/desktop) for a no-hassle way to get started)

If you'd like to follow along with the guides shown below, clone the [`ethersphere/examples` repo](https://github.com/ethersphere/examples/) and navigate to the `/manifests` folder:

```bash
git clone git@github.com:ethersphere/examples.git
cd examples/manifests/
```

Print the file tree to confirm you're in the right place:

```bash
user@machine:~/examples/manifests$ tree
.
├── directory
│   ├── folder
│   │   ├── nested.txt
│   │   └── subfolder
│   │       └── deep.txt
│   └── root.txt
├── env
├── manifestToJson.js
├── package-lock.json
├── package.json
├── script-01.js
├── script-02.js
└── script-03.js
```

If you're using Powershell you can use the `tree /f` command instead and the output file tree should look similar.

After confirming, run `npm install` to install dependencies:

```bash
npm install
```

Locate the `env` file and add a period/full stop to change the file name to a standard `dotenv` file (`.env`). Then modify the file to replace `<BEE_API_ENDPOINT>` with your RPC endpoint and `<BATCH_ID>` with your own postage batch ID:

```bash
BEE_RPC_URL=<BEE_API_ENDPOINT> // Default: http://localhost:1633
POSTAGE_BATCH_ID=<BATCH_ID>
```

Great! Now you're all set up and ready to go.

### Uploading a Directory and Printing Its Manifest

In our first script, we will simply upload our sample directory and print its contents:

**script-01.js (initial upload script)**

```js
import { Bee, MantarayNode } from "@ethersphere/bee-js";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { printManifest } from "./printManifest.js";

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bee = new Bee(process.env.BEE_RPC_URL);
const postageBatchId = process.env.POSTAGE_BATCH_ID;

// Build the folder path safely
const directoryPath = path.join(__dirname, "directory");

async function uploadDirectory() {
  try {
    console.log("Uploading directory:", directoryPath);

    // Upload using the resolved directory and get manifest reference
    const { reference } = await bee.uploadFilesFromDirectory(
      postageBatchId,
      directoryPath
    );

    console.log("Directory uploaded successfully!");
    console.log("Manifest reference:", reference.toHex());

    // Download each file using its relative path as recorded by the manifest
    const root = await bee.downloadFile(reference, "root.txt");
    const nested = await bee.downloadFile(reference, "folder/nested.txt");
    const deep = await bee.downloadFile(reference, "folder/subfolder/deep.txt");

    // Print out file contents
    console.log("root.txt:", root.data.toUtf8());
    console.log("folder/nested.txt:", nested.data.toUtf8());
    console.log("folder/subfolder/deep.txt:", deep.data.toUtf8());

    // Load the generated manifest
    const node = await MantarayNode.unmarshal(bee, reference);
    await node.loadRecursively(bee);

    // Print manifest in human readable format
    console.log("\n--- Manifest Tree ---");
    printManifest(node);
  } catch (error) {
    console.error("Error during upload or download:", error.message);
  }
}

uploadDirectory();
```

Note that in the script when downloading our files individually we must use the same relative paths that match the directory we uploaded:

```js
// Download each file using its relative path as recorded by the manifest
const root = await bee.downloadFile(reference, "root.txt");
const nested = await bee.downloadFile(reference, "folder/nested.txt");
const deep = await bee.downloadFile(reference, "folder/subfolder/deep.txt");
```

Run the script:

```bash
node script-01.js
```

If you've set up everything properly, you should see the file contents printed to the terminal followed by the manifest tree:

```json
Uploading directory: /home/user/examples/manifests/directory
Directory uploaded successfully!
Manifest reference: 4d5e6e3eb532131e128b1cd0400ca249f1a6ce5d4005c0b57bf848131300df9d
root.txt: ROOT
folder/nested.txt: NESTED
folder/subfolder/deep.txt: DEEP

--- Manifest Tree ---
{
  "path": "/",
  "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "metadata": null,
  "forks": {
    "folder/": {
      "path": "folder/",
      "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "metadata": null,
      "forks": {
        "nested.txt": {
          "path": "nested.txt",
          "target": "0x9442e445c0d58adea58e0a8afcdcc28ed7642d7a4ff9a253e8f1595faafbb808",
          "metadata": {
            "Content-Type": "text/plain; charset=utf-8",
            "Filename": "nested.txt"
          },
          "forks": {}
        },
        "subfolder/deep.txt": {
          "path": "subfolder/deep.txt",
          "target": "0x6aa935879ad2a547e57ea6350338bd04ad758977b542e86b31c159f31834b8fc",
          "metadata": {
            "Content-Type": "text/plain; charset=utf-8",
            "Filename": "deep.txt"
          },
          "forks": {}
        }
      }
    },
    "root.txt": {
      "path": "root.txt",
      "target": "0x98e63f7e826a01634881874246fc873cdf06bb5409ff5f9ec61d1e2de1dd3bf6",
      "metadata": {
        "Content-Type": "text/plain; charset=utf-8",
        "Filename": "root.txt"
      },
      "forks": {}
    }
  }
}
```

Note and record the manifest reference returned before the manifest tree is printed:

```bash
Manifest reference: 4d5e6e3eb532131e128b1cd0400ca249f1a6ce5d4005c0b57bf848131300df9d
```

We will use this in the next section when adding a file manually to the manifest.

### Adding a New File to the Manifest

This script uploads a **new file** (e.g. `newfile.txt`) and then updates the existing manifest so the new file becomes part of the directory structure.

**script-02.js**

*The following script is almost identical to script-01.js, only the changed sections will be highlighted. Remember you can always refer to the complete version of the script in the examples repo.*

```js

import "dotenv/config"
import { Bee, MantarayNode } from "@ethersphere/bee-js"
import { printManifestJson } from './manifestToJson.js'

const bee = new Bee(process.env.BEE_RPC_URL)
const batchId = process.env.POSTAGE_BATCH_ID

// We specify the manifest returned from script-01.js here
const ROOT_MANIFEST = '4d5e6e3eb532131e128b1cd0400ca249f1a6ce5d4005c0b57bf848131300df9d'

async function addFileToManifest() {
    try {
        // Load the generated manifest from script-01.js
        const node = await MantarayNode.unmarshal(bee, ROOT_MANIFEST)
        await node.loadRecursively(bee)

        // File details for new file
        const filename = 'new.txt'
        const content = "Hi, I'm new here."
        const bytes = new TextEncoder().encode(content)

        // Upload raw file data 
        // Note we use "bee.uploadData()", not "bee.uploadFile()", since we need the root reference hash of the content, not a manifest reference. 
        const { reference } = await bee.uploadData(batchId, bytes)
        console.log('Uploaded raw reference:', reference.toHex())

        // Metadata must be a plain JS object — NOT a Map or Uint8Array
        const metadata = {
            'Content-Type': 'text/plain; charset=utf-8',
            'Filename': filename,
        }

        // Insert the new file data into our new manifest
        node.addFork(filename, reference, metadata)

        // Save and print updated manifest
        const newManifest = await node.saveRecursively(bee, batchId)
        const newReference = newManifest.reference
        console.log('Updated manifest hash:', newReference.toHex())
        printManifestJson(node)

        // Download new file and print its contents
        const newFile = await bee.downloadFile(newReference, "new.txt")
        console.log("new.txt:", newFile.data.toUtf8())

    }
    catch (error) {
        console.error("Error during upload or download:", error.message)
    }
}

addFileToManifest()
```

Terminal output:

```bash
noah@NoahM16:~/examples/manifests$ node script-02.js
Uploaded raw reference: 3515db2f5e3c075b7546d7dd7dea1680c3e0785c6584e66b7e4f56fc344a0a78
Updated manifest hash: 4f67218844a814655c8d81aae4c4286a142318d672113973360c33c7930ce2f5
{
    "path": "/",
    "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "metadata": null,
    "forks": {
        "folder/": {
            "path": "folder/",
            "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "metadata": null,
            "forks": {
                "nested.txt": {
                    "path": "nested.txt",
                    "target": "0x9442e445c0d58adea58e0a8afcdcc28ed7642d7a4ff9a253e8f1595faafbb808",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "nested.txt"
                    },
                    "forks": {}
                },
                "subfolder/deep.txt": {
                    "path": "subfolder/deep.txt",
                    "target": "0x6aa935879ad2a547e57ea6350338bd04ad758977b542e86b31c159f31834b8fc",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "deep.txt"
                    },
                    "forks": {}
                }
            }
        },
        "root.txt": {
            "path": "root.txt",
            "target": "0x98e63f7e826a01634881874246fc873cdf06bb5409ff5f9ec61d1e2de1dd3bf6",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "root.txt"
            },
            "forks": {}
        },
        "new.txt": {
            "path": "new.txt",
            "target": "0x3515db2f5e3c075b7546d7dd7dea1680c3e0785c6584e66b7e4f56fc344a0a78",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "new.txt"
            },
            "forks": {}
        }
    }
}
new.txt: Hi, I'm new here.
```

This produces a new manifest where `/new.txt` is now accessible as a root level entry.

### Moving a File to a Subfolder

This script:

1. Removes `/new.txt` from the manifest
2. Adds it back under `/nested/deeper/new.txt`
3. Prints the updated manifest

**script-03.js**

```js
import "dotenv/config"
import { Bee, MantarayNode } from "@ethersphere/bee-js"
import { printManifestJson } from './manifestToJson.js'

const bee = new Bee(process.env.BEERPC_URL || process.env.BEE_RPC_URL)
const batchId = process.env.POSTAGE_BATCH_ID

// Manifest returned from script-02.js
const ROOT_MANIFEST = 'SCRIPT_2_MANIFEST'

async function moveFileInManifest() {
    try {
        // Load manifest generated in script-02
        const node = await MantarayNode.unmarshal(bee, ROOT_MANIFEST)
        await node.loadRecursively(bee)

        // Reload manifest to capture original file reference *before* deletion
        const original = await MantarayNode.unmarshal(bee, ROOT_MANIFEST)
        await original.loadRecursively(bee)

        const existing = original.find("new.txt")
        if (!existing) {
            throw new Error("Could not retrieve file reference for new.txt — run script-02.js first.")
        }

        const fileRef = existing.targetAddress

        // STEP 1 — Remove /new.txt
        node.removeFork("new.txt")
        console.log("Removed /new.txt from manifest.")

        // STEP 2 — Re-add under /nested/deeper/new.txt
        const newPath = "nested/deeper/new.txt"

        node.addFork(
            newPath,
            fileRef,
            {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "new.txt"
            }
        )

        console.log(`Added file under /${newPath}`)

        // STEP 3 — Save updated manifest
        const updated = await node.saveRecursively(bee, batchId)
        const newManifestRef = updated.reference.toHex()

        console.log("Updated manifest hash:", newManifestRef)

        // STEP 4 — Print JSON
        printManifestJson(node)

        // STEP 5 — Download the file from its new location and print contents
        const downloaded = await bee.downloadFile(updated.reference, newPath)
        console.log(`\nContents of /${newPath}:`)
        console.log(downloaded.data.toUtf8())

    } catch (error) {
        console.error("Error while modifying manifest:", error.message)
    }
}

moveFileInManifest()
```

Terminal output:

```bash
user@machine:~/examples/manifests$ node script-03.js
Removed /new.txt from manifest.
Added file under /nested/deeper/new.txt
Updated manifest hash: 656ea924fb4d98b7fa327eb9e4d98ece6c2f4370515d23b40dfca71bc99a08a6
{
    "path": "/",
    "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "metadata": null,
    "forks": {
        "folder/": {
            "path": "folder/",
            "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "metadata": null,
            "forks": {
                "nested.txt": {
                    "path": "nested.txt",
                    "target": "0x9442e445c0d58adea58e0a8afcdcc28ed7642d7a4ff9a253e8f1595faafbb808",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "nested.txt"
                    },
                    "forks": {}
                },
                "subfolder/deep.txt": {
                    "path": "subfolder/deep.txt",
                    "target": "0x6aa935879ad2a547e57ea6350338bd04ad758977b542e86b31c159f31834b8fc",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "deep.txt"
                    },
                    "forks": {}
                }
            }
        },
        "root.txt": {
            "path": "root.txt",
            "target": "0x98e63f7e826a01634881874246fc873cdf06bb5409ff5f9ec61d1e2de1dd3bf6",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "root.txt"
            },
            "forks": {}
        },
        "nested/deeper/new.txt": {
            "path": "nested/deeper/new.txt",
            "target": "0x3515db2f5e3c075b7546d7dd7dea1680c3e0785c6584e66b7e4f56fc344a0a78",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "new.txt"
            },
            "forks": {}
        }
    }
}

Contents of /nested/deeper/new.txt:
Hi, I'm new here.
```


Now the file appears under:

```
/nested/deeper/root.txt
```

Note that the only new method we used was `node.removeFork()` to remove the entry from the manifest.


