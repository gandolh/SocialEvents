import { beforeEach, describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createEventsStore, type EventsStore } from "../events/index.js";
import { createUsersStore, type UsersStore } from "../users/index.js";
import { createRatingsStore } from "./index.js";

let users: UsersStore;
let events: EventsStore;
let ratings: ReturnType<typeof createRatingsStore>;

beforeEach(() => {
  const db = freshDb();
  users = createUsersStore(db);
  events = createEventsStore(db);
  ratings = createRatingsStore(db);
});

function mkUser(name: string, deptId: string | null = null) {
  return users.create({
    name,
    email: `${name.toLowerCase()}@x.com`,
    passwordHash: "hash",
    departmentId: deptId,
  });
}

describe("ratings aggregation", () => {
  it("averages event ratings and tracks my rating; upsert replaces", () => {
    const host = mkUser("Host");
    const r1 = mkUser("R1");
    const r2 = mkUser("R2");
    const ev = events.create({
      name: "E",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Other",
      location: { label: "HQ", lat: null, lng: null },
      attendeeUserIds: [],
    });
    ratings.event.set(ev.id, r1.id, 4);
    const res = ratings.event.set(ev.id, r2.id, 2);
    expect(res.aggregate.average).toBe(3);
    expect(res.aggregate.count).toBe(2);
    expect(res.myRating).toBe(2);
    // upsert: r2 changes to 5 -> avg (4+5)/2 = 4.5
    const res2 = ratings.event.set(ev.id, r2.id, 5);
    expect(res2.aggregate.average).toBe(4.5);
    expect(res2.aggregate.count).toBe(2);
    // remove
    const res3 = ratings.event.remove(ev.id, r2.id);
    expect(res3.aggregate.count).toBe(1);
    expect(res3.myRating).toBeNull();
  });

  it("host ratings aggregate independently", () => {
    const host = mkUser("Host");
    const rater = mkUser("Rater");
    ratings.host.set(host.id, rater.id, 5);
    expect(ratings.host.get(host.id, rater.id).aggregate.average).toBe(5);
  });
});
