# Getting started

How to run SocialEvents locally, check it, and run the built app on one port. The [main README](../README.md) has the short version.

Checked on 2026-11-01 with Node 24 on Linux.

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

The seed makes three departments, five people, one of them an admin, and four events in July and October 2026. It prints the sign-in addresses and their shared password, which only suit a local run. The data lives in `server/data/socialevents.sqlite` unless `DATABASE_PATH` points elsewhere.

## Run the app

```bash
npm run dev:server     # Fastify on :3001, restarts on change
npm run dev:client     # second terminal: Vite on http://localhost:5173, forwarding /api to :3001
```

In development the server makes a throwaway `JWT_SECRET` and warns about it, so sign-ins end when it restarts. The startup log says which integrations are real and which are stand-ins, for example `weather=mock email=mock`.

## Settings

`server/.env`:

| Variable | Default | What it does |
|---|---|---|
| `JWT_SECRET` | made up per start in development | signs the sign-in cookie; required, at least 16 characters, when `NODE_ENV=production` |
| `DATABASE_PATH` | `./data/socialevents.sqlite` | the SQLite file |
| `PORT` | `3001` | the API port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS origin of the Vite page in development |
| `TRUST_PROXY` | `false` | set to `true` behind a reverse proxy, so the rate limits count each client and not the proxy |
| `WEATHER_API_KEY` | empty, stand-in | a WeatherStack-compatible key; answers are cached for 24 hours |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | empty, stand-in | mail for invites and welcomes; without them nothing is sent and the log says so |

`client/.env`:

| Variable | Default | What it does |
|---|---|---|
| `VITE_MAPS_BROWSER_KEY` | empty | a public Google Maps key; without it the map shows the places as a list |
| `VITE_API_BASE_URL` | `/api` | change only if the API is on another origin |

## Check and build

```bash
npm run typecheck      # tsc -b across the three workspaces
npm test               # Vitest: data access, sign-in, guards, ownership, ratings, the weather cache
npm run build          # shared, server and client
```

`npm run lint` has no ESLint config yet, so it stops with an error.

## Run the built app on one port

```bash
npm run build
NODE_ENV=production JWT_SECRET=<at least 16 characters> npm run start --workspace server
```

The server applies migrations, serves `client/dist` and the API from the same port, and answers unknown paths outside `/api` with the page, so links like `/calendar` work after a reload.

## UI test plans

The plain-text test plans are in [corpus/test-plans/](../corpus/test-plans/index.md), and [playwright/README.md](../playwright/README.md) says how to start a seeded server for them.
