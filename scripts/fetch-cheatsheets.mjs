// Mirror the Swarm cheatsheet(s) from the swarm-cheatsheets repo into static/,
// so they are served from our own domain (docs.ethswarm.org/cheatsheets/…) and
// embedded in a doc page via <iframe>. The swarm-cheatsheets repo stays the
// single source of truth; this fetches a fresh copy on every build.
//
// Layout served (mirrors the repo's own scripts/site.sh, but with a shared
// asset dir one level up so cheatsheets don't each duplicate the fonts):
//   static/cheatsheets/<topic>/index.html   ← page (asset paths rewritten)
//   static/cheatsheets/assets/…             ← fonts, vendor QR lib, logos
//   static/cheatsheets/<name>.pdf           ← Download-button target

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const RAW_BASE =
  'https://raw.githubusercontent.com/ethersphere/swarm-cheatsheets/main/';

const OUT_DIR = resolve(process.cwd(), 'static/cheatsheets');

// Bound each fetch so a stalled CDN connection can't hang the build forever.
const FETCH_TIMEOUT_MS = 20000;

// Shared, binary-safe assets — copied verbatim. Paths are relative to OUT_DIR
// and must match what the rewritten pages point at.
const ASSETS = [
  'assets/favicon.png',
  'assets/swarm-logo.svg',
  'assets/vendor/qrcode.min.js',
  'assets/fonts/fonts.css',
  'assets/fonts/dm-mono-400-latin.woff2',
  'assets/fonts/dm-mono-500-latin.woff2',
  'assets/fonts/dm-sans-400-latin.woff2',
  'assets/fonts/dm-sans-500-latin.woff2',
  'assets/fonts/dm-sans-700-latin.woff2',
  'assets/fonts/space-grotesk-500-latin.woff2',
  'assets/fonts/space-grotesk-600-latin.woff2',
  'assets/fonts/space-grotesk-700-latin.woff2',
];

function rewriteAssetPaths(html) {
  // Match the repo's site.sh rewrite, adapted to the shared asset dir:
  //   ../../../assets/  → ../assets/   (→ /cheatsheets/assets/…)
  //   ../../../dist/    → ../          (→ /cheatsheets/<name>.pdf)
  return html
    .replace(/\.\.\/\.\.\/\.\.\/assets\//g, '../assets/')
    .replace(/\.\.\/\.\.\/\.\.\/dist\//g, '../');
}

async function fetchOrThrow(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText} — ${url}`);
  return res;
}

async function writeOut(relPath, data) {
  const out = resolve(OUT_DIR, relPath);
  await writeFile(out, data);
  console.log(`Wrote ${out}`);
}

// Everything to mirror, as {src, dest, transform?}. `transform` (text pages
// only) rewrites asset paths; without it the file is copied verbatim
// (binary-safe). Adding a future cheatsheet is a one-line addition here.
const FILES = [
  // The card-only document (chrome/toolbar/footer live in the source's
  // index.html and are intentionally excluded — we embed just the cheatsheet).
  { src: 'src/cheatsheets/overview/cheatsheet.html', dest: 'overview/index.html', transform: rewriteAssetPaths },
  ...ASSETS.map((rel) => ({ src: rel, dest: rel })),
  // Not referenced by the card; kept so the doc page can offer a download link.
  { src: 'dist/swarm-overview-cheatsheet.pdf', dest: 'swarm-overview-cheatsheet.pdf' },
];

async function mirror({ src, dest, transform }) {
  const res = await fetchOrThrow(RAW_BASE + src);
  const data = transform ? transform(await res.text()) : Buffer.from(await res.arrayBuffer());
  await writeOut(dest, data);
}

async function main() {
  // Start clean so files dropped from the manifest (or renamed upstream) don't
  // linger and get served — mirrors the source repo's site.sh `rm -rf $OUT`.
  await rm(OUT_DIR, { recursive: true, force: true });

  // Pre-create the unique target dirs once (sequentially, so nested dirs don't
  // race on a shared ancestor), so the concurrent writes below never mkdir.
  const dirs = new Set(FILES.map(({ dest }) => dirname(resolve(OUT_DIR, dest))));
  for (const dir of dirs) await mkdir(dir, { recursive: true });

  // Fetch all files concurrently; fail the build if any one fails (matches
  // fetch-awesome-swarm.mjs), but let every fetch finish first so all failures
  // are reported, not just the first.
  const results = await Promise.allSettled(FILES.map(mirror));
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length) {
    for (const { reason } of failed) console.error(reason);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
