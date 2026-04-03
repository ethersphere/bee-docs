// Validate static/llms.txt against the actual docs directory.
// Reports stale links (URLs pointing to non-existent pages) and
// missing coverage (doc pages not listed in llms.txt).
// Exits 0 — warnings only, does not block the build.

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const LLMS_TXT = join(ROOT, 'static', 'llms.txt');
const BASE_URL = 'https://docs.ethswarm.org/docs/';

/** Recursively find all .md/.mdx files under `dir`. */
function findDocFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findDocFiles(full));
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Read the frontmatter `id` from a doc file (returns null if absent). */
function getFrontmatterId(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const id = fm[1].match(/^id:\s*(.+)$/m);
  return id ? id[1].trim() : null;
}

/**
 * Compute the URL path segment for a doc file.
 * e.g. docs/bee/installation/shell-script.md  with id "shell-script-install"
 *   → "bee/installation/shell-script-install"
 *
 * When a file's basename matches its parent directory (case-insensitive),
 * Docusaurus treats it as a category index and serves it at the directory
 * URL (with trailing slash).  e.g. DISC/DISC.mdx → "concepts/DISC/"
 */
function getUrlPath(filePath) {
  const relDir = relative(DOCS_DIR, dirname(filePath));
  const id = getFrontmatterId(filePath) || basename(filePath, extname(filePath));
  const dirName = basename(dirname(filePath));
  const fileName = basename(filePath, extname(filePath));

  // Category index: file name matches parent directory (case-insensitive)
  if (dirName.toLowerCase() === fileName.toLowerCase()) {
    return `${relDir}/`;
  }

  return relDir ? `${relDir}/${id}` : id;
}

/** Extract all docs.ethswarm.org/docs/... paths from llms.txt. */
function extractDocPaths(file) {
  const content = readFileSync(file, 'utf-8');
  const escaped = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escaped}([^)\\s]+)`, 'g');
  const paths = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    paths.push(m[1]);
  }
  return paths;
}

// ── Main ────────────────────────────────────────────────────────────

const docFiles = findDocFiles(DOCS_DIR);
const docPathSet = new Set(docFiles.map(getUrlPath));

const llmsPaths = extractDocPaths(LLMS_TXT);
const llmsPathSet = new Set(llmsPaths);

let warnings = 0;

// 1. Stale links — URL in llms.txt but no matching doc file
for (const p of llmsPaths) {
  if (!docPathSet.has(p)) {
    console.warn(`  ⚠  Stale link in llms.txt: ${BASE_URL}${p}`);
    warnings++;
  }
}

// 2. Missing coverage — doc file exists but not in llms.txt
for (const p of docPathSet) {
  if (!llmsPathSet.has(p)) {
    console.warn(`  ⚠  Missing from llms.txt: ${BASE_URL}${p}`);
    warnings++;
  }
}

if (warnings > 0) {
  console.log(`llms.txt validation: ${warnings} warning(s)`);
} else {
  console.log('llms.txt validation: all links verified, full coverage ✓');
}
