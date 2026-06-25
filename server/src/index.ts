import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import { buildApp } from "./app.js";
import { config } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";
import { weatherMode } from "./integrations/weather/index.js";
import { emailMode } from "./integrations/email/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const applied = runMigrations();
  if (applied.length) {
    // eslint-disable-next-line no-console
    console.log(`[migrate] applied: ${applied.join(", ")}`);
  }

  const app = await buildApp();

  // Serve the built client if present (single-origin production).
  const clientDist = path.resolve(__dirname, "../../client/dist");
  if (fs.existsSync(clientDist)) {
    await app.register(fastifyStatic, { root: clientDist });
    app.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith("/api")) {
        return reply.code(404).send({ error: "not_found" });
      }
      return reply.sendFile("index.html");
    });
  }

  await app.listen({ port: config.port, host: "0.0.0.0" });

  // eslint-disable-next-line no-console
  console.log(
    `[server] listening on :${config.port} | weather=${weatherMode()} email=${emailMode()}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
