# Task 15: The house style and the quality harness

**Depends on:**

- In SocialEvents: nothing. This brief runs first.
- In the owner's skills library:
  - brief 27, *A house style, and a quality harness that enforces it*: the vendored `house-style` copy, the `house-style` skill, and the plugin's `Stop` and `PostToolUse` hooks;
  - brief 15, *Enforce the base-ui and code-structure skills in every repo*: how the convention checkers are wired and when they run `--warn-only`.
- The owner's grilling of 2026-11-10 and its technical calls, questions Q5-Q14 and Q44-Q50 of the skills library's open questions.

**Runs before:** 16, 17 and 18. The reformat touches 44 of the 71 TypeScript and JavaScript files, and those briefs rewrite or move most of them. Formatting first gives one clean reformat commit.

## Context

On 2026-11-09 the owner made three calls for every web app they own: Base UI 1.9.0 everywhere, the whole app on Tailwind v4, and the researched conventions enforced in each repo. The skills library's brief 27 sets the harness: two layers.

- **The repo's gate:** `npm run check` and its fast subset `npm run check:fast`. They hold for a human and any agent.
- **The Claude Code layer:** the plugin's `Stop` hook runs `check:fast` and exits 2 on a failure; its `PostToolUse` hook formats each saved file; `.claude/rules/` files are scoped by `paths:`; a short root `CLAUDE.md` holds the commands.

This brief adopts both in SocialEvents. It also closes [the ESLint todo](../../todos/2026-11-01-eslint-config.md): `npm run lint` runs `eslint .` today with no ESLint dependency and no config.

SocialEvents is not deployed (the README, 2026-06-25), so there is no Dockerfile and no deploy gate to keep in step. Nothing here touches Base UI or Tailwind: the app has no Base UI yet (brief 16), and it is already on Tailwind v4.

### What SocialEvents has today (read 2026-11-10)

- **`tsconfig.base.json`** has `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `isolatedModules` and `verbatimModuleSyntax`. It lacks `noUnusedLocals` and `erasableSyntaxOnly`. All three workspaces use `module: ESNext` and `moduleResolution: Bundler`, not the house's `NodeNext`. Imports already carry `.js` suffixes.
- **No ESLint config and no ESLint dependency.** `package.json:23` has `"lint": "eslint ."`. The code carries 11 `eslint-disable-next-line no-console` comments, so a config was meant to exist.
- **No formatter, no `.npmrc`, no root `CLAUDE.md`, no `.claude/`.** Every dependency is pinned exactly anyway (`grep -nE '"[\^~]' package.json */package.json` prints nothing). `.gitignore` has no `.claude` line, so `.claude/rules/` is not hidden.
- **`npm test` fails on a fresh clone.** The root script runs only the server workspace, and the server imports `@socialevents/shared` through its built `dist/`. With `shared/dist` removed, `npx vitest run` in `server/` reports "Failed to resolve entry for package" and 1 failed suite of 4. `npm run typecheck` is `tsc -b`, which builds `shared` first, so it passes.
- **The tests:** 4 files, 27 tests, vitest 4.1.9, 4.2 s. All sit beside their source or in `server/src/test/`. The client has no tests.

### Measured on 2026-11-10

Taken on a scratch copy with `npm ci` (install scripts skipped, then `npm rebuild better-sqlite3 bcrypt`): Prettier 3.9.10, ESLint 9.39.5, typescript-eslint 8.72.2, eslint-plugin-react-hooks 7.1.1, knip 6.44.2, `eslint-plugin-better-tailwindcss` 4.11.0.

**Prettier churn.** Defaults (double quotes, semicolons) with `trailingComma: "all"`, over the 71 TypeScript and JavaScript files (4,723 lines) plus the JSON, CSS and HTML Prettier covers. Lines removed in the diff, and files changed:

| `printWidth` | Lines | Files |
|---|---|---|
| 80 | 175 (3.7%) | 34 |
| 90 | 159 (3.4%) | 29 |
| 100 | 394 (8.3%) | 39 |
| 110 | 517 (10.9%) | 43 |
| **120** | **590 (12.5%)** | **44** |
| 130 | 693 (14.7%) | 45 |
| 150 | 835 (17.7%) | 47 |

Churn rises with width, unlike the other house repos, because this code was written near 80 columns: the 95th percentile of line length is 76 (`git ls-files 'client/src/*' 'server/src/*' 'shared/src/*' | xargs awk '{print length($0)}'`). A wider limit joins lines that are wrapped today. The estate width is 120 (Q8, Q51), so this repo takes the larger one-off diff. Quotes and semicolons already match the house: the code has 0 single-quoted imports. The non-source files that change at 120 are `tsconfig.json` and `client/src/styles/index.css`.

**TypeScript flags**, each added alone (`find . -name '*.tsbuildinfo' -delete`, remove the `dist` folders, then `npx tsc -b`):

- `noUnusedLocals`: 0 errors.
- `erasableSyntaxOnly`: 4 errors, all parameter properties: `client/src/api/client.ts:5, 6` (`public status`, `public code`) and `server/src/http/errors.ts:3, 4` (`public statusCode`, `public errorCode`). Two classes, both `Error` subclasses.
- `exactOptionalPropertyTypes`: 7 errors: `client/src/api/client.ts:18`, `client/src/components/EventDetailModal.tsx:101`, `server/src/app.ts:19, 73`, `server/src/routes/events.ts:24`, `server/src/routes/users.ts:26`, `server/src/services/eventService.ts:96`. Four are Zod-parsed optionals passed on as `T | undefined`, two are a Fastify logger option and the fetch call's headers. Not added here (Q11, decision 4).

**The typed ESLint rules**, through `projectService`, with `typescript-eslint` recommended, `react-hooks` recommended on `client/src`, and `eslint-plugin-n`:

| Rule | Findings | Where |
|---|---|---|
| `no-floating-promises` | 4 | `client/src/api/hooks.ts:102, 103, 179, 180` (unawaited `qc.invalidateQueries`) |
| `no-misused-promises` | 5 | `client/src/components/CreateEventModal.tsx:73`, `client/src/components/EventDetailModal.tsx:47`, `client/src/components/ProfileModal.tsx:52, 73`, `client/src/routes/AuthPage.tsx:45` (async `onClick` or `onSubmit`) |
| `await-thenable` | 0 | |
| `switch-exhaustiveness-check` | 0 | |
| `no-unnecessary-type-assertion` | 2 | `client/src/components/CreateEventModal.tsx:47`, `server/src/dal/events.ts:43` |
| `consistent-type-imports` | 0 | `verbatimModuleSyntax` already holds this |
| `no-non-null-assertion` | 8 | 5 in source: `client/src/routes/CalendarMonth.tsx:27`, `server/src/integrations/email/index.ts:17`, `server/src/integrations/weather/index.ts:28, 33`, `server/src/services/eventService.ts:113`; 3 in tests: `server/src/dal/dal.test.ts:182, 183, 184` |
| `@typescript-eslint/no-unused-expressions` (recommended) | 1 | `client/src/components/CreateEventModal.tsx:32` (`next.has(id) ? next.delete(id) : next.add(id)`) |
| `react-hooks/set-state-in-effect` | 1 | `client/src/components/Shell.tsx:44` (`setDrawerOpen(false)` in an effect) |
| `n/no-process-env` | 1 | `server/src/config/env.ts:21`, the one allowed reader |
| parse error | 1 | `server/vitest.config.ts`: no tsconfig covers it, so it needs `allowDefaultProject` |

**Timings.** `tsc -b` cold 5.1 s, warm 0.63 s. Typed ESLint on one file 10.0 s, on the whole repo 22.5 s (first run 15 s). So `check:fast` is about 11 s with one changed file, under the 15 s target (Q10). `projectService` was not compared with `project`; step 1 does.

**knip**, with no config: the unused dependency `zod` in `client/package.json:20`; the unlisted binary `eslint`; the unused exports `ApiError` (`client/src/api/client.ts:3`), `useUpdateEvent` (`client/src/api/hooks.ts:173`), `loadUser` (`server/src/auth/guards.ts:12`), `closeDb` (`server/src/db/connection.ts:33`), `badRequest` (`server/src/http/errors.ts:12`); and the type `AppConfig` (`server/src/config/env.ts:61`).

**`eslint-plugin-better-tailwindcss`**, with `entryPoint` set to `client/src/styles/index.css`: the correctness rules (`no-unknown-classes`, `no-conflicting-classes`, `no-concatenated-classes`) report 0, and `enforce-consistent-class-order` reports 14 (`client/src/components/Shell.tsx:79, 95, 107, 111, 123, 145`, `client/src/components/ui/Button.tsx:43`, `client/src/components/ui/Modal.tsx:34`, and six more), all fixed by `--fix`.

**The house shapes**, counted with `grep` over `client/src`, `server/src`, `shared/src` and the config files (71 files), with a second look at multi-line constructors:

| Shape | Count | Where |
|---|---|---|
| `enum` | 0 | |
| `any` (the keyword) | 0 | |
| non-null `!` | 8 | see the table above |
| `@ts-ignore` / `@ts-nocheck` / `@ts-expect-error` | 0 | |
| `TODO` / `FIXME` / `XXX` / `HACK` | 0 | |
| `console` | 11 | `server/src/seed/seed.ts:21, 128, 138`, `server/src/db/migrate.ts:55, 58`, `server/src/index.ts:17, 37, 44`, `server/src/config/env.ts:34`, `server/src/integrations/email/index.ts:44, 49` |
| default exports | 2 | `client/vite.config.ts:5`, `server/vitest.config.ts:3`, both configs |
| classes | 2 | `ApiError`, `HttpError`, both `Error` subclasses |
| parameter properties | 4 | in those two classes |
| namespaces | 0 | |

## Decisions of 2026-11-10 (the owner's grilling and its confirmed technical calls)

1. **Vendored `house-style`** (Q6). A copy with a version header, refreshed by a `house-style:sync` script that finds the checkout by name. No git or tarball dependency.
2. **Prettier at width 120** (Q8, Q51). Double quotes, semicolons, `trailingComma: "all"` (Q9). One reformat commit, listed in `.git-blame-ignore-revs`. Markdown stays out of Prettier (Q45).
3. **The six typed rules through `projectService`** (Q12), unless step 1 shows `project` is faster. `no-floating-promises` names `describe`, `it` and `test` in `allowForKnownSafeCalls`.
4. **tsconfig** (Q11). Add `noUnusedLocals` (0 errors) and `erasableSyntaxOnly` (4 errors, step 4). `exactOptionalPropertyTypes` waits: 7 errors, 3 of them library type friction, for a later brief. `module` and `moduleResolution` stay `ESNext` and `Bundler`: the server runs under `tsx` and `tsc`, and a `NodeNext` move would force `.js` rules on the client for no gain.
5. **The house shapes as errors** (Q13, Q47, Q48). `!` is an error in source and a warning in tests. `console` is allowed in the CLIs and the entry (`seed.ts`, `migrate.ts`, `index.ts`) and in `config/env.ts`, which runs before any logger exists. The two calls in `integrations/email/index.ts` are named as a temporary exception that brief 17 deletes when the mailer gets the Fastify logger. A default export is allowed in `*.config.*`.
6. **`check:fast`** (Q10). A typecheck plus ESLint on the changed files, built incrementally.
7. **The Claude Code layer** (Q7). The plugin's hooks. A root `CLAUDE.md` stays short (Q46).
8. **A fresh clone must test** (Round 8 fact). The root gets a `pretest` that builds `shared`.

## Files you OWN

- `tsconfig.base.json`.
- New: `eslint.config.js`, the Prettier config, `.prettierignore`, `.git-blame-ignore-revs`, `.npmrc`, `scripts/` (the changed-files script, `conventions.json`), the vendored `house-style` copy.
- The root `package.json` and `client/package.json`, `server/package.json`, `package-lock.json` (scripts, devDependencies, the unused `zod` in the client).
- The reformat: whitespace-only changes to every file Prettier covers.
- The fixes the new rules ask for, in:
  - `client/src/api/client.ts` and `server/src/http/errors.ts` (parameter properties);
  - `client/src/api/hooks.ts`, the three modals, `client/src/routes/AuthPage.tsx`, `client/src/routes/CalendarMonth.tsx`, `client/src/components/Shell.tsx`;
  - `server/src/integrations/email/index.ts`, `server/src/integrations/weather/index.ts`, `server/src/services/eventService.ts`, `server/src/dal/events.ts`;
  - the unused exports knip lists.
- New: `.claude/rules/web.md`, `.claude/rules/server.md`, `CLAUDE.md`.
- Corpus: [wiki/decisions.md](../../wiki/decisions.md) (a new entry), [wiki/status.md](../../wiki/status.md), [log.md](../../log.md), and [the ESLint todo](../../todos/2026-11-01-eslint-config.md) (closed).

## Files you must NOT touch

- Behaviour. Apart from the fixes listed, every change is formatting or configuration.
- The layout of `server/src` and `client/src`, which are briefs 17 and 16.
- The skills library and the `house-style` source repo. A rule that seems wrong for SocialEvents is reported back, not patched here.

## What to do

One commit per step, each with `npm run typecheck`, `npm test` and `npm run build` green. Run `npm run lint` too from step 5 on.

1. **Measure first.** Record in the `log.md` entry: the six typed rules' counts again, lint time with `projectService` against `project`, `npx knip`, the `tsc` counts with the new flags, `@vitest/eslint-plugin` recommended's count on `server/src/**/*.test.ts` (0 on 2026-11-10), and the width table. Any rule that finds more than about 20 real problems goes back to the owner before it is turned on.
2. **Vendor `house-style`, and `.npmrc`.** Copy the package with its version header, add the `house-style:sync` script, and write `.npmrc` with `save-exact=true`.
3. **Prettier and the reformat.**
   1. Add `prettier` (pinned) and the config at width 120.
   2. Add `.prettierignore`: `*.md`, `package-lock.json`, `dist/`, `dist-types/`, `data/`, `coverage/`, `corpus/sources/`, `docs/images/`, `playwright/screenshots/`.
   3. Add `"format": "prettier --write ."` and `"format:check": "prettier --check ."`, and commit this alone.
   4. Run `npm run format` and commit only that, as `style: format with Prettier`.
   5. Put that commit's full hash in `.git-blame-ignore-revs`, in its own commit.
   6. Hand the owner the one-time `git config blame.ignoreRevsFile .git-blame-ignore-revs`.
4. **tsconfig.** Add `noUnusedLocals` and `erasableSyntaxOnly` to `tsconfig.base.json`. Turn the two classes' parameter properties into declared fields assigned in the constructor, keeping their names, order and behaviour. Delete `*.tsbuildinfo` first when measuring, or `tsc -b` skips the check.
5. **ESLint**, closing [the todo](../../todos/2026-11-01-eslint-config.md). Add the pinned devDependencies and a flat `eslint.config.js` that extends the vendored house config, passing the roots (`client/src`, `server/src`, `shared/src`). The diff in effect:

   | Rule | Today | After | Findings today |
   |---|---|---|---|
   | the six typed rules | no config | error, through `projectService` | 4, 5, 0, 0, 2, 0 (fix them) |
   | `@typescript-eslint/no-non-null-assertion` | no config | error in source, warn in tests | 5 in source (fix), 3 in tests |
   | `no-restricted-syntax` on `TSEnumDeclaration` | no config | error | 0 |
   | `no-warning-comments` (`todo`, `fixme`), pointing at `corpus/todos/` | no config | error | 0 |
   | `no-console` outside the CLIs, the entry and `config/env.ts` | the 11 disable comments | error; the comments go | 2 (email, a named exception) |
   | `no-default-export` outside `*.config.*` | no config | error | 0 |
   | `n/no-process-env` on `server/src` outside the config module and tests | no config | error | 0 (the one read is in the config module) |
   | `react-hooks` recommended on `client/src` | no config | error | 1 (`Shell.tsx:44`, fix: close the drawer in the nav links' click handler) |
   | `@vitest/eslint-plugin` recommended on `*.test.ts` | no config | error | 0 |
   | `better-tailwindcss` correctness rules and class order on `client/src` | no config | error, class order with `--fix` | 0 and 14 |
   | `ban-ts-comment` (only `@ts-expect-error` with a description) | no config | error | 0 |

   Typed linting needs `allowDefaultProject` for `server/vitest.config.ts` and `client/vite.config.ts` if no tsconfig covers it. The fixes: `void` before the four `invalidateQueries` calls and before the async handlers' promises (the house writes `void` for a discarded promise); an `if`/`else` for the set toggle; explicit narrowing or a thrown error for each `!` in source. Fix what the rules find, or list each finding left, with its reason, in the outcome note.
6. **The gate.** In the root `package.json`:
   - `pretest`: `npm run build:shared`, so a fresh clone tests;
   - `check` runs `typecheck`, `lint`, `format:check`, `check:conventions` and `test`;
   - `check:conventions` is knip plus the vendored convention checkers, with `--warn-only` until briefs 16 and 17 are done;
   - `check:fast` runs `typecheck`, then ESLint on the files changed against `HEAD` plus untracked ones, from a small Node script in `scripts/` (no shell-only syntax: the owner works under WSL);
   - `lint` stays `eslint .`.

   Fix knip's findings or list them: remove the client's unused `zod` and the unused exports, and declare `eslint`. Time `check:fast` warm with one changed file, and `check` in full. Record both.
7. **`.claude/rules/` and `CLAUDE.md`.** Each rules file stays under about 40 lines and points at the skill for the rest.
   - `web.md` (`paths: ["client/src/**"]`): read [wiki/design-system.md](../../wiki/design-system.md) first; components through `client/src/components/ui/`; the Aero theme is the skin ([wiki/decisions.md](../../wiki/decisions.md)); no inline `style` except for computed geometry; Brief 16 adds the Base UI lines.
   - `server.md` (`paths: ["server/src/**", "shared/src/**"]`): read [wiki/architecture.md](../../wiki/architecture.md), [wiki/data-model.md](../../wiki/data-model.md) and [wiki/auth.md](../../wiki/auth.md); SQL stays parameterised and hand-written; a schema the client imports lives in `shared/`; Brief 17 adds the structure lines.
   - `CLAUDE.md` at the root, under about 60 lines: one line on what the app is, "read [corpus/index.md](../../index.md) first", the commands (`npm run check` before every hand-back, `npm run check:fast`, `npx vitest run <file>` in `server/`, `npm run seed`), and the places that mislead: `server/.env` is read from the server's working directory, `shared` must be built before the server or client sees a schema change, and the API is on 3001 with Vite on 5173.
8. **Corpus.** Add the [wiki/decisions.md](../../wiki/decisions.md) entry "The house style, formatted and checked" (width, config source, what was rejected and why), update [wiki/status.md](../../wiki/status.md) (its "Not working: `npm run lint`" line goes), write the [log.md](../../log.md) entry with step 1's numbers, close the todo, and run `bash corpus/lint.sh` until it is clean.

## Acceptance

- [ ] `npm run check` passes. Its run time and `check:fast`'s, warm with one changed file, are in the outcome note; `check:fast` is under about 15 s or the owner has accepted the time.
- [ ] `npx prettier --check .` passes. `git diff -w <hash>^ <hash>` on the reformat commit shows nothing, and its hash is in `.git-blame-ignore-revs`.
- [ ] `tsconfig.base.json` has `noUnusedLocals`, `erasableSyntaxOnly` and `verbatimModuleSyntax`, and `npm run typecheck` passes.
- [ ] `npm run lint` reports zero errors. The counts before and after are in the outcome note, with every finding left and its reason.
- [ ] A deliberate `enum`, `!` in `server/src/app.ts`, `console.log` in `server/src/app.ts`, `// TODO`, `export default` in a non-config file, and an unawaited promise each fail `npm run lint`. Revert them after.
- [ ] On a fresh clone (`git clone`, `npm ci`), `npm test` passes without a prior `npm run build:shared`.
- [ ] `.claude/rules/web.md` and `server.md` exist with `paths:` frontmatter, and the root `CLAUDE.md` is under about 60 lines and names `npm run check`. `git check-ignore .claude/rules/web.md` prints nothing.
- [ ] With the plugin's hooks on, an agent's edit is formatted on save, and a type error stops it at `Stop`.
- [ ] `bash corpus/lint.sh` ends clean.

## Interplay

- Brief 16 adds the Base UI lines to `web.md`, drops `check-base-ui`'s `--warn-only`, and removes `Shell.tsx`'s drawer effect for good.
- Brief 17 deletes the email adapter's `no-console` exception, moves `config/env.ts`, adds dependency-cruiser, and drops `check-structure`'s `--warn-only`.
- The reformat changes `client/src/styles/index.css`'s hex case and wrapping. Brief 16 edits that file, so it starts after the reformat.
