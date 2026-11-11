import { beforeEach, describe, expect, it } from "vitest";
import { freshDb } from "../../testing/helpers.js";
import { createRatingsStore } from "../ratings/index.js";
import { createUsersStore, type UsersStore } from "../users/index.js";
import { createEventsStore, type EventsStore } from "./index.js";

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

describe("events repo", () => {
  it("creates with attendees and computes count", () => {
    const host = mkUser("Host");
    const a1 = mkUser("A1");
    const a2 = mkUser("A2");
    const ev = events.create({
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
    events.create({
      name: "Game",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Game night",
      location: { label: "X", lat: null, lng: null },
      attendeeUserIds: [att.id],
    });
    events.create({
      name: "Holiday",
      hostId: host.id,
      startsAt: "2026-07-02T18:00:00+00:00",
      description: "",
      category: "Holiday",
      location: { label: "Y", lat: null, lng: null },
      attendeeUserIds: [],
    });
    expect(events.list({ category: "Game night" })).toHaveLength(1);
    expect(events.list({ attendeeId: att.id })).toHaveLength(1);
    expect(events.list()).toHaveLength(2);
  });

  it("detects duplicates by host+name+time+location", () => {
    const host = mkUser("Host");
    events.create({
      name: "Dup",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Other",
      location: { label: "HQ", lat: null, lng: null },
      attendeeUserIds: [],
    });
    expect(events.findDuplicate(host.id, "Dup", "2026-07-01T18:00:00+00:00", "HQ")).not.toBeNull();
    expect(events.findDuplicate(host.id, "Dup", "2026-07-01T18:00:00+00:00", "Other")).toBeNull();
  });

  it("cascades attendees/ratings on event delete", () => {
    const host = mkUser("Host");
    const att = mkUser("Att");
    const ev = events.create({
      name: "E",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Other",
      location: { label: "HQ", lat: null, lng: null },
      attendeeUserIds: [att.id],
    });
    ratings.event.set(ev.id, att.id, 5);
    events.remove(ev.id);
    expect(events.findDetailById(ev.id)).toBeNull();
    expect(ratings.event.get(ev.id, att.id).aggregate.count).toBe(0);
  });

  it("RSVP updates attendee status", () => {
    const host = mkUser("Host");
    const att = mkUser("Att");
    const ev = events.create({
      name: "E",
      hostId: host.id,
      startsAt: "2026-07-01T18:00:00+00:00",
      description: "",
      category: "Other",
      location: { label: "HQ", lat: null, lng: null },
      attendeeUserIds: [att.id],
    });
    expect(events.setRsvp(ev.id, att.id, "accepted")).toBe(true);
    expect(events.attendees(ev.id)[0]?.status).toBe("accepted");
    expect(events.setRsvp(ev.id, host.id, "accepted")).toBe(false);
  });
});
