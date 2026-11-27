---
name: review-dependabot-pr
description: Use when reviewing a Dependabot pull request on bee-docs — a PR number or URL from dependabot[bot], a "chore(deps): bump …" title, an npm_and_yarn group update, or a package-lock.json-only security bump that needs checking before approval.
---

# Review a Dependabot PR (bee-docs)

Review a Dependabot PR end to end and print a draft review comment.
The reviewer approves and merges; this skill never does.

**Hard limits:** do not approve, merge, comment, push, or edit tracked files.
Leave the working tree clean: `git status --short` prints nothing at the end.

Work through the steps in order.
Each step ends in a pass, a flag, or a skip, and every flag and skip goes in the notes (step 8).
A step you did not run is a skip, never a pass.

Set up a scratch directory for logs first: use the session scratchpad if one exists, otherwise create one with `mktemp -d`.
Shell variables may not survive between commands, so start every code block below with `R=<that absolute path>`.

## 1. Gather and check freshness

```bash
gh pr view <N> --json number,state,title,author,body,headRefName,headRefOid,baseRefName,files,statusCheckRollup,mergeable,comments > "$R/pr.json"
gh pr list --author app/dependabot --state open --json number,title,createdAt
```

Stop when any of these holds, and go straight to step 8's early-stop output:

- The author is not `dependabot[bot]` (`app/dependabot`).
- `state` is not `OPEN`, or a Dependabot comment says "Superseded by #M".
- Another open Dependabot PR is newer and bumps the same packages.

When pointing the reviewer elsewhere, check that PR's state with `gh pr view <M> --json state,mergedAt`.
If it is still open, point to it.
If it has already merged, say so, and point to any open Dependabot PR that bumps the same packages instead.

Check `statusCheckRollup` for the `build` check.
A failing `build` is a prominent flag.
A pending one means CI has not verified the PR yet; say so in the notes.

Flag, but continue, when `mergeable` is `CONFLICTING`, and suggest the reviewer comment `@dependabot rebase`.
Suggest `@dependabot recreate` instead when someone other than Dependabot has pushed to the branch.

## 2. Check scope

Allowed files: `package-lock.json`, and `package.json` only when a bumped package is a direct dependency.
In `package.json`, only the version strings of packages named in the PR body may change.
Any other file, or any other `package.json` change, is a prominent flag at the top of the notes.

## 3. Check lockfile integrity

Get onto the PR head first.
If `git status --porcelain` prints anything, stop: do not check out over local changes.
If `git rev-parse HEAD` differs from `headRefOid`, run `gh pr checkout <N>`.
This switches the branch of the current worktree, so run the review from a worktree for the PR, or one whose branch you can switch.

List every lockfile entry that changed against the base, including nested copies such as `node_modules/body-parser/node_modules/qs`:

```bash
git fetch origin --quiet
BASE=$(git merge-base HEAD "origin/$(jq -r .baseRefName "$R/pr.json")")
echo "$BASE" > "$R/base.txt"   # later steps may run in a fresh shell
git show "$BASE:package-lock.json" > "$R/base-lock.json"
node -e '
const fs = require("fs");
const a = JSON.parse(fs.readFileSync(process.argv[1])).packages;
const b = JSON.parse(fs.readFileSync(process.argv[2])).packages;
for (const [p, e] of Object.entries(b)) {
  if (!p) continue;
  const o = a[p];
  if (o && o.version === e.version && o.integrity === e.integrity &&
      JSON.stringify(o.dependencies) === JSON.stringify(e.dependencies)) continue;
  const name = p.split("node_modules/").pop();
  console.log(["CHANGED", p, o ? o.version : "-", e.version, name + "@" + e.version, e.resolved || "-", e.integrity || "-"].join("\t"));
}
for (const p of Object.keys(a)) if (p && !b[p]) console.log(["REMOVED", p, a[p].version].join("\t"));
' "$R/base-lock.json" package-lock.json > "$R/changed.tsv"
cat "$R/changed.tsv"
```

For every `CHANGED` row, `resolved` must be on the npm registry and `integrity` must equal `npm view <name>@<version> dist.integrity`.
Any row the first command prints (git, tarball URL, other registry) is a flag:

```bash
awk -F'\t' '$1=="CHANGED" && $6 !~ /^https:\/\/registry\.npmjs\.org\//' "$R/changed.tsv"
awk -F'\t' '$1=="CHANGED"{print $5"\t"$7}' "$R/changed.tsv" | sort -u | while IFS=$'\t' read -r spec lock; do
  reg=$(npm view "$spec" dist.integrity)
  [ "$reg" = "$lock" ] && echo "OK $spec" || echo "MISMATCH $spec lock=$lock registry=$reg"
done
```

Any `MISMATCH` is a prominent flag, and the reviewer should not approve.

Packages in `changed.tsv` that the PR body does not name are co-bumps (a parent moved to accept the new version, or a nested copy was deduped).
List each in the notes with the reason, from `npm view <name>@<new> dependencies`.
A co-bump is a flag only when it is a new major version or fails the checks above.
`REMOVED` rows need no integrity check; explain each one alongside the co-bumps (usually a nested copy deduped into the top-level one).

## 4. Check alerts

```bash
gh api repos/ethersphere/bee-docs/dependabot/alerts --paginate \
  --jq '.[] | select(.state=="open") | [.number, .dependency.package.name, .security_advisory.severity, .security_vulnerability.vulnerable_version_range, (.security_vulnerability.first_patched_version.identifier // "none")] | @tsv'
```

If the call fails (for example 403), record step 4 as skipped and continue.

- **Resolved by this PR:** an open alert whose package is bumped, where *every* lockfile copy of that package is now outside the vulnerable range.
  One remaining vulnerable nested copy keeps the alert open; flag it.
- **Still open:** every other open alert.
  List them with severity and patched version, most severe first, and note "no PR" when no open Dependabot PR bumps that package.

## 5. Assess risk

For each bumped package:

- `grep -n '"<pkg>"' package.json` tells you whether it is direct.
- `npm explain <pkg>` (after step 6's install) tells you what pulls it in.
- Count its lockfile entries at base and head; a bump that adds a second copy is a flag.

Read the changelog (linked in the PR body) when the bump is a new major version or the package is direct.
Note any breaking change that touches how bee-docs uses it.
Indirect patch and minor bumps need no changelog read.

## 6. Build locally

```bash
npm ci --allow-git=all > "$R/ci.log" 2>&1; echo "npm ci exit $?"
npm run build > "$R/build.log" 2>&1; echo "build exit $?"
```

- `--allow-git=all` is needed on npm 12 for the `github:` dependency `plugin-image-zoom`.
- npm 12 blocking install scripts for core-js, esbuild, or fsevents is expected and not a failure.
- Use `npm run build`, not `build:quiet`: `build:quiet` skips the `prebuild` hook and fails on the missing `references/awesome-list` doc.
- Both exits must be 0, and `build.log` must contain `[SUCCESS] Generated static files in "build"`.

Compare warnings against the CI build of the commit the PR is based on (`$BASE` from step 3), falling back to master's latest successful build:

```bash
BASE=$(cat "$R/base.txt")
RUN=$(gh run list --workflow build.yaml --commit "$BASE" --status success --limit 1 --json databaseId --jq '.[0].databaseId')
[ -n "$RUN" ] || RUN=$(gh run list --workflow build.yaml --branch master --status success --limit 1 --json databaseId --jq '.[0].databaseId')
gh run view "$RUN" --log | sed -E 's/^.*[0-9]Z //; s/^[[:space:]]+//' | grep -iE 'warn|error|broken|⚠' | sort -u > "$R/master-warn.txt"
sed -E 's/^[[:space:]]+//' "$R/build.log" | grep -iE 'warn|error|broken|⚠' | sort -u > "$R/pr-warn.txt"
comm -13 "$R/master-warn.txt" "$R/pr-warn.txt"
```

Lines that only appear locally are new warnings.
The `⚠` pattern catches the per-page `Missing from llms.txt` lines, so a change in which pages are missing shows up even when the count is the same.
CI-only lines (`##[warning]Node.js 20 is deprecated`, git hints) appear only on the master side and are ignored by `comm -13`.
Ignore Node `DeprecationWarning` lines and `npm warn` lines that come from a different local Node or npm version, and say so in the notes.
Anything else new, especially `[WARNING]` broken links or llms.txt warnings, is a flag.
Say in the notes which run you compared against, and whether it was the base commit or the master fallback.
If no successful run is found, record the comparison as skipped.

`node_modules/`, `build/`, and `.docusaurus/` are gitignored; leave them.
Run `git status --short` and confirm it is empty.

## 7. Smoke-test the deploy preview

Do this only when a changed package is in the table below, or its direct parent in `npm explain <pkg>` is.
Packages reached only through `webpack-dev-server`, webpack, babel, or postcss tooling do not ship in the built site.
For those, and for anything else not in the table, record "no rendered feature affected" and skip the preview.

| Package | Check on the preview |
|---|---|
| `redocusaurus`, `redoc`, `@redocly/*`, `styled-components` | `/api/` renders the endpoint list |
| `@docsearch/js`, `@docusaurus/theme-search-algolia` | search box opens and returns results (swizzled `src/theme/SearchBar`) |
| `@docusaurus/theme-mermaid`, `mermaid` | diagrams render on `/docs/bee/contribute/protocols` |
| `katex`, `rehype-katex`, `remark-math` | formulas render on `/docs/concepts/incentives/postage-stamps` |
| `react`, `react-dom`, `@docusaurus/*` | calculators work on `/docs/develop/tools-and-features/buy-a-stamp-batch` |

Get the preview URL from the Netlify comment:

```bash
jq -r '.comments[] | select(.author.login=="netlify") | .body' "$R/pr.json" | grep -oE 'https://deploy-preview-[^ )|]+' | tail -1
```

If there is no Netlify comment yet, or the preview check is pending, record step 7 as skipped.

Check the page in a browser when browser tools are available.
Otherwise run `curl -sL <preview><path>` and confirm the expected markup is in the HTML (for example the calculator inputs, or `class="katex"`).
Record that as a static check only: it shows the page built, not that scripts run.

## 8. Print the draft

Print exactly two sections, then stop.

**Draft review comment** — a short, pasteable comment in this shape:

```
Verified locally: lockfile-only diff, all integrity hashes match the npm registry, `npm ci` clean, `npm run build` succeeds, no new build warnings vs master.
Resolves the open <pkg> (#a, #b) and <pkg> (#c) advisories.
```

- Replace "lockfile-only diff" with what step 2 found when `package.json` also changed.
- Name every package from step 4's "resolved" list, with its alert numbers.
  If step 4 ran and the list is empty, write "Does not resolve an open advisory."
  If step 4 was skipped, leave the advisory line out.
- Add one line for a preview check from step 7, if one ran.
- Leave out any clause whose step was skipped or flagged.

**Notes for the reviewer** — for the reviewer only, not for GitHub:

1. Flags, most serious first (scope, integrity mismatch, still-vulnerable copies, new warnings, breaking changes).
2. Skipped steps and why.
3. Still-open alerts from step 4, as a table: package, severity, patched version, PR or "no PR".
4. Suggested `@dependabot` command, if step 1 found one.

**Early stop (step 1):** the draft is one line, for example `No review needed: #847 was superseded by #848, which merged on <date>.`
The notes give the stop reason, the PR to look at instead (if any), and list steps 2–7 as not run.
