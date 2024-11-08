---
title: Access Control
id: act
---

:::info
This is guide contains a detailed explanation of how to use the ACT feature, but does not cover its higher level concepts. To better understand how ACT works and why to use it, read [the ACT page in the "Concepts" section](/docs/concepts/access-control).
:::


In this section we'll provide information on how to use the **swarm-cli** to upload, download data with ACT or update the grantee list. 

### Upload

Uploading data without ACT to the network remains unchanged.

To upload with ACT use the **act** and **act-history-address** flags following the **upload** command:
```bash
swarm-cli upload test.txt --act --stamp $stamp_id --act-history-address $swarm_history_address
```

Here **act** indicates that the file provided shall be uploaded using ACT.
The **act-history-address** flag is the reference of the historical version of the ACT. It can be omitted, in which case the data is uploaded to a new history. If provided, then the data will be uploaded to that history as the latest version. In both cases the timestamp of the upload is taken as the key of the history entry.
If the provided **act-history-address** is invalid then the request will fail with a not found error.

The response returns the newly created reference encrypted with ACT and the header contains history reference.

### Download

Downloading data which was uploaded without ACT from the network remains unchanged.

To download with ACT use the **act**, **act-publisher**, **act-timestamp** and **act-history-address** flags following the **download** command:
```bash
swarm-cli download $swarm_hash test.txt --act --act-history-address $swarm_history_address --act-publisher $public_key --timestamp $timestamp
```
Here **act** indicates that the **swarm_hash** shall be decrypted using the content publisher's public key as **act-publisher** and the lookup table mentioned above. The **act-history-address** flag is the reference of the historical version of the ACT based on the timestamp provided, however the **act-timestamp** flag can be omitted in which case the current timestamp is used.

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
The **grantee_history_reference** indicates the reference of historical version of the list, where the encrypted list reference is added as a metadata to the history entry with the key **"encryptedglref"**

**Limitation**: If an update is called again within a second from the latest upload/update of a grantee list, then mantaray save fails with an invalid input error, because the key (timestamp) already exists, hence a new fork is not created.

#### Get

As stated above, only the publisher can decrypt and therefore access the list with the following command:
```bash
swarm-cli grantee get $grantee_reference
```
which simply returns the latest version of the list.

Non-authorized access causes the request to fail with a not found error.
For each of the above operations, if the provided **act-history-address** or **reference** is invalid then the request will fail with a not found error.