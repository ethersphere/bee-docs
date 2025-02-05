---
title: Docker
id: docker
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Docker is one option for running a Bee node, and when combined with Docker Compose, it even offers a convenient solution for spinning up and managing a small "hive" of Bee nodes.  

Docker containers for Bee are hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee). 

:::caution
While it is possible to run multiple Bee nodes on a single machine, due to the high rate of I/O operations required by a full Bee node in operation, it is not recommended to run more than a handful of Bee nodes on the same physical disk (depending on the disk speed). 
:::


## Install Docker and Docker Compose

:::info
The steps for setting up Docker and Docker Compose may vary slightly from system to system, so take note system specific commands and make sure to modify them for your own system as needed. 
:::


<Tabs
defaultValue="debian"
values={[
{label: 'Debian', value: 'debian'},
{label: 'RPM', value: 'rpm'},
]}>

<TabItem value="debian">

### For Debian-based Systems (e.g., Ubuntu, Debian)

#### Step 1: Install Docker

1. **Update the package list:**

   ```bash
   sudo apt-get update
   ```

2. **Install necessary packages:**

   ```bash
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
   ```

3. **Add Docker’s official GPG key:**

   ```bash
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   ```

4. **Add Docker’s official repository to APT sources:**

   ```bash
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) latest" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

5. **Update the package list again:**

   ```bash
   sudo apt-get update
   ```

6. **Install Docker packages:**

   ```bash
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io
   ```

#### Step 2: Install Docker Compose Plugin

:::info
Skip this section if you are running Bee with Docker only.
:::

1. **Update the package list:**

   ```bash
   sudo apt-get update
   ```

2. **Install the Docker Compose plugin:**

   ```bash
   sudo apt-get install docker-compose-plugin
   ```

3. **Verify the installation:**

   ```bash
   docker compose version
   ```

</TabItem>

<TabItem value="rpm">

### For RPM-based Systems (e.g., CentOS, Fedora)

#### Step 1: Install Docker

1. **Install necessary packages:**

   ```bash
   sudo yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

2. **Add Docker’s official repository:**

   ```bash
   sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   ```

3. **Install Docker packages:**

   ```bash
   sudo yum install -y docker-ce docker-ce-cli containerd.io
   ```

4. **Start and enable Docker:**

   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

#### Step 2: Install Docker Compose Plugin

1. **Update the package list:**

   ```bash
   sudo yum update
   ```

2. **Install the Docker Compose plugin:**

   ```bash
   sudo yum install docker-compose-plugin
   ```

3. **Verify the installation:**

   ```bash
   docker compose version
   ```

</TabItem>

</Tabs>


## Bee with Docker

This section will guide you through setting up and running a single Bee node using Docker only without Docker Compose. 

### Step 1: Create directories

Create home directory:

```bash
mkdir bee-node
cd bee-node
```
Create data directory and change permissions

```bash
mkdir .bee
sudo chown -R 999:999 .bee
```

### Step 2: Bee Node Configuration

Based on your preferred node type, copy one of the three sample configurations below:

<Tabs
defaultValue="full"
values={[
{label: 'Full Node', value: 'full'},
{label: 'Light Node', value: 'light'},
{label: 'Ultra Light Node', value: 'ultralight'},

]}>

<TabItem value="full">

#### Full node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: FULL NODE CONFIGURATION
full-node: true
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="light">

#### Light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: LIGHT CONFIGURATION
full-node: false
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="ultralight">
 
#### Ultra light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org

# BEE MODE: ULTRA LIGHT CONFIGURATION
swap-enable: false
full-node: false
```

</TabItem>

</Tabs>

Save the configuration into a YAML configuration file:

```bash
sudo vi ./bee.yml
```

Print out the configuration to make sure it was properly saved:

```bash
cat ./bee.yml
```

### Step 3: Run Bee Node with Docker

Use the following command to start up your node:

```bash
docker run -d --name bee-node \
  -v "$(pwd)/.bee:/home/bee/.bee" \
  -v "$(pwd)/bee.yml:/home/bee/bee.yml" \
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
docker logs -f bee-node
```

The output should contain a line which prints the address of your node. Copy this address and save it for use in the next section.

```bash
"time"="2024-07-15 12:23:57.906429" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0005750003895" "address"="0xf50Bae90a99cfD15Db5809720AC1390d09a25d60"
```

### Step 4: Funding (Full and Light Nodes Only)



To obtain xDAI and fund your node, you can [follow the instructions](https://docs.ethswarm.org/docs/installation/install#4-fund-node) from the main install section.

### Step 5: Add Stake

To add stake, make a POST request to the `/stake` endpoint and input the amount you wish to stake in PLUR as a parameter after `/stake`. For example, to stake an amount equal to 10 xBZZ:

```bash
curl -X POST localhost:1633/stake/100000000000000000
```

Note that since we have mapped our host and container to the same port, we can use the default `1633` port to make our request. If you are running multiple nodes, make sure to update this command for other nodes which will be mapped to different ports on the host machine.


## Bee with Docker Compose

By adding Docker Compose to our setup, we can simplify the management of our configuration by saving it in a `docker-compose.yml` file rather than specifying it all in the startup command. It also lays the foundation for running multiple nodes at once. First we will review how to run a single node with Docker Compose.

### Step 1: Create directory for node(s)

```bash
mkdir bee-nodes
cd bee-nodes
```

### Step 2: Create home directory for first node

```shell
mkdir node_01
```

### Step 3: Create data directory and change permissions

```shell
mkdir node_01/.bee
sudo chown -R 999:999 node_01/.bee
```

Here we change ownership to match the UID and GID of the user specified in the [Bee Dockerfile](https://github.com/ethersphere/bee/blob/master/Dockerfile).

### Step 4: Bee node configuration

Below are sample configurations for different node types. 

:::info
The `blockchain-rpc-endpoint` entry is set to use the free and public `https://xdai.fairdatasociety.org` RPC endpoint, which is fine for testing things out but may not be stable enough for extended use. If you are running your own Gnosis Node or using a RPC provider service, make sure to update this value with your own endpoint.
:::


<Tabs
defaultValue="full"
values={[
{label: 'Full Node', value: 'full'},
{label: 'Light Node', value: 'light'},
{label: 'Ultra Light Node', value: 'ultralight'},

]}>

<TabItem value="full">

#### Full node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: FULL NODE CONFIGURATION
full-node: true
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="light">

#### Light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: LIGHT CONFIGURATION
full-node: false
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

</TabItem>

<TabItem value="ultralight">
 
#### Ultra light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org

# BEE MODE: ULTRA LIGHT CONFIGURATION
swap-enable: false
full-node: false
```

</TabItem>

</Tabs>

Copy the Docker configuration for the node type you choose and save it into a YAML configuration file:

```bash
sudo vi ./node_01/bee.yml
```

And print out the configuration to make sure it was properly saved:

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
sudo vi ./docker-compose.yml
```

And print out the contents of the file to make sure it was saved properly:

```bash
cat ./docker-compose.yml
```

Now check that you have everything set up properly:

```bash 
tree -a .
```

Your folder structure should look like this:

```bash
.
├── docker-compose.yml
└── node_01
    ├── .bee
    └── bee.yml
```

### Step 6: Run bee node with docker compose:

```
docker compose up -d
```

The node is started in detached mode by using the `-d` flag so that it will run in the background. 

Check that node is running:

```bash
docker ps
```

If we did everything properly we should see our node listed here:

```bash
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS
                                              NAMES
e53aaa4e76ec   ethersphere/bee:2.4.0   "bee start --config …"   17 seconds ago   Up 16 seconds   127.0.0.1:1636->1633/tcp, 0.0.0.0:1637->1634/tcp, :::1637->1634/tcp,  bee-node_01
```

Now let's check our logs:

```bash
docker logs -f bee-node_01
```

If everything went smoothly, we should see the logs from our Bee node. Unless you are running a node in ultra light mode, you should see a warning message in your logs which looks like this at the bottom of the logs:

```bash
"time"="2024-07-15 12:23:57.906429" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0005750003895" "address"="0xf50Bae90a99cfD15Db5809720AC1390d09a25d60"
```

This is because in order for a light or full node to operate, your node is required to set up a chequebook contract on Gnosis Chain, which requires xDAI in order to pay for transaction fees. Find the `address` value and copy it for the next step:

### Step 7: xDAI funding (full and light nodes only)

You can fund your node by transferring xDAI and xBZZ to the address you copied from the logs in the previous step.

To obtain xDAI and fund your node, you can [follow the instructions](/docs/bee/installation/install#4-fund-node) from the main install section.

You can also try the [node-funder](https://github.com/ethersphere/node-funder) tool, which is especially helpful when you are running multiple nodes, as is described in the next section.

### Step 8: Add stake

To add stake, make a POST request to the `/stake` endpoint and input the amount you wish to stake in PLUR as a parameter after `/stake`. In the example below we have input a PLUR value equal to 10 xBZZ. 

:::info
The Bee API will not be available while your node is warming up, so wait until your node is fully initialized before staking.
:::

```bash
curl -X POST localhost:1633/stake/100000000000000000
```

Note that since we have mapped our host and container to the same port, we can use the default `1633` port to make our request. If you are running multiple Bees, make sure to update this command for other nodes which will be mapped to different ports on the host machine.

## Running a Hive

In order to run multiple Bee nodes as a "hive", all we need to do is repeat the process for running one node and then extend our Docker Compose configuration.

To start with, shut down your node from the first part of this guide if it is still running:

```shell
docker compose down
```

### Step 1: Create new directories for additional node(s)

Now create a new directory for your second node:


```shell
mkdir node_02
```

We also create a new data directory and set ownership to match the user in the official [Bee Dockerfile](https://github.com/ethersphere/bee/blob/master/Dockerfile).

```shell
mkdir node_02/.bee
sudo chown -R 999:999 node_02/.bee
```

Repeat this process for however many new nodes you want to add.

### Step 2: Create new configuration file(s)

And add a `bee.yml` configuration file. You can use the same configuration as for your first node. Here we will use the configuration for a full node:

```yaml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
password: aaa4eabb0813df71afa45d
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: FULL NODE CONFIGURATION
full-node: true
swap-enable: true
blockchain-rpc-endpoint: https://xdai.fairdatasociety.org
```

```bash
sudo vi ./node_02/bee.yml
```

After saving the configuration, print out the configuration to make sure it was properly saved:

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

   1. Created an additional named service with a new unique name (bee_02).
   1. Created a unique name for each `container_name` value (bee-node_01 --> bee-node_02).
   1. Made sure that `volumes` has the correct directory for each node (./node_01/ --> ./node_02/).
   1. Updated the `ports` we map to so that each node has its own set of ports (ie, for node_02, we map 127.0.0.1:1636 to 1633 because node_01 is already using 127.0.0.1:1633, and do the same with the rest of the ports).

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
curl -X POST localhost:1633/stake/100000000000000000
```

And for bee-node_02, note that we updated the port to match the one for the Bee API address we mapped to in the Docker Compose file:

```bash
curl -X POST localhost:1636/stake/100000000000000000
```

You may also wish to make use of the [node-funder](https://github.com/ethersphere/node-funder) tool, which in addition to allowing you to fund multiple addresses at once, also allows you to stake multiple addresses at once.