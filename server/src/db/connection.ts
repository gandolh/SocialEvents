import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config/env.js";

let db: Database.Database | null = null;

/** Open (once) and return the SQLite connection.
 *  `:memory:` is supported for tests. */
export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = config.databasePath;
  if (dbPath !== ":memory:") {
    const dir = path.dirname(dbPath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

/** Replace the connection (used by tests to inject an in-memory db). */
export function setDb(instance: Database.Database): void {
  instance.pragma("foreign_keys = ON");
  db = instance;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
