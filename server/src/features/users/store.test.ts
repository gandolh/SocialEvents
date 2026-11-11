import { beforeEach, describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createDepartmentsStore, type DepartmentsStore } from "../departments/index.js";
import { createUsersStore, type UsersStore } from "./index.js";

let users: UsersStore;
let departments: DepartmentsStore;

beforeEach(() => {
  const db = freshDb();
  users = createUsersStore(db);
  departments = createDepartmentsStore(db);
});

function mkUser(name: string, deptId: string | null = null) {
  return users.create({
    name,
    email: `${name.toLowerCase()}@x.com`,
    passwordHash: "hash",
    departmentId: deptId,
  });
}

describe("users repo", () => {
  it("creates and finds by id and email", () => {
    const u = mkUser("Alice");
    expect(users.findById(u.id)?.email).toBe("alice@x.com");
    expect(users.findByEmailWithHash("alice@x.com")?.passwordHash).toBe("hash");
    expect(users.findById(u.id)).not.toHaveProperty("passwordHash");
  });

  it("lowercases email", () => {
    users.create({ name: "Bob", email: "BOB@X.com", passwordHash: "h" });
    expect(users.findByEmailWithHash("bob@x.com")).not.toBeNull();
  });

  it("sets department (null = guest)", () => {
    const d = departments.create("Eng");
    const u = mkUser("Carol");
    expect(users.setDepartment(u.id, d.id)?.departmentId).toBe(d.id);
    expect(users.setDepartment(u.id, null)?.departmentId).toBeNull();
  });
});
