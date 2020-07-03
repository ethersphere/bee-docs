# Swarm Bee technical docs

This repository holds the content of the Bee documentation, hosted at:

- https://swarm-gateways.net/bzz:/docs.swarm.eth/
- https://docs.ethswarm.org/

The deployment happens automatically with commits on `master` branch.


## How to render the docs locally?

1. [Install Hugo Extended version](https://gohugo.io/getting-started/installing/).
2. Clone this repo.
3. Run `hugo serve` in root folder of project.
4. See output for which port to point browser at (probably `http://localhost:1313`).

## How to build the docs as static website?

Same process as for rendering the docs, only you run: `hugo` . The site will be put into `public` folder.

**NOTE: might be good practice to delete the `public` folder before, so no old files are left.**


## How to generate / include the API reference html

**NOTE: when this is done, the docs will have to be rebuilt.**

1. Get the OpenAPI YAML source files from which the documentation is generated. They can be found in the [openapi folder of bee repo](https://github.com/ethersphere/bee/tree/master/openapi).
2. Generate the `index.html` file for the API docs via : `npx redoc-cli bundle Swarm.yaml -o ./SwarmAPIRedoc/index.html --disableGoogleFont --options.expandDefaultServerVariables "true"`
3. Generate the `index.html` file for the Debug API via: `npx redoc-cli bundle SwarmDebug.yaml -o ./SwarmDebugAPIRedoc/index.html --disableGoogleFont --options.expandDefaultServerVariables "true"`
4. Put the generated files into appropriate subfolders (`/bee-docs/API` and `/bee-docs/API-reference`)
5. Upload the files also to Bee / Swarm network and get their hashes.
6. Replace the reference to the hashes in the URLs in the `/bee-docs/API-reference/index.md`.
7. Rebuild and redeploy docs.


## How to contribute?

1. Branch, change, request pull.
2. Speak your mind on [Beehive #documentation channel](https://beehive.ethswarm.org/swarm/channels/documentation).
