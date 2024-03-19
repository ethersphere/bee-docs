---
title: Erasure Coding
id: erasure-coding
---

import RedundancyCalc from '@site/src/components/RedundancyCalc.js';

Erasure coding is an advanced method for safeguarding data, offering robust protection against partial data loss. This technique involves dividing the original data into multiple fragments and generating extra parity fragments to introduce redundancy. A key advantage of erasure coding is its ability to recover the complete original data even if some fragments are lost. Additionally, it offers the flexibility to customize the level of data loss protection, making it a versatile and reliable choice for preserving data integrity on Swarm. For a more in depth dive into erasure coding on Swarm, see the [erasure coding paper](https://papers.ethswarm.org/p/erasure/) from the Swarm research team. 

## Uploading With Erasure Coding

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



### Redundancy Level Costs Explained 

Erasure encoding is applied to sets of chunks of at most size 128 (including both data chunks and parity chunks). For higher levels of redundancy, the ratio of parity chunks to data chunks increases, increasing the percent cost of the upload compared to uploading at lower levels of redundancy. 

In the table below, the percent cost is displayed for each redundancy level. The cost of encrypted uploads is also shown, and is double the cost of un-encrypted uploads.


| Redundancy | Parities | Data Chunks | Percent | Chunks Encrypted | Percent Encrypted |
|----------|----------|--------|---------|------------------|-------------------|
| Medium   | 9        | 119 | *7.6%*  | 59            | 15%           |
| Strong   | 21       | 107 | *19.6%* | 53            | 40%           |
| Insane   | 31       | 97   | 32%  | 48            | 65%            |
| Paranoid | 89       | 37      | 240.5%    | 18               | 494%              |

For larger uploads (where the source data chunks are equal to or greater than the  "Data Chunks" for each redundancy level respectively) you can use the percent values shown in the "Percent" column as a general estimate of the percent cost of uploading. If the number of chunks is slightly less than the number shown in the "Data Chunks" column, you can also use the value in the "Percent" column as a good general estimate of the percent cost. 

However, if the number of source data chunks are significantly less than the value in the "Data Chunks" column for each respective level, then the percent cost will differ significantly from the one shown in the "Percent" column. In order to find the costs for smaller uploads, or in order to find the precise costs for uploads of any size, continue to the next section.

### Precise Cost Calculations

For each redundancy level, there are m + k = 128 chunks, where m are the data chunks (shown in column "Data Chunks") and k are the parity chunks (shown in column "Parities"). If the number of chunks in the data being uploaded are an exact multiple of m, then the percent cost of the upload will simply equal the one shown in the chart above in the "Percent" column for the corresponding redundancy level. 

#### Exact Multiples

For example, if we are uploading with the Strong redundancy level, and our source data consists of 321 (3 * 107) chunks, then we can simply use the percentage from the "Percent" column for the Strong level - 19.6% (63 parities / 321 data chunks). 

#### With Remainders

However, generally speaking uploads will not come in exact multiples of m, so we need to adjust our calculations. To do so we need to use the table below which shows the number of parities for sets of chunks starting at a single chunk for each redundancy level up to the maximum number of data chunks for that level. Then we simply sum up the total parities and data chunks for the entire upload and calculate the resulting percentage. 

| Security | Parities | Chunks | Percent     | Chunks Encrypted | Percent Encrypted |
|----------|----------|--------|-------------|------------------|-------------------|
| Medium   | 2        | 1      | 200%        |                  |                   |
| Medium   | 3        | 2-5    | 150% - 60%  | 1-2              | 300% - 150%       |
| Medium   | 4        | 6-14   | 66.7% - 28.6%| 3-7             | 133.3% - 57.1%    |
| Medium   | 5        | 15-28  | 33.3% - 17.9%| 7-14            | 71.4% - 35.7%     |
| Medium   | 6        | 29-46  | 20.7% - 13% | 14-23            | 42.9% - 26.1%     |
| Medium   | 7        | 47-68  | 14.9% - 10.3%| 23-34           | 30.4% - 20.6%     |
| Medium   | 8        | 69-94  | 11.6% - 8.5%| 34-47            | 23.5% - 17%       |
| Medium   | 9        | 95-119 | 9.5% - 7.6% | 47-59            | 19.1% - 15.3%     |
| Strong   | 4        | 1      | 400%        |                  |                   |
| Strong   | 5        | 2-3    | 250% - 166.7%| 1               | 500%              |
| Strong   | 6        | 4-6    | 150% - 100% | 2-3              | 300% - 200%       |
| Strong   | 7        | 7-10   | 100% - 70%  | 3-5              | 233.3% - 140%     |
| Strong   | 8        | 11-15  | 72.7% - 53.3%| 5-7             | 160% - 114.3%     |
| Strong   | 9        | 16-20  | 56.2% - 45% | 8-10             | 112.5% - 90%      |
| Strong   | 10       | 21-26  | 47.6% - 38.5%| 10-13           | 100% - 76.9%      |
| Strong   | 11       | 27-32  | 40.7% - 34.4%| 13-16           | 84.6% - 68.8%     |
| Strong   | 12       | 33-39  | 36.4% - 30.8%| 16-19           | 75% - 63.2%       |
| Strong   | 13       | 40-46  | 32.5% - 28.3%| 20-23           | 65% - 56.5%       |
| Strong   | 14       | 47-53  | 29.8% - 26.4%| 23-26           | 60.9% - 53.8%     |
| Strong   | 15       | 54-61  | 27.8% - 24.6%| 27-30           | 55.6% - 50%       |
| Strong   | 16       | 62-69  | 25.8% - 23.2%| 31-34           | 51.6% - 47.1%     |
| Strong   | 17       | 70-77  | 24.3% - 22.1%| 35-38           | 48.6% - 44.7%     |
| Strong   | 18       | 78-86  | 23.1% - 20.9%| 39-43           | 46.2% - 41.9%     |
| Strong   | 19       | 87-95  | 21.8% - 20%  | 43-47           | 44.2% - 40.4%     |
| Strong   | 20       | 96-104 | 20.8% - 19.2%| 48-52           | 41.7% - 38.5%     |
| Strong   | 21       | 105-107| 20% - 19.6%  | 52-53           | 40.4% - 39.6%     |
| Insane   | 5        | 1      | 500%        |                  |                   |
| Insane   | 6        | 2      | 300%        | 1                | 600%              |
| Insane   | 7        | 3      | 233.3%      | 1                | 700%              |
| Insane   | 8        | 4-5    | 200% - 160% | 2                | 400%              |
| Insane   | 9        | 6-8    | 150% - 112.5%| 3-4             | 300% - 225%       |
| Insane   | 10       | 9-10   | 111.1% - 100%| 4-5             | 250% - 200%       |
| Insane   | 11       | 11-13  | 100% - 84.6%| 5-6              | 220% - 183.3%     |
| Insane   | 12       | 14-16  | 85.7% - 75% | 7-8              | 171.4% - 150%     |
| Insane   | 13       | 17-19  | 76.5% - 68.4%| 8-9             | 162.5% - 144.4%   |
| Insane   | 14       | 20-22  | 70% - 63.6% | 10-11            | 140% - 127.3%     |
| Insane   | 15       | 23-26  | 65.2% - 57.7%| 11-13           | 136.4% - 115.4%   |
| Insane   | 16       | 27-29  | 59.3% - 55.2%| 13-14           | 123.1% - 114.3%   |
| Insane   | 17       | 30-33  | 56.7% - 51.5%| 15-16           | 113.3% - 106.2%   |
| Insane   | 18       | 34-37  | 52.9% - 48.6%| 17-18           | 105.9% - 100%     |
| Insane   | 19       | 38-41  | 50% - 46.3% | 19-20            | 100% - 95%        |
| Insane   | 20       | 42-45  | 47.6% - 44.4%| 21-22           | 95.2% - 90.9%     |
| Insane   | 21       | 46-50  | 45.7% - 42% | 23-25            | 91.3% - 84%       |
| Insane   | 22       | 51-54  | 43.1% - 40.7%| 25-27           | 88% - 81.5%       |
| Insane   | 23       | 55-59  | 41.8% - 39% | 27-29            | 85.2% - 79.3%     |
| Insane   | 24       | 60-63  | 40% - 38.1% | 30-31            | 80% - 77.4%       |
| Insane   | 25       | 64-68  | 39.1% - 36.8%| 32-34           | 78.1% - 73.5%     |
| Insane   | 26       | 69-73  | 37.7% - 35.6%| 34-36           | 76.5% - 72.2%     |
| Insane   | 27       | 74-77  | 36.5% - 35.1%| 37-38           | 73% - 71.1%       |
| Insane   | 28       | 78-82  | 35.9% - 34.1%| 39-41           | 71.8% - 68.3%     |
| Insane   | 29       | 83-87  | 34.9% - 33.3%| 41-43           | 70.7% - 67.4%     |
| Insane   | 30       | 88-92  | 34.1% - 32.6%| 44-46           | 68.2% - 65.2%     |
| Insane   | 31       | 93-97  | 33.3% - 32% | 46-48            | 67.4% - 64.6%     |
| Paranoid | 19       | 1      | 1900%       |                  |                   |
| Paranoid | 23       | 2      | 1150%       | 1                | 2300%             |
| Paranoid | 26       | 3      | 866.7%      | 1                | 2600%             |
| Paranoid | 29       | 4      | 725%        | 2                | 1450%             |
| Paranoid | 31       | 5      | 620%        | 2                | 1550%             |
| Paranoid | 34       | 6      | 566.7%      | 3                | 1133.3%           |
| Paranoid | 36       | 7      | 514.3%      | 3                | 1200%             |
| Paranoid | 38       | 8      | 475%        | 4                | 950%              |
| Paranoid | 40       | 9      | 444.4%      | 4                | 1000%             |
| Paranoid | 43       | 10     | 430%        | 5                | 860%              |
| Paranoid | 45       | 11     | 409.1%      | 5                | 900%              |
| Paranoid | 47       | 12     | 391.7%      | 6                | 783.3%            |
| Paranoid | 48       | 13     | 369.2%      | 6                | 800%              |
| Paranoid | 50       | 14     | 357.1%      | 7                | 714.3%            |
| Paranoid | 52       | 15     | 346.7%      | 7                | 742.9%            |
| Paranoid | 54       | 16     | 337.5%      | 8                | 675%              |
| Paranoid | 56       | 17     | 329.4%      | 8                | 700%              |
| Paranoid | 58       | 18     | 322.2%      | 9                | 644.4%            |
| Paranoid | 59       | 19     | 310.5%      | 9                | 655.6%            |
| Paranoid | 61       | 20     | 305%        | 10               | 610%              |
| Paranoid | 63       | 21     | 300%        | 10               | 630%              |
| Paranoid | 65       | 22     | 295.5%      | 11               | 590.9%            |
| Paranoid | 66       | 23     | 287%        | 11               | 600%              |
| Paranoid | 68       | 24     | 283.3%      | 12               | 566.7%            |
| Paranoid | 70       | 25     | 280%        | 12               | 583.3%            |
| Paranoid | 71       | 26     | 273.1%      | 13               | 546.2%            |
| Paranoid | 73       | 27     | 270.4%      | 13               | 561.5%            |
| Paranoid | 75       | 28     | 267.9%      | 14               | 535.7%            |
| Paranoid | 76       | 29     | 262.1%      | 14               | 542.9%            |
| Paranoid  | 78      | 30      | 260%       | 15               | 520%              |               
| Paranoid  | 80      | 31      | 258.1%     | 15               | 533.3%            |               
| Paranoid  | 81      | 32      | 253.1%     | 16               | 506.2%            |               
| Paranoid  | 83      | 33      | 251.5%     | 16               | 518.8%            |               
| Paranoid  | 84      | 34      | 247.1%     | 17               | 494.1%            |               
| Paranoid  | 86      | 35      | 245.7%     | 17               | 505.9%            |               
| Paranoid  | 87      | 36      | 241.7%     | 18               | 483.3%            |               
| Paranoid  | 89      | 37      | 240.5%     | 18               | 494.4%            |  

Let's take our previous example and adjust it slightly. Instead of a source data consisting of 321 (3 * 107) chunks, we will add 19 chunks for a total of 340 chunks. Looking at our chart, we can see that at the Strong level for 19 data chunks we need 9 parity chunks. From this we can calculate the final percentage price: 72 / 340 = 21.17%. 

## Cost Calculator Widget

This calculator takes as input an amount of data and an erasure coding redundancy level, and outputs the number of additional parity chunks required to erasure code that amount of data as well as the increase in cost to upload vs. a non-erasure encoded upload:


<RedundancyCalc />



## Downloading Erasure Encoded Data

For a downloader, the process for downloading a file which has been erasure encoded does not require any changes from the [normal download process](/docs/develop/access-the-swarm/upload-and-download). There are several options for adjusting the default behaviour for erasure encoded downloads, however there is no ned to adjust them.

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

This means that there is no need for you to inform downloaders that a file you have uploaded uses erasure coding, as even with the default download behaviour reconstruction of the source file will be attempted if any chunks are missing.

### Default Download Behaviour

Erasure coding retrieval for downloads is enabled by default, so there is no need for a downloader to explicitly enable the feature. The default download behaviour is to use the DATA strategy with fallback enabled. With these settings, first an attempt will be made to download the data chunks only. If any of the data chunks are missing, then the retrieval method will fall back to the RACE strategy (PROX is not currently implemented and so will be skipped). With the RACE strategy, an attempt will be made to download all data and parity chunks, and chunks will continue to be downloaded until enough have been retrieved to reconstruct the original data. 
