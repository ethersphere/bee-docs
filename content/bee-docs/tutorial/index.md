---
title: 'Tutorial'
weight: 3
summary: "Several tutorials on how to use the Bee-node"
alias: "/bee-docs/tutorial.html"
---

In this section, you will find several tutorials on how to run a Bee node and interact with it. These tutorials are meant as a help to get you started. In this section, no new information *specific* to Bee is given; we merely combine information from the sections [Installation](/bee-docs/installation.html), [Starting your node](/bee-docs/start.html) and [API reference](/bee-docs/API-reference.html) with some general development practices and knowledge and repackage this information in a more narrative form.


# Upload and download a file
[Download and install](/bee-docs/installation.html) a Bee node, and [start](/bee-docs/start.html) it with the default configuration (`bee start`). We will use the [API](/bee-docs/API-reference.html) interface for uploading and downloading.

There are several ways to interact with the API to upload and download a file. In this tutorial, we will show you how to do it, using the command-line and via your browser.

## Upload via command-line
A file can be uploaded by making an HTTP POST request to the `files` endpoint. We can use `curl` to do this, like this one:

```sh
curl -F file=@kitten.jpg http://localhost:8080/files
```
where `kitten.jpg` is the path to the file that you want to upload.

`curl` will form a `multipart/form-data` request with the filename, content type and file content to the `bee` API. Please see the [curl documentation](https://ec.haxx.se/http/http-multipart) for more information on uploading multipart form-data with curl.

In case you'd like to manually specify the content type during upload, you could do so using a query string parameter:

```sh
curl -H "Content-Type: image/x-jpeg" --data-binary @kitten.jpg localhost:8080/files?name=cat.jpg
```

In both cases, the `bee/files` endpoint will return a `json` formatted response with a reference to the uploaded file, for example:

```json
{"reference":"3b2791985f102fe645d1ebd7f51e522d277098fcd86526674755f762084b94ee"}
```

The reference is the Swarm hash of the content which you just uploaded. Because of the properties of the [hashing function](https://en.wikipedia.org/wiki/Hash_function), it differs for each distinct file which you upload.

## Download via command-line
Similarly to upload, we can use `curl` in the command-line to download a file. We make a GET request to the same `files` endpoint to download the file which we just uploaded:

```sh
curl http://localhost:8080/files/3b2791985f102fe645d1ebd7f51e522d277098fcd86526674755f762084b94ee
```

You will need to change the reference (the string after `/files/`) to the reference which you got while uploading the file.

Of course, you can use any command-line tool which makes HTTP-requests instead of `curl`.

## Upload via browser
You can upload a file by using your browser. To do so, we will make use of a very simple upload form:

```html
<form action="http://localhost:8080/files" method="post" enctype="multipart/form-data">
 <div>
   <input type="file" name="file">
 </div>
 <div>
   <button>Upload</button>
 </div>
</form>
```

Copy this content and save it as an `.html` file on your computer (e.g. `upload.html`). Now, open the form which you just saved by navigating to your browser and pressing `CTRL +O` or via your filesystem and double-click on the `html`.

You can use this form to upload a file. Note that by for simplicity's sake, this form just makes a request to `localhost:8080`. If your node is running with a different `HTTP endpoint`, you must change the endpoint in the form too.

Note that a form, similar to this form is also served from our [public gateway](https://gateway.ethswarm.org/).

## Download via browser
Downloading a file via the browser is very simple.

Use your address-bar to navigate to `localhost:8080/files/{reference}`. Where `reference` is the address of your file, which was returned when you uploaded the file. The file should be opened in the browser, or you will get a prompt to save the file (depending on the file-type).

# Starting a private network
A private network can be started by overriding the default configuration values of your Swarm node. We will first talk about how to start a private network on your own computer and will speak afterwards about how you can invite your friends to join this network. Throughout this tutorial, we will make use of configuration files to configure the nodes, but of course you can do the same with flags or environment variables (see [Starting your node](/bee-docs/start.html)). 

## Start a network on your own computer
### Configuration
Starting a network is easiest achieved by making use of configuration files. We need at least two nodes to start a network. Hence, below two configuration files are provided. Save them respectively as `config_1.yaml` and `config_2.yaml`.

**config_1.yaml**
```yaml
api-addr: :8080
p2p-addr: :7070
debug-api-addr: 127.0.0.1:6060
enable-debug-api: true
data-dir: /tmp/bee/node1
password: some pass phze
verbosity: trace
bootnode: ""
welcome-message: "Bzz Bzz Bzz"
```

**config_2.yaml**
```yaml
api-addr: :8081
p2p-addr: :7071
debug-api-addr: 127.0.0.1:6061
enable-debug-api: true
data-dir: /tmp/bee/node2
password: some pass phze
verbosity: trace
tracing: true
bootnode: ""
```

Note that for each node, we provide a different `api-addr`, `debug-api-addr`. If we would not specify different addresses here, we would get an `address already in use` error, as no two applications can listen to the same port. We also specify a different `p2p-addr`. If we would not do that, our nodes would not be able to communicate with each other. We won't get an error, however, as libp2p supports stream multiplexing. We also specify a seperate `data-dir` for each node. If we wouldn't specify this, the node would stop with an error `resource temporarily unavailable`, which is a protection from the database to prevent inconsistencies by multiple applications writing to the same database. Lastly, note the `welcome-message` for the first node. This is a small little feature, allowing you to set a message, printed to the console of the node which initiated a connection with you.

### Starting
Start your nodes by running `bee start --config config_1.yaml` and in another terminal `bee start --config-file config_2.yaml`.
You can expect the state of your network by calling `curl localhost:6060/topology | jq` and `curl localhost:6061/toplogy | jq`.

No connections? Right! Let's remedy that!

### Making a network
In order to create a network, you must instruct your nodes to connect to each other. This step is not explicitely needed if you connect to the main Swarm network, as there are bootnodes into the Swarm network programmed by default. 

To get the network address from the first node, we can call `curl localhost:6060/addresses | jq`. To get a list of all [multiaddresses](https://docs.libp2p.io/reference/glossary/#multiaddr) on which you node can be reached. 

Note down one of the addresses with an `ip4`, starting with 127.0.0.1 and past this full address into your config_2.yaml file. Now, shut down your second node and reboot again. 

Did it connect? Verify this by looking at the console output of your first and second node and call again the `topology` endpoint.

## Invite friends to join your network
Inviting friends to join your network is a breeze if your router or local network supports [UPNP](https://en.wikipedia.org/wiki/Universal_Plug_and_Play). You can verify this easiest by looking again at the output of `localhost:6060/addresses`. Does it list your external IP? If yes, you can just tell your friends to set this IP as their bootnode configuration. If not, now it can become a bit difficult. Most likely, you need to switch on your UPNP, but there may be other factors involved too. Please reach out to us in [the Beehive](beehive.ethswarm.org) or with a [Github issue](https://github.com/ethersphere/bee/issues/new/choose) if you encounter problems in forming a network!