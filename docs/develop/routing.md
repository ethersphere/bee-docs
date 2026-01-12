---
title: Website Routing
id: routing
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Routing on Swarm 

Swarm does not behave like a traditional web server — there is no server-side routing, and every route must correspond to a real file inside the site [manifest](/docs/develop/tools-and-features/manifests).

If you try to use typical "clean URLs" like:

```bash
/about
/contact
/dashboard/settings
```

Swarm will look for literal files such as:

```bash
about
contact
dashboard/settings
```

...which don’t exist if you've uploaded a static website with files like `about.html` and `contact.html`.

There are two main strategies for addressing routing:

* **Hash-Based Client-Side Routing**
* **Manifest-Based Routing with Aliases or Index Files**

Now let’s look at each method:

## Client-Side Hash Routing 

This section explains how to add hash based client side routing to your Swarm hosted site so that you can have clean URLs for each page of your website. 

See the [routing project in the examples repo](https://github.com/ethersphere/examples/tree/main/routing) for a full working example implementation.

Swarm has no server backend running code and so can’t rewrite paths. One approach to routing is to set up a [SPA](https://en.wikipedia.org/wiki/Single-page_application) with React's `HashRouter`, which keeps all routing inside the browser.

You can do this easily using a template from **create-swarm-app** and then adding your own pages.


#### 1. Create a New Vite + React Project (with `create-swarm-app`)

Run:

```bash
npm init swarm-app@latest my-dapp vite-tsx
```

This generates a clean project containing:

```bash
src/
  App.tsx
  index.tsx
  config.ts
public/
index.html
package.json
```

You now have a fully working Vite/React app ready for Swarm uploads.


#### 2. Install React Router

Navigate to the project directory:

```bash
cd my-dapp
```

Inside the project:

```bash
npm install react-router-dom
```

This gives you client-side navigation capability.



#### 3. Switch the App to Use Hash-Based Routing

Swarm only serves literal files, so `/#/about` is the only reliable way to have “pages.”

Replace your `./src/App.tsx` with:

```tsx
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { Home } from './Home'
import { About } from './About'
import { NotFound } from './NotFound'

export function App() {
    return (
        <HashRouter>
            <nav style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    )
}
```

This gives you usable routes:

```bash
/#/         → Home
/#/about    → About
/#/anything → React 404 page
```

#### 4. Add Your Page Components

Create your page components inside `./src`:

Example `About.tsx`:

```tsx
export function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About</h1>
      <p>This demo shows how to upload files or directories to Swarm using Bee-JS.</p>
    </div>
  )
}
```

Example `NotFound.tsx`:

```tsx
export function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Page Not Found</h1>
      <a href="./#/">Return to Home</a>
    </div>
  )
}
```

#### 5. Add a Static `404.html` for Non-Hash URLs

Swarm still needs a fallback for URLs like:

```
/non-existent-file
```

Create a `./public` directory and save a `404.html` file inside:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>404 – Not Found</title>
  <style>
    body { font-family: sans-serif; padding: 40px; }
    a { color: #007bff; }
  </style>
</head>

<nav style="display: flex; gap: 12px; padding: 12px">
  <a href="./#/">Home</a>
  <a href="./#/about">About</a>
</nav>

<body>
  <h1>404</h1>
  <p>This page doesn't exist.</p>
  <p><a href="./#/">Return to Home</a></p>
</body>
</html>
```

Vite will automatically include this in `dist/`.

This file handles **non-hash** missing paths.
React handles **hash** missing paths.

#### 6. Build the Project

Before uploading, compile the Vite app into a static bundle:

```bash
npm run build
```

This produces a `dist/` folder containing:

```bash
dist/
  index.html
  404.html
  assets/
```

Everything inside `dist/` will be uploaded to your Swarm feed.

#### 7. Deploy Site

Now with routing handled its time to deploy the site. Refer to the [Host Your Website](/docs/develop/host-your-website#host-a-site-with-swarm-cli) guide for instructions on how to deploy your site using `bee-js` or `swarm-cli` 

*Make sure when using the commands/scripts from the linked guide to replace the `./website` directory with the directory for our build — `./dist`.*

Now the Home and About pages will be properly resolved by the routes we specified (`./#/`) and (`./#/about`), and non existent URLs will be handled by the `NotFound` component for hash URLs and our `404.html` error document for all others.

![](/img/hash-routing.jpg)

## Manifest Based Routing

The second routing method involves directly manipulating the manifest so that routes resolve properly to the intended content. 



### 1. Upload the Site with Default Manifest

Download example project:

```bash
git clone https://github.com/ethersphere/examples.git
cd examples/routing-manifest
```

Install dependencies:

```bash
npm install
```

Configure environment variables. There is a `.env` file with important constants listed in it. You will need to at least update it with a valid batch ID, and potentially other changes if you are not using a default setup:

Replace the value for `BATCH_ID` with your own valid batch IDs. Otherwise you may also need to update `BEE_URL` if its value doesn't match your Bee RPC endpoint.

```.env
BEE_URL=http://localhost:1633
BATCH_ID=afd0810c2ea2936df849fe7b52650e231a19b7b31dbf7f96a93f0cf8a296f3f3
PUBLISHER_KEY=0x1111111111111111111111111111111111111111111111111111111111111111
UPLOAD_DIR=./site
```

Start by uploading the site using the `upload.js` script provided in the example project:

```bash
node .\upload.js
```

Terminal output:

```bash
Site reference: e4d93dc161d9b1fb192fdcef7e18830bd50fa5b80561de18d5f2945fb8618515

Site URL: http://localhost:1633/bzz/e4d93dc161d9b1fb192fdcef7e18830bd50fa5b80561de18d5f2945fb8618515/
```


If you peek inside the `upload.js` code you will see these lines:

```js
const { reference } = await bee.uploadFilesFromDirectory(
  batchId,
  uploadDir,
  {
    indexDocument: "index.html",
    errorDocument: "404.html",
  }
)
```

Take note of the values set by the `indexDocument` and `errorDocument` options. With those options specified, manifest entries for the root path `./` and non existent paths will be created on upload to resolve to `index.html` and `404.html` respectively. Without specifying them, your site would not load either page unless you explicitly include the entire filename with extension in the URL.

Navigate in your browser to the URL output to the terminal after running the `upload.js` script:

```bash
http://localhost:1633/bzz/e4d93dc161d9b1fb192fdcef7e18830bd50fa5b80561de18d5f2945fb8618515/
```

Scroll down the example web page, read the instructions in the example website and click each of the example links to inspect how routing works by default without any manifest edits (besides those specified for the index and error documents):

![](/img/routing-manifest.png)


### 2. Fix Routing With Manifest Manipulation

Without manifest edits, routes only work via exact file paths like:

```
/index.html
/about.html
/contact.html
```

Trying to access `/about` or `/about/` will fail.

You can fix clean URLs using **two strategies**:



#### Strategy B: Use Directory Index Files (Recommended)

If you control your site structure, this is the **recommended approach**. Instead of using flat files like `about.html`, restructure your site to use directory index files:

```
/about/index.html
/contact/index.html
```

Then add the directory route to the manifest:

```ts
node.addFork('about/', referenceForAboutIndex, metadata)
```

Now `/about/` resolves naturally to `/about/index.html`, which matches how most static hosting and web servers work.

This approach **scales cleanly to nested routes**, avoids duplicate aliases, and lets you group page-specific assets under the same directory. For anything beyond a trivial site, this structure is simpler, more predictable, and easier to maintain.

#### Strategy A: Add Aliases to the Manifest (Quick Fix)

This strategy keeps your existing file structure (for example `about.html`) and fixes clean URLs by adding **alias paths** in the manifest. It is useful when you **cannot or do not want to change your build output**.

```ts
node.addFork('about', referenceForAbout, metadata)
node.addFork('about/', referenceForAbout, metadata)
```

After this, both `/about` and `/about/` will resolve to the same content as `/about.html`.

This approach is best for **retrofitting clean URLs onto an existing flat-file site**, but it does not scale as nicely: you must usually maintain **two routes per page**, and the path prefix becomes “claimed” by that page.

## Remove and Redirect Routes

To "delete" a page you would need to remove all entries for it from the manifest to remove it entirely:

```js
node.removeFork('old-page.html')
```
For example, if you had manually added:

```js
node.addFork('about', referenceForAbout, metadata)
node.addFork('about/', referenceForAbout, metadata)
```

You will need to make sure to fully remove all entries for that file from the manifest to really "delete" it from your site.

```js
node.removeFork('about')
node.removeFork('about/')
node.removeFork('about.html')
```

:::info 
The file is not removed from the Swarm network since data on Swarm is immutable. Anyone who has its reference can still retrieve it. Removing it from your manifest just means it's no longer available through a route on your site.
:::


We are adding a record with the same path but now pointing at new content to achieve "redirect" like behavior.

To redirect:

```js
node.addFork('old-page.html', newPageReference, metadata)
```

This lets you “deprecate” a page and point old paths to new ones.

#### 4. Manifest Routing Enables Dynamic Content

Once you understand manifest-based routing, you can dynamically:

* Add new paths (e.g. blog posts, product pages)
* Create custom routes
* Redirect old paths
* Remove unwanted paths

Next, learn how to combine all the previously covered concepts to enable [dynamic content](/docs/develop/dynamic-content) on Swarm. It will allow you to turn Swarm into a decentralized CMS and decouple your front end from your back end.

