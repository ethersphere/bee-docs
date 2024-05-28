---
title: Bee Using Docker
id: docker
---

Docker containers for Bee are hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee) for your convenience.

### Quick Start

Try Bee out by simply running the following command in your terminal.

```bash
docker run \
  -p 1634:1634 \
  -p 1633:1633 \
  --rm -it ethersphere/bee:stable \
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --blockchain-rpc-endpoint http://localhost:8545 \
```

:::info
If starting your node for the first time, you will need to deploy a chequebook contract. See [installation](/docs/bee/installation/install) section for more info.
:::

To persist files, mount a local directory as follows and enter the password used to encrypt your keyfiles. Note, `docker` insists on absolute paths when mounting volumes, so you must replace `/path/to/.bee-docker` with a valid path from your local filesystem.

```bash
docker run \
  -v /path/to/.bee-docker:/home/bee/.bee \
  -p 1634:1634 \
  -p 1633:1633 \
  --rm -it ethersphere/bee:stable \
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --blockchain-rpc-endpoint https://gno.getblock.io/<<your-api-key>>/mainnet/ \
```

Once you have generated your keys, use the `-d` flag to run in detached mode and leave Bee running in the background:

```bash
docker run \
  -d
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 1634:1634 \
  -p 1633:1633 \
  --rm -it ethersphere/bee:stable \
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --blockchain-rpc-endpoint https://gno.getblock.io/<<your-api-key>>/mainnet/ \
```

### Versions

In order to avoid accidentally upgrading your Bee containers, or deadlocks resulting from Docker caching solutions, it is recommended to use best practices and pin the specific version of Bee that you want to run.

#### Specific Versions

```bash
docker pull ethersphere/bee:2.0.0
```

#### Using Tags

```bash
docker pull ethersphere/bee:beta
```

You may use the tags `beta`, `latest`, and `stable`, or find out more
at the [Docker Hub repository](https://hub.docker.com/r/ethersphere/bee).

### Docker Compose

Configuration files for Bee are provided to enable quick
and easy installation with persistent storage and
secure secret management. 

#### Setup

First, retrieve the current `docker-compose.yaml` file.

```bash
wget -q https://raw.githubusercontent.com/ethersphere/bee/v2.0.0/packaging/docker/docker-compose.yml
```

Next, create a `.env` file using the example file provided. This file will be responsible for storing configuration and secrets for our Bee node(s).

```bash
wget -q https://raw.githubusercontent.com/ethersphere/bee/v2.0.0/packaging/docker/env -O .env
```

There are some important configuration parameters which must be set in order for our projects to work. To affect configuration in the `.env` file, we first remove the `#` at the beginning of the line and then change the value after `=` to our desired config.

For Bee, amend the following parameters:

```
BEE_BLOCKCHAIN_RPC_ENDPOINT=https://gno.getblock.io/<<your-api-key>>/mainnet/
BEE_PASSWORD=my-password
```
```

With the configuration settings complete, you can start your Bee node(s) by running:

```bash
docker-compose up -d
```

:::tip
By specifying the `-d` flag to `docker-compose` we run Bee in detached mode so that it continues running in the background.
:::

:::warning
Docker Compose will create a Docker volume called `bee` containing important key material. Make sure to [backup](/docs/bee/working-with-bee/backups) the contents of your Docker volume!
:::

To determine the Bee node's address to fund, we can check the logs for our Bee _container_:

```bash
docker-compose logs -f bee-1
```

```
bee_1 | time="2020-12-15T18:43:14Z" level=warning msg="cannot continue until there is sufficient ETH (for Gas) and at least 1 xBZZ available on 7a977fa660e2e93e1eba40030c6b8da68d01971e"
time="2020-12-15T18:43:14Z" level=warning msg="learn how to fund your node by visiting our docs at https://docs.ethswarm.org/docs/bee/installation/fund-your-node"
```

Once you have determined your Bee's Ethereum addresses,
[fund your node](/docs/bee/installation/fund-your-node).

After your transaction has been completed, your node should recognise that your wallet has been funded, and begin to deploy and fund your Bee chequebook!

Once Bee has completed this procedure, you may query the Bee [HTTP API](/docs/bee/working-with-bee/bee-api) at `http://localhost:1633`.

```bash
curl localhost:1633
```

```
Ethereum Swarm Bee
```

Once you start seeing messages in the `docker-compose logs -f bee-1`
like:

```
successfully connected to peer 7fa40ce124d69ecf14d6f7806faaf9df5d639d339a9d343aa7004373f5c46b8f (outbound)
```

You're connected to the Swarm. Let's do a quick check to find out how
many peers we have using the `curl` command line utility:

```bash
curl localhost:1633/peers
```

```json
{
  "peers": [
    {
      "address": "339cf2ca75f154ffb8dd13de024c4a5c5b53827b8fd21f24bec05835e0cdc2e8"
    },
    {
      "address": "b4e5df012cfc281e74bb517fcf87fc2c07cd787929c332fc805f8124401fabae"
    }
  ]
}
```

If you see peers listed here - congratulations! You have joined the swarm! Welcome! 🐝
