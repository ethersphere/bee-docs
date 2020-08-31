---
title: Store with Encryption
id: store-with-encryption
---

In Swarm, all data is public by default. To protect sensitive content, it must be encrypted so that only authorised users are able to decrypt and then view the plaintext content. 

The Bee client provides a facility to encrypt files and directories while uploading which are only able to be read by users with access to the corresponding decryption key.

# Encrypt and Upload a File

To encrypt a file simply include the `Swarm-Encrypt: true` header with your HTTP request.

```sh
$ curl -F file=@bee.jpg -H "Swarm-Encrypt: true" http://localhost:8080/files
```

When successful, the Bee client will return a 64 byte reference, instead of the usual 32 bytes.

```json
{"reference":"f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3"}
```

This consists of a 32 byte Swarm Reference, and a 32 byte decryption key.

:::info
Encryption is disabled by default on all Swarm Gateways to keep your data safe. [Install Bee on your computer](/docs/installation/quick-start) to use the encryption feature.
:::

# Download and Decrypt a File

To retrieve your file, simply supply the full 64 byte string to the files endpoint, and the Bee client will download and decrypt all the relevant chunks and restore them to their original format.

```sh
$ curl -OJ http://localhost:8083/files/f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3
```

:::danger
Never use public gateways when requesting full encrypted references, the hash contains sensitive key information which should be kept private. Run [your own node](/docs/installation/quick-start) to get the use Bee's encryption features.
:::