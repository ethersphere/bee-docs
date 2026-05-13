---
title: Store with Encryption
id: store-with-encryption
description: Guide for encrypting data before upload to protect privacy and confidentiality.
---

In Swarm, all data is _public_ by default. To protect sensitive content, it must be encrypted so that only authorised users are able to decrypt and view the plaintext content.

The Bee client can encrypt files and directories during upload, producing a reference that bundles a Swarm address with a decryption key. Only those in possession of the full reference can decrypt the content.

## Encrypt and Upload a File

Include the `Swarm-Encrypt: true` header with your upload request:

```bash
curl -F file=@bee.jpg \
  -H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
  -H "Swarm-Encrypt: true" \
  http://localhost:1633/bzz
```

More information on how to buy a postage stamp batch and get its batch id can be found [here](./buy-a-stamp-batch.md).

When successful, Bee returns a 128-character (64-byte) reference instead of the usual 64-character (32-byte) unencrypted reference:

```json
{
  "reference": "f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3"
}
```

The reference is composed of two 64-character (32-byte) parts:

```
f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265ba  ← Swarm address (safe to share)
ef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3  ← decryption key (keep private)
```

The Swarm address (first 64 characters) is a standard content address — the same identifier you would get from an unencrypted upload and safe to share publicly. The decryption key (last 64 characters) is sensitive: anyone who holds the full 128-character reference can decrypt and read the original content. Access control is entirely possession-based — there is no server-side revocation. The key is never transmitted to the Swarm network; Bee only exposes it through the local API response.

:::warning
If you lose the decryption key portion of the reference, the encrypted data becomes permanently unrecoverable. Store the full 128-character reference in a secure location such as a password manager.
:::

:::info
Encryption is disabled by default on all Swarm gateways to protect your data. [Install Bee on your computer](./../../bee/installation/getting-started.md) to use the encryption feature.
:::

## Encrypt and Upload a Directory

To upload an entire directory with encryption, package it as a tar archive and set the `Swarm-Collection: true` header:

```bash
tar -cf site.tar ./my-website/

curl --data-binary @site.tar \
  -H "Content-Type: application/x-tar" \
  -H "Swarm-Collection: true" \
  -H "Swarm-Postage-Batch-Id: 78a26be9b42317fe6f0cbea3e47cbd0cf34f533db4e9c91cf92be40eb2968264" \
  -H "Swarm-Encrypt: true" \
  http://localhost:1633/bzz
```

The response follows the same 128-character reference format. All files in the collection are encrypted with the same key, and the full reference is required to access any file within it.

## Download and Decrypt a File

Supply the full 128-character reference to the `/bzz` endpoint. Bee downloads all the relevant chunks, decrypts them, and returns the original content:

```bash
curl -OJ http://localhost:1633/bzz/f7b1a45b70ee91d3dbfd98a2a692387f24db7279a9c96c447409e9205cf265baef29bf6aa294264762e33f6a18318562c86383dd8bfea2cec14fae08a8039bf3
```

:::danger
Never use public gateways when requesting full encrypted references. The hash contains sensitive key information which should be kept private. Run [your own node](./../../bee/installation/getting-started.md) to use Bee's encryption features.
:::
