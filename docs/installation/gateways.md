---
title: Swarm Gateways
id: gateways
---

Swarm is a p2p network application, like a Blockchain, and, in order to access it, you must run a node which will connect you directly to other user's computers across the globe.

At present, it is not yet possible to run a node directly in the browser and other scenarios.

To overcome this, Swarm provides HTTP **Gateways** which can be accessed directly with a traditional web browser. These, however, provide only some of the functionality that Swarm has to offer.

## Gateway Features

A gateway can be used to:

1. Browse websites hosted on the Swarm network, using ENS, eg. [https://swarm.bzz.link](https://swarm.bzz.link).
2. Provide a Swarm API endpoint, which can be used by decentralised applications (Dapps). 

## Gateway Types

There are three main types of gateway:

### Public

A public gateway is provided for the general public to access any data from Swarm. The Swarm Foundation and Fair Data Society provide [some of these](/docs/access-the-swarm/gateway), for you to try.

We welcome those who would like to contribute to the decentralisation and health of the network to run their own public gateways. However, we recommend that only people and institutions that are aware of the potential risks and legal liabilities of allowing anyone to access any content through a Swarm gateway they operate should attempt this.

### Personal

You may like to provide a Swarm Gateway for you and your trusted colleagues, friends and family to use. 

This should be not be exposed to the public. You may use the basic token based authentication provided in **Gateway Proxy**, by using authentication at the network level, or by configuring your reverse proxy to authenticate users.

### Dapp Provider Gateway

As a Dapp provider, you may want to provide a Swarm gateway to users who do not have access to a Swarm node, so that they are able to interact with your Dapp. 

For security, you are able to use configure Cross Origin (CORS) policy to somewhat prevent users trying to connect to your gateway from other websites.

To manage your user's data persistence, there are three approaches which can be chosen dependent on how long you need the data to stay available in the network:

- Automatic stamping with random short lived stamps. Content will be deleted when the stamps expire.
- Automatic stamping using the same large batch, by setting a default `POSTAGE_STAMP`
- Pass any postage batch id as a header. The postage batch must belong to your attached Bee node.

## Overview 

In order to run a gateway, you must:

1. configure DNS records for your gateway's domain.
2. configure and run a reverse proxy (eg. *Nginx* or *Traefik*).
3. configure and run the [Gateway Proxy](https://github.com/ethersphere/gateway-proxy) software.
4. Run one or many Bee nodes.

:::danger
Running an unauthenticated node gives public access to any data that is held on the Swarm network from your domain. While we envisage e2e encryption functionality to be added in the future, it is currently recommended that only individuals and institutions aware of the relevant laws and regulations in the relevant jurisdications run a public gateway. Others are encouraged to run an authenticated gateway and divulge the access token only to trusted individuals.
:::

## Reference Implementation

A `docker-compose.yml` file is provided [below](/docs/installation/gateways#docker-composeyml) to help you get started quickly to serve as a reference implementation. This will enable you to manage all three of these services required to run your gateway. It will also use *Cloudflare* and *Lets Encrypt* to automatically provision and manage wildcard TLS certificates.

## Gateway Components

The following instructions will use examples when changing the `docker-compose.yml` file below to configure this reference implementation, but you may run and configure each component as you please.

### 1. DNS Records

All root domain and subdomain traffic will be routed to the gateway-proxy software served from your gateway's IP.

```
my-domain.org	  A	Simple	-	123.123.123.123
*.my-domain.org	A	Simple	-	123.123.123.123
```

You may also provide a gateway as a subdomain and sub-subdomain.

### 2. Reverse Proxy

A reverse proxy is required to provide TLS (https) termination and ensure your client's connection remains encrypted with the server. We recommend using *Traefik* or *Nginx* to perform this function. Your reverse proxy can also provide additional useful functionality such as rate limiting, improved authentication, and so on...

At a minimum, your reverse proxy must perform the following tasks:

1. Listen for https traffic on port 443.
2. Provide a valid root cert or wildcard cert for all subdomains during TLS handshake.
3. Route all http traffic from port 443 to your gateway-proxy.

In the below reference implementation, Traefik uses the Cloudflare API and Lets Encrypt to automatically provide TLS certificates.

### 3. Gateway Proxy

The Swarm Foundation provides [Gateway Proxy](https://github.com/ethersphere/gateway-proxy) software which turns your Bee node into a Swarm Gateway. 

At a minimum, you must configure internal network access to your Bee node, and the domain name you are using.

- "BEE_API_URL=http://bee:1633"
- "BEE_DEBUG_API_URL=http://bee:1635"
- "HOSTNAME=my-domain.org"

To provide access to ENS Swarm hosted domains and/or CID's as subdomains, enable these too.

- "ENS_SUBDOMAINS=true"
- "CID_SUBDOMAINS=true"

Full configuration details can be found in the [https://github.com/ethersphere/gateway-proxy](readme).

### 4. Bee Node

To get your Bee node working, you will need to configure URLS for your Gnosis Chain and Ethereum mainnet RPC providers, or to your own nodes if you are running them.

- "BEE_RESOLVER_OPTIONS=https://mainnet.infura.io/v3/b33b33b33b33b33b33b33b33"
- "BEE_SWAP_ENDPOINT=https://stake.getblock.io/mainnet/?api_key=b33b33b33b33-b33b33b33b33-b33b33b33b33"

To get started, deploy an empty chequebook. Later, you can fund it with BZZ so that your gateway is able to exceed the [free usage limits](/docs/introduction/terminology#time-based-settlements).

- "BEE_SWAP_INITIAL_DEPOSIT=0"

If using Gateway Proxy facilities which require access to the Bee debug api, such as stamp autobuy, enable and provide URL's for this.

- "BEE_DEBUG_API_URL=bee:1633"
- "BEE_DEBUG_API_ENABLE=true"

If you would to know more about what's happening with your Bee node, increase the verbosity level to increase the amount of information printed in your Bee logs.

- "BEE_VERBOSITY=debug"

Consider setting your Bee node's address if it has not been automatically connected so that other nodes in the network can discover it, as sometimes it is not automatically discovered by libp2p.

- "BEE_NAT_ADDR=123.123.123.123:1634"

When you start up your node, check the logs. You will see something like:

```
cannot continue until there is at least 0.000250 xDAI (for Gas) available on b33b33b33b33b33b33b33b33b33b33b33b33b333
```

Fund the address with xDAI. Once your have done so, your node should begin to sync postage batch snapshot. Once it has done so, it should begin to connect to the network. 

Full configuration details can be found in the [Configuration guide](/docs/working-with-bee/configuration).

## Modes of Operation

The above instructions will be enough to get a basic gateway up and running. 

Next, alter your the Gateway Proxy's configuration to get your Gateway running in a way that is best for your needs.

###  Personal

Supply the following configuration parameters to Gateway Proxy in order to create an authenticated gateway that automatically stamps chunks with a default stamp.

Limit access to your gateway by providing an authorisation secret known only to you and trusted individuals.

```
AUTH_SECRET=b33b33b33b33b33b33b33b33b33
```

You must pass this in the `Authorize` header with all requests. 

This can be handled by your Swarm Dapps, or you may use an app or plugin similar to *requestly.io* to automatically inject the secret into the `authorization` header.

Use `swarm-cli`, to create a postage stamp, provide this as the default. This will then be used to stamp all chunks that are created using the Gateway Proxy software.

```
POSTAGE_STAMP=b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33
```

### Public

The following configuration parameters will set up the gateway to autobuy stamps of a certain duration. Stamps will be automatically rotated when they are getting full or running out of TTL. See [Gateway Proxy](https://github.com/ethersphere/gateway-proxy) for more configuration parameters.

```
POSTAGE_DEPTH=19
POSTAGE_AMOUNT=1000000
```

### Dapp Provider Gateway

Use `swarm-cli`, to create a postage stamp then provide this to Gateway Proxy as the default. This will then be used to stamp all chunks that are created using the Gateway Proxy software.

```
  - "POSTAGE_STAMP=b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33"
```

```
  - `BEE_CORS_ALLOWED_ORIGINS[https://my-gateway.org]`
```

If deploying a browser based js app, you may want to serve up your applications's code at your domain root address. You can use swarm to do this by proxying the root route to your application's swarm address or ENS reference.

### Docker Compose Quick Start

Use the following script to get a gateway up and running using [Docker Compose](https://docs.docker.com/compose/install/).

Configure the `docker-compose.yml` below to customise it for your needs and copy it to your server, having installed the *Docker* software.

1. Ensure you have configured DNS records as indicated above.
2. Create and account at [Cloudflare](https://www.cloudflare.com/en-gb/) and create an access token, configure:
  - `CLOUDFLARE_EMAIL=your@email.com`
  - `CLOUDFLARE_DNS_API_TOKEN=b33b33b33b33b33b33b33b33b33b33b33`
3. Add your email for letsencrypt (certs are reprovisioned automatically).
  - `certificatesresolvers.gatewayresolver.acme.email=your@email.com`
3. Configure your domain name.
  - `entrypoints.websecure.http.tls.domains[0].main=my-gateway.org`
  - `entrypoints.websecure.http.tls.domains[0].sans=*.my-gateway.org`
  - `traefik.http.routers.gateway.rule=HostRegexp('my-gateway.org,'{subdomain:[a-z]+}.my-gateway.org')`
  - `HOSTNAME=swerm.org"`
4. Add your RPC endpoint addresses with API keys.
  - `BEE_RESOLVER_OPTIONS=https://mainnet.infura.io/v3/b33b33b33b33b33b33b33b33b33b33b33`
  - `BEE_SWAP_ENDPOINT=https://gno.getblock.io/mainnet/?api_key=b33b33b33b33b33b33b33b33b33b33b33`
5. Optionally, add CORS protections.
  - `BEE_CORS_ALLOWED_ORIGINS[https://my-gateway.org]`
6. Optionally, add an authentication token.
  - `AUTH_SECRET=b33b33b33b33b33b33b33b33b33b33b33`
7. Optionally, configure your stamp autobuy or default stamp (see above).
  - `POSTAGE_STAMP=b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33`

Finally, run the following.

```
docker compose up -d
```

#### docker-compose.yml

```
version: "3.3"

services:

  traefik:
    image: "traefik:v2.6"
    container_name: "traefik"
    command:
      - "--log.level=DEBUG"

      # Tell Traefik to discover containers using the Docker API
      - --providers.docker=true
      # Enable the Trafik dashboard
      - --api.dashboard=true
      # Set up LetsEncrypt
      - --certificatesresolvers.gatewayresolver.acme.dnschallenge=true
      - --certificatesresolvers.gatewayresolver.acme.dnschallenge.provider=cloudflare
      - --certificatesresolvers.gatewayresolver.acme.email=your@email.com
      - --certificatesresolvers.gatewayresolver.acme.storage=/letsencrypt/acme.json
      # Set up an insecure listener that redirects all traffic to TLS
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entrypoint.to=websecure
      - --entrypoints.web.http.redirections.entrypoint.scheme=https
      - --entrypoints.websecure.address=:443
      # Set up the TLS configuration for our websecure listener
      - --entrypoints.websecure.http.tls=true
      - --entrypoints.websecure.http.tls.certResolver=gatewayresolver
      - --entrypoints.websecure.http.tls.domains[0].main=swerm.org
      - --entrypoints.websecure.http.tls.domains[0].sans=*.swerm.org

    environment:
      - CLOUDFLARE_EMAIL=your@email.com
      - CLOUDFLARE_DNS_API_TOKEN=b33b33b33b33b33b33b33

    ports:
      - "443:443"
      - "8080:8080"

    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"

  gateway:
          image: ethersphere/gateway-proxy:0.5.0
          container_name: gateway-proxy
          environment:
                  - "BEE_API_URL=http://bee:1633"
                  - "ENS_SUBDOMAINS=true"
                  - "CID_SUBDOMAINS=true"
                  - "HOSTNAME=swerm.org"
                  # - "POSTAGE_STAMP=b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33b33"
                  # - "BEE_DEBUG_API_URL=http://bee:1635"
                  # - "AUTH_SECRET=b33b33b33b33b33b33b33"
          labels:
                  - "traefik.enable=true"
                  - "traefik.http.routers.gateway.rule=HostRegexp('my-gateway.org','{subdomain:[a-z]+}.my-gateway.org')"
                  - "traefik.http.routers.gateway.entrypoints=websecure"
                  - "traefik.http.routers.gateway.tls.certresolver=gatewayresolver"
                  - "traefik.http.middlewares.gatewaycorsheader.headers.accesscontrolallowmethods=GET,OPTIONS,PUT,POST"
                  - "traefik.http.middlewares.gatewaycorsheader.headers.accessControlAllowOriginListRegex=(.*?)"
                  - "traefik.http.middlewares.gatewaycorsheader.headers.accesscontrolmaxage=100"
                  - "traefik.http.middlewares.gatewaycorsheader.headers.addvaryheader=true"
                  - "traefik.http.routers.gatewayrouter.middlewares=gatewaycorsheader@docker"

  bee:
    image: ethersphere/bee:stable
    container_name: bee
    restart: unless-stopped
    volumes:
      - bee:/home/bee/.bee
    command: start
    environment:
            - "BEE_API_ADDR=:1633"
            - "BEE_P2P_ADDR=:1634"
            - "BEE_CORS_ALLOWED_ORIGINS=['*']"
            - "BEE_DEBUG_API_ADDR=:1635"
            - "BEE_DEBUG_API_ENABLE=true"
            - "BEE_NAT_ADDR"
            - "BEE_RESOLVER_OPTIONS=https://mainnet.infura.io/v3/b33b33b33b33b33"
            - "BEE_SWAP_ENDPOINT=https://gno.getblock.io/mainnet/?api_key=b333b33b3b3b3b3333"
            - "BEE_SWAP_INITIAL_DEPOSIT=0"
            - "BEE_PASSWORD=my-password"
            # - "BEE_VERBOSITY=debug"
    ports:
       - "1633:1633"
       - "1634:1634"
       - "1635:1635"

volumes:
  bee:
```

## Testing your installation

If you have enabled ENS support:

1. https://swarm.my-domain.org should resolve to the Swarm website.
2. https://my-domain.org/bzz/swarm.eth should also resolve to the Swarm website.