#!/usr/bin/env python3
"""
Live site link checker for docs.ethswarm.org.

Fetches all pages listed in the sitemap, extracts every <a href> link,
then checks each link with explicit redirect handling (no auto-following).

Usage:
    python scripts/check_live_links.py [--threads N] [--max-pages N]
    npm run check:links  (then select live mode)

Output:
    .claude/live_links_audit.md   — human-readable report
"""

import re
import sys
import time
import queue
import socket
import threading
import http.client
import subprocess
import xml.etree.ElementTree as ET
import argparse
import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, urljoin, unquote
from urllib.request import Request, urlopen, HTTPRedirectHandler, build_opener
from urllib.error import URLError, HTTPError
from collections import defaultdict

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

SITE_BASE    = "https://docs.ethswarm.org"
SITEMAP_URL  = f"{SITE_BASE}/sitemap.xml"
PROJECT_DIR  = Path(__file__).resolve().parent.parent
REPORT_PATH  = PROJECT_DIR / "link-reports/live_links_audit.md"

EXT_TIMEOUT = 15   # seconds per HTTP request
EXT_THREADS = 8    # concurrent URL checkers
EXT_DELAY   = 0.05 # seconds between requests per thread

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0 Safari/537.36 bee-docs-live-checker/1.0"
)

IGNORE_SCHEMES = ("mailto:", "javascript:", "tel:", "ftp:", "data:", "#")
IGNORE_HOSTS   = ("localhost", "127.0.0.1", "192.168.", "10.0.", "0.0.0.0")
# Hostnames that end with these suffixes are placeholder/example URLs in docs
IGNORE_HOST_SUFFIXES = (".example", ".local", ".invalid", ".test")

# URL substrings to silently ignore — systematic redirects that aren't actionable doc fixes.
# e.g. every page has an "Edit this page" link using the old GitHub repo name.
IGNORE_URL_PATTERNS = (
    "github.com/ethersphere/docs.github.io",  # "Edit this page" links using old repo name
)

# Hostnames to ignore because they are example/template values in documentation
IGNORE_EXAMPLE_HOSTS = (
    "yourname.eth.limo",
    "yourname.bzz.link",
    "bee-1",       # example service hostname in docker/gateway examples
)

EXT_STATUS_OK       = 'ok'
EXT_STATUS_404      = '404'
EXT_STATUS_DOWN     = 'down'
EXT_STATUS_REDIRECT = 'redirect'
EXT_STATUS_ERROR    = 'error'


# ─────────────────────────────────────────────
# HTTP helpers (explicit redirect handling)
# ─────────────────────────────────────────────

class _NoFollowRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _build_no_redirect_opener():
    return build_opener(_NoFollowRedirectHandler())


def _fetch(url, method='HEAD', follow_redirects=False, timeout=EXT_TIMEOUT):
    """
    Single HTTP request.
    Returns (status_code, final_url, location_header, error_str).
    """
    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
    }
    try:
        req = Request(url, headers=headers, method=method)
        if follow_redirects:
            with urlopen(req, timeout=timeout) as resp:
                return resp.status, resp.url, None, None
        else:
            opener = _build_no_redirect_opener()
            with opener.open(req, timeout=timeout) as resp:
                return resp.status, url, resp.headers.get('Location'), None
    except HTTPError as e:
        loc = e.headers.get('Location') if hasattr(e, 'headers') and e.headers else None
        return e.code, url, loc, None
    except (URLError, socket.timeout, socket.error, ConnectionRefusedError,
            http.client.RemoteDisconnected, http.client.IncompleteRead) as e:
        return None, url, None, str(e)
    except Exception as e:
        return None, url, None, f'{type(e).__name__}: {str(e)[:120]}'


def _classify_err(result, err):
    if 'ECONNREFUSED' in err or 'Connection refused' in err:
        result.update(status=EXT_STATUS_DOWN, error_msg='ECONNREFUSED — server down')
    elif ('Name or service not known' in err or 'getaddrinfo' in err
          or 'nodename' in err.lower() or 'No address' in err):
        result.update(status=EXT_STATUS_DOWN, error_msg='DNS resolution failed')
    elif 'timed out' in err.lower() or 'timeout' in err.lower():
        result.update(status=EXT_STATUS_DOWN, error_msg='Connection timed out')
    elif 'SSL' in err or 'ssl' in err:
        result.update(status=EXT_STATUS_DOWN, error_msg=f'SSL error: {err[:80]}')
    else:
        result.update(status=EXT_STATUS_DOWN, error_msg=f'Connection error: {err[:80]}')
    return result


def _urls_differ(original, final):
    if not final or original == final:
        return False
    o, f = urlparse(original), urlparse(final)
    op, fp = o.path.rstrip('/'), f.path.rstrip('/')
    if o.netloc == f.netloc and op == fp and o.query == f.query:
        return False
    if o.netloc == f.netloc and op == fp and o.scheme == 'http' and f.scheme == 'https':
        return False
    return True


def _check_dest(dest_url):
    """Follow redirect destination and verify it returns 200."""
    code, final, _, err = _fetch(dest_url, method='HEAD', follow_redirects=True)
    if err:
        return None, dest_url, err
    if code in (403, 405):
        code, final, _, err = _fetch(dest_url, method='GET', follow_redirects=True)
        if err:
            return None, dest_url, err
    return code, final or dest_url, None


def check_url(url):
    """
    Check a single URL with explicit redirect handling.
    Returns dict: {url, status, http_code, final_url, error_msg}
    """
    result = dict(url=url, status=EXT_STATUS_ERROR,
                  http_code=None, final_url=None, error_msg=None)

    # Step 1: HEAD without following redirects
    code, _, location, err = _fetch(url, method='HEAD', follow_redirects=False)
    if err:
        return _classify_err(result, err)

    # HEAD rejected → retry with GET
    if code in (403, 405):
        code, _, location, err = _fetch(url, method='GET', follow_redirects=False)
        if err:
            return _classify_err(result, err)
        if code in (403, 405):
            result.update(status=EXT_STATUS_ERROR, http_code=code,
                          error_msg=f'HTTP {code} (GET retry)', final_url=url)
            return result

    result['http_code'] = code

    if code is None:
        result['status'] = EXT_STATUS_ERROR
        return result
    if code == 200:
        result.update(status=EXT_STATUS_OK, final_url=url)
    elif code == 404:
        result.update(status=EXT_STATUS_404, error_msg='HTTP 404', final_url=url)
    elif code in (301, 302, 303, 307, 308):
        dest = location or url
        if dest and not dest.startswith('http'):
            p = urlparse(url)
            dest = f"{p.scheme}://{p.netloc}{dest}"
        dest_code, dest_final, dest_err = _check_dest(dest)
        if dest_err:
            result.update(status=EXT_STATUS_DOWN,
                          error_msg=f"Redirect to {dest!r} failed: {dest_err[:80]}",
                          final_url=dest)
        elif dest_code is None:
            result.update(status=EXT_STATUS_DOWN,
                          error_msg=f"Redirect destination unreachable",
                          final_url=dest)
        elif dest_code == 200:
            if _urls_differ(url, dest_final):
                result.update(status=EXT_STATUS_REDIRECT, final_url=dest_final)
            else:
                result.update(status=EXT_STATUS_OK, final_url=dest_final)
        elif dest_code == 404:
            result.update(status=EXT_STATUS_404,
                          error_msg=f"Redirect target returned 404",
                          final_url=dest)
        else:
            result.update(status=EXT_STATUS_ERROR,
                          error_msg=f"Redirect target returned HTTP {dest_code}",
                          final_url=dest)
    elif 200 <= code < 300:
        result.update(status=EXT_STATUS_OK, final_url=url)
    else:
        result.update(status=EXT_STATUS_ERROR,
                      error_msg=f'HTTP {code}', final_url=url)

    return result


# ─────────────────────────────────────────────
# Sitemap fetcher
# ─────────────────────────────────────────────

def fetch_sitemap_urls(sitemap_url):
    """Fetch sitemap.xml and return list of page URLs."""
    print(f"Fetching sitemap: {sitemap_url}")
    try:
        req = Request(sitemap_url, headers={'User-Agent': USER_AGENT})
        with urlopen(req, timeout=30) as resp:
            xml_data = resp.read()
    except Exception as e:
        print(f"ERROR fetching sitemap: {e}", file=sys.stderr)
        return []

    urls = []
    try:
        root = ET.fromstring(xml_data)
        # Handle namespace
        ns = ''
        if root.tag.startswith('{'):
            ns = root.tag.split('}')[0] + '}'
        for loc in root.iter(f'{ns}loc'):
            u = loc.text.strip() if loc.text else ''
            if u:
                urls.append(u)
    except ET.ParseError as e:
        print(f"ERROR parsing sitemap XML: {e}", file=sys.stderr)

    print(f"  Found {len(urls)} URLs in sitemap")
    return urls


# ─────────────────────────────────────────────
# HTML link extractor
# ─────────────────────────────────────────────

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links_with_text = []  # list of (href, link_text) from <a> tags
        self.text_chunks = []      # all visible text (including code blocks) for bare URL extraction
        self._skip_depth = 0       # depth inside <script>/<style> — skip those text nodes
        self._pending_href = None  # href of the currently open <a> tag
        self._a_text_buf = []      # text buffer for the currently open <a> tag

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self._skip_depth += 1
        if tag == 'a' and 'href' in attrs:
            href = attrs['href'].strip()
            if href:
                self._pending_href = href
                self._a_text_buf = []

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self._skip_depth = max(0, self._skip_depth - 1)
        if tag == 'a':
            if self._pending_href:
                link_text = ' '.join(self._a_text_buf).strip()
                self.links_with_text.append((self._pending_href, link_text))
            self._pending_href = None
            self._a_text_buf = []

    def handle_data(self, data):
        # Collect all visible text (prose AND code blocks), skip script/style
        if self._skip_depth == 0:
            self.text_chunks.append(data)
            if self._pending_href is not None:
                self._a_text_buf.append(data)


def _normalise_url(raw, page_url):
    """
    Convert a raw href or bare URL string to an absolute, fragment-stripped URL.
    Returns the normalised URL string, or None if it should be skipped.
    """
    if not raw or raw == '#' or raw.startswith('#'):
        return None
    if any(raw.startswith(s) for s in IGNORE_SCHEMES):
        return None
    # Strip fragment
    url = raw.split('#')[0] if '#' in raw else raw
    if not url:
        return None
    # Make absolute (handles both already-absolute and relative URLs)
    abs_url = urljoin(page_url, url) if not url.startswith('http') else url
    parsed = urlparse(abs_url)
    if not parsed.scheme.startswith('http'):
        return None
    host = parsed.hostname or ''
    if any(host.startswith(h) for h in IGNORE_HOSTS):
        return None
    if any(host.endswith(s) for s in IGNORE_HOST_SUFFIXES):
        return None
    if host in IGNORE_EXAMPLE_HOSTS or any(host.startswith(h) for h in IGNORE_EXAMPLE_HOSTS):
        return None
    if any(pat in abs_url for pat in IGNORE_URL_PATTERNS):
        return None
    return abs_url


def fetch_page_links(page_url):
    """
    Fetch a live page and return list of absolute URLs referenced from it.

    Extracts URLs from two sources:
      1. <a href> anchor tags
      2. Bare http(s):// URLs appearing in prose and code blocks
         (catches links not wrapped in anchor tags)

    Returns (links_list, error_str_or_None).
    links_list: deduplicated, filtered list of absolute URL strings.
    """
    try:
        req = Request(page_url, headers={'User-Agent': USER_AGENT,
                                          'Accept': 'text/html'})
        with urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        return [], str(e)

    parser = LinkExtractor()
    parser.feed(html)

    seen = set()
    links_with_text = []   # list of (normalised_url, link_text)

    def _add(url, text=''):
        n = _normalise_url(url, page_url)
        if n and n not in seen:
            seen.add(n)
            links_with_text.append((n, text))

    # Source 1: <a href> links (with captured link text)
    for href, text in parser.links_with_text:
        _add(href, text)

    # Source 2: bare URLs in all visible text (prose + code blocks).
    # Join with a space so adjacent text nodes don't concatenate into garbled URLs
    # e.g. "https://example.com" + "may" → "https://example.com may" not "https://example.commay"
    full_text = ' '.join(parser.text_chunks)
    for m in re.finditer(r'https?://[^\s\]>"\'\\<`*]+', full_text):
        raw = m.group(0).rstrip('.,;:!)')
        # Strip trailing unbalanced close-parens
        while raw.endswith(')') and raw.count('(') < raw.count(')'):
            raw = raw[:-1]
        _add(raw, '')   # bare URLs have no link text

    return links_with_text, None


# ─────────────────────────────────────────────
# Parallel URL checker
# ─────────────────────────────────────────────

def check_urls_threaded(url_to_sources, threads=EXT_THREADS):
    """
    Check a dict of {url: [source_pages]} concurrently.
    Returns dict of {url: check_result}.
    """
    urls    = list(url_to_sources.keys())
    results = {}
    lock    = threading.Lock()
    q       = queue.Queue()
    total   = len(urls)
    done    = [0]

    for url in urls:
        q.put(url)

    def worker():
        while True:
            try:
                url = q.get_nowait()
            except queue.Empty:
                break
            time.sleep(EXT_DELAY)
            res = check_url(url)
            with lock:
                results[url] = res
                done[0] += 1
                n = done[0]
                if n % 20 == 0 or n == total:
                    print(f"  Checked {n}/{total} URLs...", end='\r', flush=True)
            q.task_done()

    ts = [threading.Thread(target=worker, daemon=True)
          for _ in range(min(threads, max(1, len(urls))))]
    for t in ts:
        t.start()
    for t in ts:
        t.join()
    print()
    return results


# ─────────────────────────────────────────────
# Staged-changes URL replacement map
# ─────────────────────────────────────────────

def get_staged_url_replacements():
    """
    Parse `git diff --cached` to find URL replacements in staged changes.
    Within each diff hunk, URLs removed (- lines) are matched to URLs added
    (+ lines) in order. Returns {old_url: new_url}.
    """
    url_re = re.compile(r'https?://[^\s\])"\'<>`\\]+')
    try:
        result = subprocess.run(
            ['git', 'diff', '--cached', '--unified=0'],
            cwd=str(PROJECT_DIR),
            capture_output=True, text=True,
        )
        if result.returncode != 0 or not result.stdout:
            return {}
    except Exception:
        return {}

    replacements = {}
    removed, added = [], []

    def _flush():
        removed_set = set(removed)
        added_set   = set(added)
        gone = [u for u in removed if u not in added_set]
        new  = [u for u in added  if u not in removed_set]
        if gone and new:
            for old, new_url in zip(gone, new):
                replacements[old] = new_url

    for line in result.stdout.splitlines():
        if line.startswith(('diff --git', 'index ', '--- ', '+++ ')):
            continue
        if line.startswith('@@'):
            _flush()
            removed, added = [], []
        elif line.startswith('-'):
            removed.extend(url_re.findall(line[1:]))
        elif line.startswith('+'):
            added.extend(url_re.findall(line[1:]))
    _flush()
    return replacements


# ─────────────────────────────────────────────
# Report writer
# ─────────────────────────────────────────────

def write_report(url_to_sources, results, pages_crawled, total_links_found, staged_replacements=None):
    today = datetime.date.today().isoformat()

    broken_404  = {u: r for u, r in results.items() if r['status'] == EXT_STATUS_404}
    broken_down = {u: r for u, r in results.items() if r['status'] == EXT_STATUS_DOWN}
    redirects   = {u: r for u, r in results.items() if r['status'] == EXT_STATUS_REDIRECT}
    errors      = {u: r for u, r in results.items() if r['status'] == EXT_STATUS_ERROR}

    n_action = len(broken_404) + len(broken_down) + len(redirects)
    _staged  = staged_replacements or {}

    def _repl(url, res):
        """Return the best replacement URL: staged fix first, then redirect final_url."""
        if url in _staged:
            return _staged[url]
        final = (res or {}).get('final_url') or ''
        return final if final and final != url else ''

    def fmt_instances(url):
        """Return bullet-point instances as a single string with <br> separators."""
        srcs = url_to_sources.get(url, [])
        if not srcs:
            return "_unknown_"
        bullets = []
        for page_url, link_text in srcs:
            safe_text = (link_text or '').strip().replace('|', '\\|')[:80]
            safe_page = page_url.replace('|', '\\|')
            if safe_text:
                bullets.append(f'• "{safe_text}" — [{safe_page}]({safe_page})')
            else:
                bullets.append(f'• [{safe_page}]({safe_page})')
        return "<br>".join(bullets)

    lines = []
    lines.append("## Context\n")
    lines.append(f"Dead link audit of docs.ethswarm.org found **{n_action}** broken, down, or stale links. Audit date: {today}.\n")
    lines.append("")

    # 404s
    lines.append("---\n")
    lines.append("## Dead Links (404)\n")
    if broken_404:
        lines.append("| Dead Link | Replacement URL | Status | Instances (Link Text — Source Page) |")
        lines.append("|---|---|---|---|")
        for url, res in sorted(broken_404.items()):
            instances = fmt_instances(url)
            err       = res.get('error_msg') or 'HTTP 404'
            repl      = _repl(url, res)
            lines.append(f"| {url} | {repl} | **Broken** — {err} | {instances} |")
    else:
        lines.append("_No 404s found._")
    lines.append("")

    # Down / refused
    lines.append("---\n")
    lines.append("## Forbidden / Down\n")
    if broken_down:
        lines.append("| Dead Link | Replacement URL | Status | Instances (Link Text — Source Page) |")
        lines.append("|---|---|---|---|")
        for url, res in sorted(broken_down.items()):
            instances = fmt_instances(url)
            err       = res.get('error_msg') or 'Connection error'
            repl      = _repl(url, res)
            lines.append(f"| {url} | {repl} | **{err}** | {instances} |")
    else:
        lines.append("_No down/refused links found._")
    lines.append("")

    # Stale redirects
    lines.append("---\n")
    lines.append("## Stale Redirects (Should Update)\n")
    if redirects:
        lines.append("| Old Link | Redirects To | Instances (Link Text — Source Page) |")
        lines.append("|---|---|---|")
        for url, res in sorted(redirects.items()):
            instances = fmt_instances(url)
            repl      = _repl(url, res)
            lines.append(f"| {url} | {repl} | {instances} |")
    else:
        lines.append("_No stale redirects found._")
    lines.append("")

    # Errors
    if errors:
        lines.append("---\n")
        lines.append("## Check Errors (timeout / blocked)\n")
        lines.append("_These URLs could not be verified — check manually._\n")
        lines.append("| URL | Error | Instances (Link Text — Source Page) |")
        lines.append("|---|---|---|")
        for url, res in sorted(errors.items()):
            instances = fmt_instances(url)
            err = res.get('error_msg') or ''
            lines.append(f"| {url} | {err} | {instances} |")
        lines.append("")

    # Summary
    lines.append("---\n")
    lines.append("## Summary\n")
    lines.append(f"- **Pages crawled:** {pages_crawled}")
    lines.append(f"- **Unique URLs checked:** {len(results)}")
    lines.append(f"- **Broken internal links:** {sum(1 for u in broken_404 if SITE_BASE in u)}")
    lines.append(f"- **Hard 404s (external):** {sum(1 for u in broken_404 if SITE_BASE not in u)}")
    lines.append(f"- **Forbidden / Down:** {len(broken_down)}")
    lines.append(f"- **Stale redirects:** {len(redirects)}")
    lines.append(f"- **Check errors (unverified):** {len(errors)}")
    lines.append(f"- **Total actionable:** {n_action}")
    lines.append("")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text('\n'.join(lines), encoding='utf-8')
    print(f"\nReport written to: {REPORT_PATH}")


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Check links on the live docs site.')
    parser.add_argument('--threads',   type=int, default=EXT_THREADS,
                        help='Concurrent URL checker threads (default: 8)')
    parser.add_argument('--max-pages', type=int, default=0,
                        help='Max pages to crawl (0 = all)')
    args = parser.parse_args()

    # 1. Fetch all page URLs from sitemap
    page_urls = fetch_sitemap_urls(SITEMAP_URL)
    if not page_urls:
        print("No pages found in sitemap. Exiting.", file=sys.stderr)
        sys.exit(1)

    if args.max_pages > 0:
        page_urls = page_urls[:args.max_pages]

    # 2. Fetch each page and collect links
    print(f"\nCrawling {len(page_urls)} pages to extract links...")
    url_to_sources = defaultdict(list)   # {link_url: [(source_page_url, link_text), ...]}
    fetch_errors = []

    for i, page_url in enumerate(page_urls, 1):
        if i % 20 == 0 or i == len(page_urls):
            print(f"  Crawling page {i}/{len(page_urls)}...", end='\r', flush=True)
        links_with_text, err = fetch_page_links(page_url)
        if err:
            fetch_errors.append((page_url, err))
        for link_url, link_text in links_with_text:
            url_to_sources[link_url].append((page_url, link_text))

    print(f"\n  Found {len(url_to_sources)} unique URLs across {len(page_urls)} pages")
    if fetch_errors:
        print(f"  WARNING: {len(fetch_errors)} pages failed to fetch")

    # 3. Check all collected URLs
    print(f"\nChecking {len(url_to_sources)} URLs ({args.threads} threads)...")
    results = check_urls_threaded(dict(url_to_sources), threads=args.threads)

    # 4. Print summary to console
    broken_404  = [u for u, r in results.items() if r['status'] == EXT_STATUS_404]
    broken_down = [u for u, r in results.items() if r['status'] == EXT_STATUS_DOWN]
    redirects   = [u for u, r in results.items() if r['status'] == EXT_STATUS_REDIRECT]
    errors_list = [u for u, r in results.items() if r['status'] == EXT_STATUS_ERROR]

    print(f"\n{'='*60}")
    print(f"RESULTS")
    print(f"{'='*60}")
    print(f"Pages crawled:     {len(page_urls)}")
    print(f"Unique URLs:       {len(results)}")
    print(f"404 (broken):      {len(broken_404)}")
    print(f"Down / refused:    {len(broken_down)}")
    print(f"Stale redirects:   {len(redirects)}")
    print(f"Errors/timeouts:   {len(errors_list)}")
    print(f"{'='*60}")

    if broken_404:
        print("\n── 404 Broken Links ──")
        for url in sorted(broken_404):
            srcs = url_to_sources.get(url, [])
            src_page, src_text = srcs[0] if srcs else ('?', '')
            print(f"  [404] {url}")
            print(f"        from: {src_page}" + (f' ("{src_text}")' if src_text else ''))

    if broken_down:
        print("\n── Down / Refused ──")
        for url in sorted(broken_down):
            err  = results[url].get('error_msg', '')
            srcs = url_to_sources.get(url, [])
            src_page, src_text = srcs[0] if srcs else ('?', '')
            print(f"  [DOWN] {url}")
            print(f"         {err}")
            print(f"         from: {src_page}" + (f' ("{src_text}")' if src_text else ''))

    if redirects:
        print("\n── Stale Redirects ──")
        for url in sorted(redirects):
            final = results[url].get('final_url', '?')
            srcs  = url_to_sources.get(url, [])
            src_page, src_text = srcs[0] if srcs else ('?', '')
            print(f"  [REDIR] {url}")
            print(f"          → {final}")
            print(f"          from: {src_page}" + (f' ("{src_text}")' if src_text else ''))

    # 5. Write report
    staged = get_staged_url_replacements()
    if staged:
        print(f"\nFound {len(staged)} staged URL replacement(s) from git diff.")
    write_report(dict(url_to_sources), results,
                 pages_crawled=len(page_urls),
                 total_links_found=len(url_to_sources),
                 staged_replacements=staged)


if __name__ == '__main__':
    main()
