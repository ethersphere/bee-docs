import { test } from 'node:test';
import assert from 'node:assert/strict';

import { normalizeNewlines, rewriteRelativeLinks } from './fetch-awesome-swarm.ts';

const REPO_HTTP_BASE = 'https://github.com/ethersphere/awesome-swarm/blob/master/';
const RAW_HTTP_BASE  = 'https://raw.githubusercontent.com/ethersphere/awesome-swarm/master/';

// ---------------------------------------------------------------------------
// normalizeNewlines
// ---------------------------------------------------------------------------

test('normalizeNewlines converts \\r\\n to \\n', () => {
  assert.equal(normalizeNewlines('line1\r\nline2'), 'line1\nline2');
});

test('normalizeNewlines converts multiple \\r\\n sequences', () => {
  assert.equal(normalizeNewlines('a\r\nb\r\nc'), 'a\nb\nc');
});

test('normalizeNewlines leaves plain \\n unchanged', () => {
  assert.equal(normalizeNewlines('a\nb\nc'), 'a\nb\nc');
});

test('normalizeNewlines leaves strings without newlines unchanged', () => {
  assert.equal(normalizeNewlines('no newlines here'), 'no newlines here');
});

test('normalizeNewlines handles empty string', () => {
  assert.equal(normalizeNewlines(''), '');
});

// ---------------------------------------------------------------------------
// rewriteRelativeLinks — image links
// ---------------------------------------------------------------------------

test('rewrites a relative image link with RAW_HTTP_BASE', () => {
  const input    = '![alt text](images/logo.png)';
  const expected = `![alt text](${RAW_HTTP_BASE}images/logo.png)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('rewrites a relative image link with empty alt text', () => {
  const input    = '![](images/logo.png)';
  const expected = `![](${RAW_HTTP_BASE}images/logo.png)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('does not rewrite an absolute https image link', () => {
  const input = '![logo](https://example.com/logo.png)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite an http image link', () => {
  const input = '![logo](http://example.com/logo.png)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite an anchor image link (#)', () => {
  const input = '![icon](#section)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite a mailto image link', () => {
  const input = '![email](mailto:foo@bar.com)';
  assert.equal(rewriteRelativeLinks(input), input);
});

// ---------------------------------------------------------------------------
// rewriteRelativeLinks — text links
// ---------------------------------------------------------------------------

test('rewrites a relative text link with REPO_HTTP_BASE', () => {
  const input    = '[some doc](docs/readme.md)';
  const expected = `[some doc](${REPO_HTTP_BASE}docs/readme.md)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('rewrites a relative root-relative text link', () => {
  const input    = '[file](CONTRIBUTING.md)';
  const expected = `[file](${REPO_HTTP_BASE}CONTRIBUTING.md)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('does not rewrite an absolute https text link', () => {
  const input = '[external](https://example.com/page)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite an http text link', () => {
  const input = '[external](http://example.com/page)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite an anchor text link (#)', () => {
  const input = '[section](#overview)';
  assert.equal(rewriteRelativeLinks(input), input);
});

test('does not rewrite a mailto text link', () => {
  const input = '[contact](mailto:foo@bar.com)';
  assert.equal(rewriteRelativeLinks(input), input);
});

// ---------------------------------------------------------------------------
// rewriteRelativeLinks — mixed content
// ---------------------------------------------------------------------------

test('rewrites image link but not absolute text link in same string', () => {
  const input = '![img](assets/pic.png) and [ext](https://example.com)';
  const expected = `![img](${RAW_HTTP_BASE}assets/pic.png) and [ext](https://example.com)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('rewrites both image and text relative links in same string', () => {
  const input    = '![img](assets/pic.png) [doc](docs/guide.md)';
  const expected = `![img](${RAW_HTTP_BASE}assets/pic.png) [doc](${REPO_HTTP_BASE}docs/guide.md)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});

test('image link takes precedence over text link pattern (! prefix)', () => {
  // Ensures the image regex fires first and the result is RAW not REPO
  const input    = '![logo](logo.svg)';
  const expected = `![logo](${RAW_HTTP_BASE}logo.svg)`;
  assert.equal(rewriteRelativeLinks(input), expected);
});
