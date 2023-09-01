---
title: FAQ
id: faq
---


# Swarm FAQ

## Community

### What are the Swarm Foundation's official channels?

- Website: [https://ethswarm.org/](https://ethswarm.org/)
- Blog:[https://blog.ethswarm.org/](https://blog.ethswarm.org/)
- Github: [https://github.com/ethersphere](https://github.com/ethersphere)
- e-mail: info@ethswarm.org
- Discord: [https://discord.ethswarm.org/](https://discord.ethswarm.org/)
- Twitter: [https://twitter.com/ethswarm](https://twitter.com/ethswarm)
- Reddit: [https://www.reddit.com/r/ethswarm](https://www.reddit.com/r/ethswarm)
- Youtube: [https://www.youtube.com/channel/UCu6ywn9MTqdREuE6xuRkskA](https://www.youtube.com/channel/UCu6ywn9MTqdREuE6xuRkskA)

### Where can I find technical support and get answers to my other questions?

The Swarm community is centered around our Discord server where you will find many people willing and able to help with your every need! [https://discord.ethswarm.org/](https://discord.ethswarm.org/)

### Where can I find support for running Bee node on Dappnode?

You can find support for running Bee on Dappnode on the Dappnode Discord server: [https://discord.gg/dRd5CrjF](https://discord.gg/dRd5CrjF)

### Who can I contact for other inquiries?

For any other inquiries, you can contact us at [info@ethswarm.org](mailto:info@ethswarm.org)

### What's the relationship between Swarm and Ethereum?

Swarm started in the first days of Ethereum as part of the original "world computer" vision, consisting of Ethereum (the processor), Whisper (messaging) and Swarm (storage). The project is the result of years of research and work by the Ethereum Foundation, the Swarm Foundation, teams, individuals across the ecosystem and the community.

The conceptual idea for Swarm was started in the Ethereum team at the beginning, and the Ethereum Foundation incubated Swarm. After five years of research, Swarm and Ethereum are now two separate entities.

## BZZ Token

### What is BZZ Token?

Swarm's native token BZZ, was initially issued on Ethereum. It has been bridged over to Gnosis where it is referred to as xBZZ for differentiation, and serves as a means of accessing the platform's data relay and storage services, while also providing compensation for node operators who provide these services. 

### What is PLUR?

1 PLUR is the atomic unit of xBZZ, where xBZZ then has 16 decimals (ie. 1 PLUR = 1e-16 xBZZ)

### Where can I buy BZZ Token?

There are many ways to acquire BZZ token, either on custodial centralised exchanges where you can trade traditional currencies and cryptocurrency or through decentralised exchanges and protocols where you can trade between cryptocurrencies. For more information please visit the [Get BZZ](https://www.ethswarm.org/get-bzz) page on the Ethswarm.org homepage.

### What is the BZZ token address?

See [this page](/docs/learn/technology/contracts/overview/#token-contracts) for a list of relevant token addresses. 

### What is the BZZ token supply?

The BZZ token does not have a fixed supply, but instead, it can be minted by depositing collateral (DAI token) and burned which releases this collateral. The amount of collateral that needs to be deposited/withdrawn to mint/burn 1 BZZ token is defined by a token bonding curve in a smart contract.

Current token supply: [https://tokenservice.ethswarm.org/circulating\_supply](https://tokenservice.ethswarm.org/circulating_supply)

### BZZ token tokenomics

More about BZZ token tokenomics: https://blog.ethswarm.org/hive/2021/bzz-tokenomics/

### What is the bonding curve?

A bonding curve is a mathematical function in the form of y=f(x) that determines the price of a single token, depending on the number of tokens currently in existence, or the market supply. The key difference is that with a traditional exchange platform market makers are required to provide liquidity to the market, whereas a bonding curve takes over the role of providing liquidity, negating the need for market makers.

### What is the "Bzzaar" bonding curve?

Bzzaar is a unique exchange platform that enables users to buy and sell BZZ tokens. Unlike traditional exchange platforms, Bzzaar uses a bonding curve to instantly complete transactions without relying on market makers. The platform allows new projects to easily integrate Bzzaar's contracts into their own interfaces, creating a front-end interface for BZZ exchange. The bonding curve is community-owned and fuels all projects created on Swarm.

Read more about the "Bzzaar" bonding curve: [https://medium.com/ethereum-swarm/swarm-and-its-bzzaar-bonding-curve-ac2fa9889914](https://medium.com/ethereum-swarm/swarm-and-its-bzzaar-bonding-curve-ac2fa9889914)

Bzzaar contract[information](https://github.com/ethersphere/bzzaar-contracts): https://github.com/ethersphere/bzzaar-contracts

[Bzzaar's smart contract](https://etherscan.io/address/0x4f32ab778e85c4ad0cead54f8f82f5ee74d46904): [https://etherscan.io/address/0x4f32ab778e85c4ad0cead54f8f82f5ee74d46904](https://etherscan.io/address/0x4f32ab778e85c4ad0cead54f8f82f5ee74d46904)

Is Bzzaar's bonding curve audited?

A full [audit of Swarm](https://github.com/ethersphere/bzzaar-contracts/tree/v1.0.0) was performed by QuantStamp and the [final audit report](https://github.com/ethersphere/bzzaar-contracts/blob/v1.0.0/audit/Buzzar_final_audit_report.pdf) has been made publicly available.

## Running a Bee Node

### How can I become part of the Swarm network?

You can become part of the network by running a bee node. Bee is a peer-to-peer client that connects you with other peers all over the world to become part of Swarm network, a global distributed p2p storage network that aims to store and distribute all of the world's data

Depending on your needs you can run ultra-light, light or full node.

### What are the differences between Bee node types?

A bee node can be configured to run in various modes based on specific use cases and requirements. [See here](/docs/bee/installation/quick-start) for an overview of the differences.

 
#### What are the requirements for running a Bee node?


See the [install section](/docs/bee/installation/install/#1-install-bee) for more information about running a Bee node.

##### Full node

- 20GB -30GB SSD (ideally nvme).
- 8GB RAM
- CPU with 2+ cores
- RCP connection to Gnosis Chaiin
- Min 0.1 xDAI for Gnosis GAS fees
- 1 xBZZ for initial chequebook deployment
- 10 xBZZ for staking (optional)

##### How much bandwidth is required for each node?

Typically, each node requires around 10 megabits per second (Mbps) of bandwidth during normal operation.

##### How do I Install Bee on Windows?

You can install Bee node on Windows but it is not mentioned in the documentation, however, the steps are the same as the manual installation https://docs.ethswarm.org/docs/bee/installation/manual you can download the binary from here

https://github.com/ethersphere/bee/releases and download one of the Windows releases.

It is also possible to build from the source.

##### How do I get the node's wallet's private key (use-case for Desktop app)?

See the [backup section](/docs/bee/working-with-bee/backups/) for more info.

##### How do I import the swarm private key to metamask?

You can import the `swarm.key` json file in MetaMask using your password file or the password you have set in your bee config file.

##### Where can I find my password?

You can find the password in the root of your data directory. See the [backup section](/docs/bee/working-with-bee/backups/) for more info.

## Connectivity

### Which p2p port does Bee use and which should I open in my router?

The default p2p port for Bee is 1634, please forward this using your router and allow traffic over your firewall as necessary. Bee also supports UPnP but it is recommended you do not use this protocol as it lacks security. For more detailed information see the connectivity section in the docs. https://docs.ethswarm.org/docs/bee/installation/connectivity

### How do I know if I am connected to other peers?

You may communicate with your Bee using its HTTP api. Type `curl http://localhost:1635/peers` at your command line to see a list of your peers.

### What does "Failed to connect to local host port 1635: Connection refused" mean?

Your node is not listening on port 1635, either the debug-api is not enabled, or it is not listening on localhost. Make sure your bee.yaml file has `debug-api-enable: true`

## Errors

### What does "could not connect to peer" mean?

“Could connect to peer can happen for various reasons.” One of the most common is that you have the identifier of a peer in your address book from a previous session. When trying to connect to this node again, the peer may no longer be online.

### What does "context deadline exceeded" error mean?

The "context deadline exceeded" is a non critical warning. It means that a node took unexpectedly long to respond to a request from your node. Your node will automatically try again via another node.

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

See the section on [backups](/docs/bee/working-with-bee/backups#files) for exporting your keys.

### How to import bee node address to MetaMask?

1. See the [backup section](/docs/bee/working-with-bee/backups/) for info on exporting keys.
2. Go to Metamask and click import account
3. Choose select type: JSON file
4. Upload exported JSON file 
5. Paste the password
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

See the [API Reference](https://docs.ethswarm.org/docs/api-reference/) pages for details.

Most common use cases:

- `curl http://localhost:1635/peers` - Shows you the currently connected peers
- `curl http://localhost:1635/balances` - Shows balances (positive=incoming, negative=outgoing) accumulating with peers, some of which may or may not be currently connected
- `curl http://localhost:1635/settlements` - When the balance with a given peer exceeds a threshold, a settlement will be issued, if the settlement is received, then your node should have a check from that peer.
- `curl http://localhost:1635/chequebook/address` your chequebook contract to see the xBZZ.

### How can I check how many cashed out cheques do I have?

You can look at your chequebook contract at etherscan.
Get your chequebook contract address with: `curl http://localhost:1635/chequebook/address`

### I have compared transactions between my ethereum address and my chequebook address, the numbers are different, which is quite weird.

Your chequebook will show OUT xBZZ transactions when your peers cash cheques issued by you, but you don't pay any gas for those so they won't show up in your Ethereum address transaction list.

### Where can I find documents about the cashout commands?

https://docs.ethswarm.org/docs/bee/working-with-bee/cashing-out

### When I run http://localhost:1635/chequebook/balance I get "totalBalance" and "availableBalance" what is the difference?

`totalBalance` is the balance on the blockchain, `availableBalance` is that balance minus the outstanding (non-cashed) cheques that you have issued to your peers. These latter cheques do not show up on the blockchain.

It's like what the bank thinks your balance is vs what your chequebook knows is actually available because of the cheques you've written that are still "in the mail" and not yet cashed.

### What determines the number of peers and how to influence their number? Why are there sometimes 300+ peers and sometimes 30?

The number of connected peers is determined by your node as it attempts to keep the distributed Kademlia well connected. As nodes come and go in the network your peer count will go up and down. If you watch bee's output logs for "successfully connected", there should be a mix of (inbound) and (outbound) at the end of those messages. If you only get (outbound) then you may need to get your p2p port opened through your firewall and/or forwarded by your router. Check out the connectivity section in the docs https://docs.ethswarm.org/docs/bee/installation/connectivity.

### What is the difference between "systemctl" and "bee start"?

_bee start_ and _systemctl start bee_ actually run 2 different instances with 2 different _bee.yaml_ files and two different data directories.

_bee start_ uses _~/.bee.yaml_ and the _~/.bee_ directory for data
_systemctl_ uses _/etc/bee/bee.yaml_ and (IIRC) _/var/lib/bee_ for data

## Swarm Protocol

### Can I use one Ethereum Address/Wallet for many nodes?

No, this violates the requirements of the Swarm Protocol. The Swarm
Protocol relies upon the `Swarm Address`, also known as the `peer address`. This address is a **hash of the node's Ethereum address**,
therefore it is deterministic. As all nodes must have a unique address,
if you were to use the same wallet, it would violate the uniqueness
constraint and result in malfunctioning nodes.

Therefore, the rule is, each node must have:

- 1 Ethereum Address
- 1 Chequebook
- 3 unique ports for API / p2p / Debug API.
