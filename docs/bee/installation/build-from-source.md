---
title: Build from Source
id: build-from-source
---

Bee is written using the [Go](https://golang.org) language.

You may build the Bee client software directly from the [source](https://github.com/ethersphere/bee).

Prerequisites for installing direct from source are:

-  **go** - download the latest release from [golang.org](https://golang.org/dl).
-  **git** - download from [git-scm.com](https://git-scm.com/).
-  **make** - [make](https://www.gnu.org/software/make/) is usually included by default in most UNIX operating systems, and can be installed and used on almost any other operating system where it is not included by default.

### Build from Source

1. Clone the repository:

   ```bash
   git clone https://github.com/ethersphere/bee
   cd bee
   ```

2. Use `git` to find the latest release:

   ```bash
   git describe --tags
   ```

3. Checkout the required version:

   ```bash
   git checkout v2.4.0
   ```

4. Build the binary:

   ```bash
   make binary
   ```

5. Check you are able to run the `bee` command. Success can be verified by running:

   ```bash
   dist/bee version
   ```

   ```
   2.4.0
   ```

6. (optional) Additionally, you may also like to move the Bee binary to somewhere in your `$PATH`

   ```bash
   sudo cp dist/bee /usr/local/bin/bee
   ```
