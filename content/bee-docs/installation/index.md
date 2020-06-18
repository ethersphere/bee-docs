---
title: 'Installation'
weight: 2
summary: "How to install client code to run a node."
---

## Supported platforms

The client can be installed on MacOS and various Linux flavors.

## Installing the Bee binary
At every official release, we release the binary files of our software. You can download them by navigating to [releases](https://github.com/ethersphere/bee/releases)

## Installation from source
<!-- https://raw.githubusercontent.com/ethersphere/bee/master/README.md -->

Prerequisites for installing bee from source are:

- Go - download the latest release from https://golang.org/dl
- git - download from https://git-scm.com/ or install with your package manager
- make

1) Clone the repository:
```sh
git clone https://github.com/ethersphere/bee
cd bee
```

2) Use `git` to find the latest release:
```sh
git describe --tags
```

3) Checkout the latest release

```sh
git checkout <name_of_latest_tag>
```

4) Build the binary and move the binary to your path:

```sh
make binary
cp dist/bee /usr/local/bin/bee
```