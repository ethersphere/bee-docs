---
title: Access Control
id: access-control
---

The Access Control Trie (ACT) implements the operation of encryption at the chunk level, with the presence of a decryption/encryption key being the only distinction between accessing private and public data.

:::info
This article describes the high level concepts and functionalities of ACT. If you're ready to try it out for yourself, please refer to this [hands on usage guide with specific details](/docs/develop/tools-and-features/act).
:::

In decentralized public data storage systems like Swarm, data is distributed across multiple nodes. Ensuring
confidentiality, integrity, and availability becomes paramount. The Access Control Trie (ACT) addresses these challenges
by managing access control information for Swarm nodes.

## Key Concepts

From the perspective of access controlled content, we can identify two main roles:

| Role                         | Rights & responsibilities                                                                                                                                            |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Content Publisher**        | <ul><li>Publishers upload data and grant access to viewers based on their wallets’ public keys.</li><li>They can also revoke access from specific viewers.</li></ul> |
| **Grantee (Content Viewer)** | <ul><li>Grantees can access the content version allowed by the publisher.</li><li>However, they may be blocked from accessing new versions of the content.</li></ul> |

The control is defined by a process to obtain the full (decrypted) reference to the protected content uploaded by the
publisher, which makes granted access possible.

For the management of access by multiple grantees (viewers), an additional layer is introduced to derive the access key
from their specific session key. This data structure, the lookup table for ACT, is implemented as key-value store in a
Swarm manifest format. The publisher is able to add and remove grantees from this ACT.

### Session

For each grantee, their public key is used as the session key. Using Diffie-Hellman key derivation, two additional keys
will be derived from the session key: a lookup key and an access key decryption key (used for symmetric encryption of
the access key). This means each grantee will have the content's access key specifically encrypted for them, and only
they will be able to decrypt this, thus gain access to the content.

### ACT lookup table

The ACT lookup table is a key-value store implemented over a Swarm manifest. It holds lookup keys and encrypted access
keys prepared for the grantees when they are added to the ACT (granting access to the content).

### History

The history of the ACT is maintained as well. This allows to retrieve a historical version of the ACT based on the
timestamp attached to it. This also ensures that grantees will be able to retrieve the content version they were
granted access to (using the relevant timestamp), even if their access to newer versions were revoked.

### Encryption

It is important to emphasise that all elements of the process will undergo encryption. Including the grantee list
itself, which is encrypted using the publisher’s own lookup key, as well as the grantee list’s content reference. This
ensures that the security of the process and the data is always maintained.