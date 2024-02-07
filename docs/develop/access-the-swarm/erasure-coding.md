---
title: Erasure Coding
id: erasure-coding
---

Erasure coding is an advanced method for safeguarding data, offering robust protection against partial data loss. This technique involves dividing the original data into multiple fragments and generating extra parity fragments to introduce redundancy. A key advantage of erasure coding is its ability to recover the complete original data even if some fragments are lost. Additionally, it offers the flexibility to customize the level of data loss protection, making it a versatile and reliable choice for preserving data integrity on Swarm. You can learn more about erasure coding and the benefits it brings to Swarm in [this article on the Swarm blog](https://blog.ethswarm.org/foundation/2023/erasure-coding-supercharges-swarm/).  

### Uploading With Erasure Coding

Erasure coding is available for the [`/bytes`](/api/#tag/Bytes) and [`/bzz`](/api/#tag/BZZ) endpoints, however it is not available for the [`/chunks`](/api/#tag/Chunk) endpoint which deals with single chunks. Since erasure coding relies on splitting data into chunks and the chunk is the smallest unit of data within Swarm which cannot be further subdivided, erasure coding is not applicable for the `/chunks` endpoint which deals with single chunks/

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

Do take note that any level of erasure encoding will increase the cost of uploaded, as with the additional parity chunks, there is a greater total number of chunks which must be stamped, and as the number of additional parity chunks increase with the redundancy level, so too does the additional cost.

### Downloading Erasure Encoded Data

When downloading erasure encoded data, there are three related headers which may be used—`swarm-redundancy-strategy`, `swarm-redundancy-fallback-mode: <integer>`, and `swarm-chunk-retrieval-timeout`. 

* `swarm-redundancy-strategy`:  This header allows you to set the retrieval strategy for fetching chunks. The accepted values range from 0 to 3. Each number corresponds to a different chunk retrieval strategy. The numbers stand for the NONE, DATA, PROX and RACE strategies respectively which are described in greater detail in [the API reference](/api/#tag/BZZ). With each increasing level, there will be a potentially greater bandwidth cost. Default is `NONE`.

* `swarm-redundancy-fallback-mode: <boolean>`: Enables the fallback feature for the redundancy strategies so that if one of the retrieval strategies fails, it will fallback to the more intensive strategy until retrieval is successful or retrieval fails. Default is `true`.

* `swarm-chunk-retrieval-timeout: <boolean>`: Allows you to specify the timeout time for chunk retrieval with a default value of 30 seconds. 

An example download request may look something like this:

```bash
    curl -OJL \
    -H "swarm-redundancy-strategy: 2" \
    -H "swarm-redundancy-fallback-mode: false" \
    -H "swarm-chunk-retrieval-timeout: 50000" \
     http://localhost:1633/bzz/c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d/

       % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
```
