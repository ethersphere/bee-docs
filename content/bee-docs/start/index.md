---
title: 'Starting your node'
weight: 3
summary: "How to start and configure your node."
alias: "/bee-docs/start.html"
---

The Bee node binary (see [Installation](/bee-docs/installation.html) on how to download this) is used to start and configure your Bee node *before* it starts. If you want to interact with you Bee node after it is started, you can use the HTTP APIs (see sections [API](/bee-docs/API-reference.html).

## Getting help
The CLI has documentation build-in. Running `bee` gives you an entry point to the documentation. Running `bee start -h` or `bee start --help` will tell you how you can configure you bee node via the command line arguments.

## Start a bee node
Run `bee start`. This command starts your bee node with all configuration parameters on their default value.

## Configuring your bee node
Bee can be configured with:

* command line arguments;
* environment variables;
* a configuration file.

The order of precedence is from command line arguments (most important) to the configuration file (least important)

### Command line arguments
You can pass several command-line arguments to the bee node upon startup. Run `bee-start -h` to get a list of available command line arguments.

### Environment variables
Environment variables are set as variables in your operating systems session. To set an environment variable, type

`export VARIABLE_NAME=variableValue`

in your command line.

Verify if it is correctly set by running `echo $VARIABLE_NAME`.

All available command-line flags (run `bee start -h`) are available as environment variables too, but their names are slightly different. To go from command-line flags to environment variable:

- remove `--` prefix from the flag name,
- capitalize all characters in the command-line name,
- replace all `-` characters with `_`,
- prepend `BEE_` prefix to the resulted string.

Hence, the flag `--api-addr` becomes `BEE_API_ADDR` and it can be set in your environment by running `BEE_API_ADDR=:8081`.

### Configuration file
Bee can be configured by means of a configuration file. The encoding of Bee's configuration file is [YAML](https://yaml.org/).

To make use of a configuration file, create a YAML file (template provided below), save it and start with with the `--config` flag, pointing to your file. For example:

`bee start --config ~/bee-config.yaml `

#### Config file template
This configuration file template, with arguments at their default value is provided here for your convenience. Note that the most-recent release of Bee might have different configuration options than the one provided here. Please verify this before using the template.

{{< content "/bee-docs/start/config-yaml-template.md" >}}
