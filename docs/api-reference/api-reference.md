---
title: API and Debug API
id: api-reference
---

The Bee node exposes two HTTP API endpoints, the `API` and the `DebugAPI`. These endpoints are the
primary interfaces to a *running* Bee node. API-endpoints can be queried using familiar HTTP
requests, and will respond with a semantically accurate
[HTTP status and error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
as well as data payloads in [JSON](https://www.json.org/json-en.html) format where appropriate.

## API
The API-endpoint exposes all functionality to upload and download content to and from the Swarm network. By default, it runs on port `:1633`.

Detailed information about Bee API endpoint can be found here:

### <a href="/api" target="_blank" rel="noopener noreferrer">Bee API reference.</a>


## Debug API
The debug-API is disabled by default but be enabled by setting the `enable-debug-api` configuration option to `true`. The debug-API exposes functionality to inspect the state of your Bee node while it is running, as well as some other features that should not be exposed to the public internet. The Debug API runs on port `:1635` by default.

:::info
For a new installation of Bee, the debug API endpoint is not yet exposed for security reasons. To enable the debug API endpoints, set `debug-api-enable` to `true` in your [configuration file](/docs/working-with-bee/configuration) and restart your Bee service.
:::

### <a href="/debug-api" target="_blank" rel="noopener noreferrer">Debug API reference.</a>

:::danger 
Your Debug API should not be exposed to the public internet, make sure that your network has a firewall which blocks port `1635`, or bind the Debug API to `localhost`
:::
