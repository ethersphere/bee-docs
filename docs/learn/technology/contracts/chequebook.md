---
title: Chequebook
id: chequebook
---

The chequebook contract is a smart contract used in the Swarm Accounting Protocol (SWAP) to manage cheques that are sent between nodes on the network. The contract is responsible for keeping track of the balance of each node and ensuring that cheques are valid and can be cashed out correctly.

When a node sends a cheque to another node, it includes a signed message that specifies the amount of BZZ tokens being transferred and the recipient's address. The chequebook contract receives this message and verifies that it is valid by checking the signature and ensuring that the sender has enough funds to cover the transfer.

If the cheque is valid, the contract updates the balances of both nodes accordingly. The recipient can then cash out their BZZ tokens by sending a transaction to the blockchain that invokes a function in the chequebook contract. This function transfers the specified amount of BZZ tokens from the sender's account to the recipient's account.

The chequebook contract also includes some additional features to prevent abuse or fraud. For example, it can impose limits on how much debt a node can accumulate before requiring payment, or it can require nodes to provide collateral before sending cheques.

Overall, the chequebook contract plays an important role in ensuring that SWAP operates smoothly and fairly, by providing a secure and reliable way for nodes to exchange value on the network.