---
title: Upload & Download
id: upload-and-download
---


Uploading to Swarm has two steps: (1) **buy storage** as a **postage stamp batch**—you can store more data or for longer by spending more xBZZ or topping up the batch—and (2) **upload using the batch ID** to prove the upload is paid. The upload returns a **Swarm reference** (hash), anyone with that reference can download the content.


**Before you begin:**
* You need a running Bee node connected to Gnosis Chain and funded with **xBZZ** and **xDAI**.
* Uploads always require a **postage stamp batch**. 
* Ultra-light nodes can download but **cannot upload**, since they cannot buy stamps.


## Upload & Download with bee-js 

The `bee-js` library is the **official SDK for building Swarm-based applications**. It works in both **browser** and **Node.js** environments and **greatly simplifies development** compared with using the Bee HTTP API directly. It is the recommended method for developing applications on Swarm.

:::tip
Some 
**Environment-specific methods**
* **Browser-only:** [`uploadFiles`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfiles) (multi-file via `File[]`/`FileList`)
* **Node.js-only:** [`uploadFilesFromDirectory`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfiles) (recursively reads local filesystem to upload multiple files in a directory using `fs`),
* **Both:** [`uploadFile`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfile) (with some environment specific usage), [`downloadFile`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#downloadfile)
:::

### Single file — Node.js

**Step-by-step Walkthrough:**

1. Create a Bee client
   `const bee = new Bee("http://localhost:1633")`

2. Buy storage (postage stamp batch)
   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Read the file from disk
   `const data = await readFile("./hello.txt")`

4. Upload bytes with filename & content type → get reference
   `const { reference } = await bee.uploadFile(batchId, data, "hello.txt", { contentType: "text/plain" })`

5. Download the file by reference
   `const file = await bee.downloadFile(reference)`

6. Log the downloaded file’s metadata and contents
   `console.log(file.name)`
   `console.log(file.contentType)`
   `console.log(file.data.toUtf8())`

**Full example:**

```js
// Single file upload & download (Node.js) — logs content to terminal

import { Bee, Size, Duration } from "@ethersphere/bee-js"
import { readFile } from "node:fs/promises"

// 1) Connect to your Bee node HTTP API
const bee = new Bee("http://localhost:1633")

// 2) Buy storage (postage stamp batch) for this session
const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))

// 3) Read the file from disk as bytes
const data = await readFile("./hello.txt")

// 4) Upload the bytes with a filename and content type; capture the reference
const { reference } = await bee.uploadFile(batchId, data, "hello.txt", { contentType: "text/plain" })
console.log("Uploaded reference:", reference)

// 5) Download the file back using the reference
const file = await bee.downloadFile(reference)

// 6) Log the file's metadata and contents to the terminal
console.log(file.name)        // e.g., "hello.txt"
console.log(file.contentType) // e.g., "text/plain"
console.log(file.data.toUtf8()) // Prints file content
```


### Single file — Browser

:::info
When working with browsers you can use the [`File` interface](https://developer.mozilla.org/en-US/docs/Web/API/File). The filename is taken from the `File` object itself, but can be overwritten through the second argument of the `uploadFile` function.
:::

**Walkthrough**

1. Initialize a Bee object using the API endpoint of a Bee node:
   `const bee = new Bee("http://localhost:1633")`

2. Buy storage and get postage stamp batch ID:
   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Grab a `File` from `<input type="file" id="file">`:
   `const fileInput = document.querySelector("#file") as HTMLInputElement;`
   `const selected = fileInput.files![0]`

4. Use batch ID to upload → get reference:
   `const { reference } = await bee.uploadFile(batchId, selected)`

5. Download by reference:
   `const downloaded = await bee.downloadFile(reference)`

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js"

const bee = new Bee("http://localhost:1633")

// 1) Buy storage
const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))

// 2) Upload a single file from an <input type="file" id="file">
const fileInput = document.querySelector("#file")!
const selected = fileInput.files![0] // a File object
const { reference } = await bee.uploadFile(batchId, selected)

// 3) Download (gets name, type, and data back)
const downloaded = await bee.downloadFile(reference)
console.log(downloaded.name) // "your-file-name.ext"
```

### Multiple files — Browser 

Use **`uploadFiles`** (browser-only). It accepts `File[]`/`FileList`. When using `<input type="file" webkitdirectory multiple>`, each file’s **relative path** is preserved. To download a specific file later, pass the **collection reference** plus the **same relative path**.


1. Initialize a Bee object using the API endpoint of a Bee node:
   `const bee = new Bee("http://localhost:1633")`

2. Buy storage and get postage stamp batch ID:
   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Select files/folder via `<input type="file" webkitdirectory multiple id="dir">`
   `const files = Array.from(document.querySelector("#dir")!.files!)`

4. Upload multiple files (collection) → get collection reference
   `const res = await bee.uploadFiles(batchId, files)`

5. Download a specific file by its relative path
   `const logo = await bee.downloadFile(res.reference, "images/logo.png")`

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js"

const bee = new Bee("http://localhost:1633")
const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))

// Using a directory picker: <input type="file" id="dir" webkitdirectory multiple>
const files = Array.from(document.querySelector("#dir")!.files!)
const res = await bee.uploadFiles(batchId, files)
console.log("Collection reference:", res.reference.toString())

// Download by relative path used at upload time:
const logo = await bee.downloadFile(res.reference, "images/logo.png")
```




### Multiple files — Node.js

**Step-by-step Walkthrough:**

1. Create a Bee client
   `const bee = new Bee("http://localhost:1633")`

2. Buy storage
   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Recursively upload a local directory → get collection reference
   `const res = await bee.uploadFilesFromDirectory(batchId, "./site")`

4. Download one file by its relative path
   `const page = await bee.downloadFile(res.reference, "index.html")`

5. Log the downloaded file’s metadata and contents
   `console.log(page.name ?? "index.html")`
   `console.log(page.contentType)`
   `console.log(page.data.toUtf8())`

**Full example:**

```ts
import { Bee, Size, Duration } from "@ethersphere/bee-js"

// 1) Connect to your Bee node HTTP API
const bee = new Bee("http://localhost:1633")

// 2) Buy storage (postage stamp batch)
const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))

// 3) Upload all files under ./site (relative paths preserved); get a collection reference
const res = await bee.uploadFilesFromDirectory(batchId, "./site")
console.log("Directory uploaded. Collection reference:", res.reference.toString())

// 4) Download a specific file from the collection by its original relative path
const page = await bee.downloadFile(res.reference, "index.html")

// 5) Log the file's metadata and contents to the terminal
console.log(page.name ?? "index.html")       // "index.html"
console.log(page.contentType)                // e.g., "text/html"
console.log(page.data.toUtf8()) // Prints file content // prints file content
```

> Tip: For **binary** files, don’t convert to UTF-8 — log `file.data.length` or write to disk instead.



## Upload & Download with Swarm CLI

The `swarm-cli` offers a convenient command-line interface for Bee node interaction. It's a convenient tool for node management or one-off uploads and downloads.

Buy storage via an interactive prompt (capacity + TTL), then upload:

```bash
swarm-cli stamp create
# ...follow prompts for capacity (e.g., 1GB) and time-to-live (e.g., 1d, 1w)...
swarm-cli upload test.txt --stamp <BATCH_ID>
```

Download content:

```bash
swarm-cli download <REFERENCE> ./output/
```

## Upload & Download with the Bee API (advanced)

The **Bee HTTP API** offers the **lowest-level access** to a Bee node. However, it is **more complex and difficult to use** than **bee-js** or **swarm-cli** because you must manage headers, content types, and postage parameters yourself. **Unless you specifically require raw HTTP control**, we **do not recommend** using the Bee API directly. Instead use **bee-js** for application development and **swarm-cli** for command-line interaction.

The Bee API exposes three HTTP endpoints:

* **`/bzz`** — upload & download files/directories (most common)
* **`/bytes`** — upload & download raw data
* **`/chunks`** — upload & download individual chunks


### Upload with **/bzz**

While both `swarm-cli` and `bee-js` allow for postage stamp batches to be purchased by specifying the storage duration and data size, the actual call to the Bee API requires an `amount` and `depth` parameters. The relationship between these parameters and the storage size and duration of the batch is complex. Therefore `bee-js` and `swarm-cli` (which allow batches to be purchased by data size/duration which are then converted to `depth`/`amount`) are strongly encouraged for newcomers to development on Swarm. [Learn more](/docs/develop/access-the-swarm/buy-a-stamp-batch). 


1. Buy a postage batch:

```bash
curl -s -X POST http://localhost:1633/stamps/<amount>/<depth>
```

2. Upload a file with the returned `batchID`:

```bash
curl -X POST \
  -H "Swarm-Postage-Batch-Id: <BATCH_ID>" \
  -H "Content-Type: text/plain" \
  --data-binary "@test.txt" \
  http://localhost:1633/bzz
```

Response:

```json
{ "reference": "22cbb9cedca08ca8d50b0319a32016174ceb8fbaa452ca5f0a77b804109baa00" }
```

3. Download with `/bzz`

```bash
curl http://localhost:1633/bzz/<REFERENCE> -o output.txt
```


