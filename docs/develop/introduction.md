---
title: Develop on Swarm
id: introduction
---

This page is the go-to starting point for web3 developers who want to build with Swarm.  

It provides everything you need to begin—from prerequisites, to running Bee, integrating Swarm into a dApp, and trying a ready-made template app.

## Prerequisites

This section is aimed at developers who want to integrate Swarm into their applications or build dApps directly on top of Swarm.

Before you start, make sure you have:

- Basic familiarity with JavaScript/TypeScript and web3 development
- A working Node.js installation
- Docker (recommended, for quickly running Bee and other tools)

## Running a Bee Node

Swarm is a p2p network composed of thousands of Bee nodes. To interact with the Swarm network you need to run a Bee node of your own: 

### Option 1: Bee Quickstart Guide

The Bee quickstart install guide is the fastest way to get a Bee node up and running on the mainnet. This method does require a small amount of xDAI in order to initialize the node: 
- [Bee Quick-Start Guide](https://docs.ethswarm.org/docs/bee/installation/quick-start)  

### Option 2: fdp-play (Requires Docker)

For a zero-crypto required option, you can also consider the fdp-play tool. This tool will spin up a cluster of pre-funded Bee nodes and allow you to get started exploring development on Swarm right away. Just note that fdp-play is a sandbox environment - none of the tokens are real and none of the uploads will be stored by nodes on the Swarm mainnet.
  
- [fdp-play repo](http://github.com/fairDataSociety/fdp-play) 

You can find installation and usage instructions in the fdp-play [README](https://github.com/fairDataSociety/fdp-play/blob/master/README.md).

## Bee Node Basic Interaction

When running your Bee node(s), you will often need to perform basic node interactions from the command line (such as checking your node's status and uploading or downloading data). There are two main options for basic command line interaction with our Bee node(s):

### The Bee API (For power users)

The [Bee API](/docs/bee/working-with-bee/bee-api) offers the lowest level control over your Bee node. Refer to the [API Specifications](/api/) for documentation of all the available endpoints and their usage. You can use [curl](https://en.wikipedia.org/wiki/CURL), [wget](https://en.wikipedia.org/wiki/Wget), [Postman](https://en.wikipedia.org/wiki/Postman_(software)), [Insomnia](https://insomnia.rest/), or any other tool with support for http requests to interact with the API.

### Swarm-CLI (Recommended for most users)

The [Swarm-CLI](/docs/bee/working-with-bee/swarm-cli) command line tool is the recommended method for basic node interaction. It's powered by the powerful `bee-js` SDK, and it covers all essential Bee use cases. Swarm-CLI is also actively maintained so that it supports all the newest features from the most recent Bee versions as they are released. It is strongly recommended as the primary tool for node interaction unless there is a specific need for using the Bee API directly.

## How to Integrate with a dApp

Once you've got your Bee node up and running, then you can begin integrating it into your dApp. 

- **bee-js**: [`bee-js` is the official JavaScript SDK for Swarm](https://bee-js.ethswarm.org/docs/), and is the *recommended approach* for building Swarm integrated dApps.  

- **Raw API**: If required, you may also directly interact with the Bee HTTP API. This approach is discouraged unless explicitly required.

## Template Applications

The best way to begin understanding how everything works together is by exploring a working app. The [`create-swarm-app` tool](https://www.npmjs.com/package/create-swarm-app) allows you to rapidly generate a minimalistic working Swarm application. 

As explained in the [bee-js docs](https://bee-js.ethswarm.org/docs/getting-started/#quickstart-with-create-swarm-app), the `create-swarm-app` tool allows you to specify options to generate a template app for your chosen development environment. The supported options include: `node`, `node-esm`, `node-ts` and `vite-tsx`. 

### Swarm Integrated Back-end

When `create-swarm-app` is run using either of the `node`, `node-esm`, or `node-ts` options, the tool will output a simple script containing the basic scaffolding for a Swarm integrated back-end using the specified environment. The output scripts are examples of Swarm enabled code which runs alongside a Bee node on a traditional server, and allows for dynamic interaction with the Swarm.

```bash
npm init swarm-app@latest my-dapp node-ts
```

```bash
> npx
> create-swarm-app my-dapp node-ts

Project created

cd my-dapp
npm install
npm start
```

Your project structure will look like:

```bash
.
├── package.json
├── src
│   ├── config.ts
│   └── index.ts
└── tsconfig.json
```

The Bee node's API endpoint is specified in `config.ts`:


```js
export const BEE_HOST = 'http://localhost:1633'
```

This is the default endpoint used in all Bee API requests, and which is used to initialized a Bee object when using the `bee-js` SDK.

Within `index.ts`, the API endpoint is used to initialize a Bee object using `bee-js`, which is then used to pay for storage on Swarm if needed, and then upload and download data from Swarm:

`index.ts`:

```js
import { Bee } from '@ethersphere/bee-js'
import { BEE_HOST } from './config'

main()

async function main() {
    const bee = new Bee(BEE_HOST)
    const batchId = await getOrCreatePostageBatch(bee)
    console.log('Batch ID', batchId.toString())
    const data = 'Hello, world! The current time is ' + new Date().toLocaleString()
    const uploadResult = await bee.uploadData(batchId, data)
    console.log('Swarm hash', uploadResult.reference.toHex())
    const downloadResult = await bee.downloadData(uploadResult.reference)
    console.log('Downloaded data:', downloadResult.toUtf8())
}

async function getOrCreatePostageBatch(bee: Bee) {
    const batches = await bee.getPostageBatches()
    const usable = batches.find(x => x.usable)
  
    if (usable) {
        return usable.batchID
    } else {
        return bee.createPostageBatch('500000000', 20)
    }
}
```

When `create-swarm-app` is used with either `node` and `node-esm` options, a similar basic script will be output for the selected development environment.

### Fully Swarm Hosted dApp

In contrast with the previous example, the `vite-tsx` option for `create-swarm-app` will output the basic scaffolding for a Swarm integrated static site which can be uploaded to Swarm directly - no servers needed! 

```bash
npm init swarm-app@latest my-dapp vite-tsx
```

```bash
> npx
> create-swarm-app my-dapp vite-tsx

Project created

cd my-dapp
npm install
npm start
```

The output files will have this structure:

```bash
tree .
.
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── config.ts
│   └── index.tsx
└── tsconfig.json
```


After installing and starting the application, you will be first be greeted with a button that will purchase a new postage batch or select an existing one as needed. 

![](/img/develop-on-swarm-00.jpg)

After a postage batch is selected, you will be greeted with an interface for uploading data:

![](/img/develop-on-swarm-01.jpg)

After selecting a file to upload, a reference hash to the file will be returned:

![](/img/develop-on-swarm-02.jpg)

Right now our application is running on localhost, and is only accessible locally. To make this application accessible for anyone on Swarm, all we need to do create a production build of our application using `vite build` and then upload it to the Swarm with `swarm-cli`.

```bash
 npm run build
```

This will generate a production build in the `/dist` directory, which we can than use `swarm-cli` to upload:

```bash
swarm-cli upload dist
```

`swarm-cli` will prompt us to select a postage batch, after which it will automatically detect that we are trying upload a website, complete the upload, and return a hash to us which can now be used by anyone with a Bee node to access our app:

```bash
? Please select a stamp for this action
4996787aee78da46b6e32d8141aee89ebb4f2ef3301bf04e0a399247fc414f27 550.296 MB
Setting --index-document to index.html
Swarm hash: 764b08bb0f9e82d4bdce951b1ded816bd0417e039828e4308d61ab3035ff60a2
URL: http://localhost:1633/bzz/764b08bb0f9e82d4bdce951b1ded816bd0417e039828e4308d61ab3035ff60a2/
Stamp ID: 4996787a
Usage: 13%
Capacity (immutable): 550.296 MB remaining out of 628.910 MB
```