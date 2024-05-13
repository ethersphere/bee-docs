---
title: Configuration
id: configuration
---


## Setting RPC Endpoint

In order to interact with the Gnosis Chain to buy stamps, participate in staking, and manage assets such as xBZZ, Bee nodes require a valid Gnosis Chain RPC endpoint. By default the RPC endpoint is set to https://xdai.fairdatasociety.org, however any valid Gnosis Chain RPC endpoint may be used. 

To modify the RPC endpoint, first navigate to the ***Settings*** tab:

![](/img/config1.png)

From the ***Settings*** tab, expand the API Settings section and click the pen button next to Blockchain RPC URL to edit the default RPC. You can choose any valid Gnosis Chain RPC, either from your own Gnosis node or a service provider. You can find a list of paid and free RPC options from the [Gnosis Chain docs](https://docs.gnosischain.com/tools/rpc/). For this example we will use the free endpoint - *https://rpc.gnosischain.com/*.

![](/img/config2.png)

Click ***Save and Restart*** to finish changing the RPC endpoint.

## Upgrading from an Ultra-light to a Light Node

Bee ultra-light nodes are limited to only downloading small amounts of data from Swarm. In order to download greater amounts of data or to upload data to Swarm you must upgrade to a light node. To do this we need to first fund our Swarm Desktop Bee node with some xDAI (DAI bridged from Ethereum to Gnosis Chain which serves as Gnosis Chain's native token for paying transaction fees) in order to pay for the Gnosis Chain transactions required for setting up a light node.


### Bridging Ethereum DAI to Gnosis Chain as xDAI

If you already have some xDAI on a Gnosis Chain address, skip to the next step ***Funding Node with xDAI***. If you have DAI on Ethereum and need to swap it for xDAI, you can use one of the [Gnosis Chain Bridge](https://bridge.gnosischain.com/)

Five to ten xDAI is plenty to get started.

### Funding Node with xDAI

Once you have a few xDAI in your Gnosis Chain address, to fund your Bee node you need to send it from your wallet to your Swarm Desktop wallet. You can find your address from the ***Account*** tab of the app.

![](/img/config3.png)


Next simply send your xDAI to that address. Before sending, make sure you have set your wallet to use the Gnosis Chain network and not the Ethereum mainnet. If Gnosis Chain is not included as default selectable network in your wallet, you may need to add the network manually. You can use this configuration to add Gnosis Chain:

| Field         | Value     |
|--------------|-----------|
|**Network name:**|Gnosis|
| **New RPC URL:** | https://rpc.gnosischain.com |
| **Chain ID:**| 100 |
| **Symbol:**|  xDai   |
| **Block Explorer URL (Optional):**|  https://blockscout.com/xdai/mainnet   |

![](/img/config4.png)

The transaction should be confirmed in under a minute. We can check on the ***Account*** page to see when the xDAI has been received:

![](/img/config5.png)


### Set Up Wallet 

Now with some xDAI in the Swarm Desktop wallet, we can upgrade our Bee node from ultra-light to a light node. Completing the setup process will swap xDAI for some xBZZ at the current price, and will issue the transactions needed to set up the chequebook contract.

To get started, navigate to the ***Info*** tab and click the ***Setup wallet*** button. 
![](/img/config10.png)
Click ***Use xDAI***.
![](/img/config6.png)
Confirm that you have sufficient xDAI balance and click ***Proceed***.
![](/img/config7.png)
Click ***Swap Now and Upgrade***.
![](/img/config8.png)
Wait for the upgrade to complete.
![](/img/config9.png)
After the upgrade is complete, you will see several new sections within the ***Account*** tab: ***Chequebook***, ***Stamps***, and ***Feeds***.
 
##  Fund Chequebook

After setting up your wallet you will have access to the ***Chequebook*** section from the ***Accounts*** tab. From here you can manage your chequebook for your Swarm Desktop Bee node.






