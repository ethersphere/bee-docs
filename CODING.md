# Coding guide

- Write each sentence on its own line: put a newline after every sentence, rather than hard-wrapping lines at a fixed column width.
  This keeps `git` line diffs small and produces fewer merge conflicts, without the awkward mid-sentence breaks that fixed-width wrapping causes.

- Don't change things unnecessarily (e.g. if you reindent an entire paragraph when you're fixing a single typo, then you unnecessarily increase the probability for merge conflicts).

- Prefer `npm ci` instead of `npm install`, and only include the `package-lock.json` file in your commit when you know what you are doing.
  For further explanation see this [stackoverflow question](https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore).

## Swarm vs. swarm, and uppercasing in general

`Swarm`, with a capital, refers to the project and the main network, e.g.:

 > Swarm uses the content hashes as addresses

 > As of today, the Swarm mainnet consists of `n` number of nodes

`swarm`, in lower case, refers to a swarm of bee nodes.
Note that the Bee client supports running/forming multiple Swarm swarms, i.e. you can even run your own!

 > when your node joins the designated swarm

[`Bee`](https://github.com/ethersphere/bee), with a capital, refers to a specific bee client, written in the `go` programming language, while `bee`, in lower case, refers to any worker that can join a swarm (e.g. any client implementation that speaks the Swarm protocol).

## Writing for answer engines (AEO/GEO)

These conventions keep pages easy for search and AI answer engines to extract:

- **Answer first**: open each page with a 1–2 sentence direct answer to its implied question (a definition, or the outcome/first step), before context, citations, or marketing.
  A friendly or on-brand line can follow the factual one.

- **One H1 per page**: the frontmatter `title` renders as the page's H1, so don't add a body `# H1`.

- **Descriptive, question-shaped headings**: phrase a heading as the question a reader would ask (e.g. "What is a full node?", "How do I pin content during upload?"), on concept, reference, and how-to pages alike, rather than generic labels like "Overview" or "Introduction".
  When you rename an existing heading, pin its original slug with `{#old-slug}` so existing anchor links keep working.

- **Self-contained sentences**: avoid "as mentioned above", "at this point", and bare "this/it/here" — name the entity or section, so a sentence still makes sense when quoted on its own.

- **`description` frontmatter**: write one concise, factual, self-contained sentence stating the page's key fact (not "Guide for…" / "Overview of…"), and make sure any acronym expansion matches the body.

- **Prefer extraction aids**: definition-first paragraphs, lists, tables, and `:::info`/`:::tip` callouts for key facts, rather than long walls of prose.
