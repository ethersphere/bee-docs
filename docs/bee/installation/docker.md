---
title: Docker
id: docker
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Docker along with Docker Compose offers a convenient solution for spinning up and managing a "hive" of Bee nodes. 

Docker containers for Bee are hosted at [Docker Hub](https://hub.docker.com/r/ethersphere/bee). The "stable" tag release is recommended for most use cases.

## Install Docker and Docker Compose

:::info
The steps for setting up Docker and Docker Compose may vary slightly from system to system, so take note system specific commands and make sure to modify them for your own operating system and processor architecture. 
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
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
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

## Setup and configuration

Next we will set up a directory for our node(s) and specify configuration files for Docker and Docker Compose:


#### Step 1: Create directory for node(s)

```bash
mkdir bee-nodes
cd bee-nodes
```

#### Step 2: Create home directory

```shell
mkdir bee-home-dir
```

#### Step 3: Create a data directory for bee
```shell
mkdir ./bee-home-dir/.bee
```

#### Step 4: Generate a random string and save it to a file. 

This will be used as the password for Bee. 

This command generates a password file containing the password for your node.
Keep a copy of this password somewhere safe. It will be required for importing/exporting wallets (into Metamask for instance). 

```shell
openssl rand -base64 24 > ./bee-home-dir/password
```

#### Step 5: Docker configuration

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

##### Full node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
debug-api-addr: :1635
password-file: /home/bee/password
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
debug-api-enable: true
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

##### Light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
debug-api-addr: :1635
password-file: /home/bee/password
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
debug-api-enable: true
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
 
##### Ultra light node sample configuration

```yml
# GENERAL BEE CONFIGURATION
api-addr: :1633
p2p-addr: :1634
debug-api-addr: :1635
password-file: /home/bee/password
data-dir: /home/bee/.bee
cors-allowed-origins: ["*"]

# DEBUG CONFIGURATION
debug-api-enable: true
verbosity: 5

# BEE MAINNET CONFIGURATION
bootnode: /dnsaddr/mainnet.ethswarm.org

# BEE MODE: ULTRA LIGHT CONFIGURATION
swap-enable: false
full-node: false
```

</TabItem>

</Tabs>

Copy the Docker configuration for the node type you choose and save it into a YAML configuration file:

```bash
sudo vi ./bee-home-dir/.bee.yml
```

And print out the configuration to make sure it was properly saved:

```bash
cat ./bee-home-dir/.bee.yml
```

#### Step 6: Docker Compose configuration

You can use the same Docker Compose configuration for all the node types.

```yml
  services:
      bee:
          container_name: bee-node
          image: ethersphere/bee:stable
          command: start --config /home/bee/.bee.yml
          volumes:
              - ./bee-home-dir:/home/bee
          ports:
              - 1633:1633 # bee api port
              - 1634:1634 # p2p port
              - 1635:1635 # debug port
```

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
├── bee-home-dir
│   ├── .bee
│   ├── .bee.yml
│   └── password
└── docker-compose.yml
```

Our project folder setup should now look like this:

![image](https://github.com/rampall/docker-compose-bee-quickstart/assets/520570/8fcf825c-f4ff-4f34-aa75-ea26ca6d9df4)

```
tree -a .
```
```
.
├── bee-home-dir
│   ├── .bee
│   ├── .bee.yml
│   └── password
└── docker-compose.yml
```


#### Step 7: Run bee node with docker compose:

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
3f99396ef480   ethersphere/bee:stable   "bee start --config …"   5 seconds ago   Up 5 seconds   0.0.0.0:1633-1635->1633-1635/tcp, :::1633-1635->1633-1635/tcp   bee-node
```

Now let's check our logs:

```bash
docker logs -f bee
```

If everything went smoothly, we should see the logs from our Bee node. Unless you are running a node in ultra light mode, you should see a warning message in your logs which looks like this:

```bash
"time"="2024-07-15 12:23:57.906429" "level"="warning" "logger"="node/chequebook" "msg"="cannot continue until there is at least min xDAI (for Gas) available on address" "min_amount"="0.0005750003895" "address"="0xf50Bae90a99cfD15Db5809720AC1390d09a25d60"
```

This is because in order for a light or full node to operate, your node is required to set up a chequebook contract on Gnosis Chain, which requires xDAI in order to pay for transaction fees. Find the `address` value and copy it for the next step:

#### Step 8: xDAI funding (full and light nodes only)



## Running a Hive




