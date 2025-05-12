---
title: Bee FAQ
id: bee-faq
---

## Running a Bee Node

### How can I become part of the Swarm network?

You can become part of the network by running a bee node. Bee is a peer-to-peer client that connects you with other peers all over the world to become part of the Swarm network, a global distributed p2p storage network that aims to store and distribute all of the world's data

Depending on your needs you can run an ultra-light, light or full node.

### What are the differences between Bee node types?

A bee node can be configured to run in various modes based on specific use cases and requirements. [See here](/docs/bee/installation/getting-started) for an overview of the differences.


#### What are the requirements for running a Bee node?

See the [getting started section](/docs/bee/installation/getting-started#software-requirements) for more information about running a Bee node.

##### Full node

- 20GB -30GB SSD (ideally NVME).
- 8GB RAM
- CPU with 2+ cores
- RPC connection to Gnosis Chain
- Min 0.1 xDAI for Gnosis GAS fees
- 1 xBZZ for initial chequebook deployment
- 10 xBZZ for staking (optional)

##### How much bandwidth is required for each node?

Typically, each node requires around 10 megabits per second (Mbps) of bandwidth during normal operation.

##### How do I Install Bee on Windows?

Bee is compatible with Windows and a Bee `.exe` file can be found on the [`releases` page](https://github.com/ethersphere/bee/releases) of the Bee repo.  

It is also possible to [build from the source](/docs/bee/installation/build-from-source).

##### How do I get the node's wallet's private key (use-case for Desktop app)?

See the [backup section](/docs/bee/working-with-bee/backups/) for more info.

##### How do I import my private key to Metamask?

You can import the `swarm.key` json file in MetaMask using your password file or the password you have set in your bee config file.

##### Where can I find my password?

You can find the password in the root of your data directory. See the [backup section](/docs/bee/working-with-bee/backups/) for more info.

## Connectivity

### Which p2p port does Bee use and which should I open in my router?

The default p2p port for Bee is 1634, please forward this using your router and allow traffic over your firewall as necessary. Bee also supports UPnP but it is recommended you do not use this protocol as it lacks security. For more detailed information see the connectivity section in the docs. https://docs.ethswarm.org/docs/bee/installation/connectivity

### How do I know if I am connected to other peers?

You can use swarm-cli to check your node's connectivity status:

```bash
 swarm-cli status
```

The `Topology` section will display basic information about the peers your node is connected to:

```bash
...
Topology
Connected Peers: 132
Population: 6437
Depth: 10
...
```

## Errors

### What does "could not connect to peer" mean?

The "Could not connect to peer" error can occur for various reasons. One of the most common is that you have the identifier of a peer in your address book from a previous session. When trying to connect to this node again, the peer may no longer be online.

### What does "context deadline exceeded" error mean?

The "context deadline exceeded" is a non-critical warning. It means that a node took unexpectedly long to respond to a request from your node. Your node will automatically try again via another node.

### How do I set up a blockchain endpoint?

We recommend you run your own [Gnosis Node using Nethermind](https://docs.gnosischain.com/node/tools/sedge).

- If you use "bee start"

  - you can set it in your bee configuration under --blockchain-rpc-endpoint or BEE_BLOCKCHAIN_RPC_ENDPOINT
  - open ~/.bee.yaml
  - set `blockchain-rpc-endpoint: http://localhost:8545`

- If you use bee.service
  - you can set it in your bee configuration under --blockchain-rpc-endpoint or BEE_BLOCKCHAIN_RPC_ENDPOINT
  - open /etc/bee/bee.yaml
  - and then uncomment `blockchain-rpc-endpoint` configuration
  - and set it to `http://localhost:8545`
  - after that sudo systemctl restart bee

### How can I export my private keys?

See the section on [backups](/docs/bee/working-with-bee/backups) for exporting your keys.

### How to import bee node address to MetaMask?

1. See the [backup section](/docs/bee/working-with-bee/backups/) for info on exporting keys.
2. Go to Metamask and click "Account 1" --> "Import Account"
3. Choose the "Select Type" dropdown menu and choose "JSON file"
4. Paste the password (Make sure to do this first)
5. Upload exported JSON file  
6. Click "Import"


### What are the restart commands of bee?

If you use bee.service:

- Start: `sudo systemctl start bee.service`
- Stop: `sudo systemctl stop bee.service`
- Status: `sudo systemctl status bee.service`

If you use "bee start"

- Start: `bee start`
- Stop: `ctrl + c` or `cmd + c` or close terminal to stop process

### Relevant endpoints and explanations

See the [API Reference](https://docs.ethswarm.org/api/) pages for details about commonly used API endpoints, and the [API reference documentation](/api/) for a complete list of endpoints.

However, directly interacting with the API is not recommended for most users. Instead, [`bee-js`](/docs/develop/tools-and-features/bee-js) (for building applications) and [`swarm-cli`](/docs/bee/working-with-bee/swarm-cli) (for command line interaction) are the recommended methods for interaction with Bee as they greatly simplify the process.

### How can I check how many cashed out cheques do I have?

You can look at your chequebook contract at etherscan.
Get your chequebook contract address with: `curl http://localhost:1633/chequebook/address`

### Where can I find documents about the cashout commands?

Learn how to cash out [here](/docs/bee/working-with-bee/cashing-out).

### When I run http://localhost:1633/chequebook/balance I get "totalBalance" and "availableBalance" what is the difference?

`totalBalance` is the balance on the blockchain, and `availableBalance` is that balance minus the outstanding (non-cashed) cheques that you have issued to your peers. These latter cheques do not show up on the blockchain.

It's like what the bank thinks your balance is vs what your chequebook knows is actually available because of the cheques you've written that are still "in the mail" and not yet cashed.

### What determines the number of peers and how to influence their number? Why are there sometimes 300+ peers and sometimes 30?

The number of connected peers is determined by your node as it attempts to keep the distributed Kademlia well connected. As nodes come and go in the network your peer count will go up and down. If you watch bee's output logs for "successfully connected", there should be a mix of (inbound) and (outbound) at the end of those messages. If you only get (outbound) then you may need to get your p2p port opened through your firewall and/or forwarded by your router. Check out the connectivity section in the docs https://docs.ethswarm.org/docs/bee/installation/connectivity.

### What is the difference between "systemctl" and "bee start"?

_bee start_ and _systemctl start bee_ actually run 2 different instances with 2 different _bee.yaml_ files and two different data directories.

_bee start_ uses _~/.bee.yaml_ and the _~/.bee_ directory for data
_systemctl_ uses _/etc/bee/bee.yaml_ and (IIRC) _/var/lib/bee_ for data

## Swarm Protocol

### Can I use one Ethereum Address/Wallet for many nodes?

No, this violates the requirements of the Swarm Protocol and will break critical node functions such as staking, purchasing stamp batches, and uploading data. 

Therefore, the rule is, each node must have:

- 1 Ethereum address (this address, the Swarm network id, and a random nonce are used to determine the node's overlay address)
- 1 Chequebook
- 2 Unique ports for Bee API / p2p API



## Miscellaneous

### How can I add Gnosis / Sepolia to Metamask?

You can easily add Sepolia or Gnosis to metamask using the [official guide from Metamask](https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/).

If you are using a different wallet which does not have an easy option for adding networks like Metamask does, then you may need to add the networks manually. You need to fill in four pieces of information to do so:

#### Gnosis Chain

Network name: Gnosis
RPC URL: https://xdai.fairdatasociety.org
Chain ID: 100
Currency symbol: XDAI

#### Sepolia

Network name: Sepolia test network
RPC URL: https://sepolia.infura.io/v3/
Chain ID: 11155111
Currency symbol: SepoliaETH