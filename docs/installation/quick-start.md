---
title: Quick Start
id: quick-start
---

## Supported platforms

The Bee client will happily run on MacOS, Windows and various Linux flavors.

### Quick Install (Stable)

We provide a convenient [installation script](https://github.com/ethersphere/bee/blob/637b67a8e0a2b15e707f510bb7f49aea4ef6c110/install.sh), which automatically detects your execution environment and installs the latest stable version of the Bee client on your computer.

Simply run either one of the following commands in your Terminal...

#### wget
```sh
wget -q -O - https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v0.3.0 bash
```

#### curl
```sh
curl -s https://raw.githubusercontent.com/ethersphere/bee/master/install.sh | TAG=v0.3.0 bash
```

### Run Bee

Once you have installed Bee, you can test that it has been successfully installed by running.

```sh
bee version
> 0.3.0
```

Now your Bee node is installed, fund you node with gBZZ, [get your node started](/docs/getting-started/start-your-node) and join us in the swarm! 🐝 🐝 🐝 🐝 🐝


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