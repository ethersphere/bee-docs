---
title: Upload a Directory
id: upload-a-directory
---

It is possible to use Bee to upload whole directory structures at once. 

:::info
If an uploaded directory contain an `index.html` file. When you navigate to the directory in a web browser, it will automatically be served to users from our [Swarm gateways](https://gateway.ethswarm.org) as if it were a website hosted by a normal web server! You can use this feature to host unstoppable websites in Swarm.
:::

This feature makes use of the [tar](https://www.gnu.org/software/tar/) command line utility to package the directory into a single file that can then uploaded to the Bee API for processing and distributed into the swarm for later retrieval.

:::caution
G-zip compression is not supported the current version of Bee, so make sure not to use the `-z` flag when using the `tar` command!
:::

## Upload the Directory Containing Your Website
First, use the `tar` command line utility to create an archive containing all the files of your directory. If uploading a website, we must take care to ensure that the `index.html` file is at the root of the directory tree.

```sh
tree build
> 
my_website
├── assets
│   └── style.css
├── index.html
└── error.html
```

Use the following command to ensure that the tar package maintains the correct directory structure.

```sh
tar -cfC my_website . > my_website.tar
```

Next, simply POST the `tar` file as binary data to Bee's `dir` endpoint, taking care to include the header `Content Type: application/x-tar`.

```sh
curl \
	-X POST \
	-H "Content-Type: application/x-tar" \
	-H "Swarm-Index-Document: index.html" \
	-H "Swarm-Error-Document: error.html" \
	--data-binary @my_website.tar http://localhost:1633/dirs
```

:::info
For instances where a Single Page App has a javascript router which handles url queries itself, simple pass `index.html` as the error document, and Bee will pass over control to the javascript served by the `index.html` file in the circumstance that a path does not yield a file from the manifest. 
:::

When the upload is successful, Bee will return a json document containing the Swarm Reference.

```json
{"reference":"b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b"}
```

Now, simply navigate your browser to view the reference using the `bzz` endpoint and your website will be served!

[http://localhost:1633/bzz/b25c89a...214917b/index.html](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/index.html) 

Other files are served at their relative paths, e.g.

[http://localhost:1633/bzz/b25c89a...214917b/assets/style.css](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/assets/style.css) 

Once your data has been [fully processed into the network](/docs/advanced/tags), you will then be able to retrieve it from any Bee node.

[https://gateway.ethswarm.org/bzz/b25c89a...214917b/index.html](https://gateway.ethswarm.org/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/index.html)

If you are not able to download your file from a different Bee node, you may be experiencing connection issues, see [troubleshooting connectivity](/docs/installation/connectivity) for assistance.

:::warn
Not all directory structures, as supported by tar, can be supported in Bee.
The reason is that not all valid directory structures are valid paths
for an HTTP router (e.g. paths that are in a parent directory to the root).
Bee will accept and upload the invalid directory structures, but some of
your content might not be accessible.
:::
