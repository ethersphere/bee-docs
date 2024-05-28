# Bee Documentation Website

Documentation for the [Swarm Bee Client](https://github.com/ethersphere/bee). View at [docs.ethswarm.org](https://docs.ethswarm.org).

## Contributing

Pull Requests are welcome, but please read our [CODING](CODING.md) guide!

### Node Version

You must use **node 18** or above. We recommend [nvm](https://github.com/nvm-sh/nvm).

### Installation

After the initial cloning of the repo you need to run:

```
npm ci
```

to download the exact revisions of the dependencies captured in
`package-lock.json`.

If the dependencies are updated in `package.json`, or if you wish to
test with the latest revisions of the dependencies, then you should
run:

```
npm install
```

and then consider pushing the updated `package-lock.json` to the
repository if everything works fine.

### Local Development

```
npm start
```

This command starts a local development server and opens up a browser
window. Most changes are reflected live without having to restart the
server.

### Build

```
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.


### Note about lunr search plugin

The lunr search plugin relies on manual [swizzling](https://docusaurus.io/docs/next/swizzling), which ejects the SearchBar component from the theme to allow for customization. Upgrading the Docusaurus theme WILL NOT upgrade swizzled components. This means upgrading the theme could break the search bare. Therefore whenever you upgrade the theme, make sure to delete the old swizzleed SearchBar component at src/theme/SearchBar and swizzle it again using this command:

```
npm run swizzle docusaurus-lunr-search SearchBar -- --eject --danger
```
See the documentation for the above command and the plugin at its github repo [here](https://github.com/praveenn77/docusaurus-lunr-search).


## Bumping Version

Don't forget to find and replace the version number for the whole of the docs folder. 

## API Reference 

The OpenAPI reference docs are compiled at build time from the OpenAPI yaml files in the `/openapi` directory using the [redocusaurus plugin](https://www.npmjs.com/package/redocusaurus) for Docusaurus. They must be manually updated to stay up to date with the [OpenAPI specs in the Bee repo](https://github.com/ethersphere/bee/tree/master/openapi).