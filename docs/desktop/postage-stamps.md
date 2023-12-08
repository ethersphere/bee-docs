---
title: Postage Stamps
id: postage-stamps
---


:::info
Swarm Desktop must be configured as a light node in order to access stamp related features. If you have not already upgraded from the default ultra-light configuration, complete the upgrade by following the ***[instructions here](/docs/desktop/configuration#upgrading-from-an-ultra-light-to-a-light-node)***.
:::

Postage stamps are required in order to upload data to Swarm. Postage stamps are purchased by interacting with the Swarm postage stamp smart contract on Gnosis Chain. Postage stamps are not purchased one by one, rather they are purchased in batches only.


## How to Buy a Postage Stamp Batch

Stamps can be purchased by selecting ***Stamps*** from the ***Account*** tab:

![](/img/stamps1.png)

And then clicking the ***Buy New Postage Stamp*** button:

![](/img/stamps2.png)

### Depth and Amount

Batch [depth and amount](docs/learn/technology/contracts/postage-stamp) are the two required parameters which must be set when purchasing a postage stamp batch. Depth determines how many chunks can be stamped with a batch while amount determines how much xBZZ is assigned per chunk.

![](/img/stamps3.png)

Inputting a value for depth allows you to preview the upper limit of data which can be uploaded for that depth. 

:::info
Note that a batch will become fully utilised before the upper limit has been reached, so the actual amount of data which can be uploaded is lower than the limit. At higher depth values, this becomes less of a problem as batch utilisation will come closer to the upper limit on average as the depth increases. For this reason, Swarm Desktop requires a minimum batch depth of 24.
:::

Inputting a value for amount and depth together will allow you to also preview the total cost of the postage stamp batch as well as the TTL (time to live - how long the batch can store data on Swarm). Click the ***Buy New Stamp*** button to purchase the stamp batch.

![](/img/stamps4.png)

After purchasing stamps you can view stamp details from the ***Postage Stamps*** drop down menu:

![](/img/stamps5.png)


## Managing Postage Batches

After purchasing a postage batch, it is important to monitor the usage and TTL (time to live) of your batch. 

TTL is shown next to the "Expired in" label in the screenshot below. 

![](/img/stamps6.png)

For this stamp batch, it has only 6 hours left. Once the TTL has run out completely, the content uploaded using that batch will no longer be kept on Swarm, and will be lost forever. To prevent this from happening, you can "top up" your batch by adding more xBZZ to the batch balance to increase the batch TTL.

## Top-up a Batch

To get started, click on the "Topup and Dilute" button. 

![](/img/stamps7.png)

From the "Action" dropdown menu, make sure that you have "Topup" selected and then fill in the `amount` by which you wish to top up the batch. Note that the number entered here is in PLUR (1e-16 xBZZ), and it is the same `amount`` parameter described in the [section above](/docs/desktop/postage-stamps#depth-and-amount) on purchasing postage stamp batches, it is NOT equal to the total amount of xBZZ spent for this top up transaction. 

After inputting the `amount`, click "Topup" to submit the transaction.

After a few moments, you will see a notice that the transaction was successful in a green alert box. A few moments after that, you will see the updated TTL in the stamp details window.

![](/img/stamps8.png)

## Dilute a Batch

If our batch begins to come close to becoming fully utilised, we can choose to increase the `depth` of the batch to increase the amount of data it can store. This is referred to as "dilution", since by increasing the `depth` without updating the `amount`, we dilute the amount of xBZZ which is assigned to each chunk. In other words, the dilute transaction will increase the amount which can be uploaded by a batch while also ***decreasing*** the TTL. Therefore it is important to both top up and also dilute your stamp batch if you wish to increase the amount stored by the batch without decreasing its TTL.

To get started, click on the "Topup and Dilute" button. Make sure to select "Dilute" from the "Action" dropdown menu.

![](/img/stamps9.png)

From here, we can select the new `depth` value for our postage stamp batch. In this instance, we will increase it from 20 to 21.

![](/img/stamps10.png)

After a few moments the transaction will be completed and you should see the updated Depth, Capacity, and TTL.

![](/img/stamps10.png)

Note that both the Depth and Capacity have increased while the TTL has decreased.