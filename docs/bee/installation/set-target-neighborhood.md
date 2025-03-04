---
title: Set Target Neighborhood
id: set-target-neighborhood
---

In older versions of Bee, [neighborhood](/docs/concepts/DISC/neighborhoods) assignment was random by default. However, we can maximize a node's chances of winning xBZZ and also strengthen the resiliency of the network by strategically assigning neighborhoods to new nodes (see the [staking section](/docs/bee/working-with-bee/staking) for more details).

Therefore the default Bee configuration now includes the `neighborhood-suggester` option, which is set by default to use the Swarmscan neighborhood suggester (`https://api.swarmscan.io/v1/network/neighborhoods/suggestion`). You can use an alternative suggester URL, but it must return a JSON response in the following format: `{"neighborhood":"101000110101"}`. However, we currently recommend using only the default suggester. 


:::info
The Swarmscan neighborhood selector prioritizes the least populated neighborhood. If a neighborhood contains imbalanced sub-neighborhoods, it will suggest the least populated sub-neighborhood instead. Furthermore, the suggester will temporarily de-prioritize previously suggested neighborhoods based on the assumption that a new node is being created in each suggested neighborhood so that multiple nodes do not simultaneously attempt to join the same neighborhood.
:::

#### Setting Neighborhood Manually

It's recommended to use the default `neighborhood-suggester` configuration for choosing your node's neighborhood, however you may also set your node's neighborhood manually using the `target-neighborhood` option.

To use this option, it's first necessary to identify potential target neighborhoods. You can find underpopulated neighborhoods using the [Swarmscan website](https://swarmscan.io/neighborhoods). It ranks neighborhoods from least to most populated and displays their leading binary bits. Simply copy the leading bits from one of the least populated neighborhoods (for example, `0010100001`) and use it to set `target-neighborhood`. After doing so, an overlay address within that neighborhood will be generated when starting Bee for the first time.

```yaml
## bee.yaml
target-neighborhood: "0010100001"
```

You can also use the [Swarmscan API endpoint](https://api.swarmscan.io/#tag/Network/paths/~1v1~1network~1neighborhoods~1suggestion/get) to programmatically retrieve a suggested neighborhood:

```bash
curl https://api.swarmscan.io/v1/network/neighborhoods/suggestion
```
A suggested neighborhood will be returned:

```bash
{"neighborhood":"1111110101"}
```
