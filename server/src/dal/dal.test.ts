import { describe, it, expect, beforeEach } from "vitest";
import { freshDb, resetData } from "../test/helpers.js";
import { usersRepo } from "./users.js";
import { departmentsRepo } from "./departments.js";
import { eventsRepo } from "./events.js";
import { eventRatingsRepo, hostRatingsRepo } from "./ratings.js";
import { notificationsRepo } from "./notifications.js";

beforeEach(() => {
  freshDb();
  resetData();
});

function mkUser(name: string, deptId: string | null = null) {
  return usersRepo.create({
    name,
    email: `${name.toLowerCase()}@x.com`,
    passwordHash: "hash",
    departmentId: deptId,
  });
}

describe("users repo", () => {
  it("creates and finds by id and email", () => {
    const u = mkUser("Alice");
    expect(usersRepo.findById(u.id)?.email).toBe("alice@x.com");
    expect(usersRepo.findByEmailWithHash("alice@x.com")?.passwordHash).toBe("hash");
    expect(usersRepo.findById(u.id)).not.toHaveProperty("passwordHash");
  });

  it("lowercases email", () => {
    usersRepo.create({ name: "Bob", email: "BOB@X.com", passwordHash: "h" });
    expect(usersRepo.findByEmailWithHash("bob@x.com")).not.toBeNull();
  });

  it("sets department (null = guest)", () => {
    const d = departmentsRepo.create("Eng");
    const u = mkUser("Carol");
    expect(usersRepo.setDepartment(u.id, d.id)?.departmentId).toBe(d.id);
    expect(usersRepo.setDepartment(u.id, null)?.departmentId).toBeNull();
  });
});

describe("departments repo + member expansion", () => {
  it("deleting a department sets members' department to null", () => {
    const d = departmentsRepo.create("Eng");
    const u = mkUser("Dave", d.id);
    departmentsRepo.remove(d.id);
    expect(usersRepo.findById(u.id)?.departmentId).toBeNull();
  });

  it("memberIds returns unique members across departments", () => {
    const a = departmentsRepo.create("A");
    const b = departmentsRepo.create("B");
    const u1 = mkUser("U1", a.id);
    const u2 = mkUser("U2", b.id);
    mkUser("U3", null);
    const ids = departmentsRepo.memberIds([a.id, b.id]);
    expect(ids.sort()).toEqual([u1.id, u2.id].sort());
  });
});

describe("events repo", () => {
  it("creates with attendees and computes count", () => {
    const host = mkUser("Host");
    const a1 = mkUser("A1");
    const a2 = mkUser("A2");
    const ev = eventsRepo.create({
      name: "Party",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Other",
      location: { label: "HQ", lat: 1, lng: 2 },
      attendeeUserIds: [a1.id, a2.id, a1.id], // dup ignored
    });
    expect(ev.attendeeCount).toBe(2);
    expect(ev.hostName).toBe("Host");
  });

  it("filters by category and attendee", () => {
    const host = mkUser("Host");
    const att = mkUser("Att");
    eventsRepo.create({
      name: "Game", hostId: host.id, startsAt: "2026-07-01T18:00:00+00:00",
      description: "", category: "Game night",
      location: { label: "X", lat: null, lng: null }, attendeeUserIds: [att.id],
    });
    eventsRepo.create({
      name: "Holiday", hostId: host.id, startsAt: "2026-07-02T18:00:00+00:00",
      description: "", category: "Holiday",
      location: { label: "Y", lat: null, lng: null }, attendeeUserIds: [],
    });
    expect(eventsRepo.list({ category: "Game night" })).toHaveLength(1);
    expect(eventsRepo.list({ attendeeId: att.id })).toHaveLength(1);
    expect(eventsRepo.list()).toHaveLength(2);
  });

  it("detects duplicates by host+name+time+location", () => {
    const host = mkUser("Host");
    eventsRepo.create({
      name: "Dup", hostId: host.id, startsAt: "2026-07-01T18:00:00+00:00",
      description: "", category: "Other",
      location: { label: "HQ", lat: null, lng: null }, attendeeUserIds: [],
    });
    expect(
      eventsRepo.findDuplicate(host.id, "Dup", "2026-07-01T18:00:00+00:00", "HQ"),
    ).not.toBeNull();
    expect(
      eventsRepo.findDuplicate(host.id, "Dup", "2026-07-01T18:00:00+00:00", "Other"),
    ).toBeNull();
  });

  it("cascades attendees/ratings on event delete", () => {
    const host = mkUser("Host");
    const att = mkUser("Att");
    const ev = eventsRepo.create({
      name: "E", hostId: host.id, startsAt: "2026-07-01T18:00:00+00:00",
      description: "", category: "Other",
      location: { label: "HQ", lat: null, lng: null }, attendeeUserIds: [att.id],
    });
    eventRatingsRepo.set(ev.id, att.id, 5);
    eventsRepo.remove(ev.id);
    expect(eventsRepo.findDetailById(ev.id)).toBeNull();
    expect(eventRatingsRepo.get(ev.id, att.id).aggregate.count).toBe(0);
  });

  it("RSVP updates attendee status", () => {
    const host = mkUser("Host");
    const att = mkUser("Att");
    const ev = eventsRepo.create({
      name: "E", hostId: host.id, startsAt: "2026-07-01T18:00:00+00:00",
      description: "", category: "Other",
      location: { label: "HQ", lat: null, lng: null }, attendeeUserIds: [att.id],
    });
    expect(eventsRepo.setRsvp(ev.id, att.id, "accepted")).toBe(true);
    expect(eventsRepo.attendees(ev.id)[0]?.status).toBe("accepted");
    expect(eventsRepo.setRsvp(ev.id, host.id, "accepted")).toBe(false);
  });
});

describe("ratings aggregation", () => {
  it("averages event ratings and tracks my rating; upsert replaces", () => {
    const host = mkUser("Host");
    const r1 = mkUser("R1");
    const r2 = mkUser("R2");
    const ev = eventsRepo.create({
      name: "E", hostId: host.id, startsAt: "2026-07-01T18:00:00+00:00",
      description: "", category: "Other",
      location: { label: "HQ", lat: null, lng: null }, attendeeUserIds: [],
    });
    eventRatingsRepo.set(ev.id, r1.id, 4);
    const res = eventRatingsRepo.set(ev.id, r2.id, 2);
    expect(res.aggregate.average).toBe(3);
    expect(res.aggregate.count).toBe(2);
    expect(res.myRating).toBe(2);
    // upsert: r2 changes to 5 -> avg (4+5)/2 = 4.5
    const res2 = eventRatingsRepo.set(ev.id, r2.id, 5);
    expect(res2.aggregate.average).toBe(4.5);
    expect(res2.aggregate.count).toBe(2);
    // remove
    const res3 = eventRatingsRepo.remove(ev.id, r2.id);
    expect(res3.aggregate.count).toBe(1);
    expect(res3.myRating).toBeNull();
  });

  it("host ratings aggregate independently", () => {
    const host = mkUser("Host");
    const rater = mkUser("Rater");
    hostRatingsRepo.set(host.id, rater.id, 5);
    expect(hostRatingsRepo.get(host.id, rater.id).aggregate.average).toBe(5);
  });
});

describe("notifications repo", () => {
  it("creates many, lists, marks read, deletes", () => {
    const u = mkUser("U");
    notificationsRepo.createMany([u.id], "hello");
    const list = notificationsRepo.listForUser(u.id);
    expect(list).toHaveLength(1);
    expect(list[0]?.read).toBe(false);
    notificationsRepo.setRead(list[0]!.id, true);
    expect(notificationsRepo.findById(list[0]!.id)?.read).toBe(true);
    expect(notificationsRepo.remove(list[0]!.id)).toBe(true);
    expect(notificationsRepo.listForUser(u.id)).toHaveLength(0);
  });
});
