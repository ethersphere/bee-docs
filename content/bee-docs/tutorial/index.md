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

## Download via browser
Downloading a file via the browser is very simple.

Use your address-bar to navigate to `localhost:8080/files/{reference}`. Where `reference` is the address of your file, which was returned when you uploaded the file. The file should be opened in the browser, or you will get a prompt to save the file (depending on the file-type).


<!--
TODO: clean this up and make sure all information is preserved.
# Starting a private network

Bee node provides CLI help that lists all available commands and flags. Every command has its own help.

```sh
bee -h
bee start -h
```

To run the node with the default configuration:

```sh
bee start
```

This command starts bee node including HTTP API for user interaction and P2P API for communication between bee nodes.

It will open an interactive prompt asking for a password which protects node private keys. Interactive prompt can be avoided by providing a CLI flag `--password-file` with path to the file that contains the password, just to pass it as the value to `--password` flag. These values are also possible to be set with environment variables or configuration file.

## Configuration

Configuration parameters can be passed to the bee node by:

- command line arguments
- environment variables
- configuration file

with that order of precedence.

Available command line parameters can be seen by invoking help flag `bee start -h`.

Environment variables are analogues to these flags and can be constructed with simple rules:

- remove `--` prefix from the flag name
- capitalize all characters in the flag name
- replace all `-` characters with `_`
- prepend `BEE_` prefix to the resulted string

For example, cli flag `--api-addr` has an analogues env variable `BEE_API_ADDR`

Configuration file path is by default `$HOME/.bee.yaml`, but it can be changed with `--config` cli flag or `BEE_CONFIG` environment variable.

Configuration file variables are all from the `bee start -h` help page, just without the `--` prefix. For example, `--api-addr` and `--data-dir` can be specified with configuration file such as this one:

```yaml
api-addr: 127.0.0.1:8085
data-dir: /data/bees/bee5
```

## File upload and download

A file can be uploaded by making an HTTP request like this one:

```sh
curl -F file=@kitten.jpg http://localhost:8080/files
```

`curl` will form a `multipart/form-data` request with the filename, content type and file content to the `bee` API, returning a response with the reference to the uploaded file:

```json
{"reference":"3b2791985f102fe645d1ebd7f51e522d277098fcd86526674755f762084b94ee"}
```

This reference is just an example, it will differ for every uploaded file.

To download or view the file, open an URL with that reference in your browser or through your favorite command line tool:  `http://localhost:8080/files/3b2791985f102fe645d1ebd7f51e522d277098fcd86526674755f762084b94ee`.

In case you'd like to manually specify the content type during upload, you could do so using a query string parameter:

```sh
curl -H "Content-Type: image/x-jpeg" --data-binary @kitten.jpg localhost:8081/files?name=cat.jpg
```

The same response with file reference is returned.

To avoid uploading with command line tools, this HTML file can be opened in the browser and used to select and submit a file:

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

Download of a file in the browser can be done by entering the URL `<API_address>/files/{reference}` in the address bar, where API_address is by default `http://localhost:8080` and reference is the reference value from the returned JSON response.

-->
