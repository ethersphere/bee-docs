#!/usr/bin/env node

/**
 * Link checker for Docusaurus sites.
 *
 * Run from your Docusaurus project root:
 *   node check_links.js [--mode local|live] [--site-domain your-site.com]
 *                       [--no-external] [--threads N]
 */

import https from 'node:https';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { execFileSync, spawnSync } from 'node:child_process';
import { runLiveCheck } from './check_live_links.js';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface MdLink { text: string; url: string }
interface HtmlLink { attr: string; url: string }
interface FetchResult { code: number | null; finalUrl: string; location: string | null; err: string | null }
interface DestResult { code: number | null; finalUrl: string; err: string | null }
interface CheckResult { url: string; status: string; httpCode: number | null; finalUrl: string | null; errorMsg: string | null }
interface BrokenInternalLink { source: string; linkText: string; linkUrl: string; resolved: string; reason: string }
interface BrokenHtmlLink { source: string; attr: string; linkUrl: string; resolved: string; reason: string }
interface DeduplicatedHtmlLink extends BrokenHtmlLink { count: number; exampleSources: string[] }
interface ExternalSource { file: string; text: string }
interface ResolveResult { html: string | null; reason: string | null }
interface SiteUrlResult { exists: boolean; tried: string }
interface HtmlExtractResult { links: HtmlLink[]; ids: Set<string> }
interface ResolveHtmlLinkResult { target: string | null; anchor: string | null; reason: string | null }
interface LlmsTxtResult { stale: string[]; missing: string[] }
interface MarkdownCheckResult {
  brokenInternal: BrokenInternalLink[];
  externalUrlToSrc: ExtUrlToSrc;
  filesChecked: number;
  linksChecked: number;
  total: number;
}
interface HtmlCheckResult { broken: BrokenHtmlLink[]; filesChecked: number; linksChecked: number; total: number }

type ExtUrlToSrc = Record<string, ExternalSource[]>;
type ExtResults = Record<string, CheckResult>;
type DocIdMap = Record<string, string>;
type ParsedArgs = Record<string, string>;

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const PROJECT_DIR = process.cwd();
const DOCS_DIR    = path.join(PROJECT_DIR, 'docs');
const BUILD_DIR   = path.join(PROJECT_DIR, 'build');
const STATIC_DIR  = path.join(PROJECT_DIR, 'static');
const REPORT_PATH       = path.join(PROJECT_DIR, 'link-reports', 'dead_links_report.md');
const HUMAN_REPORT_PATH = path.join(PROJECT_DIR, 'link-reports', 'dead_links_audit.md');

let SITE_DOMAIN = '';

const EXT_TIMEOUT = 15000;
const EXT_THREADS = 8;
const EXT_DELAY   = 150;

const USER_AGENT = (
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/122.0 Safari/537.36 bee-docs-link-checker/2.0'
);

const EXTERNAL_SCHEMES  = ['http://', 'https://'];
const IGNORE_SCHEMES    = ['mailto:', 'javascript:', 'tel:', 'ftp:', 'data:'];
const SKIP_PATHS        = ['/api/'];
const IGNORE_HOSTS      = ['localhost', '127.0.0.1', '192.168.', '10.0.', '0.0.0.0'];

const STATUS_OK       = 'ok';
const STATUS_404      = '404';
const STATUS_DOWN     = 'down';
const STATUS_REDIRECT = 'redirect';
const STATUS_ERROR    = 'error';
const STATUS_INTERNAL = 'internal_404';

const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// ─────────────────────────────────────────────
// Helpers — markdown link extraction
// ─────────────────────────────────────────────

function stripCodeBlocks(content: string): string {
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  content = content.replace(/```[^\n]*\n[\s\S]*?```/g, '');
  content = content.replace(/~~~[^\n]*\n[\s\S]*?~~~/g, '');
  content = content.replace(/`[^`\n]+`/g, '');
  return content;
}

function extractMdLinks(content: string): MdLink[] {
  content = stripCodeBlocks(content);
  const links: MdLink[] = [];

  for (const m of content.matchAll(/\[([^\]]*)\]\(((?:[^)(]|\([^)]*\))*?)(?:\s+"[^"]*")?\)/g)) {
    let u = m[2].trim().split('"')[0].trim().split("'")[0].trim();
    links.push({ text: m[1], url: u });
  }

  const refDefs: Record<string, string> = {};
  for (const m of content.matchAll(/^\[([^\]]+)\]:\s*(\S+)/gm)) {
    refDefs[m[1].toLowerCase()] = m[2];
  }
  for (const m of content.matchAll(/\[([^\]]+)\]\[([^\]]*)\]/g)) {
    const ref = (m[2] || m[1]).toLowerCase();
    if (refDefs[ref]) links.push({ text: m[1], url: refDefs[ref] });
  }

  for (const m of content.matchAll(/<a\s[^>]*href=["']([^"']+)['"]/gi))
    links.push({ text: '', url: m[1] });
  for (const m of content.matchAll(/<img\s[^>]*src=["']([^"']+)['"]/gi))
    links.push({ text: '', url: m[1] });

  const seenPositions = new Set<number>();
  for (const m of content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) seenPositions.add(m.index! + m[0].indexOf(m[2]));
  for (const m of content.matchAll(/^\[([^\]]+)\]:\s*(\S+)/gm)) seenPositions.add(m.index! + m[0].indexOf(m[2]));
  for (const m of content.matchAll(/(?:href|src)=["']([^"']+)['"]/gi)) seenPositions.add(m.index! + m[0].indexOf(m[1]));

  for (const m of content.matchAll(/https?:\/\/[^\s\]>"'\\<*`]+/g)) {
    if (seenPositions.has(m.index!)) continue;
    let u = m[0].replace(/[.,;:!]+$/, '');
    while (u.endsWith(')') && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length)
      u = u.slice(0, -1);
    links.push({ text: '', url: u });
  }

  return links;
}

// ─────────────────────────────────────────────
// Helpers — build-output link resolution
// ─────────────────────────────────────────────

function frontmatterId(mdFile: string): string | null {
  try {
    const text = fs.readFileSync(mdFile, 'utf8');
    if (!text.startsWith('---')) return null;
    const end = text.indexOf('\n---', 3);
    if (end === -1) return null;
    for (const line of text.slice(3, end).split('\n')) {
      if (line.startsWith('id:')) return line.slice(3).trim().replace(/^["']|["']$/g, '');
    }
  } catch { }
  return null;
}

let _docIdMap: DocIdMap | null = null;

function buildDocIdMap(): DocIdMap {
  const mapping: DocIdMap = {};
  if (!fs.existsSync(BUILD_DIR)) return mapping;
  for (const htmlFile of walkGlob(BUILD_DIR, 'index.html')) {
    try {
      const fd  = fs.openSync(htmlFile, 'r');
      const buf = Buffer.alloc(800);
      fs.readSync(fd, buf, 0, 800, 0);
      fs.closeSync(fd);
      const head = buf.toString('utf8');
      const m = head.match(/docs-doc-id-([^\s"']+)/);
      if (m) mapping[m[1]] = htmlFile;
    } catch { }
  }
  return mapping;
}

function getDocIdMap(): DocIdMap {
  if (!_docIdMap) _docIdMap = buildDocIdMap();
  return _docIdMap;
}

function mdPathToBuildHtml(mdFile: string): string | null {
  let rel: string;
  try { rel = path.relative(DOCS_DIR, mdFile); } catch { return null; }
  if (rel.startsWith('..')) return null;

  const ext     = path.extname(rel);
  const noExt   = rel.slice(0, -ext.length);
  const localId = frontmatterId(mdFile) || path.basename(noExt);
  const parent  = path.dirname(rel).replace(/\\/g, '/');
  const docId   = parent === '.' ? localId : `${parent}/${localId}`;

  const map = getDocIdMap();
  if (map[docId]) return map[docId];

  const parentDir = path.dirname(rel);
  if (localId === 'index') return path.join(BUILD_DIR, 'docs', parentDir, 'index.html');
  return path.join(BUILD_DIR, 'docs', parentDir, localId, 'index.html');
}

function resolveInternalToBuildHtml(sourceMd: string, linkPath: string): ResolveResult {
  const decoded = decodeURIComponent(linkPath);

  if (decoded.startsWith('/')) {
    const rel        = decoded.replace(/^\//, '');
    const candidates = [
      path.join(BUILD_DIR, rel),
      path.join(BUILD_DIR, rel, 'index.html'),
      path.join(BUILD_DIR, rel + '.html'),
    ];
    for (const c of candidates) {
      if (safeIsFile(c)) return { html: c, reason: null };
    }
    return { html: null, reason: `Not found in build: /${rel}` };
  }

  const sourceDir = path.dirname(sourceMd);
  const target    = path.resolve(sourceDir, decoded);
  const ext       = path.extname(target);

  if (ext && ext !== '.md' && ext !== '.mdx') {
    if (safeIsFile(target)) return { html: target, reason: null };
    try {
      const rel  = path.relative(PROJECT_DIR, target);
      const cand = path.join(STATIC_DIR, rel);
      if (safeIsFile(cand)) return { html: cand, reason: null };
    } catch { }
    return { html: null, reason: `File not found: ${path.basename(target)}` };
  }

  const mdCandidates = (ext === '.md' || ext === '.mdx')
    ? [target]
    : [
        target + '.md', target + '.mdx',
        path.join(target, 'index.md'),
        path.join(target, 'index.mdx'),
      ];

  for (const cand of mdCandidates) {
    if (safeIsFile(cand)) {
      const buildHtml = mdPathToBuildHtml(cand);
      if (!buildHtml) return { html: null, reason: 'Could not map source file to build path' };
      if (safeIsFile(buildHtml)) return { html: buildHtml, reason: null };
      return { html: null, reason: 'Source file exists but its build HTML was not found — is the build current?' };
    }
  }
  return { html: null, reason: 'Source file not found' };
}

function resolveSiteUrlLocally(rawUrl: string): SiteUrlResult {
  let parsed: URL;
  try { parsed = new URL(rawUrl); } catch { return { exists: false, tried: rawUrl }; }
  const rel        = parsed.pathname.replace(/\/$/, '').replace(/^\//, '');
  const candidates = [
    path.join(BUILD_DIR, rel),
    path.join(BUILD_DIR, rel, 'index.html'),
    path.join(BUILD_DIR, rel + '.html'),
  ];
  for (const c of candidates) {
    if (safeIsFile(c)) return { exists: true, tried: c };
  }
  return { exists: false, tried: path.join(BUILD_DIR, rel) };
}

// ─────────────────────────────────────────────
// External URL checker
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
        'User-Agent':      USER_AGENT,
        'Accept':          'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
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

    const timer = setTimeout(() => {
      req.destroy();
      resolve({ code: null, finalUrl: rawUrl, location: null, err: 'Connection timed out' });
    }, timeout);

    req.on('response', () => clearTimeout(timer));
    req.on('error', (e) => {
      clearTimeout(timer);
      resolve({ code: null, finalUrl: rawUrl, location: null, err: e.message });
    });
    req.end();
  });
}

function classifyErr(result: CheckResult, err: string): CheckResult {
  const e = err.toLowerCase();
  if (err.includes('ECONNREFUSED') || err.includes('Connection refused')) {
    result.status = STATUS_DOWN; result.errorMsg = 'ECONNREFUSED — server down';
  } else if (err.includes('ENOTFOUND') || err.includes('getaddrinfo') || err.includes('EAI_AGAIN') ||
             err.includes('nodename') || err.includes('No address')) {
    result.status = STATUS_DOWN; result.errorMsg = 'DNS resolution failed';
  } else if (e.includes('timed out') || e.includes('timeout')) {
    result.status = STATUS_DOWN; result.errorMsg = 'Connection timed out';
  } else if (e.includes('ssl') || err.includes('CERT_') || err.includes('ERR_TLS')) {
    result.status = STATUS_DOWN; result.errorMsg = `SSL error: ${err.slice(0, 80)}`;
  } else {
    result.status = STATUS_DOWN; result.errorMsg = `Connection error: ${err.slice(0, 80)}`;
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

async function checkExternalUrl(rawUrl: string): Promise<CheckResult> {
  const result: CheckResult = { url: rawUrl, status: STATUS_ERROR, httpCode: null, finalUrl: null, errorMsg: null };

  let parsedHost: string | undefined;
  try { parsedHost = new URL(rawUrl).hostname; } catch { }
  if (parsedHost && parsedHost === SITE_DOMAIN) {
    const { exists, tried } = resolveSiteUrlLocally(rawUrl);
    if (exists) { result.status = STATUS_OK; }
    else { result.status = STATUS_INTERNAL; result.errorMsg = `Not in local build: ${tried}`; }
    return result;
  }

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
    if (de) return Object.assign(result, { status: STATUS_DOWN, errorMsg: `Redirect to '${dest}' failed: ${de.slice(0, 80)}`, finalUrl: dest });
    if (dc === null) return Object.assign(result, { status: STATUS_DOWN, errorMsg: `Redirect destination unreachable: '${dest}'`, finalUrl: dest });
    if (dc === 200) {
      return urlsDiffer(rawUrl, df)
        ? Object.assign(result, { status: STATUS_REDIRECT, finalUrl: df })
        : Object.assign(result, { status: STATUS_OK, finalUrl: df });
    }
    if (dc === 404) return Object.assign(result, { status: STATUS_404, errorMsg: `Redirect target returned 404 ('${dest}')`, finalUrl: dest });
    return Object.assign(result, { status: STATUS_ERROR, errorMsg: `Redirect target returned HTTP ${dc}`, finalUrl: dest });
  }

  if (code >= 200 && code < 300) return Object.assign(result, { status: STATUS_OK, finalUrl: rawUrl });
  return Object.assign(result, { status: STATUS_ERROR, errorMsg: `HTTP ${code}`, finalUrl: rawUrl });
}

async function checkExternalUrlsThreaded(urlToSources: ExtUrlToSrc, threads = EXT_THREADS): Promise<ExtResults> {
  const urls    = Object.keys(urlToSources);
  const total   = urls.length;
  const results: ExtResults = {};
  let done = 0, idx = 0;

  async function worker(): Promise<void> {
    while (idx < urls.length) {
      const rawUrl = urls[idx++];
      await sleep(EXT_DELAY);
      results[rawUrl] = await checkExternalUrl(rawUrl);
      done++;
      if (done % 10 === 0 || done === total) {
        process.stdout.write(`  External: ${done}/${total} checked...\r`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(threads, Math.max(1, total)) }, worker));
  process.stdout.write('\n');
  return results;
}

// ─────────────────────────────────────────────
// HTML helpers
// ─────────────────────────────────────────────

function getHtmlIds(htmlFile: string): Set<string> {
  try {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const ids = new Set<string>();
    for (const m of content.matchAll(/\bid=(["'])([^"']+)\1/g)) ids.add(m[2]);
    for (const m of content.matchAll(/\bid=([^\s"'>\/]+)/g)) ids.add(m[1]);
    return ids;
  } catch { return new Set(); }
}

function extractHtmlLinks(content: string): HtmlExtractResult {
  const links: HtmlLink[] = [];
  const ids = new Set<string>();

  for (const m of content.matchAll(/\bid=(["'])([^"']+)\1/g)) ids.add(m[2]);
  for (const m of content.matchAll(/\bid=([^\s"'>\/]+)/g)) ids.add(m[1]);

  for (const m of content.matchAll(/<a\s[^>]*?href=(["'])([^"']+)\1/gi))
    links.push({ attr: 'href', url: m[2] });
  for (const m of content.matchAll(/<(?:img|script)\s[^>]*?src=(["'])([^"']+)\1/gi))
    links.push({ attr: 'src', url: m[2] });
  for (const m of content.matchAll(/<link\s[^>]*?href=(["'])([^"']+)\1/gi))
    links.push({ attr: 'href', url: m[2] });

  return { links, ids };
}

function resolveHtmlLink(sourceHtml: string, href: string): ResolveHtmlLinkResult {
  let anchor: string | null = null;
  if (href.includes('#')) [href, anchor] = href.split('#', 2) as [string, string];
  const decoded = decodeURIComponent(href);
  if (!decoded) return { target: null, anchor, reason: null };

  let candidates: string[];
  if (decoded.startsWith('/')) {
    const rel = decoded.replace(/^\//, '');
    const t   = path.join(BUILD_DIR, rel);
    candidates = [t, path.join(t, 'index.html')];
  } else {
    const t = path.resolve(path.dirname(sourceHtml), decoded);
    candidates = [t, path.join(t, 'index.html')];
  }

  for (const c of candidates) {
    if (safeIsFile(c)) return { target: c, anchor, reason: null };
  }
  return { target: candidates[0], anchor, reason: 'File not found' };
}

// ─────────────────────────────────────────────
// Markdown file checker
// ─────────────────────────────────────────────

async function checkMarkdownFiles(checkExternal = true): Promise<MarkdownCheckResult> {
  const brokenInternal: BrokenInternalLink[] = [];
  const externalUrlToSrc: ExtUrlToSrc = {};
  let filesChecked = 0, linksChecked = 0;
  const htmlIdCache: Record<string, Set<string>> = {};

  if (!fs.existsSync(BUILD_DIR)) {
    console.log('  WARNING: build/ directory not found.');
    console.log("  Run 'npm run build' first — internal links cannot be checked without it.");
  }

  const mdFiles = walkExt(DOCS_DIR, ['.md', '.mdx']).sort();

  for (const mdFile of mdFiles) {
    filesChecked++;
    let content: string;
    try { content = fs.readFileSync(mdFile, 'utf8'); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      brokenInternal.push({ source: mdFile, linkText: '', linkUrl: '', resolved: '', reason: `Could not read file: ${msg}` });
      continue;
    }

    const sourceBuildHtml = mdPathToBuildHtml(mdFile);
    const links = extractMdLinks(content);

    for (const { text: linkText, url: rawUrl } of links) {
      const u = rawUrl.trim();
      if (!u || u === '#') continue;
      if (IGNORE_SCHEMES.some((s) => u.startsWith(s))) continue;

      let host = '';
      try { host = new URL(u).hostname; } catch { }
      if (host && IGNORE_HOSTS.some((h) => host.startsWith(h))) continue;

      linksChecked++;

      if (EXTERNAL_SCHEMES.some((s) => u.startsWith(s))) {
        if (checkExternal) {
          if (!externalUrlToSrc[u]) externalUrlToSrc[u] = [];
          externalUrlToSrc[u].push({ file: mdFile, text: linkText });
        }
        continue;
      }

      if (SKIP_PATHS.some((p) => u.startsWith(p))) continue;

      let anchor: string | null = null;
      let linkPath = u;
      if (linkPath.includes('#')) [linkPath, anchor] = linkPath.split('#', 2) as [string, string];

      let targetHtml: string | null | undefined;
      if (!linkPath) {
        targetHtml = sourceBuildHtml;
      } else {
        const { html, reason } = resolveInternalToBuildHtml(mdFile, linkPath);
        if (reason || !html || !safeIsFile(html)) {
          brokenInternal.push({
            source: mdFile, linkText, linkUrl: u,
            resolved: html || linkPath,
            reason: reason || 'Build HTML not found',
          });
          continue;
        }
        targetHtml = html;
      }

      if (anchor && targetHtml && safeIsFile(targetHtml)) {
        if (!htmlIdCache[targetHtml]) htmlIdCache[targetHtml] = getHtmlIds(targetHtml);
        if (!htmlIdCache[targetHtml].has(anchor)) {
          brokenInternal.push({
            source: mdFile, linkText, linkUrl: u,
            resolved: `${targetHtml}#${anchor}`,
            reason: `Anchor "#${anchor}" not found in rendered HTML`,
          });
        }
      }
    }
  }

  return { brokenInternal, externalUrlToSrc, filesChecked, linksChecked, total: mdFiles.length };
}

// ─────────────────────────────────────────────
// HTML build checker
// ─────────────────────────────────────────────

function checkHtmlFiles(): HtmlCheckResult {
  const broken: BrokenHtmlLink[] = [];
  let filesChecked = 0, linksChecked = 0;
  const idCache: Record<string, Set<string>> = {};

  if (!fs.existsSync(BUILD_DIR)) return { broken, filesChecked, linksChecked, total: 0 };

  const htmlFiles = walkExt(BUILD_DIR, ['.html']).sort();

  for (const htmlFile of htmlFiles) {
    filesChecked++;
    let content: string;
    try { content = fs.readFileSync(htmlFile, 'utf8'); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      broken.push({ source: htmlFile, attr: 'href', linkUrl: '', resolved: '', reason: `Could not read: ${msg}` });
      continue;
    }

    const { links, ids: fileIds } = extractHtmlLinks(content);

    for (const { attr, url: rawUrl } of links) {
      const u = rawUrl.trim();
      if (!u || u === '#') continue;
      if (EXTERNAL_SCHEMES.some((s) => u.startsWith(s))) continue;
      if (IGNORE_SCHEMES.some((s) => u.startsWith(s))) continue;
      if (u.startsWith('data:')) continue;

      linksChecked++;

      if (u.startsWith('#')) {
        const anchor = u.slice(1);
        if (anchor && !fileIds.has(anchor)) {
          broken.push({ source: htmlFile, attr, linkUrl: u, resolved: `${htmlFile}#${anchor}`, reason: `Anchor "#${anchor}" not found in same page` });
        }
        continue;
      }

      if (SKIP_PATHS.some((p) => u.startsWith(p))) continue;

      const { target, anchor, reason } = resolveHtmlLink(htmlFile, u);
      if (reason) {
        broken.push({ source: htmlFile, attr, linkUrl: u, resolved: target || u, reason });
        continue;
      }

      if (anchor && target && safeIsFile(target)) {
        if (!idCache[target]) idCache[target] = getHtmlIds(target);
        if (!idCache[target].has(anchor)) {
          broken.push({ source: htmlFile, attr, linkUrl: u, resolved: `${target}#${anchor}`, reason: `Anchor "#${anchor}" not found in target HTML` });
        }
      }
    }
  }

  return { broken, filesChecked, linksChecked, total: htmlFiles.length };
}

// ─────────────────────────────────────────────
// llms.txt coverage check
// ─────────────────────────────────────────────

function checkLlmsTxt(): LlmsTxtResult | null {
  if (!SITE_DOMAIN) return null;
  const llmsTxtPath = path.join(PROJECT_DIR, 'static', 'llms.txt');
  if (!fs.existsSync(llmsTxtPath) || !fs.existsSync(BUILD_DIR)) return null;

  const baseUrl = `https://${SITE_DOMAIN}/docs/`;
  const escaped = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const content = fs.readFileSync(llmsTxtPath, 'utf8');
  const llmsPaths = new Set<string>();
  for (const m of content.matchAll(new RegExp(`${escaped}([^)\\s]+)`, 'g'))) {
    llmsPaths.add(m[1]);
  }

  const buildPaths = new Set<string>();
  for (const htmlFile of walkGlob(BUILD_DIR, 'index.html')) {
    const dir    = path.dirname(htmlFile);
    const rel    = path.relative(BUILD_DIR, dir).replace(/\\/g, '/');
    if (!rel.startsWith('docs/')) continue;
    const docPath = rel.slice('docs/'.length);
    if (!docPath || docPath.startsWith('api/')) continue;
    // Skip client-redirect stub pages (generated by @docusaurus/plugin-client-redirects):
    // these are meta-refresh forwards from old URLs to their canonical target, not real
    // content pages, so they must not count as "missing from llms.txt".
    const html = fs.readFileSync(htmlFile, 'utf8');
    if (/<meta[^>]+http-equiv=["']refresh["']/i.test(html)) continue;
    buildPaths.add(docPath);
  }

  return {
    stale:   [...llmsPaths].filter((p) => !buildPaths.has(p)).sort(),
    missing: [...buildPaths].filter((p) => !llmsPaths.has(p)).sort(),
  };
}

// ─────────────────────────────────────────────
// Deduplication
// ─────────────────────────────────────────────

function deduplicateHtmlBroken(broken: BrokenHtmlLink[]): DeduplicatedHtmlLink[] {
  const groups: Record<string, BrokenHtmlLink[]> = {};
  for (const item of broken) {
    const key = `${item.linkUrl}|||${item.reason}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return Object.values(groups).map((items) => ({
    ...items[0],
    count:          items.length,
    exampleSources: items.slice(0, 3).map((i) => i.source),
  })).sort((a, b) => a.linkUrl.localeCompare(b.linkUrl));
}

// ─────────────────────────────────────────────
// Report helpers
// ─────────────────────────────────────────────

function makeShortPath(p: string, base: string): string {
  try {
    const rel = path.relative(base, p);
    if (!rel.startsWith('..')) return rel;
  } catch { }
  try { return path.relative(PROJECT_DIR, p); } catch { }
  return p;
}

function fmtInstances(sourcesList: ExternalSource[] | undefined): string {
  if (!sourcesList || !sourcesList.length) return '_unknown_';
  return sourcesList.map(({ file, text }) => {
    const short    = makeShortPath(file, DOCS_DIR).replace(/\|/g, '\\|');
    const safeText = (text || '').trim().replace(/\|/g, '\\|').slice(0, 80);
    return safeText ? `• "${safeText}" — \`${short}\`` : `• \`${short}\``;
  }).join('<br>');
}

// ─────────────────────────────────────────────
// Report writers
// ─────────────────────────────────────────────

function writeReport(
  mdBroken: BrokenInternalLink[],
  extResults: ExtResults,
  extUrlToSrc: ExtUrlToSrc,
  mdFilesChecked: number,
  mdLinksChecked: number,
  mdTotalFiles: number,
  htmlBroken: BrokenHtmlLink[],
  htmlFilesChecked: number,
  htmlLinksChecked: number,
  htmlTotalFiles: number,
  llmsTxtResult: LlmsTxtResult | null = null,
  _stagedReplacements: Record<string, string> = {},
): void {
  const today = new Date().toISOString().slice(0, 10);

  const ext404      = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_404));
  const extDown     = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_DOWN));
  const extRedirect = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_REDIRECT));
  const extInternal = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_INTERNAL));
  const extError    = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_ERROR));
  const deduped     = deduplicateHtmlBroken(htmlBroken);

  const lines: string[] = [];
  lines.push('# Dead Links Report\n');
  lines.push(`Generated: ${today}\n`);
  lines.push('');
  lines.push('## Summary\n');
  lines.push('| Category | Count |');
  lines.push('|---|---|');
  lines.push(`| Source doc files checked | ${mdFilesChecked} / ${mdTotalFiles} |`);
  lines.push(`| Internal links checked (source) | ${mdLinksChecked} |`);
  lines.push(`| **Broken internal links (source)** | **${mdBroken.length}** |`);
  lines.push(`| External URLs checked | ${Object.keys(extResults).length} |`);
  lines.push(`| **External 404s** | **${Object.keys(ext404).length + Object.keys(extInternal).length}** |`);
  lines.push(`| **External down / refused** | **${Object.keys(extDown).length}** |`);
  lines.push(`| **Stale redirects** | **${Object.keys(extRedirect).length}** |`);
  lines.push(`| External errors (timeout/misc) | ${Object.keys(extError).length} |`);
  lines.push(`| Build HTML files checked | ${htmlFilesChecked} / ${htmlTotalFiles} |`);
  lines.push(`| **Broken links in build output** | **${deduped.length} patterns** |`);
  if (llmsTxtResult) {
    lines.push(`| **llms.txt stale entries** | **${llmsTxtResult.stale.length}** |`);
    lines.push(`| **llms.txt missing pages** | **${llmsTxtResult.missing.length}** |`);
  }
  lines.push('');

  lines.push('---\n');
  lines.push('## Section 1: Broken Internal Links in Source Docs\n');
  if (!mdBroken.length) {
    lines.push('_No broken internal links._\n');
  } else {
    const byFile: Record<string, BrokenInternalLink[]> = {};
    for (const item of mdBroken) {
      if (!byFile[item.source]) byFile[item.source] = [];
      byFile[item.source].push(item);
    }
    for (const source of Object.keys(byFile).sort()) {
      lines.push(`### \`${makeShortPath(source, DOCS_DIR)}\`\n`);
      lines.push('| Link Text | URL | Resolved Path | Reason |');
      lines.push('|---|---|---|---|');
      for (const item of byFile[source]) {
        const text     = (item.linkText || '').replace(/\|/g, '\\|').slice(0, 60);
        const u        = (item.linkUrl  || '').replace(/\|/g, '\\|').slice(0, 80);
        const resolved = makeShortPath(item.resolved, DOCS_DIR).replace(/\|/g, '\\|').slice(0, 100);
        const reason   = (item.reason || '').replace(/\|/g, '\\|');
        lines.push(`| ${text} | \`${u}\` | \`${resolved}\` | ${reason} |`);
      }
      lines.push('');
    }
  }

  lines.push('---\n');
  lines.push('## Section 2: External 404s\n');
  const all404 = { ...ext404, ...extInternal };
  if (!Object.keys(all404).length) {
    lines.push('_No external 404s found._\n');
  } else {
    lines.push('| URL | Notes | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(all404).sort()) {
      const instances = fmtInstances(extUrlToSrc[u]);
      const codeStr   = r.status === STATUS_INTERNAL ? 'Not found in local build' : (r.httpCode ? `HTTP ${r.httpCode}` : r.errorMsg || '');
      lines.push(`| \`${u.slice(0, 100)}\` | ${codeStr} | ${instances} |`);
    }
    lines.push('');
  }

  lines.push('---\n');
  lines.push('## Section 3: Down / Connection Refused\n');
  if (!Object.keys(extDown).length) {
    lines.push('_No unreachable external links._\n');
  } else {
    lines.push('| URL | Error | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(extDown).sort()) {
      lines.push(`| \`${u.slice(0, 100)}\` | ${r.errorMsg || ''} | ${fmtInstances(extUrlToSrc[u])} |`);
    }
    lines.push('');
  }

  lines.push('---\n');
  lines.push('## Section 4: Stale Redirects (Update to Final URL)\n');
  if (!Object.keys(extRedirect).length) {
    lines.push('_No stale redirects found._\n');
  } else {
    lines.push('| Original URL | Instances (Link Text — File) |');
    lines.push('|---|---|');
    for (const [u] of Object.entries(extRedirect).sort()) {
      lines.push(`| \`${u.slice(0, 80)}\` | ${fmtInstances(extUrlToSrc[u])} |`);
    }
    lines.push('');
  }

  if (Object.keys(extError).length) {
    lines.push('---\n');
    lines.push('## Section 5: External Check Errors (timeout / misc)\n');
    lines.push('| URL | Error | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(extError).sort()) {
      lines.push(`| \`${u.slice(0, 100)}\` | ${r.errorMsg || ''} | ${fmtInstances(extUrlToSrc[u])} |`);
    }
    lines.push('');
  }

  lines.push('---\n');
  lines.push('## Section 6: Broken Links in Build Output\n');
  lines.push('_Deduplicated by (url, reason) pattern._\n');
  if (!deduped.length) {
    lines.push('_No broken links in build output._\n');
  } else {
    lines.push('| Count | URL | Reason | Example Source |');
    lines.push('|---|---|---|---|');
    for (const item of deduped.sort((a, b) => b.count - a.count)) {
      const u       = (item.linkUrl || '').replace(/\|/g, '\\|').slice(0, 80);
      const reason  = (item.reason  || '').replace(/\|/g, '\\|');
      const example = makeShortPath(item.exampleSources[0], BUILD_DIR).replace(/\|/g, '\\|').slice(0, 80);
      lines.push(`| ${item.count} | \`${u}\` | ${reason} | \`${example}\` |`);
    }
    lines.push('');
  }

  if (llmsTxtResult) {
    lines.push('---\n');
    lines.push('## Section 7: llms.txt Coverage\n');
    lines.push('_Compares `static/llms.txt` entries against the build output._\n');
    if (llmsTxtResult.stale.length) {
      lines.push('### Stale entries (in llms.txt but not in build)\n');
      for (const p of llmsTxtResult.stale) lines.push(`- \`https://${SITE_DOMAIN}/docs/${p}\``);
      lines.push('');
    } else {
      lines.push('_No stale llms.txt entries._\n');
    }
    if (llmsTxtResult.missing.length) {
      lines.push('### Missing pages (in build but not in llms.txt)\n');
      for (const p of llmsTxtResult.missing) lines.push(`- \`https://${SITE_DOMAIN}/docs/${p}\``);
      lines.push('');
    } else {
      lines.push('_No missing pages._\n');
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(`Report written to: ${REPORT_PATH}`);
}

function writeHumanReport(
  mdBroken: BrokenInternalLink[],
  extResults: ExtResults,
  extUrlToSrc: ExtUrlToSrc,
  _mdFilesChecked: number,
  _mdLinksChecked: number,
  _mdTotalFiles: number,
  _htmlBroken: BrokenHtmlLink[],
  _htmlFilesChecked: number,
  _htmlLinksChecked: number,
  _htmlTotalFiles: number,
  llmsTxtResult: LlmsTxtResult | null = null,
  _stagedReplacements: Record<string, string> = {},
): void {
  const today = new Date().toISOString().slice(0, 10);

  const ext404      = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_404));
  const extDown     = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_DOWN));
  const extRedirect = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_REDIRECT));
  const extInternal = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_INTERNAL));
  const extError    = Object.fromEntries(Object.entries(extResults).filter(([, r]) => r.status === STATUS_ERROR));

  const self404 = { ...extInternal };
  const real404 = { ...ext404 };

  const nDead      = mdBroken.length + Object.keys(self404).length + Object.keys(real404).length;
  const nDown      = Object.keys(extDown).length;
  const nRedirects = Object.keys(extRedirect).length;
  const nErrors    = Object.keys(extError).length;
  const nTotal     = nDead + nDown + nRedirects;

  const lines: string[] = [];
  lines.push('## Context\n');
  lines.push(`Dead link audit of ${SITE_DOMAIN} found **${nTotal}** broken, down, or stale links. Audit date: ${today}.\n`);

  lines.push('---\n');
  lines.push('## Dead Links (404)\n');
  if (!mdBroken.length && !Object.keys(self404).length && !Object.keys(real404).length) {
    lines.push('_No dead links found._\n');
  } else {
    lines.push('| Dead Link | Status | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const item of mdBroken) {
      const u         = (item.linkUrl || '').replace(/\|/g, '\\|');
      const reason    = (item.reason  || '').replace(/\|/g, '\\|');
      const instances = fmtInstances([{ file: item.source, text: item.linkText || '' }]);
      lines.push(`| \`${u}\` | **Broken** — ${reason} | ${instances} |`);
    }
    for (const [u] of Object.entries(self404).sort()) {
      lines.push(`| ${u} | **404** — not found in local build (old path?) | ${fmtInstances(extUrlToSrc[u])} |`);
    }
    for (const [u] of Object.entries(real404).sort()) {
      lines.push(`| ${u} | **404** | ${fmtInstances(extUrlToSrc[u])} |`);
    }
  }
  lines.push('');

  lines.push('---\n');
  lines.push('## Forbidden / Down\n');
  if (!nDown) {
    lines.push('_No unreachable links._\n');
  } else {
    lines.push('| Dead Link | Status | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(extDown).sort()) {
      const err = r.errorMsg || 'connection failed';
      let status: string;
      if (/DNS|getaddrinfo/i.test(err)) status = '**DNS failure** — domain not found';
      else if (/ECONNREFUSED|Connection refused/i.test(err)) status = '**ECONNREFUSED** — server down';
      else if (/timed out|timeout/i.test(err)) status = '**Timeout** — server unresponsive';
      else if (/ssl|SSL/i.test(err)) status = '**SSL error** — handshake failure';
      else status = `**Down** — ${err.slice(0, 80)}`;
      lines.push(`| ${u} | ${status} | ${fmtInstances(extUrlToSrc[u])} |`);
    }
  }
  lines.push('');

  lines.push('---\n');
  lines.push('## Stale Redirects (Should Update)\n');
  if (!nRedirects) {
    lines.push('_No stale redirects._\n');
  } else {
    lines.push('| Old Link | Instances (Link Text — File) |');
    lines.push('|---|---|');
    for (const [u] of Object.entries(extRedirect).sort()) {
      lines.push(`| ${u} | ${fmtInstances(extUrlToSrc[u])} |`);
    }
  }
  lines.push('');

  if (nErrors) {
    lines.push('---\n');
    lines.push('## Check Errors (timeout / blocked)\n');
    lines.push('_These URLs could not be verified — check manually._\n');
    lines.push('| URL | Error | Instances (Link Text — File) |');
    lines.push('|---|---|---|');
    for (const [u, r] of Object.entries(extError).sort()) {
      lines.push(`| ${u} | ${r.errorMsg || ''} | ${fmtInstances(extUrlToSrc[u])} |`);
    }
    lines.push('');
  }

  lines.push('---\n');
  lines.push('## Summary\n');
  lines.push(`- **Broken internal links:** ${mdBroken.length}`);
  lines.push(`- **Hard 404s (external):** ${Object.keys(real404).length + Object.keys(self404).length}`);
  lines.push(`- **Forbidden / Down:** ${nDown}`);
  lines.push(`- **Stale redirects:** ${nRedirects}`);
  if (nErrors) lines.push(`- **Check errors (unverified):** ${nErrors}`);
  lines.push(`- **Total actionable:** ${nTotal}`);
  if (llmsTxtResult && (llmsTxtResult.stale.length || llmsTxtResult.missing.length)) {
    lines.push(`- **llms.txt stale entries:** ${llmsTxtResult.stale.length}`);
    lines.push(`- **llms.txt missing pages:** ${llmsTxtResult.missing.length}`);
  }
  lines.push('');

  lines.push('---\n');
  lines.push('## Priority\n');
  const priority: string[] = [];
  if (mdBroken.length)               priority.push(`${priority.length + 1}. Fix ${mdBroken.length} broken internal links (wrong paths / missing anchors)`);
  if (Object.keys(self404).length)   priority.push(`${priority.length + 1}. Update ${Object.keys(self404).length} old self-referential \`${SITE_DOMAIN}\` path(s) to current URLs`);
  if (Object.keys(real404).length)   priority.push(`${priority.length + 1}. Remove or replace ${Object.keys(real404).length} dead external link(s) (HTTP 404)`);
  if (nDown)                         priority.push(`${priority.length + 1}. Evaluate ${nDown} down/refused server link(s) — remove or replace`);
  if (nRedirects)                    priority.push(`${priority.length + 1}. Update ${nRedirects} stale redirect(s) to their final URL`);
  if (nErrors)                       priority.push(`${priority.length + 1}. Manually verify ${nErrors} URL(s) that returned errors during check`);
  if (llmsTxtResult?.stale.length)   priority.push(`${priority.length + 1}. Fix ${llmsTxtResult.stale.length} stale llms.txt entry/entries (page removed or renamed)`);
  if (llmsTxtResult?.missing.length) priority.push(`${priority.length + 1}. Review ${llmsTxtResult.missing.length} page(s) missing from llms.txt`);
  for (const item of priority) lines.push(item);
  lines.push('');

  fs.mkdirSync(path.dirname(HUMAN_REPORT_PATH), { recursive: true });
  fs.writeFileSync(HUMAN_REPORT_PATH, lines.join('\n'), 'utf8');
  console.log(`Human report written to: ${HUMAN_REPORT_PATH}`);
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
// Build helpers
// ─────────────────────────────────────────────

function buildIsOutdated(): boolean {
  let buildMtime: number;
  try { buildMtime = fs.statSync(BUILD_DIR).mtimeMs; }
  catch { return true; }

  const watchDirs  = [DOCS_DIR, STATIC_DIR];
  const watchFiles = [
    path.join(PROJECT_DIR, 'docusaurus.config.mjs'),
    path.join(PROJECT_DIR, 'sidebars.js'),
  ];

  for (const dir of watchDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of walkAll(dir)) {
      try { if (fs.statSync(f).mtimeMs > buildMtime) return true; } catch { }
    }
  }
  for (const f of watchFiles) {
    try { if (fs.existsSync(f) && fs.statSync(f).mtimeMs > buildMtime) return true; } catch { }
  }
  return false;
}

async function triggerBuild(): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string): Promise<string> => new Promise((resolve) => rl.question(q, (a) => { resolve(a); }));

  if (!fs.existsSync(BUILD_DIR)) {
    console.log('\nNo existing build found — running: npm run build');
    console.log('-'.repeat(40));
    const result = spawnSync(NPM, ['run', 'build'], { cwd: PROJECT_DIR, stdio: 'inherit', shell: process.platform === 'win32' });
    console.log('-'.repeat(40));
    rl.close();
    if (result.status !== 0) { console.error('ERROR: Build failed (see output above).'); return false; }
    console.log('Build complete.\n');
    return true;
  }

  const outdated = buildIsOutdated();
  let prompt: string;
  if (outdated) {
    console.log(`\nWARNING: The existing build at ${BUILD_DIR} is outdated`);
    console.log('         (source files have changed since it was last built).');
    prompt = 'Rebuild now to get accurate results? This will overwrite it. [Y/n]: ';
  } else {
    console.log(`\nAn existing build was found at: ${BUILD_DIR} (appears up to date).`);
    prompt = 'Rebuild now anyway? This will overwrite it. [y/N]: ';
  }

  let resp: string;
  try { resp = (await ask(prompt)).trim().toLowerCase(); }
  catch { resp = ''; }
  rl.close();

  const doBuild = outdated ? !['n', 'no'].includes(resp) : ['y', 'yes'].includes(resp);
  if (!doBuild) {
    console.log(outdated ? 'Skipping rebuild — results may not reflect latest changes.\n' : 'Skipping rebuild — using existing build.\n');
    return true;
  }

  console.log('\nRunning: npm run build');
  console.log('-'.repeat(40));
  const result = spawnSync(NPM, ['run', 'build'], { cwd: PROJECT_DIR, stdio: 'inherit', shell: process.platform === 'win32' });
  console.log('-'.repeat(40));
  if (result.status !== 0) { console.error('ERROR: Build failed (see output above).'); return false; }
  console.log('Build complete.\n');
  return true;
}

// ─────────────────────────────────────────────
// Site domain detection
// ─────────────────────────────────────────────

function detectSiteDomain(): string {
  for (const name of ['docusaurus.config.mjs', 'docusaurus.config.js', 'docusaurus.config.ts']) {
    const cfg = path.join(PROJECT_DIR, name);
    if (!fs.existsSync(cfg)) continue;
    try {
      const text = fs.readFileSync(cfg, 'utf8');
      const m    = text.match(/url\s*:\s*['"]https?:\/\/([^/'"]+)['"]/);
      if (m) return m[1];
    } catch { }
  }
  return '';
}

// ─────────────────────────────────────────────
// Filesystem utilities
// ─────────────────────────────────────────────

function safeIsFile(p: string): boolean {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function* walkAll(dir: string): Generator<string> {
  let entries: fs.Dirent[];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkAll(full);
    else if (e.isFile()) yield full;
  }
}

function walkExt(dir: string, exts: string[]): string[] {
  const results: string[] = [];
  for (const f of walkAll(dir)) {
    if (exts.includes(path.extname(f).toLowerCase())) results.push(f);
  }
  return results;
}

function walkGlob(dir: string, filename: string): string[] {
  const results: string[] = [];
  for (const f of walkAll(dir)) {
    if (path.basename(f) === filename) results.push(f);
  }
  return results;
}

function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

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
// Main
// ─────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs();
  const mode = args['mode'] || 'local';

  SITE_DOMAIN = args['site-domain'] || detectSiteDomain();

  if (!SITE_DOMAIN) {
    console.log(
      'WARNING: Could not determine site domain. Self-referential links will not\n' +
      'be checked against the local build.\n' +
      'Pass --site-domain your-site.com to enable this check.'
    );
  }

  // Live mode — delegate to check_live_links
  if (mode === 'live') {
    if (!SITE_DOMAIN) {
      console.error('ERROR: --site-domain is required for live mode.');
      process.exit(1);
    }
    await runLiveCheck({ ...args, 'site-domain': SITE_DOMAIN });
    return;
  }

  // Local mode
  const checkExt = args['no-external'] !== 'true';
  const threads  = parseInt(args['threads'] || String(EXT_THREADS), 10);

  console.log('=== Docusaurus Link Checker — Local Mode ===');
  console.log(`Docs dir  : ${DOCS_DIR}`);
  console.log(`Build dir : ${BUILD_DIR}`);
  console.log(`External  : ${checkExt ? 'enabled' : 'disabled (--no-external)'}`);
  console.log();

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`ERROR: Docs dir not found: ${DOCS_DIR}`);
    process.exit(1);
  }

  if (!await triggerBuild()) process.exit(1);

  console.log('Scanning source docs (internal links)...');
  const { brokenInternal: mdBroken, externalUrlToSrc, filesChecked: mdFiles, linksChecked: mdLinks, total: mdTotal } =
    await checkMarkdownFiles(checkExt);
  console.log(`  Files: ${mdFiles}/${mdTotal}, Links: ${mdLinks}, Broken internal: ${mdBroken.length}`);
  console.log(`  Unique external URLs collected: ${Object.keys(externalUrlToSrc).length}`);

  let extResults: ExtResults = {};
  if (checkExt && Object.keys(externalUrlToSrc).length) {
    console.log(`\nChecking ${Object.keys(externalUrlToSrc).length} external URLs (${threads} threads)...`);
    extResults = await checkExternalUrlsThreaded(externalUrlToSrc, threads);
    const ok       = Object.values(extResults).filter((r) => r.status === STATUS_OK).length;
    const redirect = Object.values(extResults).filter((r) => r.status === STATUS_REDIRECT).length;
    const notFound = Object.values(extResults).filter((r) => [STATUS_404, STATUS_INTERNAL].includes(r.status)).length;
    const down     = Object.values(extResults).filter((r) => r.status === STATUS_DOWN).length;
    const errors   = Object.values(extResults).filter((r) => r.status === STATUS_ERROR).length;
    console.log(`  OK: ${ok}  Redirect: ${redirect}  404: ${notFound}  Down: ${down}  Error: ${errors}`);
  }

  let htmlBroken: BrokenHtmlLink[] = [], htmlFiles = 0, htmlLinks = 0, htmlTotal = 0;
  if (fs.existsSync(BUILD_DIR)) {
    console.log('\nChecking build output (HTML internal links)...');
    ({ broken: htmlBroken, filesChecked: htmlFiles, linksChecked: htmlLinks, total: htmlTotal } = checkHtmlFiles());
    console.log(`  Files: ${htmlFiles}/${htmlTotal}, Links: ${htmlLinks}, Broken: ${htmlBroken.length}`);
  }

  const llmsTxtResult = checkLlmsTxt();
  if (llmsTxtResult) {
    console.log(`\nChecking llms.txt coverage...`);
    console.log(`  Stale entries: ${llmsTxtResult.stale.length}, Missing pages: ${llmsTxtResult.missing.length}`);
  }

  const staged = getStagedUrlReplacements();
  if (Object.keys(staged).length) console.log(`\nFound ${Object.keys(staged).length} staged URL replacement(s) from git diff.`);

  console.log('\nWriting report...');
  writeReport(
    mdBroken, extResults, externalUrlToSrc,
    mdFiles, mdLinks, mdTotal,
    htmlBroken, htmlFiles, htmlLinks, htmlTotal,
    llmsTxtResult, staged,
  );
  writeHumanReport(
    mdBroken, extResults, externalUrlToSrc,
    mdFiles, mdLinks, mdTotal,
    htmlBroken, htmlFiles, htmlLinks, htmlTotal,
    llmsTxtResult, staged,
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
