---
title: Manifests
id: manifests
---


# Manifests

Manifests define how files and folders are organized in Swarm. Instead of a flat list of uploaded files, Bee encodes directory structure as a compact prefix [trie](https://en.wikipedia.org/wiki/Trie). This allows URLs like `/images/logo.png`, `/docs/readme.txt`, or `/` to resolve efficiently to the correct Swarm references. Whenever you upload a directory — via `/bzz`, `bee-js`, or `swarm-cli` — Bee automatically builds a manifest that behaves like a lightweight, filesystem-like layer inside Swarm.

Manifests provide:

* Filesystem-style path lookup (`/foo/bar.txt`)
* Hierarchical directory structure
* Metadata attached to files or folders (e.g., Content-Type)
* Optional custom routing behavior for websites

They allow structured collections of files — including websites — to exist naturally on Swarm.

## Why Manifests Matter

Raw content hashes identify data immutably, but they don’t express relationships between files. A manifest adds this missing structure: it groups related files, assigns paths, stores metadata, and exposes the entire folder tree through URL-like navigation. Without manifests, every application on Swarm would need its own indexing and routing logic. 

## When Manifests Are Created

Manifests are created whenever you upload a directory via the `/bzz` endpoint, which are used internally by `swarm-cli` and `bee-js` for directory uploads. Bee scans the folder, builds the trie, and produces a manifest reference representing the entire directory tree.

By contrast:

* `/bytes` and `/chunks` upload raw binary data only
* They do not create manifests

## Index and Error Document Options

Directory uploads in `bee-js` support two optional helpers:

```js
{
  indexDocument: "index.html",
  errorDocument: "404.html"
}
```

These specify which file Bee should serve for the manifest root (`/`) and for invalid paths. These options can be used with normal directory uploads, not only websites — and any file type can be used — not only HTML. 

## How Manifests Are Structured

A manifest is structured as a trie: nodes are connected by forks, and each fork is labelled with a path segment. The path to a node is the concatenation of the segments you follow from the root. If a node’s `target` is non-zero, that path represents a file and the target points to its Swarm content. If the `target` is zero, the node behaves like a directory or intermediate prefix.

The printed output below shows a decoded Mantaray manifest (using the [`manifestToJson.js` script](https://github.com/ethersphere/examples/blob/main/utils/manifestToJson.js) from the examples repo). It represents a simple folder tree containing a root file and a nested subfolder.

:::info About the Term "Mantaray"
"Mantaray" was originally a standalone Swarm library for working with manifests. It has since been integrated into `bee-js` and is no longer maintained as a standalone library. Its name is still used in `bee-js` for the manifest-related classes (`MantarayNode`, etc.).
:::

```json
{
    "path": "/",
    "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "metadata": null,
    "forks": {
        "folder/": {
            "path": "folder/",
            "target": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "metadata": null,
            "forks": {
                "nested.txt": {
                    "path": "nested.txt",
                    "target": "0x9442e445c0d58adea58e0a8afcdcc28ed7642d7a4ff9a253e8f1595faafbb808",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "nested.txt"
                    },
                    "forks": {}
                },
                "subfolder/deep.txt": {
                    "path": "subfolder/deep.txt",
                    "target": "0x6aa935879ad2a547e57ea6350338bd04ad758977b542e86b31c159f31834b8fc",
                    "metadata": {
                        "Content-Type": "text/plain; charset=utf-8",
                        "Filename": "deep.txt"
                    },
                    "forks": {}
                }
            }
        },
        "root.txt": {
            "path": "root.txt",
            "target": "0x98e63f7e826a01634881874246fc873cdf06bb5409ff5f9ec61d1e2de1dd3bf6",
            "metadata": {
                "Content-Type": "text/plain; charset=utf-8",
                "Filename": "root.txt"
            },
            "forks": {}
        }
    }
}
```

### Key Concepts

**Node** — Represents either a directory or a file inside the manifest.  
- Directories have a zero target and may contain child nodes.  
- Files have a non-zero target pointing to their Swarm content.

**Fork** — A mapping from a path segment to a child node.  
In the JSON representation, the fork is the key (for example `"folder/"` or `"root.txt"`), and the value is the child node for that segment.

**Path** — The path segment label stored on a node (the same string used as the fork key from its parent). It may be a single segment such as `folder/` or `nested.txt`, or a remainder of the full path such as `subfolder/deep.txt`.  

**Target** — The Swarm reference for a file’s content. Directories use a zero target.

**Metadata** — Attributes stored with a node (for example `Content-Type`, filename, etc.).


## Immutability

Manifests are immutable. When you add, remove, or move a file, Bee writes new manifest nodes rather than modifying existing ones. Each update produces a new manifest reference, and older versions remain accessible.

To provide a stable entry point even as the manifest changes, you can combine manifests with feeds. A feed acts as an updateable pointer: publish each new manifest reference to the feed, and users access the feed hash instead of individual manifest hashes.

You can find examples of this in the [Building on Swarm](/docs/develop/introduction#building-on-swarm) page.

## Serving Files From a Manifest

A manifest reference acts like the root of a filesystem. Requests such as:

```
/ → index document
/docs/readme.txt → file content
```

are resolved by walking the trie until the correct file target is found. Bee handles this automatically under:

```
/bzz/<manifest-hash>/<path>
```

Paths to directories such as `/docs/` or even `/` will result in a 404 error by default unless the manifest is modified (or by specifying an `indexDocument` for `/`):

```
/docs/ → 404
```

You can specify which file or webpage you would like paths such as `/docs/` (which do not get entries in the manifest by default) to resolve to by manipulating the manifest. See the ["Filesystem"](/docs/develop/filesystem) and [Routing](/docs/develop/routing) guides for more information and examples.

:::caution
The `target` values inside a manifest should not be accessed directly. They cannot be reliably fetched via endpoints such as `/bzz/` or tools like `swarm-cli download`.

To retrieve a file, always access it through the manifest, for example:

```
curl http://localhost:1633/bzz/<DIRECTORY_MANIFEST_HASH>/root.txt -o ./root.txt
```

or

```
swarm-cli download c8275d246e8a14ccd6f680ea0ecae543ebc0734e52676a5468a9a30db156be64/disc.jpg
```

Bee resolves the underlying content automatically and returns the file correctly.
:::


## When to Modify the Manifest

Most Swarm users never need to manually inspect or modify a manifest. When you upload a directory, Bee creates one automatically and it "just works" for many common cases. You only need to modify the manifest when you want to change how paths resolve after the upload.

### Websites

For simple single-page sites, no manual changes are required — setting `indexDocument` and `errorDocument` during upload is enough.

You need to modify the manifest when you want to change routing behavior, such as:

* Removing `.html` extensions for clean URLs
* Adding, changing, or deleting routes
* Redirecting paths or restructuring the site

See the [Routing](/docs/develop/routing) guide for details.

### Directory Uploads

For one-time directory uploads that you don’t plan to change, you typically don’t need to touch the manifest. However, if you later want to add files, remove files, rename paths, or point new paths at existing content, the manifest must be updated.

See the ["Filesystem"](/docs/develop/filesystem) guide for examples.

## Putting It All Together

A manifest turns a set of immutable chunks into a structured, navigable collection of files. It enables folder trees, static assets, multi-file application bundles, websites, and data archives to exist on Swarm in a coherent, accessible way. Whether you're uploading a small directory or a full site, the manifest is what ties everything together.

