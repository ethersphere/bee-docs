---
title: Store with Encryption
id: store-with-encryption
---

In Swarm, all data is public by default. To protect sensitive content, it must be encrypted so that only authorised users are able to decrypt and then view the plaintext content. 

The Bee client provides a facility to encrypt files and directories while uploading which are only able to be read by users with access to the corresponding decryption key.

# Encrypt and Upload a File

To encrypt a file simply include the `Swarm-Encrypt: true` header with your HTTP request.

```sh
curl -F file=@bee.jpg -H "Swarm-Encrypt: true" http://localhost:1633/files
```

When successful, the Bee client will return a 64 byte reference, instead of the usual 32 bytes.

```json
{"reference":"f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3"}
```

Here we see that, when using the Bee node's encryption function, the reference hash that is returned is 128 hex characters long. The first 64 characters of this are the familiar Swarm address - the reference that allows us to retrieve the data from the swarm - it is the same as the reference we would get uploading unencrypted files to using Bee it is safe to share.

The second second part of the reference is a 64 character decryption key which is required to decrypt the referenced content and view the original data in the clear, this is sensitive key material and must be kept private.

It is important that this data is not be sent in requests to a public gateway as this would mean that gateway would be able to decrypt your data. However, if you are running a node on your local machine, you may safely use the api bound to `localhost`. The key material is never exposed to the network so your data remains safe.

:::info
Encryption is disabled by default on all Swarm Gateways to keep your data safe. [Install Bee on your computer](/docs/installation/quick-start) to use the encryption feature.
:::

# Download and Decrypt a File

To retrieve your file, simply supply the full 64 byte string to the files endpoint, and the Bee client will download and decrypt all the relevant chunks and restore them to their original format.

```sh
curl -OJ http://localhost:1633/files/f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3
```

:::danger
Never use public gateways when requesting full encrypted references, the hash contains sensitive key information which should be kept private. Run [your own node](/docs/installation/quick-start) to get to use Bee's encryption features.
:::
