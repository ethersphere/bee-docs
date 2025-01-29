---
title: Set Target Neighborhood
id: set-target-neighborhood
---


### Set Target Neighborhood

In older versions of Bee, [neighborhood](/docs/concepts/DISC/neighborhoods) assignment was random by default. However, we can maximize a node's chances of winning xBZZ and also strengthen the resiliency of the network by strategically assigning neighborhoods to new nodes (see the [staking section](/docs/bee/working-with-bee/staking) for more details).

Therefore the default Bee configuration now includes the `neighborhood-suggester` option which is set by default to to use the Swarmscan neighborhood suggester (`https://api.swarmscan.io/v1/network/neighborhoods/suggestion`). An alternative suggester URL could be used as long as it returns a JSON file in the same format `{"neighborhood":"101000110101"}`, however only the Swarmscan suggester is officially recommended. 


:::info
The Swarmscan neighborhood selector will return the least populated neighborhood (or its least populated sub-neighborhood in case the sub-neighborhoods are imbalanced). Furthermore, the suggester will temporarily de-prioritize previously suggested neighborhoods based on the assumption that a new node is being created in each suggested neighborhood so that multiple nodes do not simultaneously attempt to join the same neighborhood.
:::

#### Setting Neighborhood Manually

It's recommended to use the default `neighborhood-suggester` configuration for choosing your node's neighborhood, however you may also set your node's neighborhood manually using the `target-neighborhood` option.

To use this option, it's first necessary to identify potential target neighborhoods. A convenient tool for finding underpopulated neighborhoods is available at the [Swarmscan website](https://swarmscan.io/neighborhoods). This tool provides the leading binary bits of target neighborhoods in order of least populated to most. Simply copy the leading bits from one of the least populated neighborhoods (for example, `0010100001`) and use it to set `target-neighborhood`. After doing so, an overlay address within that neighborhood will be generated when starting Bee for the first time.

```yaml
## bee.yaml
target-neighborhood: "0010100001"
```

There is also a [Swarmscan API endpoint](https://api.swarmscan.io/#tag/Network/paths/~1v1~1network~1neighborhoods~1suggestion/get) which you can use to get a suggested neighborhood programmatically:

```bash
curl https://api.swarmscan.io/v1/network/neighborhoods/suggestion
```
A suggested neighborhood will be returned:

```bash
{"neighborhood":"1111110101"}
```
