---
title: Bandwidth Incentives (SWAP)
id: bandwidth-incentives
---

The Swarm Accounting Protocol (SWAP) is a protocol used to manage the exchange of bandwidth resources between nodes. SWAP ensures that node operators collaborate in routing messages and data while protecting the network against frivolous use of bandwidth. The protocol combines off-chain peer-to-peer based accounting with on-chain settlement through the chequebook contract.

As nodes relay requests and responses, they keep track of their bandwidth usage with each of their peers. Peers engage in a service-for-service exchange, where they provide resources to each other based on their relative usage. 

Once a node's relative debt with one of their peers crosses a certain threshold, the party in debt can either send a xBZZ payment in the form of a "cheque" (an off chain commitment to pay their debt), or can continue to provide bandwidth services in kind until their debt is paid off. Each node can set their own threshold for the level of relative debt they accept. Freeloader nodes which do not pay their debts are at risk of being blacklisted by other nodes. 

## Chequebook Contract

The [chequebook contract](https://github.com/ethersphere/swap-swear-and-swindle/blob/master/contracts/ERC20SimpleSwap.sol) is a smart contract used in the SWAP protocol to manage cheques that are sent between nodes on the network. It acts as a wallet which nodes can fund with xBZZ which can be used to issue payments when presented with a valid cheque. The contract is also responsible for ensuring that cheques are valid and are cashed out correctly.

When a node sends a cheque to one of its peers, it includes a signed message that specifies the amount of xBZZ tokens being transferred and the recipient's address. The chequebook contract receives this message and verifies that it is valid by checking the signature and ensuring that the sender has enough funds to cover the transfer.

If the cheque is valid, the contract updates the balances of both nodes accordingly. The recipient can then cash out their xBZZ tokens by sending a transaction to the blockchain that invokes a function in the chequebook contract. This function transfers the specified amount of xBZZ tokens from the sender's account to the recipient's account.

## Opportunistic Caching

When a node serves a chunk, the chunk is saved in the nodes' cache. Popular chunks which are frequently requested are kept in the cache so that they can be served again without the need to re-download the chunks from the network. This allows nodes to maximise their earnings by retaining popular chunks. This mechanism also contributes to Swarm's scalability, as popular chunks are always readily available for download as a result of opportunistic caching.  

To learn in more detail about how bandwidth incentives work, refer to sections 3.1 and 3.2 from [The Book of Swarm](https://papers.ethswarm.org/p/book-of-swarm/).