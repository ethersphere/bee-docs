# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role

You are an experienced documentation expert. Take care to write accurate, precise, complete yet concise documentation. You are especially proud of the correctness and usefulness of the API documentation.

## Project Overview

This is the **Swarm documentation website** (docs.ethswarm.org), built with **Docusaurus 3.9.x**. It documents the Bee client (Go implementation of the Swarm protocol) and the broader Swarm ecosystem.

## Commands

- `npm ci` — Install dependencies (preferred over `npm install`)
- `npm start` — Start local dev server with hot reload
- `npm run build` — Production build (runs `prebuild` script first to fetch external content, then generates static site in `/build`)
- `npm run serve` — Serve the built static site locally

There are no test or lint commands. The build process validates markdown links and routes (broken links produce warnings, duplicate routes produce errors).

## Architecture

**Content** lives in `docs/` as Markdown/MDX files organized into five sections:
- `concepts/` — Theoretical documentation (DISC storage, incentives, PSS, access control)
- `bee/` — Bee client guides (installation, working with Bee)
- `develop/` — Developer guides (tools, features, contributing)
- `desktop/` — Desktop app documentation
- `references/` — Glossary, tokens, community, FAQ

**Navigation** is defined in `sidebars.js`. The Docusaurus config is `docusaurus.config.mjs`.

**Custom React components** in `src/components/` provide interactive calculators (storage amount/depth, redundancy, volume/duration, parities).

**OpenAPI specs** in `openapi/` (`Swarm.yaml`, `SwarmCommon.yaml`) are rendered via the redocusaurus plugin. These are manually mirrored from the Bee repo and need manual updates.

**Build-time script** `scripts/fetch-awesome-swarm.mjs` fetches the awesome-swarm README from GitHub during `prebuild` and writes it to `docs/references/awesome-list.mdx` (auto-generated, gitignored).

**Theme customization**: The SearchBar component is swizzled from the lunr-search plugin (`src/theme/SearchBar/`). Must be re-swizzled after Docusaurus theme upgrades.

**Search**: Algolia (primary) with lunr as local fallback.

**Math/diagrams**: KaTeX for math rendering, Mermaid for diagrams.

## Deployment

CI runs on GitHub Actions. Pushes/PRs to `master` trigger a build check (`build.yaml`). Version tags (`v*.*.*`) trigger deployment to GitHub Pages (`gh-pages.yaml`).

## Important Rules

- **Never mention Claude** in any commit messages, issue titles, issue bodies, branch names, or any other visible output. Do not reference AI assistance.
- **Always use the `crtahlin` fork/repo** for creating issues, branches, and all GitHub operations — never the upstream `ethersphere` repo.

## Conventions

- **Node 20+** required (see `.nvmrc`), npm >= 9.6.0
- Use `npm ci` by default; only commit `package-lock.json` changes when intentional
- Wrap long lines in markdown with newlines to reduce merge conflicts
- Avoid unnecessary formatting changes in PRs (e.g., re-indentation unrelated to the fix)
- Terminology: `Swarm` (capital) = the project/network; `swarm` (lowercase) = network of bee nodes; `Bee` (capital) = the Go client; `bee` (lowercase) = any worker/client implementation
