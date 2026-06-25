# Task 01 — Scaffold monorepo

## Context
Greenfield rebuild. Old code wiped. Need the workspace skeleton with pinned deps
before any feature work. See [decisions.md](../../wiki/decisions.md) for the locked
stack + exact versions, [architecture.md](../../wiki/architecture.md) for layout.

## Files you OWN
- root `package.json`, `.gitignore`, `tsconfig.base.json`, `README.md`
- `shared/package.json`, `shared/tsconfig.json`
- `server/package.json`, `server/tsconfig.json`
- `client/package.json`, `client/tsconfig.json`, `client/vite.config.ts`,
  `client/index.html`, `client/src/main.tsx` (placeholder)
- env examples: `server/.env.example`, `client/.env.example`

## What to do
1. Root: npm workspaces (`client`, `server`, `shared`). Scripts to run/build each.
2. Each workspace: `package.json` with **exact pinned versions** from decisions.md.
3. TS strict base config + per-workspace extends.
4. Client: Vite 8 + React 19 + `@tailwindcss/vite` v4 + TanStack.
5. `.gitignore` (node_modules, dist, .env, *.sqlite). README (run instructions).

## Acceptance
`npm install` resolves; `tsc -b` clean across workspaces; `vite build` skeleton
builds; no `^`/`~` in any dependency.

---
## Outcome (2026-06-25)
Shipped. npm workspaces (client/server/shared), all deps pinned, TS strict project
references, Vite 8 + Tailwind v4 (`@tailwindcss/vite`, CSS `@theme` tokens),
Fastify 5 server deps, Vitest. `npm install` clean, shared + client build green,
**0 vulnerabilities**. Deviation: dropped `geist` npm pkg (pulls `next` +
vulnerable postcss) in favor of `@fontsource/geist-sans@5.2.5`; added
`@fastify/static@9.1.3` for serving the built client. Both recorded in decisions.md.
