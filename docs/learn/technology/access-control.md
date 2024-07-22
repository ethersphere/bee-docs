---
title: Access Control
id: act
---

The Access Control Trie (ACT) implements the operation of encryption at the chunk level, with the presence of a
decryption/encryption key being the only distinction between accessing private and public data.

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

## Tutorial

In this section we'll provide information on how to use the **swarm-cli** to upload, download data with ACT or update the grantee list.

### Upload

Uploading data without ACT to the netwkork remains unchanged.

To upload with ACT use the **act** and **act-history-address** flags following the **upload** command:
```bash
swarm-cli upload test.txt --act --stamp $stamp_id --act-history-address $swarm_history_address
```

Here **act** indicates that the file provided shall be uploaded using ACT.
The **act-history-address** flag is the reference of the historical version of the ACT. It can be ommitted, in which case the data is uploaded to a new history. If provided, then the data will be uploaded to that history as the latest version. In both cases the timestamp of the upload is taken as the key of the history entry.
If the provided **act-history-address** is invalid then the request will fail with a not found error.

The response returns the newly created refrence encrypted with ACT and the header contains history reference.

### Download

Downloading data which was uploaded without ACT from the netwkork remains unchanged.

To download with ACT use the **act**, **act-publisher**, **act-timestamp** and **act-history-address** flags following the **download** command:
```bash
swarm-cli download $swarm_hash test.txt --act --act-history-address $swarm_history_address --act-publisher $public_key --timestamp $timestamp
```
Here **act** indicates that the **swarm_hash** shall be decrypted using the content publisher's public key as **act-publisher** and the lookup table mentioned above. The **act-history-address** flag is the reference of the historical version of the ACT based on the timestamp provided, however the **act-timestamp** flag can be ommitted in which case the current timestamp is used.

If the **act-history-address** or **act-publisher** flags are omitted then the request is treated as a "usual" download.
If the data was uploaded with ACT and we try to download it without the ACT flags then the request will fail with a not found error.

### Grantee management

Updating a grantee list literally means patching a json file containing the list of grantee swarm public keys.

#### Create

A brand new grantee list can be created using the following command:
```bash
swarm-cli grantee create grantees.json --stamp $stamp_id
```
where **grantees.json** shall contain the key **grantees** with the list of public keys:
```json
{
  "grantees": [
    "03ec55e9fb2aefb8600f69142abaad79311516c232b28919d66efb4d41bce15bfa",
    "03fdcab22b455ce08a481d929a4cb9f447752545818eded1ad1785c51581e822c6"
  ]
}
```
The response returns the newly created and encrypted grantee list and the history reference. Only the publisher can decrypt and therefore access the list.
If **act-history-address** is provided then the grantee list is uploaded as the newest version under that history.

#### Patch

```bash
swarm-cli grantee patch grantees-patch.json --reference $grantee_reference --history $grantee_history_reference --stamp $stamp_id
```
where **grantees.json** shall contain the keys **add** and **revoke** with the list of public keys for granting and revoking access, respectively:
```json
{
  "add": ["03fdcab22b455ce08a481d929a4cb9f447752545818eded1ad1785c51581e822c6"],
  "revoke": [
    "03ec55e9fb2aefb8600f69142abaad79311516c232b28919d66efb4d41bce15bfa"
  ]
}
```
The **reference** flag indicates the already existing encrypted grantee list reference that needs to be updated.
The **grantee_history_reference** indicates the reference of historical version of the list, where the encrpyted list reference is added as a metadata to the history entry with the key **"encryptedglref"**

**Limitation**: If an update is called again within a second from the latest upload/update of a grantee list, then mantaray save fails with an invalid input error, because the key (timestamp) already exists, hence a new fork is not created.

#### Get

As stated above, only the publisher can decrypt and therefore access the list with the following command:
```bash
swarm-cli grantee get $grantee_reference
```
which simply returns the latest version of the list.

Non-authorized access causes the request to fail with a not found error.
For each of the above operations, if the provided **act-history-address** or **reference** is invalid then the request will fail with a not found error.