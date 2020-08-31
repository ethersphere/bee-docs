---
title: Host Your Website Using ENS
id: host-your-website-using-ENS
---

Bee treats ENS as a first class citizen, wherever you can use a Swarm reference, you can also use an ENS domain where the `content` ENS Resolver record is set to be a `bzz://` reference.

:::info
You may substitute ENS names for Swarm references in any of the [API methods](/docs/api-reference/api-reference) where you would normally use a Swarm reference.
:::

### Link an ENS domain to a website.

First we will need to upload some content to Swarm to get it's Swarm reference hash, see [uploading a directory](/docs/getting-started/upload-a-directory) for more information.

```bash
curl \
	-X POST \
	-H "Content-Type: application/x-tar" \
	--data-binary @my_website.tar http://localhost:8080/dirs
```

```json
{"reference":"b25c89a401d9f26811680476619a1eb4a4e189e614bc6161cbfd8b343214917b"}
```

Next, we add a `Content` record to your ENS domain's resolver contract.

We recommend the excellent [ENS Domains Dapp](https://app.ens.domains/) used with the [Metamask](https://metamask.io/) browser extension for registering and administrating your ENS domain.

Once you have registered your name, and have connected Metamask with the relevant Ethereum account, set the resolver to use the public ENS if you have not already done so.

Navigate to 'My Names', and select the name you want to link your Swarm content to.

Press 'Set' next to your resolver record.

![alt text](/img/ens-1.png "Press set resolver.")

Choose the public resolver.

![alt text](/img/ens-2.png "Choose the public resolver.")

Press add a record.

![alt text](/img/ens-3.png "Press add a record.")

Choose the Content Record type from the drop down menu.

![alt text](/img/ens-4.png "Choose the content record type from the drop down menu.")

Add the Swarm reference you created earlier and press 'save'.

![alt text](/img/ens-5.png "Add the Swarm reference you created earlier and press 'save'.")

Verify the Content Record has been created!

![alt text](/img/ens-6.png "Add the Swarm reference you created earlier.")

Done! Now you will be able to view your website using the ENS name instead of the Swarm Reference!

![alt text](/img/ens-7.png "Add the Swarm reference you created earlier.")
