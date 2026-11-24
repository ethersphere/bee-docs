// Bundle openapi/Swarm.yaml into a single self-contained static/openapi.yaml —
// the file agents fetch from https://docs.ethswarm.org/openapi.yaml.
//
// Swarm.yaml keeps its schemas, parameters, headers and responses in a sibling
// file (SwarmCommon.yaml) and references it with relative $refs. A plain copy of
// Swarm.yaml publishes those refs dangling. Bundling pulls every external
// component into the document's own `components` and rewrites the refs as
// internal `#/components/...` pointers, so the published spec needs no sibling
// file and works with clients that only fetch one URL.
//
// Uses the same bundler (@redocly/openapi-core) that redocusaurus uses to build
// the /api/ page, so both outputs come from the same resolution logic.
//
// Exits 1 if bundling reports an error, so a broken spec never ships.

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle, loadConfig, stringifyYaml } from '@redocly/openapi-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'openapi', 'Swarm.yaml');
const OUTPUT = join(ROOT, 'static', 'openapi.yaml');

const { bundle: doc, problems } = await bundle({
  ref: SOURCE,
  config: await loadConfig(),
});

const errors = problems.filter((p) => p.severity === 'error');
if (errors.length) {
  console.error(`✗ Bundling ${SOURCE} failed with ${errors.length} error(s):\n`);
  for (const e of errors) {
    const where = e.location?.[0]?.pointer ?? '';
    console.error(`   ${e.message}${where ? `  (at ${where})` : ''}`);
  }
  process.exit(1);
}

writeFileSync(OUTPUT, stringifyYaml(doc.parsed));
console.log(`✓ Bundled openapi/Swarm.yaml → static/openapi.yaml`);
