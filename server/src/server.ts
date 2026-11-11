import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import closeWithGrace from "close-with-grace";
import { buildApp } from "./app.js";
import { loadConfig, loadEnvFile } from "./config.js";

// The process: settings, the app, shutdown, listen. Nothing else in the server listens.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const envFile = loadEnvFile();
  // A bad setting throws here, before any logger exists: Node prints it and exits 1.
  const config = loadConfig();

  // Serve the built client if present (single-origin production).
  const clientDist = path.resolve(__dirname, "../../client/dist");
  const app = await buildApp(config, {
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
  app.log.info(envFile === undefined ? "no .env: settings from the environment" : "settings from server/.env");

  // SIGINT, SIGTERM or an uncaught error: stop taking requests, finish the ones in flight, and close the
  // app, which closes the database. After 10 s it exits anyway.
  closeWithGrace({ delay: 10_000, logger: app.log }, async ({ signal, err }) => {
    if (err) app.log.error({ err }, "closing after an uncaught error");
    else app.log.info(`closing on ${signal ?? "request"}`);
    await app.close();
  });

  await app.listen({ port: config.port, host: "0.0.0.0" });
  app.log.info(
    `listening on :${config.port} | weather=${config.weather.apiKey ? "live" : "mock"} email=${config.smtp.host ? "smtp" : "mock"}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
