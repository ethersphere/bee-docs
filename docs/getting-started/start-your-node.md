---
title: Start Your Node
id: start-your-node
---

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

## Join the Swarm

If all goes well, you will see your node automatically begin to connect to other Bee nodes all over the world. 

```sh
INFO[2020-08-29T11:55:16Z] greeting <Hi I am a very buzzy bee bzzzz bzzz bzz. 🐝> from peer: b6ae5b22d4dc93ce5ee46a9799ef5975d436eb63a4b085bfc104fcdcbda3b82c
```

Now your node will begin to request chunks of data that fall within your *radius of responsibilty* - data that you will then serve to other p2p clients running in the swarm. Your node will then begin to respond to requests for these chunks from other peers, for which you will soon be rewarded in BZZ.

:::tip Incentivisation
In Swarm, storing chunks of data, serving and forwarding them to other nodes earns you rewards - get ready for exciting incentivisation features coming soon at Swarm Live!
:::

Your Bee client has now generated an elliptic curve keypair similar to an Ethereum wallet. These are stored in your [data directory](/docs/installation/configuration#--data-dir), in the `keys` folder.

:::danger Keep Your Keys and Password Safe!
Your keys and password are very important, back these files up and store them in a secure place that only you have access to. With great privacy comes great responsibility - while no-one will ever be able to guess your key, but you will not be able to recover them if you lose them either, so be sure to look after them well and keep secure backups.
:::

## Getting help
The CLI has documentation build-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure you bee node via the command line arguments.

You may also check out the [configuration guide](/docs/installation/configuration), or simply run your Bee terminal command with the `--help` flag, eg. `bee start --help` or `bee --help`.
