---
title: Troubleshooting
id: troubleshooting
---

*Under construction - this troubleshooting guide is in the process of being developed, check back again for more information later*

# Introduction

In this section we cover commonly seen problems encountered during the operation of a Bee node, and give an overview of suggested solutions

## Node occupies unusually large space on disk

During normal operation of a Bee node, it should not take up more than ~30 GB of disk space. In the rare cases when the node's occupied disk space grows larger, you may need to use the compaction `db compact` command.

```danger
To prevent any data loss, operators should run the compaction on a copy of the localstore directory and, if successful, replace the original localstore with the compacted copy. 
```

The command is available as a sub-command under db as such:


```bash
bee db compact --data-dir=
```
