---
title: Website Routing
id: routing
---

Add intro and transition, mention different types of routing and strengths and weaknesses.
______________________

## Client-Side Hash Routing 

This section explains how to add hash based client side routing to your Swarm hosted site so that you can have clean URLs for each page of your website. See the [routing project in the examples repo](https://github.com/ethersphere/examples/tree/main/routing) for a full working example implementation.

### Why Hash Based Client Side Routing?

Swarm does not behave like a traditional web server — there is **no server-side routing**, and every route must correspond to a real file inside the site manifest.
If you try to use typical "clean URLs" like:

```
/about
/contact
/dashboard/settings
```

Swarm will look for literal files such as:

```
about
contact
dashboard/settings
```

...which obviously don’t exist unless you manually manipulate the manifest.
This is theoretically possible, but is tricky and complex to do manually, and there is currently not (yet) any tooling to make it easier.

### How to Add Routing

If you want multiple pages on a Swarm-hosted website, you should use a client-side router. Swarm has no server backend running code and so can’t rewrite paths, so we use **React Router’s `HashRouter`**, which keeps all routing inside the browser.

Below is the simplest way to set this up using **create-swarm-app** and then adding your own pages.


#### 1. Create a New Vite + React Project (with `create-swarm-app`)

Run:

```bash
npm init swarm-app@latest my-dapp-new vite-tsx
```

This generates a clean project containing:

```
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

Inside the project:

```bash
npm install react-router-dom
```

This gives you client-side navigation capability.



#### 3. Switch the App to Use Hash-Based Routing

Swarm only serves literal files, so `/#/about` is the only reliable way to have “pages.”

Replace your `App.tsx` with:

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

```
/#/         → Home
/#/about    → About
/#/anything → React 404 page
```

#### 4. Add Your Page Components

Example `Home.tsx`:

```tsx
export function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Home</h1>
      <p>Welcome to your Swarm-powered app.</p>
    </div>
  )
}
```

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

Create `public/404.html`:

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

```
dist/
  index.html
  404.html
  assets/
```

Everything inside `dist/` will be uploaded to your Swarm feed.

#### 7. Create a Publisher Identity and Deploy Using a Feed Manifest 

For stable URLs, use a **feed manifest** reference. This gives you a permanent Swarm URL that always resolves to the latest version of your content.

Create an identity (if you don’t have one yet):

```bash
swarm-cli identity create web-publisher
```

Upload your built site to the feed:


<Tabs>
<TabItem value="linux" label="Linux / macOS">

```bash
swarm-cli feed upload ./dist \
  --identity web-publisher \
  --topic-string website \
  --stamp <BATCH_ID> \
  --index-document index.html \
  --error-document 404.html
```

</TabItem>
<TabItem value="powershell" label="Windows PowerShell">

```powershell
swarm-cli feed upload .\dist `
  --identity web-publisher `
  --topic-string website `
  --stamp 3d98a22f522377ae9cc2aa3bca7f352fb0ed6b16bad73f0246b0a5c155f367bc `
  --index-document index.html `
  --error-document 404.html
```
</TabItem>
</Tabs>


The output includes:

* the **content hash**
* the **feed manifest URL** → this is your **permanent website URL**
* stamp usage details

Example:

```
Feed Manifest URL:
http://localhost:1633/bzz/<feed-manifest-hash>/
```

This URL never changes, even when you update your site.


#### 8. Visit Your Site

* Home:
  `/#/`

* About:
  `/#/about`

* Invalid hash route: handled by `NotFound.tsx`

* Invalid non-hash route: handled by `404.html`

#### Summary

You now have:

* A Vite + React app
* Hash-based routing fully compatible with Swarm
* A static 404 for non-hash paths
* A React 404 for invalid hash paths
* Stable, versioned deployments using feed manifests

## Add transition here
_________________________________________________

## Website Routing 

#### 1. Upload the Site (and Observe Basic Behavior)

Start by uploading the site:

```ts
const { reference } = await bee.uploadFilesFromDirectory(batchId, './site')
```

Without manifest edits, routes only work via exact file paths like:

```
/index.html
/about.html
/contact.html
```

Trying to access `/about` or `/about/` will fail.

#### 2. Fix Routing With Manifest Manipulation

You can fix clean URLs using **two strategies**:

##### Strategy A: Add Aliases to the Manifest

```ts
node.addFork('about', referenceForAbout, metadata)
node.addFork('about/', referenceForAbout, metadata)
```

Now `/about` and `/about/` work like `/about.html`.

##### Strategy B: Use Directory Index Files

Restructure files like:

```
/about/index.html
/contact/index.html
```

And add them to the manifest like:

```ts
node.addFork('about/', referenceForAboutIndex, metadata)
```

This gives you full directory-style clean URLs.

#### 3. Removal and Redirect

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
* 

Next, learn how manifest manipulation plays a key role in enabling the [dynamic content](/docs/develop/dynamic-content) on Swarm. It will allow you to turn Swarm into a decentralized CMS and decouple your front end from your back end.

