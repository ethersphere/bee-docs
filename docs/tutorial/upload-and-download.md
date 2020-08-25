---
title: Upload and Download
id: upload-and-download
---


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
