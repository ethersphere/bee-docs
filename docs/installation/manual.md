---
title: Manual Installation
id: manual
---

### Quick Install (Stable)

We provide a convenient [installation script](https://github.com/ethersphere/bee/blob/637b67a8e0a2b15e707f510bb7f49aea4ef6c110/install.sh), which automatically detects your execution environment and installs the latest stable version of the Bee client on your computer.

If your system is not supported, you might want to try to [build directly from source](/docs/installation/build-from-source).

To install the binary using our quick install script, run either one of the following commands in your Terminal...

#### wget
```sh
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v0.4.1 bash
```

#### curl
```sh
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v0.4.1 bash
```

### Bee Clef External Signer

We recommend that Swarm node implementations make use of Go Ethereum's Clef external signer. Instructions of installing and integrating this with Bee can be found [here](/docs/installation/bee-clef).

### Run Bee

Once you have installed Bee, you can test that it has been successfully installed by running.

```sh
bee version
```

```
0.4.1
```

Now your Bee node is installed, you can fund your node with gBZZ join us in the swarm! 🐝 🐝 🐝 🐝 🐝

With Bee installed, simply type `bee start` in your Terminal. 

This command will start Bee for the first time and prompt you to create your Bee wallet.

## Create Your Wallet

When you first run Bee, you will be asked to input a user password. It is important to choose a strong unique password, as this will protect your valuable **private key** which is generated during startup. 

This secret key is stored encrypted in your [Bee data directory](/docs/installation/configuration#--data-dir) (usually `~/.bee`). It represents your Swarm Address - your anonymous identity in Swarm.

```
bee start
> Welcome to the Swarm.... Bzzz Bzzzz Bzzzz
                \     /
            \    o ^ o    /
              \ (     ) /
   ____________(%%%%%%%)____________
  (     /   /  )%%%%%%%(  \   \     )
  (___/___/__/           \__\___\___)
     (     /  /(%%%%%%%)\  \     )
      (__/___/ (%%%%%%%) \___\__)
              /(       )\
            /   (%%%%%)   \
                 (%%%)
                   !
Password:
```

## SWAP Bandwidth Incentives

SWAP mode is now enabled by default for testing on Swarm mainnet, you must include configuration parameters specifying a valid [Goerli Testnet](https://goerli.net/) RPC endpoint. You can run your [own Goerli node](https://github.com/goerli/testnet), or use a RPC provider such as [rpc.slock.it/goerli](https://rpc.slock.it/goerli) or [Infura](https://infura.io/).

When running your Bee node with SWAP enabled for the first time, your Bee node will deploy a 'chequebook' contract using the canonical factory contract which is deployed by Swarm. A factory is used to ensure every node is using legitimate and verifiable chequebook contracts. Once the chequebook is deployed, Bee will deposit a certain amount of gBZZ (Goerli BZZ tokens) in the chequebook contract so that it can pay other nodes in return for their services.

In order to interact with the Goerli blockchain to deploy contracts and make payments, we must fund our account with Goerli ETH (GETH), and to make payments in return for services our account must also own some Goerli BZZ (gBZZ). We can get both tokens for trial purposes from the [Swarm Goerli Faucet](https://faucet.ethswarm.org/).

To find out your Ethereum address, we can simply run our Bee node and point it at the Goerli rpc endpoint.

```sh
bee start \
  --verbosity 5 \
  --swap-endpoint https://rpc.slock.it/goerli \
  --debug-api-enable
```

Since we haven't yet funded our account, we will see a message in our logs asking us to fund our Ethereum account. Navigate to the [Swarm Goerli Faucet](https://faucet.ethswarm.org/) and submit your address, ensuring it is prepended with the characters `0x` to the faucet, fill out the recaptcha and wait for confirmation that your gETH and gBZZ have been dispensed.

Now, we can run our Bee node and we will start to see Bee creating and waiting for transactions to complete. Please be patient as this might take a few moments.

```
INFO[2020-09-28T14:59:38+01:00] no chequebook found, deploying new one.
INFO[2020-09-28T14:59:39+01:00] deploying new chequebook in transaction 5c2949675b49d069c4c5755e1901aa59fa4224ea2a763efe78a5293f36e04370
INFO[2020-09-28T14:59:57+01:00] deployed chequebook at address a22c864fe5bd53cc3ae130709647a0e60e67f714
INFO[2020-09-28T14:59:57+01:00] depositing 100000000 token into new chequebook
INFO[2020-09-28T14:59:57+01:00] sent deposit transaction c25714a0569131707513c68f6108553bb861131253230a606a26d390e790e0f1
INFO[2020-09-28T15:00:12+01:00] successfully deposited to chequebook
```

Now our chequebook is deployed, and credited with an initial deposit of gBZZ ready to be given to reward our fellow busy Bee nodes for their services. You will also provide services, and be rewarded by your peers for services you provide for them.

For more info on bandwidth accounting, see [SWAP Bandwidth Accounting](/docs/advanced/swap).

## Join the Swarm

If all goes well, you will see your node automatically begin to connect to other Bee nodes all over the world. 

```
INFO[2020-08-29T11:55:16Z] greeting <Hi I am a very buzzy bee bzzzz bzzz bzz. 🐝> from peer: b6ae5b22d4dc93ce5ee46a9799ef5975d436eb63a4b085bfc104fcdcbda3b82c
```

Now your node will begin to request chunks of data that fall within your *radius of responsibilty* - data that you will then serve to other p2p clients running in the swarm. Your node will then begin to respond to requests for these chunks from other peers, for which you will soon be rewarded in BZZ.

:::tip Incentivisation
In Swarm, storing chunks of data, serving and forwarding them to other nodes earns you rewards! Read about incentives in [SWAP](/docs/advanced/swap) for more info.
:::

Your Bee client has now generated an elliptic curve keypair similar to an Ethereum wallet. These are stored in your [data directory](/docs/installation/configuration#--data-dir), in the `keys` folder.

:::danger Keep Your Keys and Password Safe!
Your keys and password are very important, back these files up and store them in a secure place that only you have access to. With great privacy comes great responsibility - while no-one will ever be able to guess your key, but you will not be able to recover them if you lose them either, so be sure to look after them well and keep secure backups.
:::

## Getting help
The CLI has documentation build-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure you bee node via the command line arguments.

You may also check out the [configuration guide](/docs/installation/configuration), or simply run your Bee terminal command with the `--help` flag, eg. `bee start --help` or `bee --help`.



### Upgrading Bee

To upgrade previous versions of Bee installed using the above method, simply re-run the installation command above.


### Edge (Unstable)

To get a sneak preview of the latest features added to Bee, you may also install the Edge version, which tracks the master branch of the [Github respository](https://github.com/ethersphere/bee)

#### wget
```sh
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | bash
```

#### curl
```sh
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | bash
```
