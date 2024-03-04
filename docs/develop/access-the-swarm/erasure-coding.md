---
title: Erasure Coding
id: erasure-coding
---

Erasure coding is an advanced method for safeguarding data, offering robust protection against partial data loss. This technique involves dividing the original data into multiple fragments and generating extra parity fragments to introduce redundancy. A key advantage of erasure coding is its ability to recover the complete original data even if some fragments are lost. Additionally, it offers the flexibility to customize the level of data loss protection, making it a versatile and reliable choice for preserving data integrity on Swarm. For a more in depth dive into erasure coding on Swarm, see the [erasure coding paper](https://papers.ethswarm.org/p/erasure/) from the Swarm research team. 

### Uploading With Erasure Coding

Erasure coding is available for the [`/bytes`](/api/#tag/Bytes) and [`/bzz`](/api/#tag/BZZ) endpoints, however it is not available for the [`/chunks`](/api/#tag/Chunk) endpoint which deals with single chunks. Since erasure coding relies on splitting data into chunks and the chunk is the smallest unit of data within Swarm which cannot be further subdivided, erasure coding is not applicable for the `/chunks` endpoint which deals with single chunks.

To upload data to Swarm using erasure coding, the `swarm-redundancy-level: <integer>` header is used:

```bash
    curl \
        -X POST http://localhost:1633/bzz?name=test.txt \
        -H "swarm-redundancy-level: 4" \
        -H "swarm-postage-batch-id: 27d1bbef6c01e266d3130c01c9be60fd76b4a69d6f8ea6291548e1644bcf9001" \
        -H "Content-Type: text/plain" 

    {"reference":"c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d"}
```

The accepted values for the `swarm-redundancy-level` header range from the default of 0 up to 4. Each level corresponds to a different level of data protection, with erasure coding turned off at 0, and at its maximum at 4. Each increasing level provides increasing amount of data redundancy offering greater protection against data loss. Each level has been formulated to guarantee against a certain percentage of chunk retrieval errors, shown in the table below. As long as the error rate is below the expected chunk retrieval rate for the given level, there is a less than 1 in a million chance of failure to retrieve the source data.

| Redundancy Level | Pseudonym | Expected Chunk Retrieval Error Rate |
| ---------------- | --------- | ----------------------------------- |
| 0                | None      | 0%                                  |
| 1                | Medium    | 1%                                  |
| 2                | Strong    | 5%                                  |
| 3                | Insane    | 10%                                 |
| 4                | Paranoid  | 50%                                 |

Do take note that any level of erasure encoding will increase the cost of uploads, as with additional parity chunks, there is a greater total number of chunks which must be stamped, and as the number of additional parity chunks increase with the redundancy level, so too does the additional cost.

### Downloading Erasure Encoded Data

When downloading erasure encoded data, there are three related headers which may be used—`swarm-redundancy-strategy`, `swarm-redundancy-fallback-mode: <integer>`, and `swarm-chunk-retrieval-timeout`. 

* `swarm-redundancy-strategy`:  This header allows you to set the retrieval strategy for fetching chunks. The accepted values range from 0 to 3. Each number corresponds to a different chunk retrieval strategy. The numbers stand for the NONE, DATA, PROX and RACE strategies respectively which are described in greater detail in [the API reference](/api/#tag/BZZ) (also see [the erasure code paper](https://papers.ethswarm.org/p/erasure/) for even more in-depth descriptions).  With each increasing level, there will be a potentially greater bandwidth cost. 

    The default strategy is NONE, see explanation of strategies below for details.

    :::info
    Strategies explained:

    0. NONE (cheapest): This strategy is based on direct retrieval of data chunks without pre-fetching, with parity chunks ignored. 
    1. DATA (cheap): The same as NONE, except that data chunks are pre-fetched.
    2. PROX (cheap): For this strategy, the chunks closest (in Kademlia distance) to the node are retrieved first. *(Not yet implemented.)*
    3. RACE (expensive): Initiates requests for all data and parity chunks and continues to retrieve chunks until enough chunks are retrieved that the original data can be reconstructed. 
    :::

* `swarm-redundancy-fallback-mode: <boolean>`: Enables the fallback feature for the redundancy strategies so that if one of the retrieval strategies fails, it will fallback to the more intensive strategy until retrieval is successful or retrieval fails. Default is `true`.

* `swarm-chunk-retrieval-timeout: <boolean>`: Allows you to specify the timeout time for chunk retrieval with a default value of 30 seconds. *(This is primarily used by the Bee development team for testing and it's recommended that Bee users do not need to use this option.)*

An example download request may look something like this:

```bash
    curl -OJL \
    -H "swarm-redundancy-strategy: 3" \
    -H "swarm-redundancy-fallback-mode: true" \
     http://localhost:1633/bzz/c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d/

       % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
```

For this request, the redundancy strategy is set to 3 (RACE), which means that it will initiate a request for all data and parity chunks and continue to retrieve chunks until enough have been retrieved to reconstruct the source data. This is in contrast with the default strategy of NONE where only the data chunks will be retrieved without any parity chunks which can be used to reconstruct the source data if some original data chunks are lost. 