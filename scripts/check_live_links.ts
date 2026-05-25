#!/usr/bin/env node

/**
 * Live site link checker for Docusaurus sites.
 *
 * Fetches all pages listed in the sitemap, extracts every <a href> link,
 * then checks each link with explicit redirect handling (no auto-following).
 *
 * Usage (standalone):
 *   node check_live_links.js --site-domain your-site.com [--threads N] [--max-pages N]
 *
 * Output:
 *   link-reports/live_links_audit.md
 */

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface FetchResult { code: number | null; finalUrl: string; location: string | null; err: string | null }
interface DestResult { code: number | null; finalUrl: string; err: string | null }
interface CheckResult { url: string; status: string; httpCode: number | null; finalUrl: string | null; errorMsg: string | null }
interface PageLink { url: string; linkText: string }
interface PageSource { page: string; linkText: string }
interface FetchPageResult { links: PageLink[]; err: string | null }

type UrlToSources = Record<string, PageSource[]>;
type FetchResults = Record<string, CheckResult>;
export type ParsedArgs = Record<string, string>;

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

let SITE_BASE   = '';
let SITEMAP_URL = '';

const PROJECT_DIR = process.cwd();
const REPORT_PATH = path.join(PROJECT_DIR, 'link-reports', 'live_links_audit.md');

const EXT_TIMEOUT = 15000;
const EXT_THREADS = 8;
const EXT_DELAY   = 50;

const USER_AGENT = (
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/122.0 Safari/537.36 docusaurus-link-checker/2.0'
);

const IGNORE_SCHEMES       = ['mailto:', 'javascript:', 'tel:', 'ftp:', 'data:', '#'];
const IGNORE_HOSTS         = ['localhost', '127.0.0.1', '192.168.', '10.0.', '0.0.0.0'];
const IGNORE_HOST_SUFFIXES = ['.example', '.local', '.invalid', '.test'];
const IGNORE_URL_PATTERNS  = [
  'github.com/ethersphere/docs.github.io',
];
const IGNORE_EXAMPLE_HOSTS = [
  'yourname.eth.limo',
  'yourname.bzz.link',
  'bee-1',
];

const STATUS_OK       = 'ok';
const STATUS_404      = '404';
const STATUS_DOWN     = 'down';
const STATUS_REDIRECT = 'redirect';
const STATUS_ERROR    = 'error';

// ─────────────────────────────────────────────
// HTTP helpers
// ─────────────────────────────────────────────

function httpFetch(
  rawUrl: string,
  { method = 'HEAD', followRedirects = false, timeout = EXT_TIMEOUT }: {
    method?: string;
    followRedirects?: boolean;
    timeout?: number;
  } = {},
): Promise<FetchResult> {
  return new Promise((resolve) => {
    let parsed: URL;
    try { parsed = new URL(rawUrl); } catch {
      return resolve({ code: null, finalUrl: rawUrl, location: null, err: 'Invalid URL' });
    }

    const isHttps = parsed.protocol === 'https:';
    const mod     = isHttps ? https : http;
    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (isHttps ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method,
      headers:  {
        'User-Agent': USER_AGENT,
        'Accept':     'text/html,application/xhtml+xml,*/*;q=0.8',
      },
      timeout,
    };

    const req = mod.request(options, (res) => {
      res.resume();
      const location = res.headers['location'] ?? null;

      if (followRedirects && res.statusCode! >= 300 && res.statusCode! < 400 && location) {
        const dest = /^https?:\/\//.test(location)
          ? location
          : `${parsed.protocol}//${parsed.host}${location}`;
        return httpFetch(dest, { method, followRedirects: true, timeout }).then(resolve);
      }
      resolve({ code: res.statusCode ?? null, finalUrl: rawUrl, location, err: null });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ code: null, finalUrl: rawUrl, location: null, err: 'Connection timed out' });
    });
    req.on('error', (e) => {
      resolve({ code: null, finalUrl: rawUrl, location: null, err: e.message });
    });
    req.end();
  });
}

function classifyErr(result: CheckResult, err: string): CheckResult {
  const e = err.toLowerCase();
  if (err.includes('ECONNREFUSED') || err.includes('Connection refused')) {
    result.status   = STATUS_DOWN;
    result.errorMsg = 'ECONNREFUSED — server down';
  } else if (err.includes('ENOTFOUND') || err.includes('getaddrinfo') || err.includes('EAI_AGAIN')) {
    result.status   = STATUS_DOWN;
    result.errorMsg = 'DNS resolution failed';
  } else if (e.includes('timed out') || e.includes('timeout')) {
    result.status   = STATUS_DOWN;
    result.errorMsg = 'Connection timed out';
  } else if (e.includes('ssl') || err.includes('CERT_') || err.includes('ERR_TLS')) {
    result.status   = STATUS_DOWN;
    result.errorMsg = `SSL error: ${err.slice(0, 80)}`;
  } else {
    result.status   = STATUS_DOWN;
    result.errorMsg = `Connection error: ${err.slice(0, 80)}`;
  }
  return result;
}

function urlsDiffer(original: string, final: string | null): boolean {
  if (!final || original === final) return false;
  let o: URL, f: URL;
  try { o = new URL(original); f = new URL(final); } catch { return true; }
  const op = o.pathname.replace(/\/$/, '');
  const fp = f.pathname.replace(/\/$/, '');
  if (o.host === f.host && op === fp && o.search === f.search) return false;
  if (o.host === f.host && op === fp && o.protocol === 'http:' && f.protocol === 'https:') return false;
  return true;
}

async function checkDest(destUrl: string): Promise<DestResult> {
  let { code, finalUrl, err } = await httpFetch(destUrl, { method: 'HEAD', followRedirects: true });
  if (err) return { code: null, finalUrl: destUrl, err };
  if (code === 403 || code === 405) {
    ({ code, finalUrl, err } = await httpFetch(destUrl, { method: 'GET', followRedirects: true }));
    if (err) return { code: null, finalUrl: destUrl, err };
  }
  return { code, finalUrl: finalUrl || destUrl, err: null };
}

async function checkUrl(rawUrl: string): Promise<CheckResult> {
  const result: CheckResult = { url: rawUrl, status: STATUS_ERROR, httpCode: null, finalUrl: null, errorMsg: null };

  let { code, location, err } = await httpFetch(rawUrl, { method: 'HEAD', followRedirects: false });
  if (err) return classifyErr(result, err);

  if (code === 403 || code === 405) {
    ({ code, location, err } = await httpFetch(rawUrl, { method: 'GET', followRedirects: false }));
    if (err) return classifyErr(result, err);
    if (code === 403 || code === 405) {
      return Object.assign(result, { status: STATUS_ERROR, httpCode: code, errorMsg: `HTTP ${code} (GET retry)`, finalUrl: rawUrl });
    }
  }

  result.httpCode = code;
  if (code === null) { result.status = STATUS_ERROR; return result; }

  if (code === 200) return Object.assign(result, { status: STATUS_OK, finalUrl: rawUrl });
  if (code === 404) return Object.assign(result, { status: STATUS_404, errorMsg: 'HTTP 404', finalUrl: rawUrl });

  if ([301, 302, 303, 307, 308].includes(code)) {
    let dest = location || rawUrl;
    if (dest && !/^https?:\/\//.test(dest)) {
      const p = new URL(rawUrl);
      dest = `${p.protocol}//${p.host}${dest}`;
    }
    const { code: dc, finalUrl: df, err: de } = await checkDest(dest);
    if (de) return Object.assign(result, { status: STATUS_DOWN, errorMsg: `Redirect to ${dest} failed: ${de.slice(0, 80)}`, finalUrl: dest });
    if (dc === null) return Object.assign(result, { status: STATUS_DOWN, errorMsg: 'Redirect destination unreachable', finalUrl: dest });
    if (dc === 200) {
      return urlsDiffer(rawUrl, df)
        ? Object.assign(result, { status: STATUS_REDIRECT, finalUrl: df })
        : Object.assign(result, { status: STATUS_OK, finalUrl: df });
    }
    if (dc === 404) return Object.assign(result, { status: STATUS_404, errorMsg: 'Redirect target returned 404', finalUrl: dest });
    return Object.assign(result, { status: STATUS_ERROR, errorMsg: `Redirect target returned HTTP ${dc}`, finalUrl: dest });
  }
  if (code >= 200 && code < 300) return Object.assign(result, { status: STATUS_OK, finalUrl: rawUrl });
  return Object.assign(result, { status: STATUS_ERROR, errorMsg: `HTTP ${code}`, finalUrl: rawUrl });
}

// ─────────────────────────────────────────────
// Sitemap fetcher
// ─────────────────────────────────────────────

function fetchRaw(rawUrl: string, timeout = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    let parsed: URL;
    try { parsed = new URL(rawUrl); } catch (e) { return reject(e); }
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.get(rawUrl, { headers: { 'User-Agent': USER_AGENT }, timeout }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
  });
}

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
  console.log(`Fetching sitemap: ${sitemapUrl}`);
  let xml: string;
  try { xml = await fetchRaw(sitemapUrl); } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`ERROR fetching sitemap: ${msg}`);
    return [];
  }
  const urls: string[] = [];
  for (const m of xml.matchAll(/<loc[^>]*>([\s\S]*?)<\/loc>/g)) {
    const u = m[1].trim();
    if (u) urls.push(u);
  }
  console.log(`  Found ${urls.length} URLs in sitemap`);
  return urls;
}

// ─────────────────────────────────────────────
// HTML link extractor
// ─────────────────────────────────────────────

function extractLinks(html: string, pageUrl: string): PageLink[] {
  const seen = new Set<string>();
  const results: PageLink[] = [];

  function add(raw: string, text: string): void {
    const n = normaliseUrl(raw, pageUrl);
    if (n && !seen.has(n)) { seen.add(n); results.push({ url: n, linkText: text || '' }); }
  }

  for (const m of html.matchAll(/<a\s[^>]*?href=(["'])([\s\S]*?)\1[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[2].trim();
    const text = m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    if (href) add(href, text);
  }
  for (const m of html.matchAll(/<a\s[^>]*?href=([^\s"'>]+)/gi)) {
    add(m[1].trim(), '');
  }

  const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
                       .replace(/<style[\s\S]*?<\/style>/gi, ' ')
                       .replace(/<[^>]+>/g, ' ');
  for (const m of stripped.matchAll(/https?:\/\/[^\s\]>"'\\<`*]+/g)) {
    let raw = m[0].replace(/[.,;:!]+$/, '');
    while (raw.endsWith(')') && (raw.match(/\(/g) || []).length < (raw.match(/\)/g) || []).length) {
      raw = raw.slice(0, -1);
    }
    add(raw, '');
  }

  return results;
}

function normaliseUrl(raw: string, pageUrl: string): string | null {
  if (!raw || raw === '#' || raw.startsWith('#')) return null;
  if (IGNORE_SCHEMES.some((s) => raw.startsWith(s))) return null;
  const withoutFrag = raw.includes('#') ? raw.split('#')[0] : raw;
  if (!withoutFrag) return null;

  let abs: string;
  try {
    abs = /^https?:\/\//.test(withoutFrag) ? withoutFrag : new URL(withoutFrag, pageUrl).href;
  } catch { return null; }

  let parsed: URL;
  try { parsed = new URL(abs); } catch { return null; }
  if (!parsed.protocol.startsWith('http')) return null;

  const host = parsed.hostname;
  if (IGNORE_HOSTS.some((h) => host.startsWith(h))) return null;
  if (IGNORE_HOST_SUFFIXES.some((s) => host.endsWith(s))) return null;
  if (IGNORE_EXAMPLE_HOSTS.some((h) => host === h || host.startsWith(h))) return null;
  if (IGNORE_URL_PATTERNS.some((p) => abs.includes(p))) return null;
  return abs;
}

async function fetchPageLinks(pageUrl: string): Promise<FetchPageResult> {
  let html: string;
  try {
    html = await fetchRaw(pageUrl, 20000);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { links: [], err: msg };
  }
  return { links: extractLinks(html, pageUrl), err: null };
}

// ─────────────────────────────────────────────
// Concurrent URL checker
// ─────────────────────────────────────────────

async function checkUrlsThreaded(urlToSources: UrlToSources, threads = EXT_THREADS): Promise<FetchResults> {
  const urls    = Object.keys(urlToSources);
  const total   = urls.length;
  const results: FetchResults = {};
  let done = 0, idx = 0;

  async function worker(): Promise<void> {
    while (idx < urls.length) {
      const rawUrl = urls[idx++];
      await new Promise<void>((r) => setTimeout(r, EXT_DELAY));
      results[rawUrl] = await checkUrl(rawUrl);
      done++;
      if (done % 20 === 0 || done === total) {
        process.stdout.write(`  Checked ${done}/${total} URLs...\r`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(threads, Math.max(1, total)) }, worker));
  process.stdout.write('\n');
  return results;
}

// ─────────────────────────────────────────────
// Staged URL replacements
// ─────────────────────────────────────────────

function getStagedUrlReplacements(): Record<string, string> {
  const urlRe = /https?:\/\/[^\s\])"'<>`\\]+/g;
  try {
    const out = execFileSync('git', ['diff', '--cached', '--unified=0'], {
      cwd: PROJECT_DIR, encoding: 'utf8',
    });
    if (!out) return {};

    const replacements: Record<string, string> = {};
    let removed: string[] = [], added: string[] = [];

    function flush(): void {
      const removedSet = new Set(removed);
      const addedSet   = new Set(added);
      const gone = removed.filter((u) => !addedSet.has(u));
      const newU = added.filter((u)  => !removedSet.has(u));
      gone.forEach((old, i) => { if (newU[i]) replacements[old] = newU[i]; });
    }

    for (const line of out.split('\n')) {
      if (/^(diff --git|index |--- |\+\+\+ )/.test(line)) continue;
      if (line.startsWith('@@')) { flush(); removed = []; added = []; }
      else if (line.startsWith('-')) removed.push(...(line.slice(1).match(urlRe) || []));
      else if (line.startsWith('+')) added.push(...(line.slice(1).match(urlRe) || []));
    }
    flush();
    return replacements;
  } catch { return {}; }
}

// ─────────────────────────────────────────────
// Report writer
// ─────────────────────────────────────────────

function writeReport(
  urlToSources: UrlToSources,
  results: FetchResults,
  pagesCrawled: number,
  _totalLinksFound: number,
  _stagedReplacements: Record<string, string> = {},
): void {
  const today = new Date().toISOString().slice(0, 10);

  const broken404  = Object.fromEntries(Object.entries(results).filter(([, r]) => r.status === STATUS_404));
  const brokenDown = Object.fromEntries(Object.entries(results).filter(([, r]) => r.status === STATUS_DOWN));
  const redirects  = Object.fromEntries(Object.entries(results).filter(([, r]) => r.status === STATUS_REDIRECT));
  const errors     = Object.fromEntries(Object.entries(results).filter(([, r]) => r.status === STATUS_ERROR));

  const nAction = Object.keys(broken404).length + Object.keys(brokenDown).length + Object.keys(redirects).length;

  function fmtInstances(rawUrl: string): string {
    const srcs = urlToSources[rawUrl] || [];
    if (!srcs.length) return '_unknown_';
    return srcs.map(({ page, linkText }) => {
      const safe   = (linkText || '').replace(/\|/g, '\\|').slice(0, 80);
      const safePg = page.replace(/\|/g, '\\|');
      return safe ? `• "${safe}" — [${safePg}](${safePg})` : `• [${safePg}](${safePg})`;
    }).join('<br>');
  }

  const lines: string[] = [];
  lines.push('## Context\n');
  lines.push(`Dead link audit of ${SITE_BASE} found **${nAction}** broken, down, or stale links. Audit date: ${today}.\n`);
  lines.push('');

  lines.push('---\n');
  lines.push('## Dead Links (404)\n');
  if (Object.keys(broken404).length) {
    lines.push('| Dead Link | Status | Instances (Link Text — Source Page) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(broken404).sort()) {
      lines.push(`| ${u} | **Broken** — ${r.errorMsg || 'HTTP 404'} | ${fmtInstances(u)} |`);
    }
  } else { lines.push('_No 404s found._'); }
  lines.push('');

  lines.push('---\n');
  lines.push('## Forbidden / Down\n');
  if (Object.keys(brokenDown).length) {
    lines.push('| Dead Link | Status | Instances (Link Text — Source Page) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(brokenDown).sort()) {
      lines.push(`| ${u} | **${r.errorMsg || 'Connection error'}** | ${fmtInstances(u)} |`);
    }
  } else { lines.push('_No down/refused links found._'); }
  lines.push('');

  lines.push('---\n');
  lines.push('## Stale Redirects (Should Update)\n');
  if (Object.keys(redirects).length) {
    lines.push('| Old Link | Instances (Link Text — Source Page) |');
    lines.push('|---|---|');
    for (const [u] of Object.entries(redirects).sort()) {
      lines.push(`| ${u} | ${fmtInstances(u)} |`);
    }
  } else { lines.push('_No stale redirects found._'); }
  lines.push('');

  if (Object.keys(errors).length) {
    lines.push('---\n');
    lines.push('## Check Errors (timeout / blocked)\n');
    lines.push('_These URLs could not be verified — check manually._\n');
    lines.push('| URL | Error | Instances (Link Text — Source Page) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(errors).sort()) {
      lines.push(`| ${u} | ${r.errorMsg || ''} | ${fmtInstances(u)} |`);
    }
    lines.push('');
  }

  lines.push('---\n');
  lines.push('## Summary\n');
  lines.push(`- **Pages crawled:** ${pagesCrawled}`);
  lines.push(`- **Unique URLs checked:** ${Object.keys(results).length}`);
  lines.push(`- **Broken internal links:** ${Object.keys(broken404).filter((u) => u.includes(SITE_BASE)).length}`);
  lines.push(`- **Hard 404s (external):** ${Object.keys(broken404).filter((u) => !u.includes(SITE_BASE)).length}`);
  lines.push(`- **Forbidden / Down:** ${Object.keys(brokenDown).length}`);
  lines.push(`- **Stale redirects:** ${Object.keys(redirects).length}`);
  lines.push(`- **Check errors (unverified):** ${Object.keys(errors).length}`);
  lines.push(`- **Total actionable:** ${nAction}`);
  lines.push('');

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(`\nReport written to: ${REPORT_PATH}`);
}

// ─────────────────────────────────────────────
// Arg parser
// ─────────────────────────────────────────────

function parseArgs(): ParsedArgs {
  const argv = process.argv.slice(2);
  const args: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      args[key] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    }
  }
  return args;
}

// ─────────────────────────────────────────────
// Exported entry point (called by check_links.ts)
// ─────────────────────────────────────────────

export async function runLiveCheck(args: ParsedArgs): Promise<void> {
  if (!args['site-domain']) {
    console.error('ERROR: --site-domain is required for live mode, e.g. --site-domain docs.mysite.com');
    process.exit(1);
  }

  SITE_BASE   = `https://${args['site-domain']}`;
  SITEMAP_URL = `${SITE_BASE}/sitemap.xml`;

  const maxPages = parseInt(args['max-pages'] || '0', 10);
  const threads  = parseInt(args['threads']   || String(EXT_THREADS), 10);

  let pageUrls = await fetchSitemapUrls(SITEMAP_URL);
  if (!pageUrls.length) { console.error('No pages found in sitemap. Exiting.'); process.exit(1); }
  if (maxPages > 0) pageUrls = pageUrls.slice(0, maxPages);

  console.log(`\nCrawling ${pageUrls.length} pages to extract links...`);
  const urlToSources: UrlToSources = {};
  const fetchErrors: Array<{ pageUrl: string; err: string }> = [];

  for (let i = 0; i < pageUrls.length; i++) {
    const pageUrl = pageUrls[i];
    if ((i + 1) % 20 === 0 || i + 1 === pageUrls.length) {
      process.stdout.write(`  Crawling page ${i + 1}/${pageUrls.length}...\r`);
    }
    const { links, err } = await fetchPageLinks(pageUrl);
    if (err) fetchErrors.push({ pageUrl, err });
    for (const { url: linkUrl, linkText } of links) {
      if (!urlToSources[linkUrl]) urlToSources[linkUrl] = [];
      urlToSources[linkUrl].push({ page: pageUrl, linkText });
    }
  }

  process.stdout.write('\n');
  console.log(`  Found ${Object.keys(urlToSources).length} unique URLs across ${pageUrls.length} pages`);
  if (fetchErrors.length) console.log(`  WARNING: ${fetchErrors.length} pages failed to fetch`);

  console.log(`\nChecking ${Object.keys(urlToSources).length} URLs (${threads} threads)...`);
  const results = await checkUrlsThreaded(urlToSources, threads);

  const broken404  = Object.keys(results).filter((u) => results[u].status === STATUS_404);
  const brokenDown = Object.keys(results).filter((u) => results[u].status === STATUS_DOWN);
  const redirects  = Object.keys(results).filter((u) => results[u].status === STATUS_REDIRECT);
  const errorsList = Object.keys(results).filter((u) => results[u].status === STATUS_ERROR);

  console.log(`\n${'='.repeat(60)}`);
  console.log('RESULTS');
  console.log('='.repeat(60));
  console.log(`Pages crawled:     ${pageUrls.length}`);
  console.log(`Unique URLs:       ${Object.keys(results).length}`);
  console.log(`404 (broken):      ${broken404.length}`);
  console.log(`Down / refused:    ${brokenDown.length}`);
  console.log(`Stale redirects:   ${redirects.length}`);
  console.log(`Errors/timeouts:   ${errorsList.length}`);
  console.log('='.repeat(60));

  if (broken404.length) {
    console.log('\n── 404 Broken Links ──');
    for (const u of broken404.sort()) {
      const srcs = urlToSources[u] || [];
      const { page, linkText } = srcs[0] || { page: '?', linkText: '' };
      console.log(`  [404] ${u}`);
      console.log(`        from: ${page}${linkText ? ` ("${linkText}")` : ''}`);
    }
  }
  if (brokenDown.length) {
    console.log('\n── Down / Refused ──');
    for (const u of brokenDown.sort()) {
      const srcs = urlToSources[u] || [];
      const { page, linkText } = srcs[0] || { page: '?', linkText: '' };
      console.log(`  [DOWN] ${u}`);
      console.log(`         ${results[u].errorMsg}`);
      console.log(`         from: ${page}${linkText ? ` ("${linkText}")` : ''}`);
    }
  }
  if (redirects.length) {
    console.log('\n── Stale Redirects ──');
    for (const u of redirects.sort()) {
      const srcs = urlToSources[u] || [];
      const { page, linkText } = srcs[0] || { page: '?', linkText: '' };
      console.log(`  [REDIR] ${u}`);
      console.log(`          → ${results[u].finalUrl}`);
      console.log(`          from: ${page}${linkText ? ` ("${linkText}")` : ''}`);
    }
  }

  const staged = getStagedUrlReplacements();
  if (Object.keys(staged).length) console.log(`\nFound ${Object.keys(staged).length} staged URL replacement(s) from git diff.`);
  writeReport(urlToSources, results, pageUrls.length, Object.keys(urlToSources).length, staged);
}

// ─────────────────────────────────────────────
// Standalone entry point
// ─────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runLiveCheck(parseArgs()).catch((e) => { console.error(e); process.exit(1); });
}
