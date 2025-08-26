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

- **bee-js**: [`bee-js` is the official JavaScript SDK for Swarm](https://bee-js.ethswarm.org/docs/), and is the *recommended approach* for building Swarm integrated dApps. It supports both NodeJS and browser based APIs, making it easy to integrate with both frontend and backend applications.

:::tip
Refer to the next section "Template Applications." to learn about using `create-swarm-app` to generate basic project scaffolding which demonstrate specifically how to use `bee-js` to integrate Swarm into your application.
:::

- **Raw API**: If required, you may also directly interact with the [Bee HTTP API](/api/). This approach is discouraged unless explicitly required for your use case.

## Template Applications

Once you've got your Bee node up and running and have installed all the pre-requisites and recommended tools mentioned above, now you're really ready to get started building.

The best way get started is with a simple template application to serve as an example. The [`create-swarm-app` tool](https://www.npmjs.com/package/create-swarm-app) allows you to rapidly generate simple starter templates for several different use cases, and serve a the perfect jumping off point for further learning. 

For more details on using `create-swarm-app`, and for a step-by-step explanation of the template apps it can output, refer to the [guides in the bee-js docs](https://bee-js.ethswarm.org/docs/getting-started/#quickstart-with-create-swarm-app).  

