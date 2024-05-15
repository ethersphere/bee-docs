---
title: Bee API
id: api-reference
---

The Bee HTTP API is the primary interfaces to a running Bee node. API-endpoints can be queried using familiar HTTP requests, and will respond with semantically accurate [HTTP status and error codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) as well as data payloads in [JSON](https://www.json.org/json-en.html) format where appropriate.

The Bee API-endpoint exposes all functionality to upload and download content to and from the Swarm network. By default, it runs on port `:1633`.

Detailed information about Bee API endpoints can be found in the [API reference docs](/api/).

:::danger
Your Debug API should not be exposed to the public Internet, make sure that your network has a firewall which blocks port `1633`. You may also consider using the 
:::


