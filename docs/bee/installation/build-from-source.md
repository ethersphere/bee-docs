---
title: Build from Source
id: build-from-source
---

Bee is written using the [Go](https://golang.org) language.

You may build the Bee client software directly from the [source](https://github.com/ethersphere/bee).

Prerequisites for installing direct from source are:

-  **go** - download the latest release from [golang.org](https://golang.org/dl).
-  **git** - download from [git-scm.com](https://git-scm.com/).
-  **make** - usually included in most operating systems.

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
   git checkout v1.17.3
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
   1.17.3
   ```

6. (optional) Additionally, you may also like to move the Bee binary to somewhere in your `$PATH`

   ```bash
   sudo cp dist/bee /usr/local/bin/bee
   ```
