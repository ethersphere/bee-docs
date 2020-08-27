---
title: Store with Encryption
id: store-with-encryption
---

In the swarm, all data is public by default. To protect sensitive content, it must be encrypted so that only authorised users are able to decrypt and then view the plaintext content. 

The Bee client provides a facility to encrypt files and directories while uploading which are only able to be read by users with access to the corresponding decryption key.

# Encrypt and Upload a File

To encrypt a file simply include the `Swarm-Encrypt: true` header with your `http` request.

```sh
$ curl -F file=@kitten.jpg -H "Swarm-Encrypt: true" http://localhost:8080/files
```

When successful, the Bee client will return a 64 byte reference, instead of the usual 32 bytes.

```json
{"reference":"9af0181735d4870589edc8748879dfd8898e0412eb63091c503212c4e23891823c484dcb8102baa7bd84117c5cc0176275efabaefccc9ac4a0e75ba3be9f1605"}
```

This consists of a 32 byte Swarm Reference, and a 32 byte decryption key.

:::info
Encryption is disabled by default on all Swarm Gateways to keep your data safe.
:::

# Download and Decrypt a File

To retreive your file, simply supply the full 64 byte string to the files endpoint, and the Bee client will download and decrypt all the relevant chunks and restore them to their original format.

```sh
$ curl -OJ http://localhost:8083/files/d2baf779d7d6705880b50238358c8bc22e6ffca19995f3a0527c6fb263c5d860
```