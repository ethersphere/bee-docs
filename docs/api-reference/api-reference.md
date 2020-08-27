---
title: API and debug API
id: api-reference
---

The Bee node exposes two HTTP API endpoints, `API` and `debugAPI`. These endpoints are the primary interface into a *running* bee node. All API-endpoints will return a [JSON](https://www.json.org/json-en.html) formatted string upon success or an appropriate [HTTP-error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

## API
The API-endpoint exposes all functionality to upload and download content to/from the Swarm network. By default, it runs on port `:8080`, which can be changed to any other unused port by using the `--api-addr` flag upon startup.

The API-endpoint is specified, using the [openAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) standard. And can be found under the `openapi` folder in the [bee-repo](https://github.com/ethersphere/bee).

A HTML representation thereof can be reached via:

- <a href="../../api" target="_blank" rel="noopener noreferrer">Web2</a>,
- [Swarm Bee](https://gateway.ethswarm.org/files/tbc).

## Debug API
The debug-API is disabled by default and can be enabled by passing the `--enable-debug-api` flag upon startup. The debug-API exposes all functionality to inspect the state of your running bee node and experimental features. The debug-API run on port `:6060`, which can be changed by passing the `--debug-api-addr` flag to your node upon startup.

The debug-API endpoint is specified, using the [openAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) standard. And can be found under the `openapi` folder in the [bee-repo](https://github.com/ethersphere/bee).

A HTML representation thereof can be reached via:

- <a href="../../debug-api" target="_blank" rel="noopener noreferrer">Web2</a>,
- [Swarm Bee](https://gateway.ethswarm.org/files/tbc).

## Interaction
Interaction with the Swarm HTTP APIs can be done via many ways. Below, a few examples are listed, but these are by no means exhaustive!

### Command-line
The HTML endpoints can be reached via the command-line, using [curl](https://curl.haxx.se/). As the returned answer is always in `JSON`, you can make the output pretty to use in your terminal, using [jq](https://stedolan.github.io/jq/).

As an example, you can inspect your topology, by calling `curl localhost:6060/topology | jq` (note that you must run a node with the `debug-api` endpoint enabled).

### Browser
You can call all open `GET` API endpoints also via your browsers navigation bar. To verify this, navigate to `localhost:6060/topology`. The output can be shown in a pretty form, using a browser plugin.

### Your app
If you are integrating Swarm as a component in your app, you can just interact with the Swarm HTTP endpoints as you would interact with any other HTTP endpoint. Please refer to the canonical documentation of the HTTP endpoints in the `openapi` folder in the [bee-repo](https://github.com/ethersphere/bee).
