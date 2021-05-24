---
title: Bee Using Docker
id: docker
---

Docker containers for Bee are hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee) for your convenience. 

If running a full Bee node, it is recommended that you make use of Ethereum's external signer, [Clef](/docs/installation/bee-clef). See below for instructions on how to use [Docker Compose](/docs/installation/docker#docker-compose) to easily set up Bee with persistent storage and integration with the Bee Clef container.

### Quick Start

Try Bee out by simply running the following command in your Terminal. 

```bash
docker run\
  -p 1635:1635 \
  -p 1634:1634 \
  -p 1633:1633\
  --rm -it ethersphere/bee:latest\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint wss://goerli.infura.io/ws/v3/your-api-key \
    --debug-api-enable
```

:::info
If starting your node for the first time, you will need to deploy a chequebook contract. See [Manual Installation](/docs/installation/manual) for more info.
:::

To persist files, mount a local directory as follows and enter the password used to encrypt your keyfiles. Note, Docker insists on absolute paths when mounting volumes, so you must replace `/path/to/.bee-docker` with a valid path from your local filesystem.

```bash
docker run\
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 1635:1635 \
  -p 1634:1634 \
  -p 1633:1633\
  --rm -it ethersphere/bee:latest\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint wss://goerli.infura.io/ws/v3/your-api-key \
	  --debug-api-enable
```

Once you have generated your keys, leave Bee to run in the background...

```bash
docker run\
  -d 
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 1635:1635 \
  -p 1634:1634 \
  -p 1633:1633\
  --rm -it ethersphere/bee:latest\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint wss://goerli.infura.io/ws/v3/your-api-key \
	  --debug-api-enable
```

### Versions

Other versions of the Bee container are also available.

#### Latest Beta Release

```bash
docker pull ethersphere/bee:beta
```

#### Specific Versions

```bash
docker pull ethersphere/bee:0.6.0
```

#### Edge

```bash
docker pull ethersphere/bee:latest
```

Please see the [Docker Hub repository](https://hub.docker.com/r/ethersphere/bee) for more information.

### Docker Compose

Configuration files for Bee and Bee Clef are provided to enable quick and easy installation of both projects with persistent storage and secure secret management. To install Bee without Clef, simply omit the relevant steps.

#### Setup

First, retrieve the current `docker-compose.yaml` file.

```bash
wget -q https://raw.githubusercontent.com/ethersphere/bee/v0.6.1/packaging/docker/docker-compose.yml
```

Next, create a `.env` file using the example file provided. This file will be responsible for storing configuration and secrets for our Bee and Bee Clef applications.

```bash
wget -q https://raw.githubusercontent.com/ethersphere/bee/v0.6.1/packaging/docker/env -O .env
``` 

There are some important configuration parameters which must be set in order for our projects to work. To affect configuration in the `.env` file, we first remove the `#` at the beginning of the line and then change the value after `=` to our desired config.

For Bee, amend the following parameters:

```
BEE_SWAP_ENDPOINT=wss://goerli.infura.io/ws/v3/your-api-key
BEE_PASSWORD=my-password
```

To enable Clef support, we must also change the following params: 

```
CLEF_CHAINID=5
```

```
BEE_CLEF_SIGNER_ENABLE=true
BEE_CLEF_SIGNER_ENDPOINT=http://clef-1:8550
```

With the configuration settings complete, run `docker-compose up` with the `-d` flag to run Bee and Bee Clef as a daemon.

```bash
docker-compose up -d
```

:::warning
Docker Compose will create a Docker Volume called `bee` containing important key material. Make sure to [backup](/docs/working-with-bee/backups) the contents of your Docker volume!
:::

To determine our address to fund, we can check the logs for our Bee container:

```bash
docker-compose logs -f bee-1
```

```
bee_1 | time="2020-12-15T18:43:14Z" level=warning msg="cannot continue until there is sufficient ETH (for Gas) and at least 1 BZZ available on 7a977fa660e2e93e1eba40030c6b8da68d01971e"
time="2020-12-15T18:43:14Z" level=warning msg="learn how to fund your node by visiting our docs at https://docs.ethswarm.org/docs/installation/fund-your-node"
```


Once you have determined your Ethereum addresses, [fund your node](/docs/installation/fund-your-node)

After your transaction has been completed, your node should recognise that your wallet has been funded, and begin to deploy and fund your Bee chequebook!

Once Bee has completed this procedure, you may query the Bee [HTTP API](/docs/api-reference/api-reference) at `http://localhost:1633`.

```bash
curl localhost:1633
```

```
Ethereum Swarm Bee
```

Congratulations! Your Bee is up and running! 🐝
