---
title: Erasure Coding
id: erasure-coding
---

Erasure coding (also known as erasure code) is an efficient and flexible approach to data protection which is an optional feature for Swarm uploads. It is a technique that increases data protection by enabling the recovery of original data even when some encoded chunks are lost or corrupted. When used, it ensures that data on Swarm can always be accessed reliably, even if some nodes or entire neighborhoods go offline. Refer to the [official erasure coding paper](https://papers.ethswarm.org/p/erasure/) for more in depth details. 

## How It Works

Erasure coding enhances data protection by dividing the source data into "chunks" and adding additional redundant chunks.

Specifically, data is divided into **m** chunks, and **k** additional chunks are generated, resulting in **m + k** total chunks. The data is encoded across these chunks such that as long as **m** chunks are intact, the original data can be fully reconstructed. Chunks are then distributed across the network as with a standard upload. This approach provides a robust method for data recovery in distributed storage networks like Swarm.

### Example

For an 8KB image, if we set **m = 2** and **k = 1**, we create 3 chunks (2 original + 1 redundant). As long as any 2 of these 3 chunks are available, we can reconstruct the original data. By increasing **k** to 4, we can tolerate the loss of up to 4 chunks while still recovering the original data.

![Erasure Code Example](https://www.ethswarm.org/uploads/erasure-coding-01.png)

### Levels of Protection

In Swarm's implementation of erasure coding, there are four named levels of protection, Medium, Strong, Insane, and Paranoid. For each level, the **m** and **k** values have been adjusted in order to meet a certain level of data protection:

***Table A:***
| Redundancy Level Value | Level Name | Chunk Loss Tolerance         |      
| ---------------- | --------- | ----------------------------------- |
| 1                | Medium    | 1%                                  | 
| 2                | Strong    | 5%                                  |
| 3                | Insane    | 10%                                 | 
| 4                | Paranoid  | 50%                                 | 

The "Redundancy Level" is a numeric value for each level of protection, the "Level Name" is the official name for each level, and the "Chunk Loss Tolerance" column corresponds to the exact level of data protection for each level. For each redundancy level, the original data is retrievable with >=99.9999% statistical certainty given a percent chunk loss equal or less than the percent shown in the "Chunk Loss Tolerance" column. 

Note that this guarantee of retrievability is for each 128 chunk segment, and therefore does not correspond to retrievability of a whole file. The retrievability failure rate for any individual file depends on the size of the file, and increases with the size of the file. For a detailed explanation of how to calculate the retrievability of any sized file refer to [section 3 in the erasure coding paper](https://papers.ethswarm.org/erasure-coding.pdf).    

## Usage

For usage instructions, see the [erasure coding page in the "Develop" section](/docs/develop/tools-and-features/erasure-coding).

## Cost Calculation

In Swarm's implementation of erasure coding, there are four levels of protection: Medium, Strong, Insane, and Paranoid. Each level adds additional parity chunks for a corresponding increase in data protection (and also cost).

The table below shows the number of parities and data chunks for each level, as well as the percent increase in cost vs a non-erasure coded upload. 

***Table B:***
| Redundancy | Parities | Data Chunks | Percent | Chunks Encrypted | Percent Encrypted |
|----------|----------|--------|---------|------------------|-------------------|
| Medium   | 9        | 119 | *7.6%*  | 59            | 15%           |
| Strong   | 21       | 107 | *19.6%* | 53            | 40%           |
| Insane   | 31       | 97   | 32%  | 48            | 65%            |
| Paranoid | 90       | 38      | 240.5%    | 18               | 494%              |

For each redundancy level, there are **m + k** = 128 chunks, where **m** are the data chunks (shown in column "Data Chunks") and **k** are the parity chunks (shown in column "Parities"). The "Percent" and "Percent Encrypted" columns show percent of "parity overhead" cost increase from using erasure coding for normal and encrypted uploads respectively. 


### Cost Calculation for Smaller Uploads

To find the percent increase in cost for uploads of less than 128 chunks, refer to the table below:

***Table C:***
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

### Example Cost Calculation

For each redundancy level, there are m + k = 128 chunks, where m are the data chunks (shown in column "Data Chunks") and k are the parity chunks. If the number of chunks in the data being uploaded are an exact multiple of m, then the percent cost of the upload will simply equal the one shown in table B from the section above in the "Percent" column for the corresponding redundancy level.

#### Exact Multiples

For example, if we are uploading with the Strong redundancy level, and our source data consists of 321 (3 * 107) chunks, then we can simply use the percentage from the "Percent" column for the Strong level - 19.6% (63 parities / 321 data chunks).

#### With Remainders

However, generally speaking uploads will not come in exact multiples of m, so we need to adjust our calculations. To do so we need to use table C from the section above which shows the number of parities for sets of chunks starting at a single chunk for each redundancy level up to the maximum number of data chunks for that level. Then we simply sum up the total parities and data chunks for the entire upload and calculate the resulting percentage.

Let's say for example we have a source file of 340 chunks which we want to upload with the Strong level of protection. Referring to table B, we see for the Strong level there are 21 parity chunks for each 107 data chunks. 340 / 107 = ~3.177, meaning our upload will have three full sets of 128 chunks where m = 107 and k = 21. The remainder can be calculated from the modulus of 340 % 107 = 19


Looking at our chart, we can see that at the Strong level for 19 data chunks we need 9 parity chunks. From this we can calculate the final percentage price: 72 / 340 = 21.17%.