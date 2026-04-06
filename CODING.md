# Coding guide

- Please wrap long lines using `newline` characters, so that the `git`
  line diffs result in fewer merge conflicts.

- Don't change things unnecessarily (e.g. if you reindent an entire
  paragraph when you're fixing a single typo, then you unnecessarily
  increase the probability for merge conflicts).

- Prefer `npm ci` instead of `npm install`, and only include the
  `package-lock.json` file in your commit when you know what you are
  doing. For further explanation see this
  [stackoverflow question](https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore).

## Swarm vs. swarm, and uppercasing in general

`Swarm`, with a capital, refers to the project and the main network,
e.g.:

 > Swarm uses the content hashes as addresses

 > As of today, the Swarm mainnet consists of `n` number of nodes

`swarm`, in lower case, refers to a swarm of bee nodes. Note that the
Bee client supports running/forming multiple Swarm swarms, i.e. you
can even run your own!

 > when your node joins the designated swarm

[`Bee`](https://github.com/ethersphere/bee), with a capital, refers to
a specific bee client, written in the `go` programming language, while
`bee`, in lower case, refers to any worker that can join a swarm
(e.g. any client implementation that speaks the Swarm protocol).

## Component Testing

### Calculator Component

If you modify `src/components/AmountAndDepthCalc.js` (the postage stamp cost calculator), you **must** run the automated tests before submitting your PR:

```bash
node src/components/AmountAndDepthCalc.test.js
```

All 37 tests must pass (`PASSED: 37`). If any test fails, your changes have introduced a bug. Fix the issue and re-run the tests.

For detailed information about what the tests cover and how to debug failures, see `.claude/README-CALCULATOR-TESTING.md`.
