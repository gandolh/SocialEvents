import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import { getDb } from "./connection.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "migrations");

/** Apply all pending migrations (forward-only) in filename order. */
export function runMigrations(db: Database.Database = getDb()): string[] {
  db.exec(
    `CREATE TABLE IF NOT EXISTS schema_migrations (
       name        TEXT PRIMARY KEY,
       applied_at  TEXT NOT NULL
     )`,
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const appliedRows = db
    .prepare("SELECT name FROM schema_migrations")
    .all() as { name: string }[];
  const applied = new Set(appliedRows.map((r) => r.name));

  const newlyApplied: string[] = [];
  const insert = db.prepare(
    "INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)",
  );

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const tx = db.transaction(() => {
      db.exec(sql);
      insert.run(file, new Date().toISOString());
    });
    tx();
    newlyApplied.push(file);
  }

  return newlyApplied;
}

// CLI entry: `tsx src/db/migrate.ts`
const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const applied = runMigrations();
  if (applied.length === 0) {
    // eslint-disable-next-line no-console
    console.log("[migrate] up to date, nothing to apply");
  } else {
    // eslint-disable-next-line no-console
    console.log(`[migrate] applied: ${applied.join(", ")}`);
  }
}
