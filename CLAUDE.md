# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Documentation website for the [Swarm Bee client](https://github.com/ethersphere/bee), built with **Docusaurus 3** and deployed at [docs.ethswarm.org](https://docs.ethswarm.org). Content lives in `docs/` as Markdown/MDX; everything else is site config, build tooling, and a few React components.

## Commands

```bash
npm ci                 # install exact deps (preferred over npm install)
npm start              # local dev server with live reload
npm run build          # production build into build/ (runs prebuild first)
npm run build:quiet    # build with noisy Node deprecation warnings suppressed
npm run serve          # serve a built site locally

npm run check:links    # check links against an existing local build
npm run build:check    # build + check links in one step
```

Link checker flags pass through after `--`:

```bash
npm run check:links -- --mode local --no-external --threads 16
npm run check:links -- --mode live --site-domain docs.ethswarm.org
```

Node >=20, npm >=9.6 (see `.nvmrc` / `package.json` engines).

There is **no test suite and no linter** — validation is the build, the `llms.txt` validator (runs in `prebuild`), and the link checker.

## Build pipeline gotchas

The `prebuild` npm hook runs automatically before `build` and does three things, in order:
1. Copies `openapi/Swarm.yaml` → `static/openapi.yaml`.
2. `scripts/fetch-awesome-swarm.mjs` — fetches external content at build time.
3. `scripts/validate-llms-txt.mjs` — validates `static/llms.txt` coverage (informational, **always exit 0**, never blocks the build).

`onBrokenLinks: 'warn'` — broken internal links warn rather than fail the build. Use the link checker to catch them.

## Architecture / where things live

- **`docs/`** — all documentation content, grouped into top-level sections: `bee/`, `concepts/`, `desktop/`, `develop/`, `references/`. Page ordering and the sidebar tree are defined manually in **`sidebars.js`** (not auto-generated) — adding a doc file requires adding it to `sidebars.js`.
- **`docusaurus.config.mjs`** — single source of site config: plugins, presets, redirects (`@docusaurus/plugin-client-redirects`), the OpenAPI integration (`redocusaurus`), and three `docusaurus-plugin-llms` slice configs (`llms-api.txt`, `llms-node-ops.txt`, etc.).
- **`openapi/`** — `Swarm.yaml` + `SwarmCommon.yaml`. The API reference page is compiled from these at build time via redocusaurus. These are **manually kept in sync** with the [OpenAPI specs in the Bee repo](https://github.com/ethersphere/bee/tree/master/openapi) — they do not auto-update.
- **`src/components/`** — interactive calculators embedded in docs via MDX (e.g. `AmountAndDepthCalc.js`, `RedundancyCalc.js`, `VolumeAndDurationCalc.js`). `src/config/globalVariables.js` holds shared constants.
- **`src/theme/SearchBar/`** — a **swizzled** component (ejected from the theme). See the README: upgrading the Docusaurus theme does NOT upgrade swizzled components and can break search; re-swizzle after theme upgrades.
- **`scripts/`** — TypeScript (`tsx`, no separate install) build/CI helpers: link checkers (`check_links.ts`, `check_live_links.ts`) and the build-time `.mjs` scripts above.

## llms.txt (AI-agent docs)

- `static/llms.txt` — **hand-curated** index of every doc page, one line each. Edit by hand when pages are added/renamed/deleted.
- `/llms-full.txt` and the sliced variants — **auto-generated** at build time; do not hand-edit.
- When the prebuild validator warns about a stale link or missing coverage, fix `static/llms.txt` (update the path or add a `- [Title](url): description` line in the right section). A few navigation-only landing pages are intentionally excluded — those warnings are expected.

## Content conventions (from CODING.md)

- **Wrap long lines** with newlines — keeps git diffs small and reduces merge conflicts.
- **Minimize unrelated edits** (e.g. don't reflow a whole paragraph to fix one typo) for the same reason.
- **`Swarm` vs `swarm`**: capital `Swarm` = the project / main network; lowercase `swarm` = a swarm of bee nodes (Bee supports running multiple). Capital `Bee` = the Go client; lowercase `bee` = any Swarm-protocol client.
- **Version bumps**: find-and-replace the version number across the whole `docs/` folder.
