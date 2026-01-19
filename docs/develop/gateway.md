---
title: Run a Gateway
id: gateway-proxy
---

This guide explains how to use the [swarm-gateway](https://github.com/ethersphere/swarm-gateway) tool to set up your node in gateway mode. Running your node in gateway mode exposes it publicly, allowing access through any typical browser or http API. 

It is divided into several parts:

* Part 1 - Basic setup 
* Part 2 - Securing your gateway with TLS
* Part 3 - Optional features

## Part 1 — Running a Swarm Gateway (HTTP, minimal setup)

:::info
Historically, the main tool for running a Swarm HTTP gateway was [gateway-proxy](https://github.com/ethersphere/gateway-proxy), however it is planned to be deprecated in favor of [swarm-gateway](https://github.com/ethersphere/swarm-gateway).

At the time of writing, `gateway-proxy` still contains some features that are not yet implemented in `swarm-gateway` - unless you have a specific need for these features however, `swarm-gateway` is strongly recommended.
:::

This guide describes how to run a Swarm HTTP gateway using `swarm-gateway` and Bee with a minimal configuration.

At the end of this section, the gateway will be reachable at:

```text
http://your-domain.example
```

Swarm content will be accessible at:

```text
http://your-domain.example/bzz/<reference>/
```

:::warning Security notice
This setup uses plain HTTP.

Traffic is not encrypted and any `Authorization` headers can be observed by intermediaries on the network path. This configuration is not suitable for production use.

The purpose of this section is to verify that the gateway is working. HTTPS is added in a later part of the guide.
:::

The guide in this section:

* Runs `swarm-gateway` using Docker
* Connects it to an existing Bee node
* Exposes it publicly over HTTP

:::danger
This part of the guide does not cover setting up TLS, so your gateway will be accessible through plain HTTP, not HTTPS, making it highly insecure. It should not be exposed publicly without first setting up TLS, which is covered in the next section.
:::

### Prerequisites


* A server with:
  * A public IP address (VPS recommended)
  * Port **80** open
* Docker 
* A domain for hosting your gateway publicly
* A running Bee node in Docker
* A valid stamp batch

### 1. Configure DNS for your domain

Create an A record in your DNS provider:

```text
your-domain.example -> <your-server-ip>
```

ADD SCREENSHOT 

After DNS propagation, verify that the domain resolves to your server (this may take some time, to verify more quickly, try pinging from a different machine or VPS):

```bash
ping your-domain.example
```

### 2. Create a Docker network

The gateway container must be able to communicate with your Bee node, for this, both containers must be on the same Docker network.

Create a network and attach the Bee container to it:

```bash
docker network create swarm-net
docker network connect swarm-net bee-1
```

Verify:

```bash
docker network inspect swarm-net
```

The output should list `bee-1` as an attached container.

### 3. Pull the gateway image

```bash
docker pull ethersphere/swarm-gateway:0.1.3
```

### 4. Run the gateway

Start the gateway container:

```bash
docker run -d --restart unless-stopped \
  --name swarm-gateway \
  --network swarm-net \
  -p 80:3000 \
  -e HOSTNAME="your-domain.example" \
  -e BEE_API_URL="http://bee-1:1633" \
  -e DATABASE_CONFIG="{}" \
  ethersphere/swarm-gateway:0.1.3
```

In this configuration, database-backed features such as subdomain rewrites and moderation are not configured.

### 5. Verify operation

From your local machine (not the server):

```bash
curl http://your-domain.example/health
```

Expected output:

```text
OK
```

### 6. Test with uploaded content

Upload a file using Bee:

```bash
echo "hello swarm" > test.txt
swarm-cli upload test.txt
```

This will print a Swarm reference.

Open the file through the gateway:

```text
http://your-domain.example/bzz/<REFERENCE>/
```

The file contents should be returned.

### 7. Optional: restrict uploads using authentication

By default, the gateway allows anyone to upload content using your Bee node.

To restrict uploads, set:

* `AUTH_SECRET` — a long random string
* `SOFT_AUTH=true` — only require authentication for POST requests

Example (add these lines to the `docker run` command):

```bash
-e AUTH_SECRET="replace-with-a-long-random-secret" \
-e SOFT_AUTH="true" \
```

At this point, you have:

* A working Swarm HTTP gateway
* Connected to your Bee node
* Exposing content over `/bzz/<reference>`

The setup is intentionally minimal and suitable for testing and development, however without TLS, it is not secure and should never be used in production or publicly exposed. 

The next section explains how to enable TLS so that your gateway can be securely accessed through HTTPS.


## TLS Setup

TBD

## Optional Features

TBD