# SocialEvents

An internal company social-events planner: a Fastify + SQLite API, a React + Tailwind client and a shared Zod
package. Read [corpus/index.md](corpus/index.md) first.

## Commands

- `npm run check`: typecheck, lint, format check, conventions, tests. Run it before every hand-back.
- `npm run check:fast`: the typecheck, then ESLint on the changed files. The Stop hook runs it.
- `npx vitest run <file>`: one test file, from `server/`.
- `npm run format`: Prettier writes every file it covers (Markdown stays out).
- `npm run seed`: the local accounts. `npm run dev:server` and `npm run dev:client` start the two halves.
- `npm run house-style:sync`: refreshes `vendor/house-style/`. Never edit that copy.

## Places that mislead

- `server/.env` is read from the server's working directory, so run the server scripts through `npm`.
- `shared` must be built before the server or client sees a schema change (`npm run build:shared`; `tsc -b` and
  `npm test` do it).
- The API is on 3001 and Vite on 5173; Vite forwards `/api`.
- `vendor/house-style/` is a generated copy. The configs at the root are thin wrappers around it.

## Hard rules

- **No secrets.** Never write a password, token or key into the repo or the corpus.
- **No CI.** Don't add GitHub Actions, runners or other GitHub-specific automation.
- **No pushes.** Commit locally; the owner pushes.

## brief-board

Brief progress goes on brief-board. Run `brief-board guide` before you start or resume a brief, and follow it.
