import { beforeEach, describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createUsersStore, type UsersStore } from "../users/index.js";
import { createDepartmentsStore, type DepartmentsStore } from "./index.js";

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

describe("departments repo + member expansion", () => {
  it("deleting a department sets members' department to null", () => {
    const d = departments.create("Eng");
    const u = mkUser("Dave", d.id);
    departments.remove(d.id);
    expect(users.findById(u.id)?.departmentId).toBeNull();
  });

  it("memberIds returns unique members across departments", () => {
    const a = departments.create("A");
    const b = departments.create("B");
    const u1 = mkUser("U1", a.id);
    const u2 = mkUser("U2", b.id);
    mkUser("U3", null);
    const ids = departments.memberIds([a.id, b.id]);
    expect(ids.sort()).toEqual([u1.id, u2.id].sort());
  });
});
