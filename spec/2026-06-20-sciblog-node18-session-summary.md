# Sciblog Node 18 Upgrade Session Summary

Date: 2026-06-20
Branch: `feature/upgrade-node-18-20-22`

## Scope

This session focused on getting `projects/examples/sciblog` building on Node 18 and fixing major layout/runtime regressions introduced by the age of the Gatsby 1 example app and its dependencies.

## What Changed

- Removed the legacy sharp-based Gatsby image plugins from `projects/examples/sciblog/gatsby-config.js`.
- Updated `projects/examples/sciblog/package.json` scripts to invoke Gatsby through `node ./node_modules/gatsby/dist/bin/gatsby.js` because the old Gatsby package installs a non-executable bin in this environment.
- Refreshed `projects/examples/sciblog/package-lock.json` for the current dependency graph.
- Removed direct npm dependencies on stale published `@scion-scxml/scxml` and `@scion-scxml/schviz` packages from `projects/examples/sciblog/package.json`.
- Added webpack aliases in `projects/examples/sciblog/gatsby-node.js` to point `@scion-scxml/scxml` and `@scion-scxml/schviz` imports at local wrappers under `projects/examples/sciblog/src/vendor/`.
- Added `projects/examples/sciblog/src/vendor/scxml.js` to load the local browser bundle from `projects/libraries/scxml/dist/scxml.js`.
- Added `projects/examples/sciblog/src/vendor/schviz.js` to:
  - load the local `schviz` browser bundle in the browser
  - provide an SSR-safe placeholder component during Gatsby static HTML rendering
  - expose a minimal `SCHVIZ.layouts` surface on the SSR placeholder so tutorial pages can render without crashing
- Added `onPreBootstrap` logic in `projects/examples/sciblog/gatsby-node.js` to copy `src/docs/assets` into `static/assets`, fixing 404s for TypeDoc assets like `/assets/js/main.js`.
- Reworked the shared example `Cell` component in `projects/examples/sciblog/src/examples/common.js` to support explicit content heights instead of relying on unresolved table-percentage sizing.
- Updated all sciblog tutorial/example pages that use `Cell` to pass explicit `contentHeight` values matching their table layouts.

## Problems Solved

- Clean install no longer fails on old `sharp` during the sciblog build path.
- Gatsby build now succeeds on Node 18.
- Static HTML generation no longer crashes due to `schviz` requiring browser-only globals during SSR.
- TypeDoc pages now ship their required CSS/JS assets instead of 404ing on `/assets/js/main.js`.
- The tutorial/example table cells now use explicit viewports rather than ambiguous `height: 100%` chains.

## Verification Performed

- Rebuilt `projects/examples/sciblog` repeatedly under Node 18 using:

```bash
source ~/.nvm/nvm.sh
nvm use v18
cd projects/examples/sciblog
timeout 600s npm run build
```

- Final verified build result: `EXIT:0`
- Verified built docs assets exist:
  - `projects/examples/sciblog/public/assets/js/main.js`
  - `projects/examples/sciblog/public/assets/css/main.css`

## Remaining Work

- Some page-level layout issues still need browser inspection and refinement.
- The next step proposed in-session is to use local Playwright tooling for deterministic inspection of rendered layout behavior under the upgraded stack.

