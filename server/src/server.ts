import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import closeWithGrace from "close-with-grace";
import { buildApp } from "./app.js";
import { config, loadEnvFile } from "./config.js";
import { closeDb } from "./db/connection.js";
import { runMigrations } from "./db/migrate.js";
import { weatherMode } from "./features/integrations/weather.js";
import { emailMode } from "./features/notifications/email.js";

// The process: settings, migrations, the app, shutdown, listen. Nothing else in the server listens.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const envFile = loadEnvFile();
  console.log(envFile === undefined ? "[config] no .env: settings from the environment" : "[config] settings from server/.env");

  const applied = runMigrations();
  if (applied.length) {
    console.log(`[migrate] applied: ${applied.join(", ")}`);
  }

  // Serve the built client if present (single-origin production).
  const clientDist = path.resolve(__dirname, "../../client/dist");
  const app = await buildApp({
    ...(fs.existsSync(clientDist) ? { clientDist } : {}),
    server: {
      logger: config.isTest ? false : { level: config.isProd ? "info" : "debug" },
      trustProxy: config.trustProxy,
      // A socket silent this long mid-request is cut. No route runs long: the weather call is one fetch.
      connectionTimeout: 10_000,
      // The whole request, body included, must arrive within this.
      requestTimeout: 30_000,
    },
  });

  // SIGINT, SIGTERM or an uncaught error: stop taking requests, finish the ones in flight, close the database.
  closeWithGrace({ delay: 10_000, logger: app.log }, async ({ signal, err }) => {
    if (err) app.log.error({ err }, "closing after an uncaught error");
    else app.log.info(`closing on ${signal ?? "request"}`);
    await app.close();
    closeDb();
  });

  await app.listen({ port: config.port, host: "0.0.0.0" });
  console.log(`[server] listening on :${config.port} | weather=${weatherMode()} email=${emailMode()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
