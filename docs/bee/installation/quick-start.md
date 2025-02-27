---
title: Quick Start
id: quick-start
---

This guide will help you install and run a Bee light node using the [shell script](/docs/bee/installation/shell-script-install) install method. After starting the node, the guide explains how to use the [`swarm-cli` command line tool](/docs/bee/working-with-bee/swarm-cli) to find your node's address, fund your node, and buy a batch of postage stamps. Finally it explains how to upload data using the postage stamp batch and how to download that data.

:::tip
This guide is a great way to get started using Bee to interact with the Swarm network, however it leaves out important information for the sake of brevity. 

To learn more about Bee (including other installation methods, configuration, node types, and more) read the complete ***[Getting Started](/docs/bee/installation/getting-started)*** section.
:::

## Requirements  

- **Linux or macOS** (The shell script installation method does **not** support Windows natively. Windows users can use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).)  
- [Node.js (v18 or higher)](https://nodejs.org/)
- [npm (Node Package Manager)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)  
- [`curl`](https://curl.se/) or [`wget`](https://www.gnu.org/software/wget/) (Check with `curl --version` or `wget --version`)

## 1. Install Bee

Run the shell script using `curl` or `wget`:

```bash
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.4.0 bash
```

OR

```bash
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v2.4.0 bash
```

Verify installation:

```bash
bee version
```



## 2. Install Swarm-CLI

Requires **Node.js 18+**. Install using **npm**:

```bash
npm install --global @ethersphere/swarm-cli
```

Verify installation:

```bash
swarm-cli --version
```



## 3. Start Your Bee Node in Light Mode

Start Bee with a secure password:

```bash
bee start \
  --password YOUR_SECURE_PASSWORD \
  --swap-enable \
  --api-addr 127.0.0.1:1633 \
  --blockchain-rpc-endpoint https://xdai.fairdatasociety.org
```


## 4. Get Your Node’s Ethereum Address

```bash
swarm-cli addresses
```

Example output:

```
Node Addresses
------------------------------------------------------------------------------------------------------------------
Ethereum: 0x63d0ee9f572fdae63335c90e39d1719fffa27523
Overlay: fe262a7a3cae0224938242e9e8b036ce0e45989c3f4353a36e71253544482067
PSS Public Key: 02dea6240cf85e5e475870bdcfa8a8f2da4b7a110a48cd333e524477ee6d780c22
Public Key: 03541298230b371b0d668f5aec4e579241bd5c4ff2d43349a6130d436240f34820
Underlay:
```


## 5. Fund Your Node

Send **xDAI** (for transactions) and **xBZZ** (for uploads and staking) to your node’s Ethereum address on **Gnosis Chain**.

- **xDAI:** 0.01 xDAI is enough to start a light node
- **xBZZ:** 0.02 xBZZ is enough to upload a small amount of data


## 6. Buy a Batch of Postage Stamps 

:::tip
When starting a Bee node for the first time, the node must first sync blockchain data before it can buy a postage stamp batch. The process may take half an hour or longer depending on your RPC provider and network speed.

You can check your Bee node logs to know how many blocks have been synced so far:

```bash
"time"="2025-02-27 15:11:02.516675" "level"="debug" "logger"="node/batchstore" "msg"="put chain state" "block"=33973602 "amount"=64429426640 "price"=24488
```

Copy the *"block"* value and search for it on [Gnosis Scan](https://gnosisscan.io/block/33973602) to find out how close we are to the current block.
:::

Before uploading, you need a **postage stamp**. [Learn more](/docs/develop/access-the-swarm/buy-a-stamp-batch).:

```bash
swarm-cli stamp buy --amount 600000000 --depth 17
```
:::tip
The `amount` value determines how long your batch stays a live, while the `depth` value determines how much data it can store. There is a minimum depth of 17 and the `amount` value must be high enough for a batch with at least 24 hours of TTL (time to live). Learn more.
:::


Example output:

```
noah@NoahM16:~$ swarm-cli stamp buy --amount 600000000 --depth 17
Estimated cost: 0.008 xBZZ
Estimated capacity: 512.000 MB
Estimated TTL: 28 hours
Type: Immutable
At full capacity, an immutable stamp no longer allows new content uploads.
? Confirm the purchase Yes
Stamp ID: 8d60f9c2475115acac440050ea72cf8b153522dfb8880f3836f7030eaa605d1e
```


## 7. Upload a Files

First create a sample file to upload. Open it with your text editor of choice and write a message:

```bash
vi test.txt
cat test.txt
```

```bash
Hello Swarm!
```

Then use your postage stamp batch ID ("Stamp ID: 8d60f9c2475115acac440050ea72cf8b153522dfb8880f3836f7030eaa605d1e" in our example) to upload your file:

```bash
swarm-cli upload test.txt --stamp 8d60f9c2475115acac440050ea72cf8b153522dfb8880f3836f7030eaa605d1e
```

Response:

```
Swarm hash: cb8fbcc7bc0901afa2cec86590c09b491206af40fc6781874abfc3edc7aa495f
URL: http://localhost:1633/bzz/cb8fbcc7bc0901afa2cec86590c09b491206af40fc6781874abfc3edc7aa495f/
Stamp ID: 8d60f9c2
Usage: 50%
Capacity (immutable): 256.000 MB remaining out of 512.000 MB
```

The "Swarm hash" returned here is the unique reference for our upload.

You can share this hash with someone else and they can use it to download whatever you uploaded for as long as the stamp batch you used still has remaining TTL. 

## 8. Download a File:

Use the `swarm-cli download` command with the hash for our uploaded file to download it. We specify the output directory with as a second argument after the postage stamp hash with "./" to ensure the file is downloaded into our current directory (otherwise it will create a new directory with the hash itself as the filename and the `test.txt` file we uploaded inside that directory):  

```bash
swarm-cli download cb8fbcc7bc0901afa2cec86590c09b491206af40fc6781874abfc3edc7aa495f ./
```
Output after a successful download: 
```bash
test.txt OK
```

Check the file contents:
```bash
cat test.txt
```

```bash
Hello Swarm!
```
