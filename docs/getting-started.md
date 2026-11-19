# Getting started

How to run SocialEvents locally, check it, and run the built app on one port. The [main README](../README.md) has the short version.

Checked on 2026-11-16 with Node 22 on Linux.

## Prerequisites

- Node 20.11 or newer and npm.
- Nothing else: SQLite is a file, and weather, maps and email have built-in stand-ins.

## Set up

```bash
npm install
cp server/.env.example server/.env     # optional, every setting has a default
cp client/.env.example client/.env     # optional
npm run build:shared                   # the server and client import the built contract
npm run migrate                        # create the schema; the server also applies it on start
npm run seed                           # sample data
```

The seed makes three departments, five people, one of them an admin, and four events in July and October 2026. It prints the sign-in addresses and their shared password, which only suit a local run. It skips everything when the database already has users; delete the file to start over. The data lives in `server/data/socialevents.sqlite` unless `DATABASE_PATH` points elsewhere.

## Run the app

```bash
npm run dev:server     # Fastify on :3001, restarts on change
npm run dev:client     # second terminal: Vite on http://localhost:5173, forwarding /api to :3001
```

In development the server makes a throwaway `JWT_SECRET` and warns about it, so sign-ins end when it restarts. The startup log says which integrations are real and which are stand-ins, for example `weather=mock email=mock`.

Run the server scripts through `npm`. They run in `server/`, so the default `DATABASE_PATH` lands in `server/data/`; the server finds `server/.env` from its own folder either way.

To move the ports, set `PORT` for the API and pass Vite its flag through both npm layers, as in `npm run dev:client -- -- --port 5180`. With a single `--`, npm keeps the flag and Vite stays on 5173. Vite forwards `/api` to port 3001 whatever `PORT` says (`client/vite.config.ts`), so the dev page only reaches an API on 3001.

## Settings

`server/.env`:

| Variable | Default | What it does |
|---|---|---|
| `JWT_SECRET` | made up per start in development | signs the sign-in cookie; required, at least 16 characters, when `NODE_ENV=production` |
| `DATABASE_PATH` | `./data/socialevents.sqlite` | the SQLite file |
| `PORT` | `3001` | the API port |
| `CLIENT_ORIGIN` | `http://localhost:5173` in the example file | CORS origin of the Vite page in development |
| `TRUST_PROXY` | `false` | set to `true` behind a reverse proxy, so the rate limits count each client and not the proxy |
| `WEATHER_API_KEY` | empty, stand-in | a WeatherStack-compatible key; answers are cached for 24 hours, and a call that fails or takes over 5 seconds falls back to the stand-in |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | empty, stand-in | mail for invites and welcomes; without a host nothing is sent and the log says so |

`client/.env`:

| Variable | Default | What it does |
|---|---|---|
| `VITE_MAPS_BROWSER_KEY` | empty | a public Google Maps key; without it the map shows the places as a list |
| `VITE_API_BASE_URL` | `/api` | change only if the API is on another origin |

## Check and build

```bash
npm run check          # typecheck, ESLint, Prettier check, conventions, tests: run it before handing work back
npm run check:fast     # the typecheck, then ESLint on the changed files only
npm test               # Vitest: the server's settings, stores, routes, sign-in, guards, errors, weather cache and mail escaping; the client's dialog, sheet, inline confirm and theme in jsdom
npm run format         # Prettier writes every file it covers (Markdown stays out)
npm run build          # shared, server and client
```

`check:conventions`, part of `check`, runs knip, the contrast check in `scripts/check-contrast.mjs` (every text, icon and focus-ring colour pair in both themes), dependency-cruiser and the two house-style checkers. The lint, format and convention configs at the root wrap the copy in `vendor/house-style/`; refresh it with `npm run house-style:sync` and never edit it by hand.

## Browser specs

The Playwright specs in [playwright/](../playwright/README.md) check the focus ring, reduced motion, no sideways scroll at 390 and 360 px, the first screen's layout, the Join states and the theme switch. They run against a seeded test server that serves the built client:

```bash
bash playwright/scripts/start-test-server.sh 3009             # builds, seeds data/pwtest.sqlite, serves on :3009
SOCIALEVENTS_URL=http://localhost:3009 npm run e2e            # second terminal
```

The plain-text UI test plans are in [corpus/test-plans/](../corpus/test-plans/index.md).

## Run the built app on one port

```bash
npm run build
NODE_ENV=production JWT_SECRET=<at least 16 characters> npm run start --workspace server
```

The server applies migrations, serves `client/dist` and the API from the same port, and answers unknown paths outside `/api` with the page, so links like `/calendar` work after a reload.
