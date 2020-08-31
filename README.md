# Website

Documentation for the Swarm Bee Client built using [Docusaurus 2](https://v2.docusaurus.io/).

### Installation

```
$ npm i
```

### Local Development

```
$ npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.


## How to generate / include the API reference html

**NOTE: when this is done, the docs will have to be rebuilt.**

1. Get the OpenAPI YAML source files from which the documentation is generated. They can be found in the [openapi folder of bee repo](https://github.com/ethersphere/bee/tree/master/openapi).
2. Generate the `index.html` file for the API docs via : `npx redoc-cli bundle Swarm.yaml -o ./SwarmAPIRedoc/index.html --disableGoogleFont --options.expandDefaultServerVariables "true"`
3. Generate the `index.html` file for the Debug API via: `npx redoc-cli bundle SwarmDebug.yaml -o ./SwarmDebugAPIRedoc/index.html --disableGoogleFont --options.expandDefaultServerVariables "true"`
4. Put the generated files into appropriate subfolders (`/bee-docs/API` and `/bee-docs/API-reference`)
5. Upload the files also to Bee / Swarm network and get their hashes.
6. Replace the reference to the hashes in the URLs in the `/bee-docs/API-reference/index.md`.
7. Rebuild and redeploy docs.

1. [Install Hugo Extended version](https://gohugo.io/getting-started/installing/)
2. clone this repo
3. run `hugo serve` in root folder of project
4. see output for which port to point browser at (probably `http://localhost:1313`)

## Where are the docs published to?
- https://docs.ethswarm.org/bee-docs/introduction.html
- https://swarm-gateways.net/bzz:/docs.swarm.eth/bee-docs/installation.html
