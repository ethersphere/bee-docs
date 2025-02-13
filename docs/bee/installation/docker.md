---
title: Docker Install
id: docker
---

# Docker Install

The following is a guide for installing a Bee node using Docker. Docker images for Bee are hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee). Using Docker to operate your Bee node offers

:::caution
In the examples below we specify the exact version number of the image using the 2.2.0 tag. It's recommended to only use the exact version number tags. Make sure to check that you're on the latest version of Bee by reviewing the tags for Bee on [Docker Hub](https://hub.docker.com/r/ethersphere/bee/tags), and replace 2.2.0 in the commands below if there is a newer full release.
:::

:::warning
Note that in all the examples below we map the Bee API to 127.0.0.1 (localhost), since we do not want to expose our Bee API endpoint to the public internet, as that would allow anyone to control our node. Make sure you do the same, and it's also recommended to use a firewall to protect access to your node(s).
:::

:::info
This guide sets options using environment variables as a part of the Docker startup commands such as `-e BEE_API_ADDR=":1633"`, however there are [several other methods available for configuring options](/docs/bee/working-with-bee/configuration).
:::

:::info
**Bee Modes:**

Bee nodes can be run in multiple modes with different functionalities. To run a node in full mode, both `BEE_FULL_NODE` and `BEE_SWAP_ENABLE` must be set to `true`. To run a light node (uploads and downloads only), set `BEE_FULL_NODE` to `false` and `BEE_SWAP_ENABLE` to `true`, or to run in ultra light mode (free tier downloads only) set both `BEE_FULL_NODE` and `BEE_SWAP_ENABLE` to `false`.

For more information on the different functionalities of each mode, as well as their different system requirements, refer to the [Getting Started guide](/docs/bee/installation/getting-started).
:::

## Node setup process

This section will guide you through setting up and running a single full Bee node using Docker. In the guide, we use a single line command for running our Bee node, with the Bee config options being set through environment variables, and a single volume hosted for our node's data.

### Start node

```bash
docker run -d --name bee-1 \
  --restart always \
  -p 127.0.0.1:1633:1633 \
  -p 1634:1634 \
  ethersphere/bee:2.4.0 start --config /home/bee/bee.yml
```

:::info
Command breakdown:

1. **`docker run`**: This is the command to start a new Docker container.

1. **`-d`**: This flag runs the container in detached mode, meaning it runs in the background.

1. **`--name bee-node`**: This sets the name of the container to `bee-node`. Naming containers can help manage and identify them easily.

1. **`-v "$(pwd)/.bee:/home/bee/.bee"`**: This mounts a volume. It maps the `.bee` directory in your current working directory (`$(pwd)`) to the `/home/bee/.bee` directory inside the container. This allows the container to store and access persistent data on your host machine.

1. **`-v "$(pwd)/bee.yml:/home/bee/bee.yml"`**: This mounts another volume. It maps the `bee.yml` file in your current working directory to the `/home/bee/bee.yml` file inside the container. This allows the container to use the configuration file from your host machine.

1. **`-p 127.0.0.1:1633:1633`**: This maps port 1633 on `127.0.0.1` (localhost) of your host machine to port 1633 inside the container. This is used for the Bee API.

1. **`-p 1634:1634`**: This maps port 1634 on all network interfaces of your host machine to port 1634 inside the container. This is used for P2P communication.

1. **`ethersphere/bee:2.4.0`**: This specifies the Docker image to use for the container. In this case, it is the `ethersphere/bee` image with the tag `2.4.0`.

1. **`start --config /home/bee/bee.yml`**: This specifies the command to run inside the container. It starts the Bee node using the configuration file located at `/home/bee/bee.yml`.
   :::

Note that we have mapped the Bee API and Debug API to 127.0.0.1 (localhost), this is to ensure that these APIs are not available publicly, as that would allow anyone to control our node.

Check that the node is running:

```bash
docker ps
```

If everything is set up correctly, you should see your Bee node listed:

```bash
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS
                                              NAMES
e53aaa4e76ec   ethersphere/bee:2.4.0   "bee start --config …"   17 seconds ago   Up 16 seconds   127.0.0.1:1633->1633/tcp, 0.0.0.0:1634->1634/tcp, :::1634->1634/tcp,   bee-node
```

And check the logs:

```bash
docker logs -f bee-1
```

The output should contain a line which prints a message notifying you of the minimum required xDAI for running a node as well as the address of your node. Copy the address and save it for use in the next section.

```bash
"time"="2024-09-24 22:06:51.363708" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0003576874793" "address"="0x91A7e3AC06020750D32CeffbEeFD55B4c5e42bd6"
```

You can use `Ctrl + C` to exit the logs.

Before moving on to funding, stop your node:

```bash
docker stop bee-1
```

And let's confirm that it has stopped:

```bash
docker ps
```

We can confirm no Docker container processes are currently running.

```bash
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### Fund node

Check the logs from the previous step. Look for the line which says:

```
"time"="2024-09-24 18:15:34.520716" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x1A801dd3ec955E905ca424a85C3423599bfb0E66"
```

That address is your node's address on Gnosis Chain which needs to be funded with xDAI and xBZZ. Copy it and save it for the next step.

xDAI is widely available from many different centralized and decentralized exchanges, just make sure that you are getting xDAI on Gnosis Chain, and not DAI on some other chain. See [this page](https://www.ethswarm.org/get-bzz) for a list of resources for getting xBZZ (again, make certain that you are getting the Gnosis Chain version, and not BZZ on Ethereum).

After acquiring some xDAI and some xBZZ, send them to the address you copied above.

**_How Much to Send?_**

Only a very small amount of xDAI is needed to get started, 0.1 is more than enough.

You can start with just 2 or 3 xBZZ for uploading small amounts of data, but you will need at least 10 xBZZ if you plan on staking.

### Initialize full node

After you have a small amount of xDAI in your node's Gnosis Chain address, you can now restart your node using the same command as before so that it can issue the required smart contract transactions and also sync data.

```bash
docker start bee-1
```

Let's check the logs to see what's happening:

```bash
cat ./node_01/bee.yml
```

### Step 5: Docker Compose configuration

You can use the same Docker Compose configuration for all the node types.

:::info
Note that we have specified the exact version number of the image using the 2.4.0 tag. It's recommended to always specify the exact version number you need using the version tag. You can find all available tags for Bee on [Docker Hub](https://hub.docker.com/r/ethersphere/bee/tags).
:::

```yml
services:
  bee_01:
    container_name: bee-node_01
    image: ethersphere/bee:2.4.0
    command: start --config /home/bee/bee.yml
    volumes:
      - ./node_01/.bee:/home/bee/.bee
      - ./node_01/bee.yml:/home/bee/bee.yml
    ports:
      - 127.0.0.1:1633:1633 # bee api port
      - 1634:1634 # p2p port
```

:::warning
Note that we are mapping to 127.0.0.1 (localhost), since we do not want to expose our Bee API endpoint to the public internet, as that would allow anyone to control our node. Make sure you do the same, or use a firewall to protect access to your node(s).
:::

Copy the configuration and save it in a YAML file like we did in the previous step. Make sure that you are saving it to the root directory.

```bash
Welcome to Swarm.... Bzzz Bzzzz Bzzzz
                \     /
            \    o ^ o    /
              \ (     ) /
   ____________(%%%%%%%)____________
  (     /   /  )%%%%%%%(  \   \     )
  (___/___/__/           \__\___\___)
     (     /  /(%%%%%%%)\  \     )
      (__/___/ (%%%%%%%) \___\__)
              /(       )\
            /   (%%%%%)   \
                 (%%%)
                   !

DISCLAIMER:
This software is provided to you "as is", use at your own risk and without warranties of any kind.
It is your responsibility to read and understand how Swarm works and the implications of running this software.
The usage of Bee involves various risks, including, but not limited to:
damage to hardware or loss of funds associated with the Ethereum account connected to your node.
No developers or entity involved will be liable for any claims and damages associated with your use,
inability to use, or your interaction with other nodes or the software.

version: 2.2.0-06a0aca7 - planned to be supported until 11 December 2024, please follow https://ethswarm.org/

"time"="2024-09-24 22:21:04.543661" "level"="info" "logger"="node" "msg"="bee version" "version"="2.2.0-06a0aca7"
"time"="2024-09-24 22:21:04.590823" "level"="info" "logger"="node" "msg"="swarm public key" "public_key"="02f0e59eafa3c5c06542c0a7a7fe9579c55a163cf1d28d9f6945a34469f88d1b2a"
"time"="2024-09-24 22:21:04.686430" "level"="info" "logger"="node" "msg"="pss public key" "public_key"="02ea739530bbf48eed49197f21660f3b6564709b95bf558dc3b472688c34096418"
"time"="2024-09-24 22:21:04.686464" "level"="info" "logger"="node" "msg"="using ethereum address" "address"="0x8288F1c8e3dE7c3bf42Ae67fa840EC61481D085e"
"time"="2024-09-24 22:21:04.700711" "level"="info" "logger"="node" "msg"="using overlay address" "address"="22dc155fe072e131449ec7ea2f77de16f4735f06257ebaa5daf2fdcf14267fd9"
"time"="2024-09-24 22:21:04.700741" "level"="info" "logger"="node" "msg"="starting with an enabled chain backend"
"time"="2024-09-24 22:21:05.298019" "level"="info" "logger"="node" "msg"="connected to blockchain backend" "version"="Nethermind/v1.28.0+9c4816c2/linux-x64/dotnet8.0.8"
"time"="2024-09-24 22:21:05.485287" "level"="info" "logger"="node" "msg"="using chain with network network" "chain_id"=100 "network_id"=1
"time"="2024-09-24 22:21:05.498845" "level"="info" "logger"="node" "msg"="starting debug & api server" "address"="[::]:1633"
"time"="2024-09-24 22:21:05.871498" "level"="info" "logger"="node" "msg"="using default factory address" "chain_id"=100 "factory_address"="0xC2d5A532cf69AA9A1378737D8ccDEF884B6E7420"
"time"="2024-09-24 22:21:06.059179" "level"="info" "logger"="node/chequebook" "msg"="no chequebook found, deploying new one."
"time"="2024-09-24 22:21:07.386747" "level"="info" "logger"="node/chequebook" "msg"="deploying new chequebook" "tx"="0x375ca5a5e0510f8ab307e783cf316dc6bf698c15902a080ade3c1ea0c6059510"
"time"="2024-09-24 22:21:19.101428" "level"="info" "logger"="node/transaction" "msg"="pending transaction confirmed" "sender_address"="0x8288F1c8e3dE7c3bf42Ae67fa840EC61481D085e" "tx"="0x375ca5a5e0510f8ab307e783cf316dc6bf698c15902a080ade3c1ea0c6059510"
"time"="2024-09-24 22:21:19.101450" "level"="info" "logger"="node/chequebook" "msg"="chequebook deployed" "chequebook_address"="0x66127e4393956F11947e9f54599787f9E455173d"
"time"="2024-09-24 22:21:19.506515" "level"="info" "logger"="node" "msg"="using datadir" "path"="/home/bee/.bee"
"time"="2024-09-24 22:21:19.518258" "level"="info" "logger"="migration-RefCountSizeInc" "msg"="starting migration of replacing chunkstore items to increase refCnt capacity"
"time"="2024-09-24 22:21:19.518283" "level"="info" "logger"="migration-RefCountSizeInc" "msg"="migration complete"
"time"="2024-09-24 22:21:19.566160" "level"="info" "logger"="node" "msg"="starting reserve repair tool, do not interrupt or kill the process..."
"time"="2024-09-24 22:21:19.566232" "level"="info" "logger"="node" "msg"="removed all bin index entries"
"time"="2024-09-24 22:21:19.566239" "level"="info" "logger"="node" "msg"="removed all chunk bin items" "total_entries"=0
"time"="2024-09-24 22:21:19.566243" "level"="info" "logger"="node" "msg"="counted all batch radius entries" "total_entries"=0
"time"="2024-09-24 22:21:19.566247" "level"="info" "logger"="node" "msg"="parallel workers" "count"=20
"time"="2024-09-24 22:21:19.566271" "level"="info" "logger"="node" "msg"="migrated all chunk entries" "new_size"=0 "missing_chunks"=0 "invalid_sharky_chunks"=0
"time"="2024-09-24 22:21:19.566294" "level"="info" "logger"="migration-step-04" "msg"="starting sharky recovery"
"time"="2024-09-24 22:21:19.664643" "level"="info" "logger"="migration-step-04" "msg"="finished sharky recovery"
"time"="2024-09-24 22:21:19.664728" "level"="info" "logger"="migration-step-05" "msg"="start removing upload items"
"time"="2024-09-24 22:21:19.664771" "level"="info" "logger"="migration-step-05" "msg"="finished removing upload items"
"time"="2024-09-24 22:21:19.664786" "level"="info" "logger"="migration-step-06" "msg"="start adding stampHash to BatchRadiusItems, ChunkBinItems and StampIndexItems"
"time"="2024-09-24 22:21:19.664837" "level"="info" "logger"="migration-step-06" "msg"="finished migrating items" "seen"=0 "migrated"=0
"time"="2024-09-24 22:21:19.664897" "level"="info" "logger"="node" "msg"="waiting to sync postage contract data, this may take a while... more info available in Debug loglevel"
```

Your node will take some time to finish [syncing postage contract data](https://docs.ethswarm.org/docs/develop/access-the-swarm/buy-a-stamp-batch/) as indicated by the final line:

```bash
"msg"="waiting to sync postage contract data, this may take a while... more info available in Debug loglevel"
```

You may need to wait 5 - 10 minutes for your node to finish syncing in this step.

Eventually you will be able to see when your node finishes syncing, and the logs will indicate your node is starting in full node mode:

```bash
"time"="2024-09-24 22:30:19.154067" "level"="info" "logger"="node" "msg"="starting in full mode"
"time"="2024-09-24 22:30:19.155320" "level"="info" "logger"="node/multiresolver" "msg"="name resolver: no name resolution service provided"
"time"="2024-09-24 22:30:19.341032" "level"="info" "logger"="node/storageincentives" "msg"="entered new phase" "phase"="reveal" "round"=237974 "block"=36172090
"time"="2024-09-24 22:30:33.610825" "level"="info" "logger"="node/kademlia" "msg"="disconnected peer" "peer_address"="6ceb30c7afc11716f866d19b7eeda9836757031ed056b61961e949f6e705b49e"
```

Your node will now begin syncing chunks from the network, this process can take several hours. You check your node's progress with the `/status` endpoint:

```bash
curl -s  http://localhost:1633/status | jq
```

```bash
{
  "overlay": "22dc155fe072e131449ec7ea2f77de16f4735f06257ebaa5daf2fdcf14267fd9",
  "proximity": 256,
  "beeMode": "full",
  "reserveSize": 686217,
  "reserveSizeWithinRadius": 321888,
  "pullsyncRate": 497.8747754074074,
  "storageRadius": 11,
  "connectedPeers": 148,
  "neighborhoodSize": 4,
  "batchCommitment": 74510761984,
  "isReachable": false,
  "lastSyncedBlock": 36172390
}
```

We can see that our node has not yet finished syncing chunks since the `pullsyncRate` is around 497 chunks per second. Once the node is fully synced, this value will go to zero. It can take several hours for syncing to complete, but we do not need to wait until our node is full synced before staking, so we can move directly to the next step.

### Stake node

You can use the following command to stake 10 xBZZ:

```bash
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS
                                              NAMES
e53aaa4e76ec   ethersphere/bee:2.4.0   "bee start --config …"   17 seconds ago   Up 16 seconds   127.0.0.1:1636->1633/tcp, 0.0.0.0:1637->1634/tcp, :::1637->1634/tcp,  bee-node_01
```

If the staking transaction is successful a `txHash` will be returned:

```
{"txHash":"0x258d64720fe7abade794f14ef3261534ff823ef3e2e0011c431c31aea75c2dd5"}
```

We can also confirm that our node has been staked with the `/stake` endpoint:

```bash
curl localhost:1633/stake
```

The results will be displayed in PLUR units (1 PLUR is equal to 1e-16 xBZZ). If you have properly staked the minimum 10 xBZZ, you should see the output below:

```bash
{"stakedAmount":"100000000000000000"}
```

Congratulations! You have now installed your Bee node and are connected to the network as a full staking node. Your node will now be in the process of syncing chunks from the network. Once it is fully synced, your node will finally be eligible for earning staking rewards.

### Set Target Neighborhood

When installing your Bee node it will automatically be assigned a neighborhood. However, when running a full node with staking there are benefits to periodically updating your node's neighborhood. Learn more about why and how to set your node's target neighborhood [here](/docs/bee/installation/set-target-neighborhood).

### Logs and monitoring

Docker provides convenient built-in tools for logging and monitoring your node, which you've already encountered if you've read through earlier sections of this guide. For a more detailed guide, [refer to the section on logging](/docs/bee/working-with-bee/logs-and-files).

**Viewing node logs:**

To monitor your node’s logs in real-time, use the following command:

```bash
docker logs -f bee-1
```

This command will continuously output the logs of your Bee node, helping you track its operations. The `-f` flag ensures that you see new log entries as they are written. Press `Ctrl + C` to stop following the logs.

You can read more about how Docker manages container logs [in their official docs](https://docs.docker.com/reference/cli/docker/container/logs/).

**Checking the Node's status with the Bee API**

To check your node's status as a staking node, we can use the `/redistributionstate` endpoint:

```bash
cat ./node_02/bee.yml
```

Repeat this step for any other additional node directories you created in the previous step.

### Step 3: Modify Docker Compose configuration

Here is the Docker compose configuration for running a hive of two Bee nodes:

```yaml
services:
  bee_01:
    container_name: bee-node_01
    image: ethersphere/bee:2.4.0
    command: start --config /home/bee/bee.yml
    volumes:
      - ./node_01/.bee:/home/bee/.bee
      - ./node_01/bee.yml:/home/bee/bee.yml
    ports:
      - 127.0.0.1:1633:1633 # bee api port
      - 1634:1634 # p2p port
  bee_02:
    container_name: bee-node_02
    image: ethersphere/bee:2.4.0
    command: start --config /home/bee/bee.yml
    volumes:
      - ./node_02/.bee:/home/bee/.bee
      - ./node_02/bee.yml:/home/bee/bee.yml
    ports:
      - 127.0.0.1:1636:1633 # bee api port
      - 1637:1634 # p2p port
```

Here is a list of the changes we made to extend our setup:

1.  Created an additional named service with a new unique name (bee_02).
1.  Created a unique name for each `container_name` value (bee-node_01 --> bee-node_02).
1.  Made sure that `volumes` has the correct directory for each node (./node_01/ --> ./node_02/).
1.  Updated the `ports` we map to so that each node has its own set of ports (ie, for node_02, we map 127.0.0.1:1636 to 1633 because node_01 is already using 127.0.0.1:1633, and do the same with the rest of the ports).

### Step 4: Start up the hive

Start up the hive:

```shell
docker compose up -d
```

After starting up the hive, check that both nodes are running:

```shell
docker ps
```

```shell
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS
                                              NAMES
a62ec5143d30   ethersphere/bee:2.4.0   "bee start --config …"   2 seconds ago   Up 1 second   127.0.0.1:1636->1633/tcp, 0.0.0.0:1637->1634/tcp, :::1637->1634/tcp,   bee-node_02
a3496b9bb2c8   ethersphere/bee:2.4.0   "bee start --config …"   2 seconds ago   Up 1 second   127.0.0.1:1633->1633/tcp, 0.0.0.0:1634->1634/tcp, :::1634->1634/tcp   bee-node_01
```

And we can also check the logs for each node:

```shell
docker logs -f bee-node_01
```

Copy the address from the logs:

```shell
"time"="2024-07-23 11:54:08.657999" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_xdai_amount"="0.000500000002" "address"="0x0E386401AFA8A9e23c6FFD81C7078505a36dB435"
```

```shell
docker logs -f bee-node_02
```

And copy the second address:

```shell
"time"="2024-07-23 11:54:08.532812" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_xdai_amount"="0.000500000002" "address"="0xa4DBEa11CE6D089455d1397c0eC3D705f830De69"
```

### Step 5: Fund nodes

You can fund your nodes by sending xDAI and xBZZ the addresses you collected from the previous step.

To obtain xDAI and fund your node, you can [follow the instructions](/docs/bee/installation/install#4-fund-node) from the main install section.

Since you're running a hive, the [node-funder](https://github.com/ethersphere/node-funder) tool is recommended, as it will allow you to rapidly fund and stake multiple nodes.

If you plan on staking, you will also want to [get some xBZZ](https://www.ethswarm.org/get-bzz) to stake. You will need 10 xBZZ for each node.

### Step 6: Add stake

:::info
The Bee API will not be available while your nodes are warming up, so wait until your nodes are fully initialized before staking.
:::

In order to stake you simply need to call the `/stake` endpoint with an amount of stake in PLUR as a parameter for each node.

For bee-node_01:

```bash
{
  "minimumGasFunds": "11080889201250000",
  "hasSufficientFunds": true,
  "isFrozen": false,
  "isFullySynced": true,
  "phase": "claim",
  "round": 212859,
  "lastWonRound": 207391,
  "lastPlayedRound": 210941,
  "lastFrozenRound": 210942,
  "lastSelectedRound": 212553,
  "lastSampleDuration": 491687776653,
  "block": 32354719,
  "reward": "1804537795127017472",
  "fees": "592679945236926714",
  "isHealthy": true
}
```

For a complete breakdown of this output, check out [this section in the Bee docs](https://docs.ethswarm.org/docs/bee/working-with-bee/bee-api#redistributionstate).

You can read more other important endpoints for monitoring your Bee node in the [official Bee docs](https://docs.ethswarm.org/docs/bee/working-with-bee/bee-api), and you can find complete information about all available endpoints in [the API reference docs](https://docs.ethswarm.org/api/).

**Stopping Your Node**

To gracefully stop your Bee node, use the following command:

```bash
docker stop bee-1
```

Replace `bee-1` with the name of your node if you've given it a different name.

## Back Up Keys

Once your node is up and running, make sure to [back up your keys](/docs/bee/working-with-bee/backups).

## Getting help

The CLI has documentation built-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` from within your Docker container or `bee start --help` will tell you how you can configure your Bee node via the command line arguments.

You may also check out the [configuration guide](/docs/bee/working-with-bee/configuration), or simply run your Bee terminal command with the `--help` flag, eg. `bee start --help` or `bee --help`.

## Next Steps to Consider

### Access the Swarm

If you'd like to start uploading or downloading files to Swarm, [start here](/docs/develop/access-the-swarm/introduction).

### Explore the API

The [Bee API](/docs/bee/working-with-bee/bee-api) is the primary method for interacting with Bee and getting information about Bee. After installing Bee and getting it up and running, it's a good idea to start getting familiar with the API.

### Run a hive!

If you would like to run a hive of many Bees, check out the [hive operators](/docs/bee/installation/hive) section for information on how to operate and monitor many Bees at once.

### Start building DAPPs on Swarm

If you would like to start building decentralised applications on Swarm, check out our section for [developing with Bee](/docs/develop/introduction).
