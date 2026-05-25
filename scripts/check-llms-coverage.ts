// Post-build: validate static/llms.txt coverage against the actual build output.
// Uses build/docs/**/index.html as ground truth — avoids file-path/slug inference.
// Reports stale links and missing coverage. Exits 0 (warnings only, does not block).

import { readFileSync, existsSync, readdirSync, Dirent } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const BUILD_DIR = join(ROOT, 'build');
const LLMS_TXT  = join(ROOT, 'static', 'llms.txt');
const BASE_URL  = 'https://docs.ethswarm.org/docs/';

if (!existsSync(BUILD_DIR)) {
  console.error('check-llms-coverage: build/ not found — run `npm run build` first.');
  process.exit(1);
}

if (!existsSync(LLMS_TXT)) {
  console.error('check-llms-coverage: static/llms.txt not found.');
  process.exit(1);
}

function walkFind(dir: string, name: string, results: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true }) as Dirent[]) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFind(full, name, results);
    } else if (entry.name === name) {
      results.push(full);
    }
  }
  return results;
}

const buildPaths = new Set<string>();
for (const htmlFile of walkFind(BUILD_DIR, 'index.html')) {
  const dir     = dirname(htmlFile);
  const rel     = relative(BUILD_DIR, dir).replace(/\\/g, '/');
  if (!rel.startsWith('docs/')) continue;
  const docPath = rel.slice('docs/'.length);
  if (!docPath || docPath.startsWith('api/')) continue;
  buildPaths.add(docPath);
}

const escaped  = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re       = new RegExp(`${escaped}([^)\\s]+)`, 'g');
const content  = readFileSync(LLMS_TXT, 'utf-8');
const llmsPaths = new Set<string>();
for (const m of content.matchAll(re)) {
  llmsPaths.add(m[1]);
}

let warnings = 0;

for (const p of llmsPaths) {
  if (!buildPaths.has(p)) {
    console.warn(`  ⚠  Stale link in llms.txt: ${BASE_URL}${p}`);
    warnings++;
  }
}

for (const p of buildPaths) {
  if (!llmsPaths.has(p)) {
    console.warn(`  ⚠  Missing from llms.txt: ${BASE_URL}${p}`);
    warnings++;
  }
}

if (warnings > 0) {
  console.log(`llms.txt coverage: ${warnings} warning(s)`);
} else {
  console.log('llms.txt coverage: all links verified, full coverage ✓');
}
