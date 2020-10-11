---
title: Bee Using Docker
id: docker
---

Bee is also provided as Docker images hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee).

### Quick Start

Try Bee out by simply running the following command in your Terminal. 

```sh
docker run\
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 6060:6060 \
  -p 7070:7070 \
  -p 8080:8080\
  --rm -it bee:v1\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint https://rpc.slock.it/goerli \
    --debug-api-enable
```

:::info
If starting your node for the first time, you will need to deploy a chequebook contract. See [Start Your Node](/docs/getting-started/start-your-node) for more info.
:::

To persist files, mount a local directory as follows and enter the password used to encrypt your keyfiles. Note, Docker insists on absolute paths when mounting volumes, so you must replace `/path/to/.bee-docker` with a valid path from your local filesystem.

```sh
docker run\
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 6060:6060 \
  -p 7070:7070 \
  -p 8080:8080\
  --rm -it bee:v1\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint https://rpc.slock.it/goerli \
	  --debug-api-enable
```

Once you have generated your keys, leave Bee to run in the background...

```sh
docker run\
  -d 
  -v /path/to/.bee-docker:/home/bee/.bee\
  -p 6060:6060 \
  -p 7070:7070 \
  -p 8080:8080\
  --rm -it bee:v1\
  start \
    --welcome-message="Bzzzz bzzz bzz bzz. 🐝" \
    --swap-endpoint https://rpc.slock.it/goerli \
	  --debug-api-enable
```

### Versions

Other versions of the Bee container are also available.

#### Latest beta Release

```sh
docker pull ethersphere/bee:beta
```

#### Specific Versions

```sh
docker pull ethersphere/bee:0.3.0
```

#### Edge

```sh
docker pull ethersphere/bee:latest
```

Please see the [Docker Hub repository](https://hub.docker.com/r/ethersphere/bee) for more information.
