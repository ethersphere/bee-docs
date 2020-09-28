---
title: SWAP Bandwidth Accounting
id: swap
---

Underpinning Swarm is a set of accounting protocols that have been developed and prototyped during over 5 years of R&D. Your Beta Bee node contains functionality giving it the ability to keep track of bandwidth exchanges with all it's peers, issue and cache cheques using smart contracts which live on EVM compatible blockchain. Currently we are in the testing phase using the Goerli testnet. We would love for you to get involved, help us try out these incentives and maybe even earn some gBZZ!

:::info
Learn more about how SWAP and the other accounting protocols work by reading the [Book of Swarm](https://swarm-gateways.net/bzz:/latest.bookofswarm.eth/the-book-of-swarm.pdf).
:::


To investigate our accounting, let's upload a 20mb file to the network so we can see some traffic being generated as Bee begins to push chunks into the network. In order to do this, we will pay a forwarding cost in each node that passes the chunk on.

First, we will need to run our Bee node with a RPC endpoint, debug api enabled and verbosity set to TRACE.

```sh
bee start \
  --verbosity 5 \
  --swap-enable \
  --swap-endpoint https://rpc.slock.it/goerli \
  --debug-api-enable
```

```sh
dd if=/dev/urandom of=/tmp/test.txt bs=1m count=20
curl -F file=@/tmp/test.txt http://localhost:8080/files
```

If we set `--verbosity 5` in our Bee configuration, we will be able to see these individual transactions being recorded on our node's internal per peer ledgers.

```
...
TRAC[2020-09-28T15:18:08+01:00] crediting peer f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47 with price 150, new balance is -2300
TRAC[2020-09-28T15:18:08+01:00] crediting peer f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47 with price 150, new balance is -2450
TRAC[2020-09-28T15:18:08+01:00] pusher pushed chunk bd638a8c58f48ca6729b6d86b7623c524f7c74e4ed9bc71712637b8b50234ce0
TRAC[2020-09-28T15:18:08+01:00] pusher pushed chunk b06309f68a89f1a6513d3231ad2d5335b3c0309972513a4f28d949e7fc47e39d
TRAC[2020-09-28T15:18:08+01:00] crediting peer e00460ced3c509dfd72b6ce915c764b13669e65f95b3ba84dcb7d4b6d18a0b11 with price 150, new balance is -8780
TRAC[2020-09-28T15:18:08+01:00] pusher pushed chunk a81c8ee73284f8c0d1b7cfa0b0907c5b12c3b56d1accd08835543771e93c7fc5
TRAC[2020-09-28T15:18:08+01:00] pusher pushed chunk 056f59ca65bdfb8b7499c44a7d8d8ed29d7b4eaa39621b468bdbb69fc2de4b87
TRAC[2020-09-28T15:18:08+01:00] crediting peer e00460ced3c509dfd72b6ce915c764b13669e65f95b3ba84dcb7d4b6d18a0b11 with price 150, new balance is -8930
TRAC[2020-09-28T15:18:08+01:00] pusher pushed chunk a3c6958271aab4e1ad53206898f045a169a57aeaab0531cbcf497c8ff10a7800
TRAC[2020-09-28T15:18:08+01:00] crediting peer f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47 with price 120, new balance is -2570
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
curl localhost:6060/balances | jq
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
curl localhost:6060/settlements | jq
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
      "received": 89890,
      "sent": 0
    }
    // ...
  ]
}
```

More info can be found by using the chequebook api.

```sh
curl localhost:6060/chequebook/cheque | jq
```

```json
{
  "totalreceived": 0,
  "totalsent": 718030,
  "settlements": [
    //...
    {
      "peer": "dce1833609db868e7611145b48224c061ea57fd14e784a278f2469f355292ca6",
      "received": 0,
      "sent": 89550
    }
    //...
  ]
}
```

As our node's participation in the network increases, we will begin to see more and more of these balances arriving. In the case that we have *received* a settlement from another peer, we can ask our node to perform the relevant transactions on the blockchain, and cash our earnings out.

To do this, we simply POST the relevant peer's address to the `cashout` endpoint.

```sh
curl -XPOST http://localhost:6069/chequebook/cashout/d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b
```

```json
{"transactionHash":"0xba7b500e21fc0dc0d7163c13bb5fea235d4eb769d342e9c007f51ab8512a9a82"}
```

You may check the status of your transaction using [Goerli Etherscan](https://goerli.etherscan.io/)

Finally, we can now see the status of the cashout transaction by sending a GET request to the same URL.

```sh
curl http://localhost:6062/chequebook/cashout/d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b | jq
```

```json
{
  "peer": "d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b",
  "chequebook": "0xae315a9adf0920ba4f3353e2f011031ca701d247",
  "cumulativePayout": 179160,
  "beneficiary": "0x21b26864067deb88e2d5cdca512167815f2910d3",
  "transactionHash": "0xba7b500e21fc0dc0d7163c13bb5fea235d4eb769d342e9c007f51ab8512a9a82",
  "result": {
    "recipient": "0x312fe7fde9e0768337c9b3e3462189ea6f9f9066",
    "lastPayout": 179160,
    "bounced": false
  }
}
```

Success, we earned our first gBZZ! 🐝
