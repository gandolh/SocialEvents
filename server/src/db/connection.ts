import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

/** The connection every store is built on. */
export type Db = Database.Database;

/** Opens the SQLite file at `dbPath`, creating its folder. `:memory:` is for tests. */
export function openDb(dbPath: string): Db {
  if (dbPath !== ":memory:") {
    const dir = path.dirname(dbPath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}
