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

## Bumping Version

Don't forget to find and replace the version number for the whole of the docs folder. 

## How to generate / include the API reference html

**NOTE: when this is done, the docs will have to be rebuilt.**

1. Get all the OpenAPI YAML source files from the [openapi folder of bee repo](https://github.com/ethersphere/bee/tree/master/openapi).
1. Install [Redocly](https://redocly.com/docs/cli/installation/).
  ```
    npm i -g @redocly/cli@latest
  ```
1. Generate the `index.html` file for API docs: 
 ```
    redocly build-docs Swarm.yaml --theme.openapi.expandDefaultServerVariables=true --disableGoogleFont -o static/api/index.html
  ```
1. Generate the `index.html` file for debug API docs: 
  ```
    redocly build-docs SwarmDebug.yaml --theme.openapi.expandDefaultServerVariables=true --disableGoogleFont -o static/debug-api/index.html
  ```
1. Rebuild and redeploy docs.
