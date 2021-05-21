---
title: FAQ
id: FAQ
---

### Which p2p port does Bee use and which should I open in my router?

The default p2p port for Bee in 1634, please forward this using your router and allow traffic over your firewall as necessary. Bee also supports UPNP but it is recommended you do not use this protocol as it lacks security. For more detailed information see the connectivity section in the docs. https://docs.ethswarm.org/docs/installation/connectivity

### How do I know if I am connected to other peers?

You may communicate with your Bee using it’s HTTP api. Type `curl http://localhost:1635/peers` at your command line to see a list of your peers.

### What does "Failed to connect to local host port 1635: Connection refused" mean?
Your node is not listening on port 1635, either the debug-api is not enabled, or it is not executing on localhost. Make sure your bee.yaml file has `debug-api-enable: true`

## Errors

### What does "could not connect to peer" mean?

“Could connect to peer can happen for various reasons.” One of the most common is that you have the identifier of a peer in your address book from a previous session. When trying to connect to this node again, the peer may no longer be online.

### What does "context deadline exceeded" error mean?

The "context deadline exceeded" is a non critical warning. It means that a node took unexpectedly long to respond a request from your node. Your node will automatically try again via another node. 

### How do I set up a blockchain endpoint?

- If you use "bee start" 
    - you can set it in your bee configuration under --swap-endpoint or BEE_SWAP_ENDPOINT
    - open ~/.bee.yaml
    - set `swap-endpoint: wss://goerli.infura.io/ws/v3/your-api-key`


- If you use bee.service
    - you can set it in your bee configuration under --swap-endpoint or BEE_SWAP_ENDPOINT
    - open /etc/bee/bee.yaml
    - and then uncomment `swap-endpoint` configuration
    - and set it to `wss://goerli.infura.io/ws/v3/your-api-key`
    - after that sudo systemctl restart bee

### How to export private keys from the node with bee-clef installed


If you are running Bee together with the Bee-Clef, you can type in the command line `bee-clef-keys` and that will store the .JSON file into your home folder and copy the password in your clipboard.


### I have bee-clef installed but I can't export private keys.
It happens quite a lot that bee-clef is installed, but getting the address from bee-clef-keys does not yield the same output as `:1635/addresses`

In this case, the user most likely does not have clef enabled in the configuration of the bee node.

This doesn't work for you? You get erorr -> `xclip: not found” or “Error: Can’t open display: (null)`

Try running the command below:
`sudo cat /var/lib/bee-clef/password`

You can then use that to import to Metamask or any other web3 wallet provider.

### How to export private keys from the node (without bee-clef)?

You can find insturction here in README section:
https://github.com/ethersphere/exportSwarmKey

You can also follow to the mini-guide on the link below:
https://pastebee.com/?3b2a4cecafa21a7afcdd4d4f3d74fef1d5551acd91eb2d3a5b750dc9a161fbcf

### How to import bee node address to Metamask?

1. [export your bee node private keys](https://hackmd.io/tfKVeHaIQGewlGTC4ooESg#How-to-export-private-keys-from-the-node-with-bee-claf-installed)
2. go to Metamask and click import account
3. choose select type: JSON file
4. upload exported .JSON file (which contains your keys)
5. paste the password
6. click Import

### What are the restart commands of bee?

If you use bee.service:

- Start: `sudo systemctl start bee.service`
- Stop: `sudo systemctl stop bee.service`
- Status: `sudo systemctl status bee.service`

If you use "bee start" 

- Start: `bee start` 
- Stop: `ctrl + c` or `cmd + c` or close terminal to stop process

### Relevant endpoints and explanations

Balances: https://docs.ethswarm.org/debug-api/#tag/Balance
Chequebook: https://docs.ethswarm.org/debug-api/#tag/Chequebook
Status: https://docs.ethswarm.org/debug-api/#tag/Status
Connectivity: https://docs.ethswarm.org/debug-api/#tag/Connectivity
Settlements: https://docs.ethswarm.org/debug-api/#tag/Settlements
Chunk: https://docs.ethswarm.org/debug-api/#tag/Chunk

Most common use cases:

- `curl http://localhost:1635/peers` - Shows you the currently connected peers
- `curl http://localhost:1635/balances` - Shows balances (positive=incoming, negative=outgoing) accumulating with peers, some of which may or may not be currently connectd
- `curl http://localhost:1635/settlements` - When the balance with a given peer exceeds a threshold, a settlement will be issued, if the settlement is received, then your node should have a check from that peer.
- `curl http://localhost:1635/chequebook/address` your checkbook contract to see the gBZZ.

### How can I check how many cashed out cheques do I have?
You can look at your checkbook contract at etherscan.  
Get your checkbook contract address with: `curl http://localhost:1635/chequebook/address`



### I have compared transactions between my ethereum address and my chequebook address, the number are different, which is quite weird.

Your checkbook will show OUT gBZZ transactions when your peers cash checks issued by you, but you don't pay any gas for those so they won't show up in your Ethereum address transaction list.

### How to set infura.io endpoint:

You need to sign up for a free account at infura.io, set up an Ethereum project, and get the goerli test net URL which will include your personal API key.  Put that URL in your swap-endpoint and restart your node.

Be sure that you choose the right network:
![](https://i.imgur.com/ev5Fwsm.png)

### Can I connect several nodes to infura endpoint?

Yes, but their free plan has limit 100k requests per day.


### Where can I find documents about the cashout commands?

https://docs.ethswarm.org/docs/working-with-bee/cashout


### When I run http://localhost:1635/chequebook/balance I get "totalBalance" and "availableBalance" what is the difference?

`totalBalance` is the balance on the blockchain, `availableBalance` is that balance minus the outstanding (non-cashed) checks that you have issued to your peers.  These latter checks do not show up on the blockchain.
It's like what the bank thinks your balance is vs what your checkbook knows is actually available because of the checks you've written that are still "in the mail" and not yet cashed.

### What determines the number of peers and how to influence their number? Why are there sometimes 300+ peers and sometimes 30?

The number of connected peers is determined by your node as it attempts to keep the distributed Kademlia well connected.  As nodes come and go in the network your peer count will go up and down. If you watch bee's output logs for "successfully connected", there should be a mix of (inbound) and (outbound) at the end of those messages.  If you only get (outbound) then you my need to get your p2p port opened through your firewall and/or forwarded by your router. Check out the connectivity section in the docs https://docs.ethswarm.org/docs/installation/connectivity.

### What is the difference between "systemctl" and "bee start"?

*bee start* and *systemctl start bee* actually run 2 different instances with 2 different *bee.yaml* files and two different data directories.

*bee start* uses *~/.bee.yaml* and the *~/.bee* directory for data
*systemctl* uses */etc/bee/bee.yaml* and (IIRC) */var/lib/bee* for data

### How can I find a transaction hash for the --transaction configuration parameter?

Use this cunning one liner - thanks [filoozom](https://github.com/beejeez/beejeez/commits?author=filoozom)

Get your API key from [etherscan](https://etherscan.io)

```
curl "https://api-goerli.etherscan.io/api?module=account&action=txlist&address=$ADDRESS&startblock=0&endblock=99999999&sort=asc&apikey=$API_KEY" | jq -c 'first(.result[] | select(.to == "'$ADDRESS'")).hash'
```