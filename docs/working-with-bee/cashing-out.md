---
title: Cashing Out
id: cashing-out
---

As your Bee forwards and serves chunks to its peers, it is rewarded in
BZZ in the form of cheques. Once these cheques accumulate sufficient
value, you may *cash them out* using Bee's API. This process transfers
money from your peer's chequebooks into your own, which you can then
withdrawal to your wallet to do with as you please!

:::important
PLEASE! Do not cash out your cheques too regularly! Once a week is more than sufficient! This prevents and relieves unneccesary congestion on the blockchain. 💩
:::

:::info
Learn more about how SWAP and other accounting protocols work by reading
<a href="/the-book-of-swarm.pdf" target="_blank" rel="noopener noreferrer">The Book of Swarm</a> .
:::

Bee contains a rich set of features to enable you to query the current accounting state of your node. First, let's query our node's current balance by sending a POST request to the balances endpoint.

```bash
curl localhost:1635/chequebook/balance | jq
```

```json
{
  "totalBalance": "10000000",
  "availableBalance": "9640360"
}
```

It is also possible to examine your per-peer balances.

```bash
curl localhost:1635/balances | jq
```

```json
{
  "balances": [
    //...
    {
      "peer": "d0bf001e05014fa036af97f3d226bee253d2b147f540b6c2210947e5b7b409af",
      "balance": "-85420"
    },
    {
      "peer": "f1e2872581de18bdc68060dc8edd3aa96368eb341e915aba86b450486b105a47",
      "balance": "-75990"
    }
    //...
  ]
}
```

In Swarm, these per-peer balances represent trustful agreements between nodes. Tokens only actually change hands when a node settles a cheque. This can either be triggered manually or when a certain threshold is reached with a peer. In this case, a settlement takes place. You may view these using the settlements endpoint.


```bash
curl localhost:1635/settlements| jq
```

```json
{
  "totalreceived": "718030",
  "totalsent": "0",
  "settlements": [
    //...
    {
      "peer": "dce1833609db868e7611145b48224c061ea57fd14e784a278f2469f355292ca6",
      "received": "8987000000000",
      "sent": "0"
    }
    //...
  ]
}
```

More information about the current received or sent cheques can also be found using the chequebook api.

```bash
curl localhost:1635/chequebook/cheque | jq
```

```json
{
  "lastcheques": [
    {
      "peer": "dce1833609db868e7611145b48224c061ea57fd14e784a278f2469f355292ca6",
      "lastreceived": {
        "beneficiary": "0x21b26864067deb88e2d5cdca512167815f2910d3",
        "chequebook": "0x4A373Db93ba54cab999e2C757bF5ca0356B42a3f",
        "payout": "8987000000000"
      },
      "lastsent": null
    },
    //...
  ]
}
```

As our node's participation in the network increases, we will begin to see more and more of these balances arriving. In the case that we have *received* a settlement from another peer, we can ask our node to perform the relevant transactions on the blockchain, and cash our earnings out.

To do this, we simply POST the relevant peer's address to the `cashout` endpoint.

```bash
curl -XPOST http://localhost:1635/chequebook/cashout/d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b
```

```json
{"transactionHash":"0xba7b500e21fc0dc0d7163c13bb5fea235d4eb769d342e9c007f51ab8512a9a82"}
```

You may check the status of your transaction using [XDAI Blockscout](https://blockscout.com/xdai/mainnet)

Finally, we can now see the status of the cashout transaction by sending a GET request to the same URL.

```bash
curl http://localhost:1635/chequebook/cashout/d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b | jq
```

```json
{
  "peer": "d7881307e793e389642ea733451db368c4c9b9e23f188cca659c8674d183a56b",
  "chequebook": "0xae315a9adf0920ba4f3353e2f011031ca701d247",
  "cumulativePayout": "179160",
  "beneficiary": "0x21b26864067deb88e2d5cdca512167815f2910d3",
  "transactionHash": "0xba7b500e21fc0dc0d7163c13bb5fea235d4eb769d342e9c007f51ab8512a9a82",
  "result": {
    "recipient": "0x312fe7fde9e0768337c9b3e3462189ea6f9f9066",
    "lastPayout": "179160",
    "bounced": false
  }
}
```

Success, we earned our first BZZ! 🐝

Now we have earnt tokens, to withdraw our BZZ from the chequebook contract back into our node's own wallet, we simply POST a request to the chequebook withdraw endpoint.

```bash
curl -XPOST http://localhost:1635/chequebook/withdraw\?amount\=1000 | jq
```

And conversely, if we have used more services than we have provided, we may deposit extra BZZ into the chequebook contract by sending a POST request to the deposit endpoint.

```bash
curl -XPOST http://localhost:1635/chequebook/deposit\?amount\=1000 | jq
```

```json
{"transactionHash":"0x60fd4be6c1db4552ecb5cd3c99f6a4906089277f592593cccd1fee0dbf501085"}
```

You may then use [Blockscout](https://blockscout.com/xdai/mainnet) to track your transaction and make sure it completes successfully.

# Managing uncashed cheques
For the Bee process, the final step of earning BZZ is cashing a cheque. It is worth noting that a cheque is not yet actual BZZs. In Bee, a cheque, just like a real cheque, is a promise to hand over money upon request. In real life, you would present the cheque to a bank. In swarm life, we present the cheque to a smart-contract. Holding on to a swap-cheque is risky; it is possible that the owner of the chequebook has issued cheques worth more BZZ than is contained in their chequebook contract. For this reason, it is important to cash out your cheques every so often. With the set of API endpoints, as offered by Bee, it is possible to develop a script that fully manages the uncashed cheques for you. As an example, we offer you a [very basic script](https://gist.github.com/ralph-pichler/3b5ccd7a5c5cd0500e6428752b37e975#file-cashout-sh), where you can manually cash out all cheques with a worth above a certain value. To use the script:

1. Download and save the script:

```bash
wget -O cashout.sh https://gist.githubusercontent.com/ralph-pichler/3b5ccd7a5c5cd0500e6428752b37e975/raw/cashout.sh
```

2. Make the file executable

```bash
chmod +x cashout.sh
```

3. List all uncashed cheques and cash out your cheques above a certain value

- List:
```bash
./cashout.sh
```
:::info
If running ./cashout.sh returns nothing, you currently have no uncashed cheques.
:::

- Cashout all cheques worth more than 5 BZZ
```bash
./cashout.sh cashout-all 5
```

:::info
Are you a Windows-user who is willing to help us? We are currently missing a simple cashout script for Windows. Please see the [issue](https://github.com/ethersphere/bee/issues/1092)
:::

:::info
Please find the officially deployed smart-contract by the Swarm team in the [swap-swear-and-swindle repository](https://github.com/ethersphere/swap-swear-and-swindle)
:::
