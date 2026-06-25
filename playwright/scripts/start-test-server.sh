#!/usr/bin/env bash
# Build, seed a throwaway DB, and start the SocialEvents server for UI testing.
# Usage: bash playwright/scripts/start-test-server.sh [PORT]
# Serves API + built client on one origin. Mock integrations (no keys needed).
set -euo pipefail

PORT="${1:-3009}"
DB="./data/pwtest.sqlite"
export DATABASE_PATH="$DB"
export JWT_SECRET="pwtest-secret-pwtest-secret-1234"
export PORT

cd "$(dirname "$0")/../.."

echo "[pwtest] building shared + client…"
npm run build:shared >/dev/null
npm run build --workspace client >/dev/null

echo "[pwtest] resetting + seeding $DB…"
rm -f "$DB" "$DB"-shm "$DB"-wal
npx tsx server/src/seed/seed.ts

echo "[pwtest] starting server on :$PORT (Ctrl-C to stop)"
echo "[pwtest] open http://localhost:$PORT  | logins: *@socialevents.local / password123"
npx tsx server/src/index.ts
