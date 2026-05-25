// Fetch Awesome Swarm README and emit a doc under docs/references.
// Result: docs/references/awesome-list.mdx (visible to Docs plugin + sidebars)

import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/ethersphere/awesome-swarm/refs/heads/master/README.md';

const OUT_PATH = resolve(process.cwd(), 'docs/references/awesome-list.mdx');

const REPO_HTTP_BASE = 'https://github.com/ethersphere/awesome-swarm/blob/master/';
const RAW_HTTP_BASE  = 'https://raw.githubusercontent.com/ethersphere/awesome-swarm/master/';

function normalizeNewlines(str: string): string {
  return str.replace(/\r\n/g, '\n');
}

function rewriteRelativeLinks(md: string): string {
  md = md.replace(
    /!\[([^\]]*)\]\((?!https?:|#|mailto:)([^)]+)\)/g,
    (_m, alt: string, p: string) => `![${alt}](${RAW_HTTP_BASE}${p})`
  );
  md = md.replace(
    /\[([^\]]+)\]\((?!https?:|#|mailto:)([^)]+)\)/g,
    (_m, text: string, p: string) => `[${text}](${REPO_HTTP_BASE}${p})`
  );
  return md;
}

async function main(): Promise<void> {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  let md = normalizeNewlines(await res.text());

  md = md.replace(/^# .*\n+/, '');
  md = rewriteRelativeLinks(md);

  const header = `---
title: Awesome Swarm
sidebar_label: Awesome Swarm
description: Curated list of community resources tools and projects related to Swarm.
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
