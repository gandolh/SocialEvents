import type { Department } from "@socialevents/shared";
import type { Db } from "../../db/connection.js";
import { newId, now } from "../../db/util.js";

interface DepartmentRow {
  id: string;
  name: string;
  created_at: string;
}

function toDepartment(row: DepartmentRow): Department {
  return { id: row.id, name: row.name, createdAt: row.created_at };
}

export function createDepartmentsStore(db: Db) {
  const store = {
    create(name: string): Department {
      const row: DepartmentRow = { id: newId(), name, created_at: now() };
      db.prepare("INSERT INTO departments (id, name, created_at) VALUES (@id, @name, @created_at)").run(row);
      return toDepartment(row);
    },

    findById(id: string): Department | null {
      const row = db.prepare("SELECT * FROM departments WHERE id = ?").get(id) as DepartmentRow | undefined;
      return row ? toDepartment(row) : null;
    },

    findByName(name: string): Department | null {
      const row = db.prepare("SELECT * FROM departments WHERE name = ?").get(name) as DepartmentRow | undefined;
      return row ? toDepartment(row) : null;
    },

    list(): Department[] {
      const rows = db.prepare("SELECT * FROM departments ORDER BY name").all() as DepartmentRow[];
      return rows.map(toDepartment);
    },

    /** Delete; FK ON DELETE SET NULL moves members to no-department. */
    remove(id: string): boolean {
      const res = db.prepare("DELETE FROM departments WHERE id = ?").run(id);
      return res.changes > 0;
    },

    /** All distinct user ids belonging to the given departments. */
    memberIds(departmentIds: string[]): string[] {
      if (departmentIds.length === 0) return [];
      const placeholders = departmentIds.map(() => "?").join(",");
      const rows = db
        .prepare(`SELECT id FROM users WHERE department_id IN (${placeholders})`)
        .all(...departmentIds) as { id: string }[];
      return rows.map((r) => r.id);
    },
  };
  return store;
}

export type DepartmentsStore = ReturnType<typeof createDepartmentsStore>;
