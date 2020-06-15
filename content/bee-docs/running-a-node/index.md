---
title: 'Installation'
weight: 2
summary: "How to install client code to run a node."
---

## Supported platforms

The client can be installed on MacOS and various Linux flavors.

## Installation from source
<!-- https://raw.githubusercontent.com/ethersphere/bee/master/README.md -->

Prerequisites for installing bee from source are:

- Go - download the latest release from https://golang.org/dl
- git - download from https://git-scm.com/ or install with your package manager
- make

Installing from source by checking the git repository:

```sh
git clone https://github.com/ethersphere/bee
cd bee
make binary
cp dist/bee /usr/local/bin/bee
```
