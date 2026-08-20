# SCION GitHub Migration Plan

This file records the agreed migration schedule so future sessions have local context.

## Target Repository

- Keep the canonical GitHub repository at `https://github.com/jbeard4/scion`.
- Do not transfer the repository to the `SCION-SCXML` organization for now.

## Vendor History Strategy

The contents of `projects/vendor/*` are forks of third-party projects. Their
full upstream histories should not pollute the cleaned SCION repository history.
Use GitHub forks to preserve provenance, then keep SCION clean of vendored source.

Vendor fork mapping:

- `projects/vendor/eslint` -> `https://github.com/jbeard4/eslint`
- `projects/vendor/jsondiffpatch` -> `https://github.com/jbeard4/jsondiffpatch`
- `projects/vendor/react-codemirror` -> `https://github.com/jbeard4/react-codemirror`
- `projects/vendor/react-collapsible` -> `https://github.com/jbeard4/react-collapsible`
- `projects/vendor/sax-js` -> `https://github.com/jbeard4/sax-js`
- `projects/vendor/vm-browserify` -> `https://github.com/jbeard4/vm-browserify`
- `projects/vendor/xmllint` -> `https://github.com/jbeard4/xml.js`

For each vendored project, extract the SCION-side history for its vendor
directory and push that extracted history to a long-lived `scion` branch on the
corresponding fork.

## Work Schedule

1. Create a backup branch from the current pre-rewrite state.
2. Push the backup branch to `jbeard4/scion` before any destructive rewrite.
3. Clone all vendor forks into `~/workspace/scion-vendor/`.
4. Extract history from each `projects/vendor/<name>` directory using
   `git subtree split --prefix=projects/vendor/<name>`.
5. Push each extracted history to the matching fork as branch `scion`.
6. Replace SCION's local `projects/vendor/*` dependencies with clean dependency
   sources, such as fork branches, package dependencies, subtree imports, or
   published packages.
7. Ensure the repository still builds and tests pass locally before rewriting
   history.
8. Rewrite SCION history to remove `projects/vendor/`, preferably with
   `git filter-repo --invert-paths --path projects/vendor/`.
9. Re-run build and tests on the rewritten history.
10. Force-push the cleaned `master` branch to `jbeard4/scion`.
11. Add a "Fork me on GitHub" banner to sciblog pointing to
    `https://github.com/jbeard4/scion`.
12. Add GitHub Actions test automation.
13. Publish sciblog with Netlify or GitHub Pages.

## Safety Notes

- Prefer `git filter-repo` over `git filter-branch`.
- Do not perform the history rewrite until the backup branch and all vendor
  `scion` branches are pushed and verified.
- Treat force-pushing `master` as a migration event. Existing checkouts will
  need to reclone or manually reset.
- Keep `spec/LOG` and other explicitly local planning files untracked.
