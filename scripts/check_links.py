#!/usr/bin/env python3
"""
Link checker for bee-docs Docusaurus site.
Checks:
  1. Internal links in source docs (markdown/mdx) — verified against the BUILD output:
       • page existence checked by looking up the corresponding HTML file in build/
       • anchor existence checked by reading actual id attributes from rendered HTML
       No slug inference — only what Docusaurus actually produced is trusted.
  2. Internal links in build output (HTML) — file existence + anchors
  3. External links in source docs — real HTTP requests (HEAD/GET)

Requirements: run 'npm run build' before running this script so build/ is current.

Usage:
    python scripts/check_links.py [--no-external] [--threads N]
    npm run check:links
"""

import os
import re
import sys
import time
import threading
import queue
import subprocess
from pathlib import Path

# On Windows, npm is a .cmd script and must be invoked as 'npm.cmd'
_NPM = 'npm.cmd' if sys.platform == 'win32' else 'npm'
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
from collections import defaultdict
from urllib.request import Request, urlopen, HTTPRedirectHandler, build_opener
from urllib.error import URLError, HTTPError
import http.client
import socket
import argparse

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────

PROJECT_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR    = PROJECT_DIR / "docs"
BUILD_DIR   = PROJECT_DIR / "build"
STATIC_DIR  = PROJECT_DIR / "static"
REPORT_PATH       = PROJECT_DIR / "link-reports/dead_links_report.md"
HUMAN_REPORT_PATH = PROJECT_DIR / "link-reports/dead_links_audit.md"

# The live domain — full-URL links using this domain are treated as internal
# and checked against the local build directory instead of via HTTP.
SITE_DOMAIN   = "docs.ethswarm.org"
SITE_BASE_URL = f"https://{SITE_DOMAIN}"

# External link checker settings
EXT_TIMEOUT  = 15   # seconds per request
EXT_THREADS  = 8    # concurrent HTTP workers
EXT_DELAY    = 0.15 # seconds between requests per thread (politeness)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/122.0 Safari/537.36 bee-docs-link-checker/2.0"
)

# Schemes to collect for external checking (everything http/https)
EXTERNAL_SCHEMES = ("http://", "https://")
# Schemes to ignore entirely
IGNORE_SCHEMES   = ("mailto:", "javascript:", "tel:", "ftp:", "data:")

# Internal path prefixes where anchor checking is skipped (JS-rendered pages)
SKIP_ANCHOR_PATHS = (
    "/api/",
    "/api#",
)

# Hostnames/prefixes to skip — example/placeholder URLs in documentation
IGNORE_HOSTS = (
    "localhost",
    "127.0.0.1",
    "192.168.",
    "10.0.",
    "0.0.0.0",
)


# ─────────────────────────────────────────────
# Helpers — markdown link extraction
# ─────────────────────────────────────────────

def strip_code_blocks(content):
    content = re.sub(r'<!--[\s\S]*?-->', '', content)   # HTML comments
    content = re.sub(r'```[^\n]*\n[\s\S]*?```', '', content)
    content = re.sub(r'~~~[^\n]*\n[\s\S]*?~~~', '', content)
    content = re.sub(r'`[^`\n]+`', '', content)
    return content


def extract_md_links(content):
    """Return list of (link_text, url) from markdown content."""
    content = strip_code_blocks(content)
    links = []

    # Inline links: [text](url) or [text](url "title")
    # The URL pattern allows balanced parentheses (e.g. Wikipedia URLs like /wiki/APT_(software))
    for m in re.finditer(r'\[([^\]]*)\]\(((?:[^)(]|\([^)]*\))*?)(?:\s+"[^"]*")?\)', content):
        url = m.group(2).strip().split('"')[0].strip().split("'")[0].strip()
        links.append((m.group(1), url))

    # Reference-style definitions
    ref_defs = {}
    for m in re.finditer(r'^\[([^\]]+)\]:\s*(\S+)', content, re.MULTILINE):
        ref_defs[m.group(1).lower()] = m.group(2)

    # Reference-style uses
    for m in re.finditer(r'\[([^\]]+)\]\[([^\]]*)\]', content):
        text = m.group(1)
        ref  = m.group(2).lower() if m.group(2) else text.lower()
        if ref in ref_defs:
            links.append((text, ref_defs[ref]))

    # HTML anchors and images in markdown
    for m in re.finditer(r'<a\s[^>]*href=["\']([^"\']+)["\']', content, re.IGNORECASE):
        links.append(('', m.group(1)))
    for m in re.finditer(r'<img\s[^>]*src=["\']([^"\']+)["\']', content, re.IGNORECASE):
        links.append(('', m.group(1)))

    # Bare URLs — plain http(s) URLs not inside a markdown link or HTML attribute.
    # Collect all URL positions already captured above to avoid double-reporting.
    seen_spans = set()
    for m in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)', content):
        seen_spans.add(m.start(2))
    for m in re.finditer(r'^\[([^\]]+)\]:\s*(\S+)', content, re.MULTILINE):
        seen_spans.add(m.start(2))
    for m in re.finditer(r'(?:href|src)=["\']([^"\']+)["\']', content, re.IGNORECASE):
        seen_spans.add(m.start(1))

    for m in re.finditer(r'https?://[^\s\]>"\'\\<*`]+', content):
        if m.start() not in seen_spans:
            url = m.group(0).rstrip('.,;:!')
            # Strip trailing unbalanced close-parens
            while url.endswith(')') and url.count('(') < url.count(')'):
                url = url[:-1]
            links.append(('', url))

    return links


# ─────────────────────────────────────────────
# Helpers — build-output link resolution
# ─────────────────────────────────────────────

def _frontmatter_id(md_file):
    """Return the 'id' value from YAML frontmatter, or None."""
    try:
        text = md_file.read_text(encoding='utf-8', errors='replace')
        if not text.startswith('---'):
            return None
        end = text.find('\n---', 3)
        if end == -1:
            return None
        for line in text[3:end].splitlines():
            if line.startswith('id:'):
                return line[3:].strip().strip('"\'')
    except Exception:
        pass
    return None


def _build_docid_map():
    """
    Scan all HTML files in the build and return a dict {doc_id: html_path}.

    Docusaurus embeds the doc ID in the <html> class as 'docs-doc-id-{id}',
    e.g. class="... docs-doc-id-concepts/DISC/disc ...".
    This is the ground truth for what page is at what path — no inference needed.
    """
    mapping = {}
    if not BUILD_DIR.exists():
        return mapping
    for html_file in BUILD_DIR.rglob('index.html'):
        try:
            # Only read the <html> opening tag (first ~500 bytes) for performance
            with html_file.open(encoding='utf-8', errors='replace') as fh:
                head = fh.read(800)
            m = re.search(r'docs-doc-id-([^\s"\']+)', head)
            if m:
                mapping[m.group(1)] = html_file
        except Exception:
            pass
    return mapping


# Populated once at first call to md_path_to_build_html()
_DOCID_MAP = None


def md_path_to_build_html(md_file):
    """Map a source .md/.mdx file to the HTML file Docusaurus built from it.

    Uses the build's own HTML files (via the embedded docs-doc-id class) as the
    authoritative source — no path inference or slug computation.

    Falls back to a computed path when the build map lookup misses.
    """
    global _DOCID_MAP
    if _DOCID_MAP is None:
        _DOCID_MAP = _build_docid_map()

    try:
        rel = md_file.relative_to(DOCS_DIR)
    except ValueError:
        return None

    # Compute the full doc ID: parent/local_id
    local_id = _frontmatter_id(md_file) or rel.with_suffix('').name
    parent   = str(rel.parent).replace('\\', '/')
    doc_id   = local_id if parent == '.' else f"{parent}/{local_id}"

    # Look up in the reverse map first (authoritative)
    if doc_id in _DOCID_MAP:
        return _DOCID_MAP[doc_id]

    # Fallback: compute expected path
    parent_path = rel.parent
    if local_id == 'index':
        return BUILD_DIR / 'docs' / parent_path / 'index.html'
    return BUILD_DIR / 'docs' / parent_path / local_id / 'index.html'


def resolve_internal_to_build_html(source_md, link_path):
    """Resolve an internal (non-http) link path to the build HTML file it corresponds to.

    Checks the build/ directory only — no slug inference, no source-file guessing.
    Returns (html_path_or_None, error_reason_or_None).
    Caller is responsible for splitting off any '#anchor' before calling.
    """
    decoded = unquote(link_path)

    # ── Absolute path (/docs/… or /static/…) ──
    if decoded.startswith('/'):
        rel = decoded.lstrip('/')
        candidates = [
            BUILD_DIR / rel,
            BUILD_DIR / rel / 'index.html',
            BUILD_DIR / (rel + '.html'),
        ]
        for c in candidates:
            if c.exists() and c.is_file():
                return c, None
        return None, f"Not found in build: /{rel}"

    # ── Relative path ──
    target = (source_md.parent / decoded).resolve()

    # Non-markdown file (image, PDF, asset): check static/ and on-disk path
    if target.suffix not in ('', '.md', '.mdx'):
        if target.exists():
            return target, None
        try:
            static_candidate = STATIC_DIR / target.relative_to(PROJECT_DIR)
            if static_candidate.exists():
                return static_candidate, None
        except ValueError:
            pass
        return None, f"File not found: {target.name}"

    # Markdown / no extension: find source file → map to build HTML
    md_candidates = (
        [target] if target.suffix in ('.md', '.mdx')
        else [target.with_suffix('.md'), target.with_suffix('.mdx'),
              target / 'index.md',       target / 'index.mdx']
    )
    for md_cand in md_candidates:
        if md_cand.exists() and md_cand.is_file():
            build_html = md_path_to_build_html(md_cand)
            if build_html is None:
                return None, "Could not map source file to build path"
            if build_html.exists():
                return build_html, None
            return None, "Source file exists but its build HTML was not found — is the build current?"

    return None, "Source file not found"


def resolve_site_url_locally(url):
    """Check a full docs.ethswarm.org URL against the local build output."""
    parsed = urlparse(url)
    rel    = parsed.path.rstrip('/').lstrip('/')
    candidates = [
        BUILD_DIR / rel,
        BUILD_DIR / rel / 'index.html',
        BUILD_DIR / (rel + '.html'),
    ]
    for c in candidates:
        if c.exists() and c.is_file():
            return True, str(c)
    return False, str(BUILD_DIR / rel)


# ─────────────────────────────────────────────
# External URL checker
# ─────────────────────────────────────────────

EXT_STATUS_OK       = 'ok'
EXT_STATUS_404      = '404'
EXT_STATUS_DOWN     = 'down'
EXT_STATUS_REDIRECT = 'redirect'
EXT_STATUS_ERROR    = 'error'
EXT_STATUS_INTERNAL = 'internal_404'   # full site URL that resolves locally but build says 404


class _NoFollowRedirectHandler(HTTPRedirectHandler):
    """Prevent urllib from automatically following redirects."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None  # returning None makes urllib raise HTTPError with the 3xx code


def _build_no_redirect_opener():
    return build_opener(_NoFollowRedirectHandler())


def _fetch(url, headers, method='HEAD', follow_redirects=False):
    """
    Make a single HTTP request.

    follow_redirects=False: do not follow redirects; 3xx responses return the
        code and Location header so the caller can decide what to do.
    follow_redirects=True: follow the full redirect chain (standard urlopen behaviour).

    Returns (status_code_or_None, final_url, location_header_or_None, error_str_or_None).
    """
    try:
        req = Request(url, headers=headers, method=method)
        if follow_redirects:
            with urlopen(req, timeout=EXT_TIMEOUT) as resp:
                return resp.status, resp.url, None, None
        else:
            opener = _build_no_redirect_opener()
            with opener.open(req, timeout=EXT_TIMEOUT) as resp:
                return resp.status, url, resp.headers.get('Location'), None
    except HTTPError as e:
        loc = e.headers.get('Location') if hasattr(e, 'headers') and e.headers else None
        return e.code, url, loc, None
    except (URLError, socket.timeout, socket.error, ConnectionRefusedError,
            http.client.RemoteDisconnected, http.client.IncompleteRead) as e:
        return None, url, None, str(e)
    except Exception as e:
        return None, url, None, f'{type(e).__name__}: {str(e)[:80]}'


def _classify_connection_error(result, err):
    """Populate result with the right status for a network-level error string."""
    if 'ECONNREFUSED' in err or 'Connection refused' in err:
        result['status']    = EXT_STATUS_DOWN
        result['error_msg'] = 'ECONNREFUSED — server down'
    elif ('Name or service not known' in err or 'getaddrinfo' in err
          or 'nodename' in err.lower() or 'No address' in err):
        result['status']    = EXT_STATUS_DOWN
        result['error_msg'] = 'DNS resolution failed'
    elif 'timed out' in err.lower() or 'timeout' in err.lower():
        result['status']    = EXT_STATUS_DOWN
        result['error_msg'] = 'Connection timed out'
    elif 'SSL' in err or 'ssl' in err:
        result['status']    = EXT_STATUS_DOWN
        result['error_msg'] = f'SSL error: {err[:80]}'
    else:
        result['status']    = EXT_STATUS_DOWN
        result['error_msg'] = f'Connection error: {err[:80]}'
    return result


def _check_destination(dest_url, headers):
    """
    Verify that a redirect destination is actually reachable (200).
    Follows the full redirect chain from dest_url.
    Returns (status_code_or_None, final_url, error_str_or_None).
    """
    code, final, _, err = _fetch(dest_url, headers, method='HEAD', follow_redirects=True)
    if err:
        return None, dest_url, err
    if code in (403, 405):
        # Some servers reject HEAD — retry with GET
        code, final, _, err = _fetch(dest_url, headers, method='GET', follow_redirects=True)
        if err:
            return None, dest_url, err
    return code, final or dest_url, None


def check_external_url(url):
    """
    Check a single external URL.

    Strategy:
      1. HEAD request WITHOUT following redirects so we can see whether
         the URL itself redirects (and where).
      2. If 3xx: explicitly fetch the redirect destination and verify it
         returns 200. Only report as EXT_STATUS_REDIRECT if the destination
         is reachable. A redirect that leads to a 404/down is reported as
         the appropriate broken status.
      3. If HEAD is rejected (403/405): retry with GET, same logic.

    Returns dict: {url, status, http_code, final_url, error_msg}
    """
    result = {
        'url':       url,
        'status':    EXT_STATUS_ERROR,
        'http_code': None,
        'final_url': None,
        'error_msg': None,
    }

    # Special case: links to our own live site — check against local build
    parsed = urlparse(url)
    if parsed.netloc == SITE_DOMAIN:
        exists, tried = resolve_site_url_locally(url)
        if exists:
            result['status'] = EXT_STATUS_OK
        else:
            result['status']    = EXT_STATUS_INTERNAL
            result['error_msg'] = f"Not in local build: {tried}"
        return result

    headers = {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
    }

    # ── Step 1: initial request (no auto-redirect) ──
    code, _, location, err = _fetch(url, headers, method='HEAD', follow_redirects=False)

    if err:
        return _classify_connection_error(result, err)

    # HEAD rejected → retry with GET (no auto-redirect)
    if code in (403, 405):
        code, _, location, err = _fetch(url, headers, method='GET', follow_redirects=False)
        if err:
            return _classify_connection_error(result, err)
        if code in (403, 405):
            result['status']    = EXT_STATUS_ERROR
            result['http_code'] = code
            result['error_msg'] = f"HTTP {code} (GET retry)"
            result['final_url'] = url
            return result

    result['http_code'] = code

    # ── Step 2: classify based on response code ──
    if code is None:
        result['status'] = EXT_STATUS_ERROR
        return result

    if code == 200:
        result['status']    = EXT_STATUS_OK
        result['final_url'] = url

    elif code == 404:
        result['status']    = EXT_STATUS_404
        result['error_msg'] = 'HTTP 404'
        result['final_url'] = url

    elif code in (301, 302, 303, 307, 308):
        # ── Redirect: verify the destination is actually reachable ──
        dest = location or url
        # Make dest absolute if it's a relative Location header
        if dest and not dest.startswith('http'):
            p = urlparse(url)
            dest = f"{p.scheme}://{p.netloc}{dest}"

        dest_code, dest_final, dest_err = _check_destination(dest, headers)

        if dest_err:
            result['status']    = EXT_STATUS_DOWN
            result['error_msg'] = f"Redirect to {dest!r} failed: {dest_err[:80]}"
            result['final_url'] = dest
        elif dest_code is None:
            result['status']    = EXT_STATUS_DOWN
            result['error_msg'] = f"Redirect destination unreachable: {dest!r}"
            result['final_url'] = dest
        elif dest_code == 200:
            if _urls_differ_meaningfully(url, dest_final):
                result['status']    = EXT_STATUS_REDIRECT
                result['final_url'] = dest_final
            else:
                result['status']    = EXT_STATUS_OK
                result['final_url'] = dest_final
        elif dest_code == 404:
            result['status']    = EXT_STATUS_404
            result['error_msg'] = f"Redirect target returned 404 ({dest!r})"
            result['final_url'] = dest
        else:
            result['status']    = EXT_STATUS_ERROR
            result['error_msg'] = f"Redirect target returned HTTP {dest_code}"
            result['final_url'] = dest

    else:
        # Any other 2xx is fine; other codes treated as errors
        if 200 <= code < 300:
            result['status']    = EXT_STATUS_OK
            result['final_url'] = url
        else:
            result['status']    = EXT_STATUS_ERROR
            result['error_msg'] = f"HTTP {code}"
            result['final_url'] = url

    return result


def _urls_differ_meaningfully(original, final):
    """True if the URLs differ in a way that's worth reporting (not just http→https or trailing slash)."""
    if not final or original == final:
        return False
    o = urlparse(original)
    f = urlparse(final)
    o_path = o.path.rstrip('/')
    f_path = f.path.rstrip('/')
    # Same host+path, only scheme or trailing-slash differs → not meaningful
    if o.netloc == f.netloc and o_path == f_path and o.query == f.query:
        return False
    # http → https upgrade on same host/path → not meaningful
    if (o.netloc == f.netloc and o_path == f_path
            and o.scheme == 'http' and f.scheme == 'https'):
        return False
    return True


def check_external_urls_threaded(url_to_sources, threads=EXT_THREADS):
    """
    Check a dict of {url: [source_files]} concurrently.
    Returns dict of {url: check_result_dict}.
    """
    urls    = list(url_to_sources.keys())
    results = {}
    lock    = threading.Lock()
    q       = queue.Queue()

    for url in urls:
        q.put(url)

    total = len(urls)
    done  = [0]

    def worker():
        while True:
            try:
                url = q.get_nowait()
            except queue.Empty:
                break
            time.sleep(EXT_DELAY)
            res = check_external_url(url)
            with lock:
                results[url] = res
                done[0] += 1
                n = done[0]
                if n % 10 == 0 or n == total:
                    print(f"  External: {n}/{total} checked...", end='\r', flush=True)
            q.task_done()

    thread_list = [threading.Thread(target=worker, daemon=True) for _ in range(min(threads, len(urls)))]
    for t in thread_list:
        t.start()
    for t in thread_list:
        t.join()

    print()  # newline after \r progress
    return results


# ─────────────────────────────────────────────
# Markdown file checker
# ─────────────────────────────────────────────

def check_markdown_files(check_external=True):
    """
    Scan all .md/.mdx source files.

    Internal links are verified against the BUILD output:
      - page existence: does the corresponding build HTML file exist?
      - anchor existence: is the anchor present as an id attribute in the rendered HTML?
    No slug inference is performed at any point.

    Returns:
      - broken_internal: list of broken internal link dicts
      - external_url_to_sources: dict {url: [(source_file, link_text)]}
      - stats
    """
    broken_internal     = []
    external_url_to_src = defaultdict(list)
    files_checked       = 0
    links_checked       = 0
    html_id_cache       = {}   # str(html_path) → frozenset of id strings

    if not BUILD_DIR.exists():
        print("  WARNING: build/ directory not found.")
        print("  Run 'npm run build' first — internal links cannot be checked without it.")

    md_files = sorted(list(DOCS_DIR.rglob('*.md')) + list(DOCS_DIR.rglob('*.mdx')))

    for md_file in md_files:
        files_checked += 1
        try:
            content = md_file.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            broken_internal.append({
                'source': str(md_file), 'link_text': '', 'link_url': '',
                'resolved': '', 'reason': f'Could not read file: {e}',
            })
            continue

        # Build HTML for this source file — used for anchor-only (#frag) links
        source_build_html = md_path_to_build_html(md_file)

        links = extract_md_links(content)

        for link_text, url in links:
            url = url.strip()
            if not url or url == '#':
                continue
            if any(url.startswith(s) for s in IGNORE_SCHEMES):
                continue

            parsed_url = urlparse(url)
            if any(parsed_url.hostname and parsed_url.hostname.startswith(h) for h in IGNORE_HOSTS):
                continue

            links_checked += 1

            # ── External / self-site links ──
            if any(url.startswith(s) for s in EXTERNAL_SCHEMES):
                if check_external:
                    external_url_to_src[url].append((str(md_file), link_text))
                continue

            # ── Split anchor from path ──
            anchor    = None
            link_path = url
            if '#' in link_path:
                link_path, anchor = link_path.split('#', 1)

            # ── Determine target build HTML ──
            if not link_path:
                # Anchor-only link — same page
                target_html = source_build_html
            else:
                target_html, reason = resolve_internal_to_build_html(md_file, link_path)
                if reason or target_html is None or not target_html.exists():
                    broken_internal.append({
                        'source':    str(md_file),
                        'link_text': link_text,
                        'link_url':  url,
                        'resolved':  str(target_html) if target_html else link_path,
                        'reason':    reason or 'Build HTML not found',
                    })
                    continue

            # ── Check anchor in rendered HTML ──
            if anchor and any(url.startswith(p) for p in SKIP_ANCHOR_PATHS):
                continue  # JS-rendered page — anchor not in static HTML
            if anchor and target_html and target_html.exists():
                key = str(target_html)
                if key not in html_id_cache:
                    html_id_cache[key] = get_html_ids(target_html)
                if anchor not in html_id_cache[key]:
                    broken_internal.append({
                        'source':    str(md_file),
                        'link_text': link_text,
                        'link_url':  url,
                        'resolved':  f'{target_html}#{anchor}',
                        'reason':    f'Anchor "#{anchor}" not found in rendered HTML',
                    })

    return broken_internal, dict(external_url_to_src), files_checked, links_checked, len(md_files)


# ─────────────────────────────────────────────
# HTML build checker
# ─────────────────────────────────────────────

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids   = set()

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if 'id' in attrs_dict:
            self.ids.add(attrs_dict['id'])
        if tag == 'a' and 'href' in attrs_dict:
            self.links.append(('href', attrs_dict['href']))
        elif tag in ('img', 'script') and 'src' in attrs_dict:
            self.links.append(('src', attrs_dict['src']))
        elif tag == 'link' and 'href' in attrs_dict:
            self.links.append(('href', attrs_dict['href']))


def get_html_ids(html_file):
    try:
        content = html_file.read_text(encoding='utf-8', errors='replace')
    except Exception:
        return set()
    parser = LinkExtractor()
    parser.feed(content)
    return parser.ids


def resolve_html_link(source_html, href, build_root):
    anchor = None
    if '#' in href:
        href, anchor = href.split('#', 1)

    href = unquote(href)
    if not href:
        return None, anchor, None

    if href.startswith('/'):
        rel        = href.lstrip('/')
        target     = build_root / rel
        candidates = [target]
        if target.suffix == '':
            candidates.append(target / 'index.html')
    else:
        source_dir = source_html.parent
        target     = (source_dir / href).resolve()
        candidates = [target]
        if target.suffix == '':
            candidates.append(target / 'index.html')

    for c in candidates:
        if c.exists() and c.is_file():
            return c, anchor, None
    return target, anchor, "File not found"


def check_html_files():
    broken        = []
    files_checked = 0
    links_checked = 0
    id_cache      = {}

    html_files = sorted(BUILD_DIR.rglob('*.html'))

    for html_file in html_files:
        files_checked += 1
        try:
            content = html_file.read_text(encoding='utf-8', errors='replace')
        except Exception as e:
            broken.append({'source': str(html_file), 'attr': 'href', 'link_url': '',
                           'resolved': '', 'reason': f'Could not read: {e}'})
            continue

        parser = LinkExtractor()
        parser.feed(content)
        file_ids = parser.ids

        for attr, url in parser.links:
            url = url.strip()
            if not url or url == '#':
                continue
            if any(url.startswith(s) for s in EXTERNAL_SCHEMES + IGNORE_SCHEMES + ('data:',)):
                continue

            links_checked += 1

            if url.startswith('#'):
                anchor = url[1:]
                if anchor and anchor not in file_ids:
                    broken.append({'source': str(html_file), 'attr': attr, 'link_url': url,
                                   'resolved': f'{html_file}#{anchor}',
                                   'reason': f'Anchor "#{anchor}" not found in same page'})
                continue

            resolved, anchor, reason = resolve_html_link(html_file, url, BUILD_DIR)

            if reason:
                broken.append({'source': str(html_file), 'attr': attr, 'link_url': url,
                               'resolved': str(resolved) if resolved else url, 'reason': reason})
                continue

            if anchor and resolved and resolved.exists():
                key = str(resolved)
                if key not in id_cache:
                    id_cache[key] = get_html_ids(resolved)
                if anchor not in id_cache[key]:
                    broken.append({'source': str(html_file), 'attr': attr, 'link_url': url,
                                   'resolved': f'{resolved}#{anchor}',
                                   'reason': f'Anchor "#{anchor}" not found in target HTML'})

    return broken, files_checked, links_checked, len(html_files)


# ─────────────────────────────────────────────
# Deduplication
# ─────────────────────────────────────────────

def deduplicate_html_broken(broken):
    groups = defaultdict(list)
    for item in broken:
        groups[(item['link_url'], item['reason'])].append(item)
    result = []
    for (url, reason), items in sorted(groups.items()):
        rep = dict(items[0])
        rep['count'] = len(items)
        rep['example_sources'] = [it['source'] for it in items[:3]]
        result.append(rep)
    return result


# ─────────────────────────────────────────────
# Report
# ─────────────────────────────────────────────

def make_short_path(path_str, base):
    try:
        return str(Path(path_str).relative_to(base))
    except ValueError:
        try:
            return str(Path(path_str).relative_to(PROJECT_DIR))
        except ValueError:
            return path_str


def write_report(
    md_broken, ext_results, ext_url_to_src,
    md_files_checked, md_links_checked, md_total_files,
    html_broken, html_files_checked, html_links_checked, html_total_files,
    staged_replacements=None,
):
    import datetime
    today = datetime.date.today().isoformat()

    # Categorise external results
    ext_404      = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_404}
    ext_down     = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_DOWN}
    ext_redirect = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_REDIRECT}
    ext_internal = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_INTERNAL}
    ext_error    = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_ERROR}

    _staged = staged_replacements or {}

    def _repl(url, res=None):
        if url in _staged:
            return _staged[url]
        final = (res or {}).get('final_url') or ''
        return final if final and final != url else ''

    deduped_html = deduplicate_html_broken(html_broken)

    lines = []
    lines.append("# Dead Links Report\n")
    lines.append(f"Generated: {today}\n")
    lines.append("")

    # ── Summary ──
    lines.append("## Summary\n")
    lines.append("| Category | Count |")
    lines.append("|---|---|")
    lines.append(f"| Source doc files checked | {md_files_checked} / {md_total_files} |")
    lines.append(f"| Internal links checked (source) | {md_links_checked} |")
    lines.append(f"| **Broken internal links (source)** | **{len(md_broken)}** |")
    lines.append(f"| External URLs checked | {len(ext_results)} |")
    lines.append(f"| **External 404s** | **{len(ext_404) + len(ext_internal)}** |")
    lines.append(f"| **External down / refused** | **{len(ext_down)}** |")
    lines.append(f"| **Stale redirects** | **{len(ext_redirect)}** |")
    lines.append(f"| External errors (timeout/misc) | {len(ext_error)} |")
    lines.append(f"| Build HTML files checked | {html_files_checked} / {html_total_files} |")
    lines.append(f"| **Broken links in build output** | **{len(deduped_html)} patterns** |")
    lines.append("")

    # ── Section 1: Internal broken links ──
    lines.append("---\n")
    lines.append("## Section 1: Broken Internal Links in Source Docs\n")

    if not md_broken:
        lines.append("_No broken internal links._\n")
    else:
        by_file = defaultdict(list)
        for item in md_broken:
            by_file[item['source']].append(item)
        for source in sorted(by_file):
            short = make_short_path(source, DOCS_DIR)
            lines.append(f"### `{short}`\n")
            lines.append("| Link Text | URL | Resolved Path | Reason |")
            lines.append("|---|---|---|---|")
            for item in by_file[source]:
                text     = item['link_text'].replace('|', '\\|')[:60]
                url      = item['link_url'].replace('|', '\\|')[:80]
                resolved = make_short_path(item['resolved'], DOCS_DIR).replace('|', '\\|')[:100]
                reason   = item['reason'].replace('|', '\\|')
                lines.append(f"| {text} | `{url}` | `{resolved}` | {reason} |")
            lines.append("")

    # ── Section 2: External 404s ──
    lines.append("---\n")
    lines.append("## Section 2: External 404s\n")

    all_404 = {**ext_404, **ext_internal}
    if not all_404:
        lines.append("_No external 404s found._\n")
    else:
        lines.append("| URL | Notes | Instances (Link Text — File) |")
        lines.append("|---|---|---|")
        for url, res in sorted(all_404.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            code_str  = f"HTTP {res['http_code']}" if res['http_code'] else (res['error_msg'] or '')
            if res['status'] == EXT_STATUS_INTERNAL:
                code_str = "Not found in local build"
            lines.append(f"| `{url[:100]}` | {code_str} | {instances} |")
        lines.append("")

    # ── Section 3: Down / refused ──
    lines.append("---\n")
    lines.append("## Section 3: Down / Connection Refused\n")

    if not ext_down:
        lines.append("_No unreachable external links._\n")
    else:
        lines.append("| URL | Error | Instances (Link Text — File) |")
        lines.append("|---|---|---|")
        for url, res in sorted(ext_down.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            err       = res.get('error_msg', '') or ''
            lines.append(f"| `{url[:100]}` | {err} | {instances} |")
        lines.append("")

    # ── Section 4: Stale redirects ──
    lines.append("---\n")
    lines.append("## Section 4: Stale Redirects (Update to Final URL)\n")

    if not ext_redirect:
        lines.append("_No stale redirects found._\n")
    else:
        lines.append("| Original URL | Instances (Link Text — File) |")
        lines.append("|---|---|")
        for url, res in sorted(ext_redirect.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            lines.append(f"| `{url[:80]}` | {instances} |")
        lines.append("")

    # ── Section 5: Errors / timeouts ──
    if ext_error:
        lines.append("---\n")
        lines.append("## Section 5: External Check Errors (timeout / misc)\n")
        lines.append("| URL | Error | Instances (Link Text — File) |")
        lines.append("|---|---|---|")
        for url, res in sorted(ext_error.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            err       = res.get('error_msg', '') or ''
            lines.append(f"| `{url[:100]}` | {err} | {instances} |")
        lines.append("")

    # ── Section 6: Build HTML broken links ──
    lines.append("---\n")
    lines.append("## Section 6: Broken Links in Build Output\n")
    lines.append("_Deduplicated by (url, reason) pattern._\n")

    if not deduped_html:
        lines.append("_No broken links in build output._\n")
    else:
        lines.append("| Count | URL | Reason | Example Source |")
        lines.append("|---|---|---|---|")
        for item in sorted(deduped_html, key=lambda x: -x['count']):
            url     = item['link_url'].replace('|', '\\|')[:80]
            reason  = item['reason'].replace('|', '\\|')
            example = make_short_path(item['example_sources'][0], BUILD_DIR).replace('|', '\\|')[:80]
            lines.append(f"| {item['count']} | `{url}` | {reason} | `{example}` |")
        lines.append("")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text('\n'.join(lines), encoding='utf-8')
    print(f"Report written to: {REPORT_PATH}")


# ─────────────────────────────────────────────
# Human-readable audit report
# ─────────────────────────────────────────────

def _source_to_page_link(path_str):
    """Return a markdown link like [/docs/foo/bar](https://docs.ethswarm.org/docs/foo/bar)."""
    try:
        rel = Path(path_str).relative_to(DOCS_DIR)
    except ValueError:
        return path_str
    url_path = str(rel).replace('\\', '/').replace('.mdx', '').replace('.md', '')
    display = f"/docs/{url_path}"
    url     = f"https://{SITE_DOMAIN}/docs/{url_path}"
    return f"[{display}]({url})"


def _fmt_sources(sources_list, max_show=2):
    """Format a list of (file, text) source tuples into page link(s)."""
    if not sources_list:
        return "Unknown"
    seen = []
    for f, _ in sources_list:
        lnk = _source_to_page_link(f)
        if lnk not in seen:
            seen.append(lnk)
    if len(seen) > max_show:
        return ", ".join(seen[:max_show]) + f" _(+{len(seen)-max_show} more)_"
    return ", ".join(seen)


def _fmt_instances(sources_list, docs_dir=None):
    """
    Format a list of (file_path, link_text) tuples as bullet points separated
    by <br> tags (for inline rendering in markdown table cells).

    Each bullet: • "link text" — `relative/file/path.md`
    """
    if not sources_list:
        return "_unknown_"
    if docs_dir is None:
        docs_dir = DOCS_DIR
    bullets = []
    for f, text in sources_list:
        short = make_short_path(f, docs_dir).replace('|', '\\|')
        safe_text = (text or '').strip().replace('|', '\\|')[:80]
        if safe_text:
            bullets.append(f'• "{safe_text}" — `{short}`')
        else:
            bullets.append(f'• `{short}`')
    return "<br>".join(bullets)


def write_human_report(
    md_broken, ext_results, ext_url_to_src,
    md_files_checked, md_links_checked, md_total_files,
    html_broken, html_files_checked, html_links_checked, html_total_files,
    staged_replacements=None,
):
    import datetime
    today = datetime.date.today().isoformat()

    # Categorise external results
    ext_404      = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_404}
    ext_down     = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_DOWN}
    ext_redirect = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_REDIRECT}
    ext_internal = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_INTERNAL}
    ext_error    = {u: r for u, r in ext_results.items() if r['status'] == EXT_STATUS_ERROR}

    # Self-site 404s (docs.ethswarm.org old paths) vs truly external 404s
    self_404 = {**ext_internal}   # checked against local build, not found
    real_404 = {**ext_404}        # HTTP 404 from external server

    _staged = staged_replacements or {}

    def _repl(url, res=None):
        if url in _staged:
            return _staged[url]
        final = (res or {}).get('final_url') or ''
        return final if final and final != url else ''

    n_dead       = len(md_broken) + len(self_404) + len(real_404)
    n_down       = len(ext_down)
    n_redirects  = len(ext_redirect)
    n_errors     = len(ext_error)
    n_total      = n_dead + n_down + n_redirects

    lines = []
    lines.append("## Context\n")
    lines.append(
        f"Dead link audit of {SITE_DOMAIN} found **{n_total}** broken, down, or stale links. "
        f"Audit date: {today}.\n"
    )

    # ── Dead Links (404) ──────────────────────────────────────────────────────
    lines.append("---\n")
    lines.append("## Dead Links (404)\n")

    if not md_broken and not self_404 and not real_404:
        lines.append("_No dead links found._\n")
    else:
        lines.append("| Dead Link | Status | Instances (Link Text — File) |")
        lines.append("|---|---|---|")

        # Broken internal links (wrong file path or missing anchor)
        for item in md_broken:
            url       = item['link_url'].replace('|', '\\|')
            reason    = item['reason'].replace('|', '\\|')
            instances = _fmt_instances([(item['source'], item.get('link_text', ''))])
            lines.append(f"| `{url}` | **Broken** — {reason} | {instances} |")

        # Self-site 404s (old docs.ethswarm.org paths not in local build)
        for url, _res in sorted(self_404.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            lines.append(f"| {url} | **404** — not found in local build (old path?) | {instances} |")

        # External 404s
        for url, res in sorted(real_404.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            lines.append(f"| {url} | **404** | {instances} |")

    lines.append("")

    # ── Forbidden / Down ─────────────────────────────────────────────────────
    lines.append("---\n")
    lines.append("## Forbidden / Down\n")

    if not ext_down:
        lines.append("_No unreachable links._\n")
    else:
        lines.append("| Dead Link | Status | Instances (Link Text — File) |")
        lines.append("|---|---|---|")
        for url, res in sorted(ext_down.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            err       = res.get('error_msg') or 'connection failed'
            # Simplify error messages
            if 'DNS' in err or 'getaddrinfo' in err.lower():
                status = "**DNS failure** — domain not found"
            elif 'ECONNREFUSED' in err or 'Connection refused' in err:
                status = "**ECONNREFUSED** — server down"
            elif 'timed out' in err.lower() or 'timeout' in err.lower():
                status = "**Timeout** — server unresponsive"
            elif 'SSL' in err or 'ssl' in err:
                status = "**SSL error** — handshake failure"
            else:
                status = f"**Down** — {err[:80]}"
            lines.append(f"| {url} | {status} | {instances} |")

    lines.append("")

    # ── Stale Redirects ───────────────────────────────────────────────────────
    lines.append("---\n")
    lines.append("## Stale Redirects (Should Update)\n")

    if not ext_redirect:
        lines.append("_No stale redirects._\n")
    else:
        lines.append("| Old Link | Instances (Link Text — File) |")
        lines.append("|---|---|")
        for url, res in sorted(ext_redirect.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            lines.append(f"| {url} | {instances} |")

    lines.append("")

    # ── Errors / Timeouts ────────────────────────────────────────────────────
    if ext_error:
        lines.append("---\n")
        lines.append("## Check Errors (timeout / blocked)\n")
        lines.append("_These URLs could not be verified — check manually._\n")
        lines.append("| URL | Error | Instances (Link Text — File) |")
        lines.append("|---|---|---|")
        for url, res in sorted(ext_error.items()):
            instances = _fmt_instances(ext_url_to_src.get(url, []))
            err       = res.get('error_msg') or ''
            lines.append(f"| {url} | {err} | {instances} |")
        lines.append("")

    # ── Summary ───────────────────────────────────────────────────────────────
    lines.append("---\n")
    lines.append("## Summary\n")
    lines.append(f"- **Broken internal links:** {len(md_broken)}")
    lines.append(f"- **Hard 404s (external):** {len(real_404) + len(self_404)}")
    lines.append(f"- **Forbidden / Down:** {n_down}")
    lines.append(f"- **Stale redirects:** {n_redirects}")
    if ext_error:
        lines.append(f"- **Check errors (unverified):** {n_errors}")
    lines.append(f"- **Total actionable:** {n_total}")
    lines.append("")

    # ── Priority ─────────────────────────────────────────────────────────────
    lines.append("---\n")
    lines.append("## Priority\n")
    priority = []
    if md_broken:
        priority.append(f"1. Fix {len(md_broken)} broken internal links (wrong paths / missing anchors)")
    if self_404:
        priority.append(f"{len(priority)+1}. Update {len(self_404)} old self-referential `{SITE_DOMAIN}` path(s) to current URLs")
    if real_404:
        priority.append(f"{len(priority)+1}. Remove or replace {len(real_404)} dead external link(s) (HTTP 404)")
    if ext_down:
        priority.append(f"{len(priority)+1}. Evaluate {len(ext_down)} down/refused server link(s) — remove or replace")
    if ext_redirect:
        priority.append(f"{len(priority)+1}. Update {len(ext_redirect)} stale redirect(s) to their final URL")
    if ext_error:
        priority.append(f"{len(priority)+1}. Manually verify {len(ext_error)} URL(s) that returned errors during check")
    for item in priority:
        lines.append(item)
    lines.append("")

    HUMAN_REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    HUMAN_REPORT_PATH.write_text('\n'.join(lines), encoding='utf-8')
    print(f"Human report written to: {HUMAN_REPORT_PATH}")


# ─────────────────────────────────────────────
# Staged-changes URL replacement map
# ─────────────────────────────────────────────

def get_staged_url_replacements():
    """
    Parse `git diff --cached` to find URL replacements in staged changes.
    Within each diff hunk, URLs on removed lines (-) are matched to URLs on
    added lines (+) in order. Returns {old_url: new_url}.
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
# Build helper
# ─────────────────────────────────────────────

def _build_is_outdated():
    """
    Return True if any source file in docs/, static/, or key config files
    was modified more recently than the build directory itself.
    """
    try:
        build_mtime = BUILD_DIR.stat().st_mtime
    except FileNotFoundError:
        return True  # no build at all

    watch_dirs = [DOCS_DIR, STATIC_DIR]
    watch_files = [
        PROJECT_DIR / "docusaurus.config.mjs",
        PROJECT_DIR / "sidebars.js",
    ]

    for d in watch_dirs:
        if d.exists():
            for f in d.rglob("*"):
                if f.is_file() and f.stat().st_mtime > build_mtime:
                    return True

    for f in watch_files:
        if f.exists() and f.stat().st_mtime > build_mtime:
            return True

    return False


def trigger_build():
    """
    Ensure a current build exists before running local checks.

    Behaviour:
      • No build found     → build immediately, no prompt needed.
      • Build found, up to date  → ask permission to overwrite.
      • Build found, outdated    → warn user, ask if they want to rebuild.

    Returns True if the build is ready to use, False on build failure or abort.
    """
    if not BUILD_DIR.exists():
        print("\nNo existing build found — running: npm run build")
        print("-" * 40)
        result = subprocess.run([_NPM, 'run', 'build'], cwd=str(PROJECT_DIR))
        print("-" * 40)
        if result.returncode != 0:
            print("ERROR: Build failed (see output above).", file=sys.stderr)
            return False
        print("Build complete.\n")
        return True

    # Build exists — check freshness
    outdated = _build_is_outdated()
    if outdated:
        print(f"\nWARNING: The existing build at {BUILD_DIR} is outdated")
        print("         (source files have changed since it was last built).")
        prompt = "Rebuild now to get accurate results? This will overwrite it. [Y/n]: "
    else:
        print(f"\nAn existing build was found at: {BUILD_DIR} (appears up to date).")
        prompt = "Rebuild now anyway? This will overwrite it. [y/N]: "

    try:
        resp = input(prompt).strip().lower()
    except (EOFError, KeyboardInterrupt):
        print()
        resp = ''

    # For outdated builds default is YES; for current builds default is NO
    if outdated:
        do_build = resp not in ('n', 'no')
    else:
        do_build = resp in ('y', 'yes')

    if not do_build:
        if outdated:
            print("Skipping rebuild — results may not reflect latest changes.\n")
        else:
            print("Skipping rebuild — using existing build.\n")
        return True

    print("\nRunning: npm run build")
    print("-" * 40)
    result = subprocess.run([_NPM, 'run', 'build'], cwd=str(PROJECT_DIR))
    print("-" * 40)
    if result.returncode != 0:
        print("ERROR: Build failed (see output above).", file=sys.stderr)
        return False
    print("Build complete.\n")
    return True


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='Bee-docs link checker',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Modes:\n"
            "  local  — build the site locally and check source docs + build output\n"
            "  live   — fetch the live site at docs.ethswarm.org and check all links\n"
        ),
    )
    parser.add_argument(
        '--mode', choices=['local', 'live'], default=None,
        help='Check mode: "local" (build + source check) or "live" (live site crawl). '
             'If omitted you will be prompted.',
    )
    parser.add_argument('--no-external', action='store_true',
                        help='(local mode only) Skip external URL checking')
    parser.add_argument('--threads', type=int, default=EXT_THREADS,
                        help=f'Concurrent HTTP threads (default: {EXT_THREADS})')
    args = parser.parse_args()

    # ── Mode selection ──
    mode = args.mode
    if mode is None:
        print("=== Bee-docs Link Checker ===\n")
        print("Which site do you want to check?")
        print("  1) local  — build locally and check source docs + build output")
        print("  2) live   — fetch the live site at docs.ethswarm.org\n")
        try:
            choice = input("Enter 1 or 2 [default: 1]: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            choice = '1'
        mode = 'live' if choice == '2' else 'local'
        print()

    # ── Live mode: delegate to check_live_links.py ──
    if mode == 'live':
        live_script = Path(__file__).parent / 'check_live_links.py'
        if not live_script.exists():
            print(f"ERROR: {live_script} not found.", file=sys.stderr)
            sys.exit(1)
        cmd = [sys.executable, str(live_script), '--threads', str(args.threads)]
        print(f"Running live checker: {' '.join(cmd)}\n")
        result = subprocess.run(cmd)
        sys.exit(result.returncode)

    # ── Local mode ──
    check_ext = not args.no_external

    print("=== Bee-docs Link Checker — Local Mode ===")
    print(f"Docs dir  : {DOCS_DIR}")
    print(f"Build dir : {BUILD_DIR}")
    print(f"External  : {'enabled' if check_ext else 'disabled (--no-external)'}")
    print()

    if not DOCS_DIR.exists():
        print(f"ERROR: Docs dir not found: {DOCS_DIR}")
        sys.exit(1)

    # Always trigger a build for local mode
    if not trigger_build():
        sys.exit(1)

    print("Scanning source docs (internal links)...")
    md_broken, ext_url_to_src, md_files, md_links, md_total = check_markdown_files(check_ext)
    print(f"  Files: {md_files}/{md_total}, Links: {md_links}, Broken internal: {len(md_broken)}")
    print(f"  Unique external URLs collected: {len(ext_url_to_src)}")

    ext_results = {}
    if check_ext and ext_url_to_src:
        print(f"\nChecking {len(ext_url_to_src)} external URLs ({args.threads} threads)...")
        ext_results = check_external_urls_threaded(ext_url_to_src, threads=args.threads)
        ok       = sum(1 for r in ext_results.values() if r['status'] == EXT_STATUS_OK)
        redirects = sum(1 for r in ext_results.values() if r['status'] == EXT_STATUS_REDIRECT)
        not_found = sum(1 for r in ext_results.values() if r['status'] in (EXT_STATUS_404, EXT_STATUS_INTERNAL))
        down      = sum(1 for r in ext_results.values() if r['status'] == EXT_STATUS_DOWN)
        errors    = sum(1 for r in ext_results.values() if r['status'] == EXT_STATUS_ERROR)
        print(f"  OK: {ok}  Redirect: {redirects}  404: {not_found}  Down: {down}  Error: {errors}")

    html_broken = []
    html_files = html_links = html_total = 0
    if BUILD_DIR.exists():
        print("\nChecking build output (HTML internal links)...")
        html_broken, html_files, html_links, html_total = check_html_files()
        print(f"  Files: {html_files}/{html_total}, Links: {html_links}, Broken: {len(html_broken)}")

    staged = get_staged_url_replacements()
    if staged:
        print(f"\nFound {len(staged)} staged URL replacement(s) from git diff.")

    print("\nWriting report...")
    write_report(
        md_broken, ext_results, ext_url_to_src,
        md_files, md_links, md_total,
        html_broken, html_files, html_links, html_total,
        staged_replacements=staged,
    )
    write_human_report(
        md_broken, ext_results, ext_url_to_src,
        md_files, md_links, md_total,
        html_broken, html_files, html_links, html_total,
        staged_replacements=staged,
    )


if __name__ == '__main__':
    main()
