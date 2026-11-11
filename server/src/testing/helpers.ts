import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";
import { loadConfig, type Config } from "../config.js";
import { openDb, type Db } from "../db/connection.js";
import { runMigrations } from "../db/migrate.js";

/** A settings object for a test: in-memory database, a fixed secret, nothing read from the process. */
export function testConfig(env: NodeJS.ProcessEnv = {}): Config {
  return loadConfig({
    NODE_ENV: "test",
    DATABASE_PATH: ":memory:",
    JWT_SECRET: "test-secret-test-secret-0123456789",
    ...env,
  });
}

/** A fresh in-memory database with the schema applied. */
export function freshDb(): Db {
  const db = openDb(":memory:");
  runMigrations(db);
  return db;
}

/**
 * The whole app for one test, over its own in-memory database, never listening. The database comes back
 * too, for a test that must arrange rows directly. Close the app after the test: that closes the database.
 */
export async function buildTestApp(): Promise<{ app: FastifyInstance; db: Db }> {
  const db = freshDb();
  const app = await buildApp(testConfig(), { db });
  return { app, db };
}
