import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/ethersphere/awesome-swarm/refs/heads/master/README.md';

// We will generate the actual page file (single route, no imports)
const OUT_PATH = resolve(process.cwd(), 'src/pages/awesome-swarm.mdx');

// Matches the line like: [.. DeepWiki ..](...) - ...
const deepWikiLine = /^\[[^\]]*DeepWiki[^\]]*\]\([^)]+\)\s*-\s*.*$/im;

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  let md = (await res.text()).replace(/\r\n/g, '\n');

  // Optionally strip upstream H1 to avoid duplicate title
  // md = md.replace(/^# .*\n+/, '');

  // Build the full MDX page. We’ll inject the JSX admonition after the DeepWiki entry if found.
  const header = `---
title: Awesome Swarm
id: awesome-list
---

*Contribute to the Awesome Swarm list on [GitHub](https://github.com/ethersphere/awesome-swarm).*

import Admonition from '@theme/Admonition';
`;

  const admonition = `
<Admonition type="caution">
As with all LLMs, DeepWiki may sometimes be confidently wrong. Make sure to always double check (either by inspecting the code yourself, or confirming with a Bee team core developer) before assuming its answers are correct.
</Admonition>
`;

  let body;
  if (deepWikiLine.test(md)) {
    body = md.replace(deepWikiLine, (match) => `${match}\n\n${admonition}`);
  } else {
    // Fallback: put admonition near top (after the header)
    body = `${admonition}\n${md}`;
  }

  const page = `${header}\n${body}\n`;

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, page, 'utf8');
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
