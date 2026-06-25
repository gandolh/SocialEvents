import type {
  EventSummary,
  EventDetail,
  Attendee,
  EventCategory,
  EventLocation,
  AttendeeStatus,
} from "@socialevents/shared";
import { getDb } from "../db/connection.js";
import { newId, now } from "../db/util.js";

interface EventRow {
  id: string;
  name: string;
  host_id: string;
  host_name: string;
  starts_at: string;
  description: string;
  category: string;
  location_label: string;
  location_lat: number | null;
  location_lng: number | null;
  attendee_count: number;
  created_at: string;
}

const SELECT_SUMMARY = `
  SELECT e.id, e.name, e.host_id, u.name AS host_name, e.starts_at,
         e.description, e.category, e.location_label, e.location_lat,
         e.location_lng, e.created_at,
         (SELECT COUNT(*) FROM event_attendees a WHERE a.event_id = e.id) AS attendee_count
  FROM events e
  JOIN users u ON u.id = e.host_id
`;

function toSummary(row: EventRow): EventSummary {
  return {
    id: row.id,
    name: row.name,
    hostId: row.host_id,
    hostName: row.host_name,
    startsAt: row.starts_at,
    category: row.category as EventCategory,
    description: row.description,
    location: {
      label: row.location_label,
      lat: row.location_lat,
      lng: row.location_lng,
    },
    attendeeCount: row.attendee_count,
    createdAt: row.created_at,
  };
}

export interface EventFilters {
  from?: string;
  to?: string;
  category?: string;
  hostId?: string;
  attendeeId?: string;
  search?: string;
}

export interface CreateEventParams {
  name: string;
  hostId: string;
  startsAt: string;
  description: string;
  category: EventCategory;
  location: EventLocation;
  attendeeUserIds: string[];
}

export const eventsRepo = {
  list(filters: EventFilters = {}): EventSummary[] {
    const where: string[] = [];
    const params: unknown[] = [];

    if (filters.from) {
      where.push("e.starts_at >= ?");
      params.push(filters.from);
    }
    if (filters.to) {
      where.push("e.starts_at <= ?");
      params.push(filters.to);
    }
    if (filters.category) {
      where.push("e.category = ?");
      params.push(filters.category);
    }
    if (filters.hostId) {
      where.push("e.host_id = ?");
      params.push(filters.hostId);
    }
    if (filters.attendeeId) {
      where.push(
        "EXISTS (SELECT 1 FROM event_attendees a WHERE a.event_id = e.id AND a.user_id = ?)",
      );
      params.push(filters.attendeeId);
    }
    if (filters.search) {
      where.push("(e.name LIKE ? OR e.location_label LIKE ?)");
      const like = `%${filters.search}%`;
      params.push(like, like);
    }

    const sql =
      SELECT_SUMMARY +
      (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
      " ORDER BY e.starts_at ASC";
    const rows = getDb().prepare(sql).all(...params) as EventRow[];
    return rows.map(toSummary);
  },

  findSummaryById(id: string): EventSummary | null {
    const row = getDb()
      .prepare(`${SELECT_SUMMARY} WHERE e.id = ?`)
      .get(id) as EventRow | undefined;
    return row ? toSummary(row) : null;
  },

  findDetailById(id: string): EventDetail | null {
    const summary = this.findSummaryById(id);
    if (!summary) return null;
    const attendees = this.attendees(id);
    const agg = getDb()
      .prepare(
        "SELECT AVG(rating) AS avg, COUNT(*) AS count FROM event_ratings WHERE event_id = ?",
      )
      .get(id) as { avg: number | null; count: number };
    return {
      ...summary,
      attendees,
      rating: { average: agg.avg ?? 0, count: agg.count },
    };
  },

  attendees(eventId: string): Attendee[] {
    const rows = getDb()
      .prepare(
        `SELECT a.user_id, a.status, u.name, u.email
         FROM event_attendees a JOIN users u ON u.id = a.user_id
         WHERE a.event_id = ? ORDER BY u.name`,
      )
      .all(eventId) as {
      user_id: string;
      status: string;
      name: string;
      email: string;
    }[];
    return rows.map((r) => ({
      userId: r.user_id,
      name: r.name,
      email: r.email,
      status: r.status as AttendeeStatus,
    }));
  },

  /** Duplicate guard: same host + name + time + location label. */
  findDuplicate(
    hostId: string,
    name: string,
    startsAt: string,
    locationLabel: string,
  ): string | null {
    const row = getDb()
      .prepare(
        `SELECT id FROM events
         WHERE host_id = ? AND name = ? AND starts_at = ? AND location_label = ?`,
      )
      .get(hostId, name, startsAt, locationLabel) as { id: string } | undefined;
    return row?.id ?? null;
  },

  create(params: CreateEventParams): EventDetail {
    const db = getDb();
    const id = newId();
    const createdAt = now();
    const tx = db.transaction(() => {
      db.prepare(
        `INSERT INTO events
           (id, name, host_id, starts_at, description, category,
            location_label, location_lat, location_lng, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        params.name,
        params.hostId,
        params.startsAt,
        params.description,
        params.category,
        params.location.label,
        params.location.lat,
        params.location.lng,
        createdAt,
      );
      this.setAttendees(id, params.attendeeUserIds);
    });
    tx();
    const detail = this.findDetailById(id);
    if (!detail) throw new Error("event vanished after insert");
    return detail;
  },

  /** Replace the attendee set, preserving existing RSVP statuses. */
  setAttendees(eventId: string, userIds: string[]): void {
    const db = getDb();
    const unique = [...new Set(userIds)];
    const tx = db.transaction(() => {
      db.prepare("DELETE FROM event_attendees WHERE event_id = ?").run(eventId);
      const insert = db.prepare(
        "INSERT INTO event_attendees (event_id, user_id, status) VALUES (?, ?, 'invited')",
      );
      for (const uid of unique) insert.run(eventId, uid);
    });
    tx();
  },

  update(
    id: string,
    fields: Partial<{
      name: string;
      startsAt: string;
      description: string;
      category: EventCategory;
      location: EventLocation;
    }>,
  ): EventDetail | null {
    const existing = this.findSummaryById(id);
    if (!existing) return null;
    const merged = {
      name: fields.name ?? existing.name,
      starts_at: fields.startsAt ?? existing.startsAt,
      description: fields.description ?? existing.description,
      category: fields.category ?? existing.category,
      location_label: fields.location?.label ?? existing.location.label,
      location_lat:
        fields.location !== undefined ? fields.location.lat : existing.location.lat,
      location_lng:
        fields.location !== undefined ? fields.location.lng : existing.location.lng,
    };
    getDb()
      .prepare(
        `UPDATE events SET name = ?, starts_at = ?, description = ?, category = ?,
           location_label = ?, location_lat = ?, location_lng = ? WHERE id = ?`,
      )
      .run(
        merged.name,
        merged.starts_at,
        merged.description,
        merged.category,
        merged.location_label,
        merged.location_lat,
        merged.location_lng,
        id,
      );
    return this.findDetailById(id);
  },

  remove(id: string): boolean {
    const res = getDb().prepare("DELETE FROM events WHERE id = ?").run(id);
    return res.changes > 0;
  },

  setRsvp(eventId: string, userId: string, status: AttendeeStatus): boolean {
    const res = getDb()
      .prepare(
        "UPDATE event_attendees SET status = ? WHERE event_id = ? AND user_id = ?",
      )
      .run(status, eventId, userId);
    return res.changes > 0;
  },
};
