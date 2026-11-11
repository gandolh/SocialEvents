import { beforeEach, describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createUsersStore, type UsersStore } from "../users/index.js";
import { createNotificationsStore, type NotificationsStore } from "./index.js";

let users: UsersStore;
let notifications: NotificationsStore;

beforeEach(() => {
  const db = freshDb();
  users = createUsersStore(db);
  notifications = createNotificationsStore(db);
});

function mkUser(name: string, deptId: string | null = null) {
  return users.create({
    name,
    email: `${name.toLowerCase()}@x.com`,
    passwordHash: "hash",
    departmentId: deptId,
  });
}

describe("notifications repo", () => {
  it("creates many, lists, marks read, deletes", () => {
    const u = mkUser("U");
    notifications.createMany([u.id], "hello");
    const list = notifications.listForUser(u.id);
    expect(list).toHaveLength(1);
    expect(list[0]?.read).toBe(false);
    const id = list[0]?.id ?? "";
    notifications.setRead(id, true);
    expect(notifications.findById(id)?.read).toBe(true);
    expect(notifications.remove(id)).toBe(true);
    expect(notifications.listForUser(u.id)).toHaveLength(0);
  });
});
