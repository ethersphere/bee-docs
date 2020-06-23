---
title: 'Usage'
weight: 3
summary: "How to run a node."
alias: "/bee-docs/usage.html"
---

## Running the Bee node
<!-- https://raw.githubusercontent.com/ethersphere/bee/master/README.md -->

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
