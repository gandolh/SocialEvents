import type { User, UserRole } from "@socialevents/shared";
import type { Db } from "../../db/connection.js";
import { newId, now } from "../../db/util.js";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  department_id: string | null;
  job_title: string | null;
  created_at: string;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRole,
    departmentId: row.department_id,
    jobTitle: row.job_title,
    createdAt: row.created_at,
  };
}

export interface CreateUserParams {
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  departmentId?: string | null;
}

export function createUsersStore(db: Db) {
  const store = {
    create(params: CreateUserParams): User {
      const row: UserRow = {
        id: newId(),
        name: params.name,
        email: params.email.toLowerCase(),
        password_hash: params.passwordHash,
        role: params.role ?? "user",
        department_id: params.departmentId ?? null,
        job_title: null,
        created_at: now(),
      };
      db.prepare(
        `INSERT INTO users (id, name, email, password_hash, role, department_id, job_title, created_at)
         VALUES (@id, @name, @email, @password_hash, @role, @department_id, @job_title, @created_at)`,
      ).run(row);
      return toUser(row);
    },

    findById(id: string): User | null {
      const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
      return row ? toUser(row) : null;
    },

    /** Includes password_hash — for auth only. */
    findByEmailWithHash(email: string): (User & { passwordHash: string }) | null {
      const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()) as UserRow | undefined;
      if (!row) return null;
      return { ...toUser(row), passwordHash: row.password_hash };
    },

    findPasswordHash(id: string): string | null {
      const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(id) as
        { password_hash: string } | undefined;
      return row?.password_hash ?? null;
    },

    list(departmentId?: string): User[] {
      const rows = (
        departmentId
          ? db.prepare("SELECT * FROM users WHERE department_id = ? ORDER BY name").all(departmentId)
          : db.prepare("SELECT * FROM users ORDER BY name").all()
      ) as UserRow[];
      return rows.map(toUser);
    },

    updateProfile(id: string, fields: { name?: string; jobTitle?: string | null }): User | null {
      const existing = store.findById(id);
      if (!existing) return null;
      const name = fields.name ?? existing.name;
      const jobTitle = fields.jobTitle === undefined ? existing.jobTitle : fields.jobTitle;
      db.prepare("UPDATE users SET name = ?, job_title = ? WHERE id = ?").run(name, jobTitle, id);
      return store.findById(id);
    },

    updatePasswordHash(id: string, passwordHash: string): void {
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, id);
    },

    setDepartment(id: string, departmentId: string | null): User | null {
      db.prepare("UPDATE users SET department_id = ? WHERE id = ?").run(departmentId, id);
      return store.findById(id);
    },
  };
  return store;
}

export type UsersStore = ReturnType<typeof createUsersStore>;
