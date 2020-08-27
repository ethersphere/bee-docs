---
title: Host a Website or Directory
id: host-a-website
---

One of Swarm's most useful features is the ability to upload whole directories into the swarm. If these directories contain an `index.html` file in their root directory, then it will automatically be served to users by Swarm Gateways as if it were a website hosted by a web server.

This feature makes use of the ubiquitous `tar` archiving format to package the directory into a single file that is then uploaded to the gateway so that they it can be processed and distributed into the swarm for later retrieval.

:::caution
In the current version of Bee, g-zip compression in not supported, so make sure not to use the `-z` flag!
:::

## Upload the Directory Containing Your Website
First, use the `tar` command line utility to create an archive containing all the files of your directory. If uploading a website, we must take care to ensure that the `index.html` file is at the root of the directory tree.

```bash
$ tree build
my_website
├── assets
│   └── style.css
└── index.html
```

<!-- Use this handy one-liner to move into the directory, archive everything and return to your working location.

```bash
$ cd my_website/ && tar -cf ../my_website.tar . && cd - 
``` -->

```bash
$ tar -cf my_website.tar assets index.html
```

Next, simply POST the `tar` file as binary data to Bee's `dir` endpoint, taking care to include the header `Content Type: application/x-tar`.

```bash
$ curl \
	-X POST \
	-H "Content-Type: application/x-tar" \
	--data-binary @my_website.tar http://localhost:8080/dirs
```

When the upload is successful, Bee will return json containing a Swarm Reference.

```json
{"reference":"ad4199b7286b44b1e94d46fa1ab7ad956b16b7a742c34b54b1a2b493b05cf542"}
```

Now, navigate your browser to view the reference using the `bzz` reference and your directory will be served!

[http://localhost:8080/bzz/ad4199...b05cf542/index.html](http://localhost:8080/bzz/ad4199b7286b44b1e94d46fa1ab7ad956b16b7a742c34b54b1a2b493b05cf542/index.html) 

Other files are served at their relative paths, e.g.

[http://localhost:8080/bzz/ad4199...b05cf542/assets/style.css](http://localhost:8080/bzz/ad4199b7286b44b1e94d46fa1ab7ad956b16b7a742c34b54b1a2b493b05cf542/assets/style.css) 

Once your data is [synced to the network](/docs/tutorial/tags), you will be able to retrieve it from any node in the network!

[https://gateway.ethswarm.org/bzz/ad4199...b05cf542/assets/style.css](https://gateway.ethswarm.org/bzz/ad4199b7286b44b1e94d46fa1ab7ad956b16b7a742c34b54b1a2b493b05cf542/assets/style.css) 



