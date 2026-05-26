---
title: Upload & Download
id: upload-and-download
description: Comprehensive guide for uploading and downloading files with the Bee API.
---

Uploading to Swarm has two steps: (1) **buy storage** as a **postage stamp batch** with a unique **batch ID**—and (2) **upload using the batch ID**. The upload returns a **Swarm reference hash**, anyone with that reference can download the content.

:::info Example project
The runnable Node.js scripts for this guide are in [`examples/upload-and-download`](https://github.com/ethersphere/examples/tree/main/upload-and-download). Clone the repo, copy `.env.example` to `.env`, fill in your `BEE_URL` and `BATCH_ID`, run `npm install`, then `npm run script:01` or `npm run script:02`.
:::

**Before you begin:**

- You need a running Bee node connected to Gnosis Chain and funded with **xBZZ** and **xDAI**.
- Uploads always require a **postage stamp batch**.
- Ultra-light nodes can download but **cannot upload**.

## Upload & Download with bee-js

The `bee-js` library is the **official SDK for building Swarm-based applications**. It works in both **browser** and **Node.js** environments and **greatly simplifies development** compared with using the Bee HTTP API directly. It is the recommended method for developing applications on Swarm.

Refer to the [`bee-js` documentation](https://bee-js.ethswarm.org/docs/) for more usage guides.

:::tip
**Environment-specific methods:**

- **Browser-only:** [`uploadFiles`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfiles) (multi-file via `File[]`/`FileList`)
- **Node.js-only:** [`uploadFilesFromDirectory`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfiles) (recursively reads local filesystem to upload multiple files in a directory using `fs`),
- **Both:** [`uploadFile`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#uploadfile) (with some environment specific usage), [`downloadFile`](https://bee-js.ethswarm.org/docs/api/classes/Bee/#downloadfile)
  :::

### Single file — Node.js

**Step-by-step Walkthrough:**

1. Create a Bee client:

   `const bee = new Bee("http://localhost:1633")`

2. Buy storage (postage stamp batch) by specifying storage size and duration:

   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Read the file from disk:

   `const data = await readFile("./hello.txt")`

4. Upload bytes with filename & content type → get reference:

   `const { reference } = await bee.uploadFile(batchId, data, "hello.txt", { contentType: "text/plain" })`

5. Download the file by reference:

   `const file = await bee.downloadFile(reference)`

6. Log the downloaded file’s title and metadata:

   `console.log(file.name)`

   `console.log(file.contentType)`

   `console.log(file.data.toUtf8())`

**Full example:**

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js";
import { readFile } from "node:fs/promises";

// 1) Connect to your Bee node HTTP API
const bee = new Bee("http://localhost:1633");

// 2) Buy storage (postage stamp batch) for this session
const batchId = await bee.buyStorage(
  Size.fromGigabytes(1),
  Duration.fromDays(1)
);

// 3) Read the file from disk as bytes
const data = await readFile("./hello.txt");

// 4) Upload the bytes with a filename and content type; capture the reference
const { reference } = await bee.uploadFile(batchId, data, "hello.txt", {
  contentType: "text/plain",
});
console.log("Uploaded reference:", reference.toHex());

// 5) Download the file back using the reference
const file = await bee.downloadFile(reference);

// 6) Log the file's metadata and contents to the terminal
console.log(file.name); // "hello.txt"
console.log(file.contentType); // "text/plain"
console.log(file.data.toUtf8()); // Prints file content
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

3. Create a `File` object:

`const file = new File(["Hello Swarm!"], "hello.txt", { type: "text/plain" })`

4. Use batch ID to upload → get reference:

   `const { reference } = await bee.uploadFile(batchId, file)`

5. Download by reference:

   `const downloaded = await bee.downloadFile(reference)`

6. Log the downloaded file’s title and metadata:

   `console.log(downloaded.name)   // "hello.txt"`

   `console.log(file.contentType) // "text/plain"`

   `console.log(downloaded.data.toUtf8()) // prints file content`

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js";

// 1) Connect to your Bee node HTTP API
const bee = new Bee("http://localhost:1633");

// 2) Buy storage (postage stamp batch) for this session
const batchId = await bee.buyStorage(
  Size.fromGigabytes(1),
  Duration.fromDays(1)
);
console.log("Batch ID:", String(batchId));

// 3) Upload a single file created in code
const file = new File(["Hello Swarm!"], "hello.txt", { type: "text/plain" });
const { reference } = await bee.uploadFile(batchId, file);
console.log("Reference:", String(reference));

// 4) Download and print name + contents
const downloaded = await bee.downloadFile(reference);
console.log(downloaded.name); // "hello.txt"
console.log(file.contentType); // "text/plain"
console.log(downloaded.data.toUtf8()); // prints file content
```

### Multiple files — Browser

Use **`uploadFiles`** for multi-file upload in the browser. It accepts `File[]`/`FileList`. When using `<input type="file" webkitdirectory multiple>`, each file’s **relative path** is preserved. To download a specific file later, pass the **collection reference** plus the **same relative path**.

1. Initialize a Bee object using the API endpoint of a Bee node:
   `const bee = new Bee("http://localhost:1633")`

2. Buy storage and get postage stamp batch ID:
   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Create files for upload:

```js
const files = [
  new File(["<h1>Hello Swarm</h1>"], "index.html", { type: "text/html" }),
  new File(["body{font-family:sans-serif}"], "assets/main.css", {
    type: "text/css",
  }),
];
```

4. Upload multiple files (collection) → get collection reference:
   `const res = await bee.uploadFiles(batchId, files)`

5. Download files by relative paths:
   `const logo = await bee.downloadFile(res.reference, "images/logo.png")`

6. Log the downloaded file’s title and contents:

   `console.log(page.name)          // "index.html"`

   `console.log(page.data.toUtf8()) // prints file content`

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js";

// 1. Initialize a Bee object
const bee = new Bee("http://localhost:1633");

// 2. Buy storage and get batch ID
const batchId = await bee.buyStorage(
  Size.fromGigabytes(1),
  Duration.fromDays(1)
);
console.log("Batch ID:", String(batchId));

// 3. Create files for upload
const files = [
  new File(["<h1>Hello Swarm</h1>"], "index.html", { type: "text/html" }),
  new File(["body{font-family:sans-serif}"], "assets/main.css", {
    type: "text/css",
  }),
];

//  4. Upload multiple files (collection) → get collection reference
const res = await bee.uploadFiles(batchId, files);
console.log("Collection ref:", String(res.reference));

// 5. Download files by relative path
const page = await bee.downloadFile(res.reference, "index.html");
console.log(page.name); // "index.html"
console.log(page.data.toUtf8()); // prints file content

const style = await bee.downloadFile(res.reference, "assets/main.css");
console.log(style.name); // "main.css"
console.log(style.data.toUtf8()); // prints file content
```

### Multiple files — Node.js

**Step-by-step Walkthrough:**

1. Initialize a Bee object using the API endpoint of a Bee node:

   `const bee = new Bee("http://localhost:1633")`

2. Buy storage and get postage stamp batch ID:

   `const batchId = await bee.buyStorage(Size.fromGigabytes(1), Duration.fromDays(1))`

3. Recursively upload a local directory → get collection reference:

   `const res = await bee.uploadFilesFromDirectory(batchId, "./site")`

4. Download one file by its relative path:

   `const page = await bee.downloadFile(res.reference, "index.html")`

5. Log the downloaded file name and contents:

   `console.log(page.name ?? "index.html")`

   `console.log(page.data.toUtf8())`

**Full example:**

```js
import { Bee, Size, Duration } from "@ethersphere/bee-js";

// 1) Connect to your Bee node HTTP API
const bee = new Bee("http://localhost:1633");

// 2) Buy storage (postage stamp batch)
const batchId = await bee.buyStorage(
  Size.fromGigabytes(1),
  Duration.fromDays(1)
);

// 3) Upload all files under ./files (relative paths preserved); get reference
const res = await bee.uploadFilesFromDirectory(batchId, "./files");
console.log("Directory uploaded. Collection reference:", res.reference.toHex());

// 4) Download files from the collection by original relative paths
const page = await bee.downloadFile(res.reference, "root.txt");
const stylesheet = await bee.downloadFile(
  res.reference,
  "subdirectory/example.txt"
);

// 5) Log the file name and contents to the terminal
console.log(page.name); // "root.txt"
console.log(page.data.toUtf8()); // prints file content

console.log(stylesheet.name); // "example.txt"
console.log(stylesheet.data.toUtf8()); // prints file content
```

## Upload & Download with the Bee API (advanced)

The **Bee HTTP API** offers the **lowest-level access** to a Bee node. It is **more complex and harder to use** than **bee-js** because you must manage headers, content types, and postage parameters yourself. **Unless you specifically require raw HTTP control**, we **do not recommend** using the Bee API directly — use **bee-js** instead for application development.

Refer to the [Bee API reference specification](https://docs.ethswarm.org/api/) for detailed usage information.

The Bee API exposes three HTTP endpoints:

- **`/bzz`** — upload & download files/directories (most common)
- **`/bytes`** — upload & download raw data
- **`/chunks`** — upload & download individual chunks

#### Upload with **/bzz**

While `bee-js` allows postage stamp batches to be purchased by specifying storage duration and data size, the raw Bee API requires `amount` and `depth` parameters directly. The relationship between these parameters and the storage size and duration of the batch is complex, so `bee-js` is strongly encouraged for newcomers. [Learn more](./tools-and-features/buy-a-stamp-batch.md).

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
{
  "reference": "22cbb9cedca08ca8d50b0319a32016174ceb8fbaa452ca5f0a77b804109baa00"
}
```

3. Download with `/bzz`

```bash
curl http://localhost:1633/bzz/<REFERENCE> -o output.txt
```

---

**Next:** [Host a Webpage](/docs/develop/host-your-website) — upload a static website and serve it through `/bzz/<reference>/`.
