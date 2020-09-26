---
title: SWAP Bandwidth Accounting
id: swap
---

Underpinning Swarm is a set of accounting protocols that have been developed and prototyped during over 5 years of R&D. Your Beta Bee node contains functionality giving it the ability to keep track of bandwidth exchanges with all it's peers, issue and cache cheques using smart contracts which live on EVM compatible blockchain. Currently we are in the testing phase using the Goerli testnet. We would love for you to get involved, help us try out these incentives and maybe even earn some GBZZ!

:::info
Learn more about how SWAP and the other accounting protocols work by reading the [Book of Swarm](https://swarm-gateways.net/bzz:/latest.bookofswarm.eth/the-book-of-swarm.pdf).
:::

To enable SWAP mode, you must include configuration paramaters `--swap-enabled`, and also a valid [Goerli Testnet](https://goerli.net/) RPC endpoint. An example of this is provided at [rpc.slock.it/goerli](https://rpc.slock.it/goerli), you may sign up for a free account at [Infura](https://infura.io/) run your [own node](https://github.com/goerli/testnet).

When running your Bee node with SWAP enabled for the first time, your Bee node will deploy a 'chequebook' contract using the canonical factory contract which is deployed by Swarm. A factory is used to ensure every node is using legitimate and verifiable chequebook contracts. Once the chequebook is deployed, Bee will deposit a certain amount of GBZZ (Goerli BZZ tokens) in the chequebook contract so that it can pay other nodes in return for their services.

In order to interact with the Goerli blockchain to deploy contracts and make payments, we must fund our account with Goerli ETH (GETH), and to make payments in return for services our account must also own some Goerli BZZ (GBZZ). We can get both tokens for trial purposes from the [Swarm Goerli Faucet](https://faucet.ethswarm.org/).

To get the Ethereum address, we can simply run our Bee node with SWAP enabled and pointed at the Goerli rpc endpoint.

```sh
bee start \
	--verbosity 5 \
	--swap-enable \
	--swap-endpoint https://rpc.slock.it/goerli \
	--debug-api-enable
```

We will see the Ethereum address printed out in our logs.

```
INFO[2020-09-26T14:21:25+01:00] using ethereum address a16929f387f6934c5e5d4eca764c70500ca00298
```

Since we haven't yet funded our account, we will also see an error protesting insufficient funds.

```
Error: insufficient token for initial deposit	
```

To resolve this, navigate to the [Swarm Goerli Faucet](https://faucet.ethswarm.org/) and submit your address, ensuring it is prepended with the characters `0x` to the faucet, fill out the recaptcha (sorry 🙈) and wait for confirmation that your GETH and GBZZ have been dispensed.

Now, we can run our Bee node and we will start to see Bee creating and waiting for transactions to complete. Please be patient this might take a few moments!

```
INFO[2020-09-26T14:52:23+01:00] deploying new chequebook
TRAC[2020-09-26T14:52:24+01:00] waiting for transaction e9267f568fde587440873b906bc6328b12a6e6e618948a2130a5abfd02600152 to be mined: not found
TRAC[2020-09-26T14:52:25+01:00] waiting for transaction e9267f568fde587440873b906bc6328b12a6e6e618948a2130a5abfd02600152 to be mined: not found
INFO[2020-09-26T14:52:26+01:00] deployed chequebook at address 5f50924f29b87440b230b2ee4cf288ebc133e235
INFO[2020-09-26T14:52:26+01:00] depositing into new chequebook
TRAC[2020-09-26T14:52:27+01:00] waiting for transaction 3ae9bb1b01d6c203743e726b6f9732d41571c7a4e7cb2ce21a7b82ddbbe0bfd6 to be mined: not found
INFO[2020-09-26T14:52:41+01:00] deposited to chequebook 5f50924f29b87440b230b2ee4cf288ebc133e235 in transaction 3ae9bb1b01d6c203743e726b6f9732d41571c7a4e7cb2ce21a7b82ddbbe0bfd6
DEBU[2020-09-26T18:25:33+01:00] initializing NAT manager
...
```

Now our chequebook is deployed, and credited with an initial deposit of GBZZ ready to be given to reward our fellow busy Bee nodes for their services. You will also provide services, and be rewarded by your peers for services you provide for them.

Let's upload a 20mb file to the network so we can see some traffic being generated as Bee begins to push chunks into the network. In order to do this, we will pay a forwarding cost in each node that passes the chunk on.

```sh
dd if=/dev/urandom of=/tmp/test.txt bs=1m count=20
curl -F file=@/tmp/test.txt http://localhost:8082/files
```

As we have set `--verbosity 5` in our Bee configuration, we will be able to see these individual transactions being recorded on our node's internal per peer ledgers.

```
...
TRAC[2020-09-26T18:31:30+01:00] pusher pushed chunk 67c091db09d25f9189c593656145944213eb7679121765cc9547fc3719b7cf0f
TRAC[2020-09-26T18:31:30+01:00] crediting peer f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47 with price 110, new balance is -85130
TRAC[2020-09-26T18:31:30+01:00] pusher pushed chunk f503b2feae7c0ced9ca786fa125e9798a3ce1ae1ac20c8c6ead6ecb786e8db23
TRAC[2020-09-26T18:31:30+01:00] crediting peer f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47 with price 150, new balance is -85280
TRAC[2020-09-26T18:31:30+01:00] pusher pushed chunk b68b01815a2d9b5ab59a0cf6452151ccec871a5195eb5cec96210c874a42d690
TRAC[2020-09-26T18:31:30+01:00] crediting peer e00460ced3c509dfd72b6ce915c764b13669e65f95b3ba84dcb7d4b6d18a0b11 with price 150, new balance is -82920
TRAC[2020-09-26T18:31:30+01:00] crediting peer 6a04f1f872da2d32a4597fad2323e8c5f4a00cb441c2bba2fa87f771dd358572 with price 130, new balance is -38230
TRAC[2020-09-26T18:31:30+01:00] pusher pushed chunk a4b548a1426b47798c6d011d95ba2626a740aea49a26a1435210a307240c260e
TRAC[2020-09-26T18:31:30+01:00] pusher pushed chunk 7243a785fa09e573f8db4f50ecfe2a1a67fe0d03fc94914e26d5cfec549331dc
...
```

We also have a rich set of features to be able to query the current accounting state of your node. For example, you may query your node's current balance by send a POST request to the balances endpoint.

```sh
curl localhost:6060/chequebook/balance | jq
```

```json
{
  "totalBalance": 10000000,
  "availableBalance": 9640360
}
```

It is also possible to examine per-peer balances.

```sh
curl localhost:6062/balances | jq
```

```json
{
  "balances": [
    //...
    {
      "peer": "d0bf001e05014fa036af97f3d226bee253d2b147f540b6c2210947e5b7b409af",
      "balance": -85420
    },
    {
      "peer": "f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47",
      "balance": -75990
    }
    //...
  ]
}
```

In Swarm, these per-peer balances simply represent trustful agreements between nodes. Tokens only actually change hands when a node settles a cheque. This can either be triggered manually or when a certain threshold is reached with a peer. In this case, a settlement takes place. You may view these using the settlements endpoint.

```sh
curl localhost:6062/settlements | jq
```

```json
{
  "totalreceived": 0,
  "totalsent": 359640,
  "settlements": [
    // ...
    {
      "peer": "d0bf001e05014fa036af97f3d226bee253d2b147f540b6c2210947e5b7b409af",
      "received": 0,
      "sent": 90070
    },
    {
      "peer": "f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47",
      "received": 0,
      "sent": 89890
    }
    // ...
  ]
}
```



