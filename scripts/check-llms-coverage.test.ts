import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { walkFind } from './check-llms-coverage.ts';

// ---------------------------------------------------------------------------
// walkFind
// ---------------------------------------------------------------------------

test('walkFind returns empty array when no matching file exists', () => {
  const dir = join(tmpdir(), `wf-test-${Date.now()}-1`);
  mkdirSync(join(dir, 'sub'), { recursive: true });
  try {
    assert.deepEqual(walkFind(dir, 'index.html'), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('walkFind finds a file in the root directory', () => {
  const dir = join(tmpdir(), `wf-test-${Date.now()}-2`);
  mkdirSync(dir, { recursive: true });
  const target = join(dir, 'index.html');
  writeFileSync(target, '');
  try {
    assert.deepEqual(walkFind(dir, 'index.html'), [target]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('walkFind finds files recursively in nested directories', () => {
  const dir  = join(tmpdir(), `wf-test-${Date.now()}-3`);
  const deep = join(dir, 'a', 'b', 'c');
  mkdirSync(deep, { recursive: true });
  const f1 = join(dir, 'index.html');
  const f2 = join(dir, 'a', 'index.html');
  const f3 = join(deep, 'index.html');
  writeFileSync(f1, '');
  writeFileSync(f2, '');
  writeFileSync(f3, '');
  writeFileSync(join(dir, 'a', 'b', 'other.html'), '');
  try {
    assert.deepEqual(walkFind(dir, 'index.html').sort(), [f1, f2, f3].sort());
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('walkFind does not return non-matching files', () => {
  const dir = join(tmpdir(), `wf-test-${Date.now()}-4`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'other.html'), '');
  try {
    assert.deepEqual(walkFind(dir, 'index.html'), []);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Regex: BASE_URL path extraction (mirrors the logic in the script)
// ---------------------------------------------------------------------------

const BASE_URL = 'https://docs.ethswarm.org/docs/';
const escaped  = BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re       = new RegExp(`${escaped}([^)\\s]+)`, 'g');

function extractPaths(content: string): string[] {
  return [...content.matchAll(re)].map((m) => m[1]);
}

test('regex extracts a single path segment', () => {
  const content = `[doc](https://docs.ethswarm.org/docs/installation/quick-start)`;
  assert.deepEqual(extractPaths(content), ['installation/quick-start']);
});

test('regex extracts multiple path segments', () => {
  const content = [
    `[a](https://docs.ethswarm.org/docs/bee/installation/quick-start)`,
    `[b](https://docs.ethswarm.org/docs/references/awesome-list)`,
  ].join('\n');
  assert.deepEqual(extractPaths(content), [
    'bee/installation/quick-start',
    'references/awesome-list',
  ]);
});

test('regex ignores URLs that do not match BASE_URL', () => {
  assert.deepEqual(extractPaths('[x](https://example.com/docs/something)'), []);
});

test('regex stops at closing paren', () => {
  assert.deepEqual(
    extractPaths('(https://docs.ethswarm.org/docs/node-operators/light-node)'),
    ['node-operators/light-node'],
  );
});

test('regex stops at whitespace', () => {
  assert.deepEqual(
    extractPaths('https://docs.ethswarm.org/docs/node-operators/light-node extra'),
    ['node-operators/light-node'],
  );
});

// ---------------------------------------------------------------------------
// Stale / missing logic (pure set operations — extracted from script body)
// ---------------------------------------------------------------------------

function computeWarnings(
  llmsPaths: Set<string>,
  buildPaths: Set<string>,
): { stale: string[]; missing: string[] } {
  const stale: string[] = [];
  const missing: string[] = [];
  for (const p of llmsPaths) if (!buildPaths.has(p)) stale.push(p);
  for (const p of buildPaths) if (!llmsPaths.has(p)) missing.push(p);
  return { stale, missing };
}

test('no warnings when both sets are identical', () => {
  const paths = new Set(['installation/quick-start', 'bee/overview']);
  const { stale, missing } = computeWarnings(paths, paths);
  assert.deepEqual(stale, []);
  assert.deepEqual(missing, []);
});

test('detects stale entries (in llms but not in build)', () => {
  const { stale, missing } = computeWarnings(
    new Set(['installation/quick-start', 'old-page']),
    new Set(['installation/quick-start']),
  );
  assert.deepEqual(stale, ['old-page']);
  assert.deepEqual(missing, []);
});

test('detects missing entries (in build but not in llms)', () => {
  const { stale, missing } = computeWarnings(
    new Set(['installation/quick-start']),
    new Set(['installation/quick-start', 'new-page']),
  );
  assert.deepEqual(stale, []);
  assert.deepEqual(missing, ['new-page']);
});

test('detects both stale and missing entries simultaneously', () => {
  const { stale, missing } = computeWarnings(
    new Set(['a', 'b', 'stale']),
    new Set(['a', 'b', 'new']),
  );
  assert.deepEqual(stale, ['stale']);
  assert.deepEqual(missing, ['new']);
});

test('empty sets produce no warnings', () => {
  const { stale, missing } = computeWarnings(new Set(), new Set());
  assert.deepEqual(stale, []);
  assert.deepEqual(missing, []);
});
