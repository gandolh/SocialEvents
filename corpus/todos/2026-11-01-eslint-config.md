---
title: npm run lint has no ESLint config
created: 2026-11-01
status: open
tags: [tooling]
---

# npm run lint has no ESLint config

Found on 2026-11-01. The root `package.json` has `"lint": "eslint ."`, but no workspace lists `eslint` as a dependency and there is no `eslint.config.js`. `npm run lint` picks up whatever `eslint` is on the path and stops with "ESLint couldn't find an eslint.config.(js|mjs|cjs) file". The code already carries `eslint-disable-next-line` comments, so a config was meant to exist.

## Acceptance

`eslint` and its TypeScript and React plugins are pinned dev dependencies, like every other version here, a flat `eslint.config.js` covers the three workspaces, and `npm run lint` passes.
