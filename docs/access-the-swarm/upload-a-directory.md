---
title: Upload a Directory
id: upload-a-directory
---

It is possible to use Bee to upload directories of files all at once. 

:::tip
Comfortable with nodeJS and JavaScript? Check out [swarm-cli](https://github.com/ethersphere/swarm-cli), a command line tool you can use to easily interact with your Bee node!
:::

:::info
If an uploaded directory contains an `index.html` file, when you navigate to the directory in a web browser it will automatically be served to users from our [Swarm gateways](https://gateway.ethswarm.org) as if it were a website hosted by a normal web server. Use this feature to host your unstoppab le website on Swarm!
:::

This feature makes use of the [tar](https://www.gnu.org/software/tar/) command line utility to package the directory into a single file that can then uploaded to the Bee API for processing and distributed into the swarm for later retrieval.

:::caution
G-zip compression is not supported the current version of Bee, so make sure not to use the `-z` flag when using the `tar` command!
:::

## Upload the Directory Containing Your Website
First, use the `tar` command line utility to create an archive containing all the files of your directory. If uploading a website, we must take care to ensure that the `index.html` file is at the root of the directory tree.

```bash
tree build
> 
my_website
├── assets
│   └── style.css
├── index.html
└── error.html
```

Use the following command to ensure that the tar package maintains the correct directory structure.

```bash
cd my_website
tar -cf tar -cf ../my_website.tar .
cd ..
```

Next, simply POST the `tar` file as binary data to Bee's `dir` endpoint, taking care to include the header `Content Type: application/x-tar`.

:::info
In order to upload your data to swarm, you must agree to burn some of your gBZZ to signify to storer and fowarder nodes that the content is important. Before you progress to the next step, you must buy stamps! See this guide on how to [purchase an appropriate batch of stamps](/docs/access-the-swarm/keep-your-data-alive).
:::


```bash
curl \
	-X POST \
	-H "Content-Type: application/x-tar" \
	-H "Swarm-Index-Document: index.html" \
	-H "Swarm-Error-Document: error.html" \
	-H "Swarm-Collection: true" \
	-H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
	--data-binary @my_website.tar http://localhost:1633/bzz
```

:::info
For instances where a Single Page App has a javascript router which handles url queries itself, simple pass `index.html` as the error document, and Bee will pass over control to the javascript served by the `index.html` file in the circumstance that a path does not yield a file from the manifest. 
:::

When the upload is successful, Bee will return a json document containing the Swarm Reference.

```json
{"reference":"b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b"}
```

Now, simply navigate your browser to view the reference using the `bzz` endpoint and your website will be served!

[http://localhost:1633/bzz/b25c89a...214917b/](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/) 

Other files are served at their relative paths, e.g.

[http://localhost:1633/bzz/b25c89a...214917b/assets/style.css](http://localhost:1633/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/assets/style.css) 

Once your data has been [fully processed into the network](/docs/access-the-swarm/syncing), you will then be able to retrieve it from any Bee node.

[https://gateway.ethswarm.org/bzz/b25c89a...214917b/index.html](https://gateway.ethswarm.org/bzz/b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b/)

If you are not able to download your file from a different Bee node, you may be experiencing connection issues, see [troubleshooting connectivity](/docs/installation/connectivity) for assistance.
