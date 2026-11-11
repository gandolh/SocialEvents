import Database from "better-sqlite3";
import { setDb, getDb } from "../db/connection.js";
import { runMigrations } from "../db/migrate.js";

/** Create a fresh in-memory database with the schema applied. */
export function freshDb(): void {
  const db = new Database(":memory:");
  setDb(db);
  runMigrations(db);
}

/** Wipe all data (keep schema). */
export function resetData(): void {
  const db = getDb();
  db.pragma("foreign_keys = OFF");
  const tables = [
    "event_attendees",
    "event_ratings",
    "host_ratings",
    "notifications",
    "events",
    "users",
    "departments",
  ];
  for (const t of tables) db.exec(`DELETE FROM ${t}`);
  db.pragma("foreign_keys = ON");
}
