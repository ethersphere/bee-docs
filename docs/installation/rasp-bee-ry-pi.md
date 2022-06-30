---
title: Rasp-bee-ry Pi
id: rasp-bee-ry-pi
---

:::danger
It is not recommended to run a full node on a Raspberry Pi. Please ensure Bee is running in 'light-node' mode.
:::

You will need:

- Raspberry Pi 4
- 128GB Micro SD Card
- SD card reader or some way to write to your SD Card
- Micro to Normal HDMI Cable (Male->Male)
- USB keyboard and mouse
- USB C power adapter suitiable for your Pi
- A monitor or TV with a HDMI input
- Another computer
- The password for you WiFi network or an ethernet connection\*

### Install Raspbian OS and Start Your Pi

To get started download the [official SD card formatter](https://www.sdcard.org/downloads/formatter/) and format your card . A 'quick format' should suffice. You may try to skip this step, but completing it will ensure your best chance of success.

Next download the official [Raspberry Pi Imager](https://www.raspberrypi.org/software/) and use it to image the _Raspberry Pi OS_ on to your SD card. This is a port of the Debian Linux operating system which is designed to work well with your Raspberry Pi's hardware.

Once you have installed the operating system. Take your SD card and
place it into your Raspbery Pi. Connect the HDMI cable to suitable
monitor, plug in your keyboard and mouse, and then connect the USB C
power connector to power on the Pi.

If all goes well, you should see the Raspbian OS starting to to boot up on your Pi! 🎉

Now all that is left is to click on the WiFi icon to the immediate
left of the speaker icon, and connect to your WiFi network. If you are
using an ethernet connection, you may simply plug it in to your
router.

Now click on the `>_` terminal icon on the right hand side. This is
the [login shell](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29)
g33ks use to interact with the computer. Welcome, you are now one of
us. 🧡

Type the following, followed by the enter key to `ping` Wikipedia.

```bash
ping wikipedia.org
```

If you see something like this, your Pi is now connected to the Internet!

```bash
sig@rapberrypi:~ $ ping wikipedia.org
PING wikipedia.org (91.198.174.192): 56 data bytes
64 bytes from 91.198.174.192: icmp_seq=0 ttl=60 time=1469.724 ms
64 bytes from 91.198.174.192: icmp_seq=1 ttl=60 time=22.271 ms
```

### Install Bee Clef and Bee

Next we will install the Bee software, accompanied by a special port of Ethereum's Clef signer, [Bee Clef](/docs/installation/bee-clef).

We must install Bee Clef **before** Bee. To do so, open the browser
(the 🌐 icon) and type the following to open these docs on your
Raspberry Pi [https://docs.ethswarm.org](https://docs.ethswarm.org).

Click `Install > Bee Clef` and scroll down to find the installation commands for Bee Clef **ARM (Raspberry Pi) ARMv7**. These should look something like:

```sh
wget https://github.com/ethersphere/bee-clef/releases/download/v0.12.0/bee-clef_0.12.0_armv7.deb
sudo dpkg -i bee-clef_0.12.0_armv7.deb
```

Click `Copy` on the right hand side of the box containing the
instructions, then go back to your terminal on your Raspberry Pi,
right click with your mouse and paste in the commands. The first one
will execute immediately because there is a 'newline' or 'enter'
character.

You should see some output from the `wget` command which is a Linux utility this is used to download the correct Bee Clef 'package' from Github, where the development of the Bee utilities takes place.

```bash
bee-clef_0.12.0_armv7.deb.1           100%[===================================================================>]   9.99M  8.21MB/s    in 1.2s

2021-05-15 17:34:02 (8.21 MB/s) - ‘bee-clef_0.12.0_armv7.deb’ saved [10473282/10473282]

pi@raspberrypi:~ $ sudo dpkg -i bee-clef_0.12.0_armv7.deb
```

The other command will be left in your terminal, this uses the `dpkg` utility, the Debian Package Manager to install Bee Clef. Package Managers are used to conveniently install software on Linux systems.

Press enter to start the installation process. All being well, you will see some output like this:

```
pi@raspberrypi:~ $ sudo dpkg -i bee-clef_0.12.0_armv7.deb
Selecting previously unselected package bee-clef.
(Reading database ... 98610 files and directories currently installed.)
Preparing to unpack bee-clef_0.12.0_armv7.deb ...
Unpacking bee-clef (0.12.0) ...
Setting up bee-clef (0.12.0) ...
Created symlink /etc/systemd/system/multi-user.target.wants/bee-clef.service → /lib/systemd/system/bee-clef.service.
```

Finally, if running a mainnet node, amend the configuration at `/etc/default/bee-clef` to include:

```sh
BEE_CLEF_CHAIN_ID=100
```

Congratulations! You just installed Bee Clef!

Now to repeat the process for Bee itself.

Go back to the [https://docs.ethswarm.org](https://docs.ethswarm.org) and click `Installation > Quick Start`. Scroll down and copy the commands for **ARM (Raspberry Pi) ARMv7**.

As before, right click and paste these into your terminal, `wget` will download the package file, you may then press enter to install the Bee package using `dpkg`.

After download and installation are complete you will see output similar to the following:

```
Please make sure there is sufficient ETH and BZZ available on the node's Ethereum address: 738853974f852a40f6ea9f598596ca8556bd578f.

learn how to fund your node by visiting our docs at https://docs.ethswarm.org/docs/installation/fund-your-node

Once the node's wallet has received the funds it will begin joining the Swarm network.
```

Your Bee node needs BZZ to be able to properly interact with the network. In order to receive these, you will need to sign into our Discord and request your BZZ test tokens from our #faucet channel using the above Ethereum address.

Sign into Discord (make an account if you don't have one yet), join our Discord server, complete verification and go to the [#faucet](https://discord.gg/kfKvmZfVfe) channel.

Here you must **type** (not copy paste) the following, _replacing the
address with your own_:

```
/faucet sprinkle 0xabeeecdef123452a40f6ea9f598596ca8556bd57
```

After some time, you should receive a notification indicating your
transaction has been successful. The faucet will have made a transfer
of XDAI (for gas), and BZZ (so that you can interact with the Swarm
network). You can check out what's been going on in the blockchain by
navigating to
[https://blockscout.com/xdai/mainnet](https://blockscout.com/xdai/mainnet)
and searching your address. All being well, you will see two
succesfull transactions.

## Bee Tidy

Now, for a moment, let's have a little look around in our Bash Terminal so we can start to feel at home in the command line. Type the following command and press enter:

```
ls -la
```

You can think of your terminal as a very old way of interacting with your computer that was always there while you were in the graphic user interface, you just didn't know it. The terminal is home to many small programs that are designed to do one purpose very well. This is the Linux mantra. The command line is very powerful, but can be a little unwieldy and clunky at times. Once mastered, your fingers will have gained a magical control of the bits and the bytes.

`ls` was originally written way back in 1987 but still persists to
this day. It is still entered into terminals literally millions of
times a day by thousands of engineers, hobbyists and geeks all over
the world and is present in even very basic Linux distributions.

Here, we have specified the `l` 'flag' (`l` is for 'long') to get the long version of the information and the `h` flag to get 'human readable' file sizes.

Your output should looks something like this:

```bash
-rw-r--r--  1 pi   pi       3523 Mar  4 22:47 .bashrc
-rw-r--r--  1 pi   pi   10787806 Mar 23 08:18 bee_1.6.2_armv7.deb
-rw-r--r--  1 pi   pi   10473282 Feb 24 18:00 bee-clef_0.12.0_armv7.deb
drwxr-xr-x  2 pi   pi       4096 Mar  4 22:57 Bookshelf
```

For more information, you can use the `man` utility to read the
manual. Type `man ls` for a full list of the options you can specify
as flags. Press `q` to exit the `man` program.

Now, let's use the `rm` program to remove the clutter and delete the
`.deb` files we no longer need.

```bash
rm bee_1.6.2_armv7.deb
```

The `rm` program gives no output, so let's check it's dissapeared by
checking the contents of the directory. This time we will also you the
'pipe' command, which passes the output of one command to the next,
and the `grep` command which searches through the output and only
prints lines that match the pattern.

```bash
ls -la | grep "bee"
```

```bash
-rw-r--r--  1 pi   pi   10473282 Feb 24 18:00 bee-clef_0.12.0_armv7.deb
```

Success! The Bee package file is deleted! Note at the command line
there _is no undelete_. **With great power comes great
resposibility**. Please use your new powers wisely, and only for the
good of the swarm as a whole. 🐝🧡

All that is left now is to delete the Bee package file, since we have
completed this step. Type `rm bee` and press your `tab` button. Bash
(the name of the shell/program running the terminal) will autocomplete
your file name. Now press `enter` to delete your file.

# Start Your Bee

If all has gone to plan, by this point your Bee will have been funded by our faucet and you should bee ready to start up your client.

The `dpkg` package manager has used our `.deb` package file to install
Bee and set up the the `systemd` service which will manage and control
our `bee` program as it runs happily in the background on our
computers, earning `BZZ`, and serving and forwarding content to other
bees all over the planet!

We can now use the `systemctl` utility to interact with `systemd`. For more info, you can type `man systemctl` to read about it.

Let's see what the status of your `bee` service is.

```bash
systemctl status bee
```

You will be shown a bunch of information including the current status and the output of the logs. Press `q` to exit.

Let's see what the current logs are saying.

```bash
journalctl -u bee -f
```

Here we have used the `-u` flag (`u` is for unit) to only show the
output for the `bee` process, and `f` for follow, to continuously
update the logs as new ones appear.

Open another terminal window using the same button as before and type:

```bash
systemctl restart bee
```

This will restart the Bee process. You should see some activity in the
logs (journal) as Bee shuts down and restarts.

Now we need to specify some Bee configuration. In order to access the
blockchain, your Bee needs to access an Ethereum blockchain node. We
recommend running your own [XDAI Node](https://www.xdaichain.com/),
but for now let's take the easy way and sign up to
[getblock.io](https://getblock.io). Once you have created an account,
go to your dashboard and make a new project (you can call it whatever
you'd like to). Then use the api key to create your api url as follows
`http://localhost:8545`. Keep
this open for later.

Now we will configure your Bee node so it can access the blockchain, deploy your chequebook and start making transactions to cash out those BZZ cheques from your peers! Type:

```bash
sudo nano /etc/bee/bee.yaml
```

To open the `nano` program which is a old time text editor, we're going to party like it's 1999. Note we're using the `sudo` command to wrap `nano`. This is short for `super user do` and gives us full permissions to do anything in our Raspberry Pi OS.

Hold down `Ctrl` and press `W` to access the `where is?`
functionality. Type `swap-endpoint` and press `Enter`. This will take
you to the correct part of the config file. Here we will change the
value to look like the following, using your Infura url from
before. Most configuration at the command line is done by changing
files and then restarting processes just like this! Make sure to pay
attention to detail so that everything is exact, even one misplaced
character can cause issues. 🔍

```yaml
## swap ethereum blockchain endpoint (default "http://localhost:8545")
swap-endpoint: https://stake.getblock.io/mainnet/?api_key=your-api-key
```

To save and exit, hold `Ctrl` and press `X`, then `Y` and finally
`Enter` to agree to write the file. You can see the different commands
that are available listed at the bottom of the screen, for example `^X Exit`.

Ok! We're all set! Let's restart Bee and watch our logs as the chequebook transactions begin to be processed.

```bash
systemctl restart bee
```

There are many other configuration options available to fine tune
Bee. Please check out the
[configuration](/docs/working-with-bee/configuration) section of
the docs for more info.

Now, in your other terminal window where Bee's logs are still being
output, you should start to see transactions being submitted by Bee to
the blockchain and processed. Eventually Bee will begin to connect to
other Bee 'peers' in the Swarm.

Once you start to see messages like:

```
successfully connected to peer 7fa40ce124d69ecf14d6f7806faaf9df5d639d339a9d343aa7004373f5c46b8f (outbound)
```

You're connected to the swarm. Let's do a quick check to find out how
many peers we have using the `curl` command line utility:

```bash
curl localhost:1635/peers
```

```json
{
  "peers": [
    {
      "address": "339cf2ca75f154ffb8dd13de024c4a5c5b53827b8fd21f24bec05835e0cdc2e8"
    },
    {
      "address": "b4e5df012cfc281e74bb517fcf87fc2c07cd787929c332fc805f8124401fabae"
    }
  ]
}
```

If you see peers listed here - congratulations! You have joined the swarm! Welcome! 🐝
