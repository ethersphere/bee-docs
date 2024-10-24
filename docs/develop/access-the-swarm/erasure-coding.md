---
title: Erasure Coding
id: erasure-coding
---

import RedundancyCalc from '@site/src/components/RedundancyCalc.js';

[Erasure coding](/docs/learn/DISC/erasure-coding) is a powerful method for safeguarding data, offering robust protection against partial data loss. This technique involves dividing the original data into multiple fragments and generating extra parity fragments to introduce redundancy. A key advantage of erasure coding is its ability to recover the complete original data even if some fragments are lost. Additionally, it offers the flexibility to customize the level of data loss protection, making it a versatile and reliable choice for preserving data integrity on Swarm. For a more in depth dive into erasure coding on Swarm, see the [erasure coding paper](https://papers.ethswarm.org/p/erasure/) from the Swarm research team. 

## Uploading With Erasure Coding

Erasure coding is available for the [`/bytes`](/api/#tag/Bytes) and [`/bzz`](/api/#tag/BZZ) endpoints, however it is not available for the [`/chunks`](/api/#tag/Chunk) endpoint which deals with single chunks. Since erasure coding relies on splitting data into chunks and the chunk is the smallest unit of data within Swarm which cannot be further subdivided, erasure coding is not applicable for the `/chunks` endpoint which deals with single chunks.

To upload data to Swarm using erasure coding, the `swarm-redundancy-level: <integer>` header is used:

```bash
    curl \
    -X POST http://localhost:1633/bzz?name=test.txt \
    -H "swarm-redundancy-level: 1" \
    -H "swarm-postage-batch-id: 54ba8e39a4f74ccfc7f903121e4d5d0fc40732b19efef5c8894d1f03bdd0f4c5" \
    -H "Content-Type: text/plain" \
    --data-binary @test.txt

    {"reference":"c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d"}
```

The accepted values for the `swarm-redundancy-level` header range from the default of 0 up to 4. Each level corresponds to a different level of data protection, with erasure coding turned off at 0, and at its maximum at 4. Each increasing level provides increasing amount of data redundancy offering greater protection against data loss. 

| Redundancy Level Value | Level Name |       
| ---------------- | --------- | 
| 1                | Medium    |  
| 2                | Strong    | 
| 3                | Insane    | 
| 4                | Paranoid  | 

For more details about each level of protection refer to the [erasure coding page](/docs/learn/DISC/erasure-coding) in the learn section and refer to the [erasure coding paper](https://papers.ethswarm.org/p/erasure/) for an even deeper dive.

## Cost Calculator Widget

This calculator takes as input an amount of data and an erasure coding redundancy level, and outputs the number of additional parity chunks required to erasure code that amount of data as well as the increase in cost to upload vs. a non-erasure encoded upload:

<RedundancyCalc />

For more details of erasure coding costs, see [here](/docs/learn/DISC/erasure-coding).

## Downloading Erasure Encoded Data

For a downloader, the process for downloading a file which has been erasure encoded does not require any changes from the [normal download process](/docs/develop/access-the-swarm/upload-and-download). There are several options for adjusting the default behaviour for erasure encoded downloads, however there is no need to adjust them.

### Default Download Behaviour

Erasure coding retrieval for downloads is enabled by default, so there is no need for a downloader to explicitly enable the feature. The default download behaviour is to use the DATA strategy with fallback enabled. With these settings, first an attempt will be made to download the data chunks only. If any of the data chunks are missing, then the retrieval method will fall back to the RACE strategy (PROX is not currently implemented and so will be skipped). With the RACE strategy, an attempt will be made to download all data and parity chunks, and chunks will continue to be downloaded until enough have been retrieved to reconstruct the original data. 

### Options

:::warning
Do not adjust these options unless you know exactly what you are doing. The default settings are the best option for almost all cases. 
:::

When downloading erasure encoded data, there are three related headers which may be used: `swarm-redundancy-strategy`, `swarm-redundancy-fallback-mode: <integer>`, and `swarm-chunk-retrieval-timeout`. 

* `swarm-redundancy-strategy`:  This header allows you to set the retrieval strategy for fetching chunks. The accepted values range from 0 to 3. Each number corresponds to a different chunk retrieval strategy. The numbers stand for the NONE, DATA, PROX and RACE strategies respectively which are described in greater detail in [the API reference](/api/#tag/BZZ) (also see [the erasure code paper](https://papers.ethswarm.org/p/erasure/) for even more in-depth descriptions).  With each increasing level, there will be a potentially greater bandwidth cost. 

    :::info Retrieval Strategies
    0. NONE: This strategy is based on direct retrieval of data chunks without pre-fetching, with parity chunks ignored. No pre-fetching is used (data chunks are fetched sequentially). 
    1. DATA: The same as NONE, except that data chunks are pre-fetched (data chunks are fetched in parallel in order to reduce latency).
    2. PROX: For this strategy, the chunks closest (in Kademlia distance) to the node are retrieved first. *(Not yet implemented.)*
    3. RACE: Initiates requests for all data and parity chunks and continues to retrieve chunks until enough chunks are retrieved that the original data can be reconstructed. 
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

For this request, the redundancy strategy is set to 3 (RACE), which means that it will initiate a request for all data and parity chunks and continue to retrieve chunks until enough have been retrieved to reconstruct the source data. This is in contrast with the default strategy of DATA where only the data chunks will be retrieved.

However, as noted above, it is recommended to not adjust the default settings for these options, so a typical request would actually look like this (which is the exact same as a [normal download](/docs/develop/access-the-swarm/upload-and-download) without any additional options set):


```bash
    curl -OJL http://localhost:1633/bzz/c02e7d943fbc0e753540f377853b7181227a83e773870847765143681511c97d/

       % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
```

This means that there is no need to inform downloaders that a file uses erasure coding, as even with the default download behaviour reconstruction of the source file will be attempted if any chunks are missing.

