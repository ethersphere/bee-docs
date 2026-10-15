// Validate the OpenAPI spec published to static/ — the file agents actually fetch
// from https://docs.ethswarm.org/openapi.yaml.
//
// Why this exists: Swarm.yaml keeps every schema, parameter, header and response
// in a sibling file (SwarmCommon.yaml) and references it with relative $refs. The
// Redoc page at /api/ dereferences those at build time from the openapi/ directory,
// so it renders correctly even when the *published* file cannot be dereferenced at
// all. That failure is invisible over HTTP — the spec still returns 200 — so only a
// build-time check catches it.
//
// Exits 1 on an unresolvable $ref. Unlike validate-llms-txt.mjs this blocks the
// build, because a spec that no OpenAPI client can dereference is broken output,
// not a documentation warning.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SPEC = join(ROOT, 'static', 'openapi.yaml');

const docCache = new Map();

/** Load and parse a YAML document, memoised by absolute path. */
function loadDoc(absPath) {
  if (!docCache.has(absPath)) {
    if (!existsSync(absPath)) {
      docCache.set(absPath, null);
    } else {
      docCache.set(absPath, parse(readFileSync(absPath, 'utf8')));
    }
  }
  return docCache.get(absPath);
}

/** Walk a JSON Pointer (RFC 6901) into a parsed document. */
function resolvePointer(doc, pointer) {
  let node = doc;
  for (const rawPart of pointer.replace(/^#\/?/, '').split('/')) {
    if (rawPart === '') continue;
    const part = rawPart.replace(/~1/g, '/').replace(/~0/g, '~');
    if (node && typeof node === 'object' && part in node) {
      node = node[part];
    } else {
      return undefined;
    }
  }
  return node;
}

/** Collect every $ref value in a document, with the path where it was found. */
function collectRefs(node, trail = '', found = []) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectRefs(item, `${trail}/${i}`, found));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string') {
        found.push({ ref: value, at: trail || '/' });
      } else {
        collectRefs(value, `${trail}/${key}`, found);
      }
    }
  }
  return found;
}

if (!existsSync(SPEC)) {
  console.error(`✗ ${SPEC} not found — the prebuild copy step did not run.`);
  process.exit(1);
}

const spec = loadDoc(SPEC);
const refs = collectRefs(spec);
const failures = [];
const externalFiles = new Set();

for (const { ref, at } of refs) {
  const [filePart, pointer = ''] = ref.split('#');
  // A ref with no file part is internal to this document.
  const targetPath = filePart ? resolvePath(dirname(SPEC), filePart) : SPEC;
  if (filePart) externalFiles.add(filePart);

  const targetDoc = loadDoc(targetPath);
  if (targetDoc === null) {
    failures.push(`${ref}  (referenced at ${at}) — file not published alongside the spec`);
    continue;
  }
  if (pointer && resolvePointer(targetDoc, pointer) === undefined) {
    failures.push(`${ref}  (referenced at ${at}) — pointer does not resolve`);
  }
}

const distinct = new Set(refs.map((r) => r.ref));
console.log(
  `OpenAPI spec check: ${refs.length} $refs (${distinct.size} distinct) across ` +
    `${externalFiles.size} external file(s): ${[...externalFiles].join(', ') || 'none'}`
);

if (failures.length) {
  const unique = [...new Set(failures)];
  console.error(`\n✗ ${failures.length} unresolvable $ref(s), ${unique.length} distinct:\n`);
  for (const f of unique.slice(0, 20)) console.error(`   ${f}`);
  if (unique.length > 20) console.error(`   … and ${unique.length - 20} more`);
  console.error(
    `\nEvery file referenced by static/openapi.yaml must be copied into static/ ` +
      `by the prebuild step, or the published spec cannot be dereferenced.`
  );
  process.exit(1);
}

console.log('✓ All $refs resolve in the published spec.');
