---
summary: The locked tech and design choices, including the pinned versions, with the reason for each; the visual decisions reopened and changed on 2026-11-13 (brief 18) keep their old lines as history
updated: 2026-11-13
---

# Decisions (locked)

Settled choices. Don't relitigate without an explicit revisit + a `log.md` note.

## Stack
- **Visual theme (changed 2026-11-13, brief 18, the owner's approval on the estate redesign board):** "The open
  invitation". Aero stays, narrowed (next bullet), and the layout is no longer the Stitch layout: no **280 px
  sidebar** and no Month / Day / List / Map switcher. The places (Calendar, All Events, Map, and Admin for admins)
  are tabs on a glass top bar; List and Map folded into All Events and Map; **Month | Day** is a segmented pair in
  the month's head. The routes are unchanged. Tonight's event, or the next one, is a ticket over the month.
  *History, kept:* "Windows-7 **Aero** (modern interpretation), frosted glass + glossy blue + glow, over a desktop
  gradient. Implemented via Tailwind v4 `@theme` tokens + `@utility` glass/gloss/glow classes in
  `client/src/styles/index.css`. Stitch layout/IA preserved; only the skin changed. (Brief 13.)"
- **Aero stays in both themes, narrowed (2026-11-13, brief 18; ask 2 on the board):** glass only on the bars
  (top bar, phone bottom bar) and the dialogs' title bars. Islands, dialogs and fields are opaque surfaces with a
  1 px edge over a flat desktop; the desktop gradient, the stronger glass, the glossy danger and social buttons and
  the glow are gone. "Two themes, Aero in both" stands. The category colours keep their hues (purple, orange-red,
  green, slate), only tuned for contrast (not a reopened decision); the Other chip's fill is opaque.
- **Type (changed 2026-11-13, brief 18):** Lexend for the wordmark, the month title, the ticket title, dialog titles
  and the list head, Figtree for everything else, both self-hosted (`@fontsource-variable/*` 5.3.0). This also ends
  an old mismatch: the stylesheet asked for "Geist" while `@fontsource/geist-sans` registers "Geist Sans", so the
  system face had been rendering. *History:* the Stitch type was Geist via `@fontsource/geist-sans`, 5.2.5.
- **Two themes, Aero in both (2026-11-11, brief 16).** Light, Dark and System, light on a first visit, the choice
  kept in `localStorage` (the app has no per-user settings). `data-theme` on `<html>` holds `light` or `dark`;
  System is resolved in JS (`lib/theme.ts`, with a `matchMedia` listener) and by the boot script in `index.html`.
  The picker is a `RadioGroup`, not a guarded `ToggleGroup`: nothing is saved to the server (base-ui rule 16, Q57).
- **Base UI 1.9.0 under `components/ui/`, by the conventions (2026-11-11, brief 16).** ~~The phone menu is a `Drawer`~~ (changed
  2026-11-13, brief 18: there is no phone menu; a bottom bar holds the places, with Create Event at its right end, and
  the `Drawer` wrapper now carries the phone event sheet, so its grab bar really swipes it away);
  the All / Hosted-by-me filter a `RadioGroup`; the invite switch `Tabs`; the form dialogs (create, profile) ignore
  an outside press; the detail dialog does not. Deletes ask in place ("Delete? Yes No", `InlineConfirm`), including
  the event delete, which used to delete on one click. `StarRating` stays buttons: each click saves, and the stars
  show the average (a `conventions.json` exception). The three native `<select>`s and the text and date inputs stay
  native (Q16).
- **Monorepo**, npm workspaces: `client` / `server` / `shared`. `shared` = API contract.
- **Frontend:** React + Vite + TypeScript + Tailwind + TanStack Query + TanStack Router.
- **Backend:** Fastify (TypeScript), grouped by feature (`server/src/features/<name>/`), not by layer. See "The server structure" below.
- **DB:** SQLite via `better-sqlite3`. **Hand-written SQL stores (`createXStore(db)`), NO ORM.** Parameterized SQL only.
- **Migrations:** forward-only `.sql` files + tiny hand-written runner (`schema_migrations` table).
- **Validation:** Zod everywhere, schemas shared via `shared/`.
- **Auth:** self-made. bcrypt + self-signed JWT (HS256) in httpOnly+SameSite=Lax+Secure cookie. Email/password only (no OAuth/Google). See [auth.md](auth.md).
- **Authorization:** roles `user`/`admin` + host-or-admin ownership on event mutate. Enforced server-side on every protected route.
- **Tests:** Vitest on core logic (stores, auth, guards, dept→attendee expansion, rating aggregation, weather cache).
- **TS strict** everywhere. ESLint.
- **API style:** REST, proper verbs/status codes (old app's POST-for-reads is banned).
- **Integrations:** optional keys; **mock fallback** when key absent — app runs with zero keys. See [integrations.md](integrations.md).
- **Copy:** English only.
- **Data model:** normalized, real FKs (no free-text host / loose attendee blobs). See [data-model.md](data-model.md).
- **Greenfield:** no data migration from the old Mongo app. Seed instead.

## Package versions — PINNED (exact, no `^`/`~`)
Verified latest stable & mutually compatible on **2026-06-25**. Use these exact
versions in every `package.json`. When bumping, bump deliberately and update here.

### Root / tooling
| package | version |
|---|---|
| typescript | 6.0.3 |
| vitest | 4.1.9 |
| tsx | 4.22.4 |
| @playwright/test | 1.63.0 |

### shared
| package | version |
|---|---|
| zod | 4.6.7 |

### server
| package | version |
|---|---|
| fastify | 5.8.5 |
| @fastify/cookie | 11.0.2 |
| @fastify/cors | 11.2.0 |
| @fastify/helmet | 13.0.2 |
| @fastify/rate-limit | 11.0.0 |
| @fastify/static | 10.1.10 |
| better-sqlite3 | 12.11.1 |
| bcrypt | 6.0.0 |
| jsonwebtoken | 9.0.3 |
| nodemailer | 10.5.0 |
| zod | 4.6.7 |
| @types/node | 26.0.1 |
| @types/better-sqlite3 | 7.6.13 |
| @types/bcrypt | 6.0.0 |
| @types/jsonwebtoken | 9.0.10 |

### client
| package | version |
|---|---|
| react | 19.2.7 |
| react-dom | 19.2.7 |
| vite | 8.1.0 |
| @vitejs/plugin-react | 6.0.3 |
| tailwindcss | 4.3.1 |
| @tailwindcss/vite | 4.3.1 |
| @tanstack/react-query | 5.101.1 |
| @tanstack/react-router | 1.170.16 |
| react-icons | 5.6.0 |
| @fontsource-variable/figtree | 5.3.0 |
| @fontsource-variable/lexend | 5.3.0 |
| @types/react | 19.2.17 |
| @types/react-dom | 19.2.3 |
| zod | 4.6.7 |

## Notable version implications (load-bearing)
- **Tailwind v4** is CSS-first: configure via `@import "tailwindcss"` + `@theme`
  in CSS using the `@tailwindcss/vite` plugin. **No `tailwind.config.js`** by
  default. Design tokens (see [design-system.md](design-system.md)) go in the
  `@theme` block, not a JS config.
- **React 19** — no `React.FC` ceremony needed; new JSX transform; refs as props.
- **TanStack Router v1** — file-based or code-based routes; we use code-based in
  `client/src/router.tsx`.
- **Zod v4** — import from `zod` (v4 is the default export now). Shared schemas
  must work in both Node (server) and browser (client) — keep them runtime-only,
  no Node built-ins.
- **bcrypt v6** is native (node-gyp). If native build is a problem in the target
  env, `bcryptjs` is the documented fallback (revisit + log if switched).
- **better-sqlite3 v12** — synchronous; matches the no-ORM, prepared-statement stores.

## Maps key note
Google Maps JS needs a **browser** key (public). It's the one intentionally-public
key, exposed to the client via Vite env (`VITE_MAPS_BROWSER_KEY`). All other keys
stay server-side. Absent → non-interactive fallback. See [integrations.md](integrations.md).

## The house style, formatted and checked (2026-11-11)
- **Config source:** the estate's `house-style` 1.0.0, vendored at `vendor/house-style/` and refreshed with
  `npm run house-style:sync`. The root configs (`eslint.config.mjs`, `prettier.config.mjs`, `knip.config.js`,
  `.dependency-cruiser.cjs`) are thin wrappers; they are `.mjs`/`.js` files because the root `package.json` is not
  `"type": "module"`.
- **Prettier at width 120**, double quotes, semicolons, trailing commas. This code was written near 80 columns, so
  the one reformat commit is larger than in other repos (44 files, 248 lines added, 589 removed); it is in
  `.git-blame-ignore-revs`. Markdown stays out of Prettier.
- **tsconfig:** `noUnusedLocals` and `erasableSyntaxOnly` added. `exactOptionalPropertyTypes` waits (7 errors, 3 of
  them library type friction). `module` and `moduleResolution` stay `ESNext` and `Bundler`: the server runs under
  `tsx` and `tsc`, and `NodeNext` would force `.js` rules on the client for no gain.
- **ESLint:** the six typed rules through `projectService` (12.8 s on the repo against 11.6 s for `project: true`,
  so no change), `!` an error in source and a warning in tests, no enums, no `TODO` comments, no `console` outside the
  CLIs, no default exports outside `*.config.*`, `process.env` only in `server/src/config.ts`.
- **Gate:** `check` and `check:fast` (typecheck, then ESLint on the changed files, from `scripts/check-fast.mjs`).
  `pretest` builds `shared`, so a fresh clone tests.
- **Rejected:** a `NodeNext` move (above); Prettier over Markdown; running the convention checkers strict now (they
  report 7 and 67 findings, which the Base UI and server briefs fix).

## The server structure (2026-11-11, brief 17)
- **Shape:** the owner's code-structure skill. `server.ts` listens, `app.ts` builds, `config.ts` alone reads the
  environment, `features/<name>/` holds routes, store and service behind an `index.ts`, `plugins/` the cross-cutting
  parts, `lib/` the Fastify-free `HttpError`. Dependencies are passed as typed plugin options built once in `buildApp`.
- **Schemas:** the zod type provider on every route, a response schema on every route (no route streams, so no
  exemption). A schema the client also imports lives in `shared/` (`idParamsSchema`, `healthSchema`, the list and
  wrapper response schemas). `FastifyPluginAsyncZod` types each feature plugin.
- **Errors:** one error plugin, registered first, keeping the repo's flat `{ error, message? }`. Fastify's own 4xx pass
  through with their status; everything else is a fixed 500. The 404 handler is rate-limited.
- **Guards run in `preValidation`,** not `preHandler`, so the order of replies is unchanged (401 before 400). The
  brief's text assumed the session check ran before validation by being a `preHandler`; it does not, so the hook moved.
- **Singleton or factories:** factories (`createUsersStore(db)` and the rest), as the brief's default. `getDb`, `setDb`
  and `resetData` are gone.
- **Event ratings** moved to the ratings feature (same URLs); it takes `eventExists` and `userExists` as plain
  functions, so it imports neither the events nor the users feature.
- **`NODE_ENV`:** `check-structure` rule 3 reports `config.ts`'s reads (production secret check, the Secure cookie flag,
  the silent test logger). Accepted in `scripts/conventions.json` until a deploy brief replaces them with variables of
  the app's own.
- **`TRUST_PROXY`:** a new optional setting, false by default; unused until the app is deployed.
- **Rejected:** keeping the layer split (`routes/ services/ dal/`: it spreads one feature over three folders and lets
  any route import any store); filesystem autoload (an implicit registration order, hard to read and to test); keeping
  the module singleton as a recorded exception (it hid every dependency and made tests swap a global).
