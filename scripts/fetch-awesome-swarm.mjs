// Fetch Awesome Swarm README and emit a doc under docs/references.
// Result: docs/references/awesome-list.mdx (visible to Docs plugin + sidebars)

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/ethersphere/awesome-swarm/refs/heads/master/README.md';

const OUT_PATH = resolve(process.cwd(), 'docs/references/awesome-list.mdx');

const REPO_HTTP_BASE = 'https://github.com/ethersphere/awesome-swarm/blob/master/';
const RAW_HTTP_BASE  = 'https://raw.githubusercontent.com/ethersphere/awesome-swarm/master/';

function normalizeNewlines(str) {
  return str.replace(/\r\n/g, '\n');
}

function rewriteRelativeLinks(md) {
  // Images: ![alt](path) where path is relative
  md = md.replace(
    /!\[([^\]]*)\]\((?!https?:|#|mailto:)([^)]+)\)/g,
    (_m, alt, path) => `![${alt}](${RAW_HTTP_BASE}${path})`
  );
  // Links: [text](path) where path is relative
  md = md.replace(
    /\[([^\]]+)\]\((?!https?:|#|mailto:)([^)]+)\)/g,
    (_m, text, path) => `[${text}](${REPO_HTTP_BASE}${path})`
  );
  return md;
}

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  let md = normalizeNewlines(await res.text());

  // Optional: strip upstream H1 to avoid a second big title under our frontmatter title
  md = md.replace(/^# .*\n+/, '');

  md = rewriteRelativeLinks(md);

  const header = `---
title: Awesome Swarm
sidebar_label: Awesome Swarm
# Do NOT set 'id' here; we want the doc id to be 'references/awesome-list' from the path
---

*Contribute to the Awesome Swarm list on [GitHub](https://github.com/ethersphere/awesome-swarm).*

`;

  const page = `${header}${md}\n`;

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, page, 'utf8');
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
