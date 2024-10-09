---
title: Erasure Coding
id: erasure-coding
---

# Erasure Coding on Swarm


Erasure coding (also known as erasure code) is a powerful approach to data protection which is an optional feature for Swarm uploads. It is a technique that increases data protection by enabling the recovery of original data even when some encoded chunks are lost or corrupted. When used, it ensures that data on Swarm can always be accessed reliably, even if some nodes or entire neighborhoods go offline.


### How It Works
Erasure coding enhances data protection by dividing the source data into "chunks" and adding extra data to allow reconstruction of the original data.

Specifically, data is divided into **N** chunks, and **K** additional chunks are generated, resulting in **N + K** total chunks. The data is encoded across these chunks such that as long as **N** chunks are intact, the original data can be fully reconstructed. This approach provides a robust method for data recovery in distributed storage networks like Swarm.

#### Example

For an 8KB image, if we set **N = 2** and **K = 1**, we create 3 chunks (2 original + 1 redundant). As long as any 2 of these 3 chunks are available, we can reconstruct the original data. By increasing **K** to 4, we can tolerate the loss of up to 4 chunks while still recovering the original data.

![Erasure Code Example](https://www.ethswarm.org/uploads/erasure-coding-01.png)

### General Benefits of Erasure Coding

1. **Cost-Effective**: Erasure coding achieves data protection similar to or better than replication while requiring less storage space.
   
2. **Tolerates Data Loss**: Unlike traditional error correction codes, erasure coding can withstand the total loss of specific chunks, making it suitable for scenarios where data integrity is critical.

## Implications for Swarm

### Tailored Data Protection for Swarm

Swarm’s existing architecture, which naturally divides files into chunks and distributes them across a network of nodes, aligns perfectly with the principles of erasure coding. This addition enhances the resilience of data storage, ensuring that data remains accessible even if entire neighborhoods of nodes go offline.

### Enabling New Use-Cases

The integration of erasure coding significantly increases the durability of data stored on Swarm. It allows Swarm to cater to enterprise users and scenarios requiring enhanced data protection, serving as insurance against potential outages or attacks.

## Conclusion

The development of erasure coding on Swarm is actively progressing. A technical paper outlining Swarm’s specific approach to erasure coding will be released soon. Follow us for updates on these developments.
