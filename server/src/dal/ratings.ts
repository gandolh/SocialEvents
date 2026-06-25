import type { RatingResponse } from "@socialevents/shared";
import { getDb } from "../db/connection.js";
import { now } from "../db/util.js";

interface RatingTable {
  table: "event_ratings" | "host_ratings";
  subjectCol: "event_id" | "host_id";
}

function build(t: RatingTable) {
  return {
    get(subjectId: string, userId: string): RatingResponse {
      const db = getDb();
      const agg = db
        .prepare(
          `SELECT AVG(rating) AS avg, COUNT(*) AS count FROM ${t.table} WHERE ${t.subjectCol} = ?`,
        )
        .get(subjectId) as { avg: number | null; count: number };
      const mine = db
        .prepare(
          `SELECT rating FROM ${t.table} WHERE ${t.subjectCol} = ? AND user_id = ?`,
        )
        .get(subjectId, userId) as { rating: number } | undefined;
      return {
        aggregate: { average: agg.avg ?? 0, count: agg.count },
        myRating: mine?.rating ?? null,
      };
    },

    set(subjectId: string, userId: string, rating: number): RatingResponse {
      getDb()
        .prepare(
          `INSERT INTO ${t.table} (${t.subjectCol}, user_id, rating, updated_at)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(${t.subjectCol}, user_id)
           DO UPDATE SET rating = excluded.rating, updated_at = excluded.updated_at`,
        )
        .run(subjectId, userId, rating, now());
      return this.get(subjectId, userId);
    },

    remove(subjectId: string, userId: string): RatingResponse {
      getDb()
        .prepare(
          `DELETE FROM ${t.table} WHERE ${t.subjectCol} = ? AND user_id = ?`,
        )
        .run(subjectId, userId);
      return this.get(subjectId, userId);
    },
  };
}

export const eventRatingsRepo = build({
  table: "event_ratings",
  subjectCol: "event_id",
});

export const hostRatingsRepo = build({
  table: "host_ratings",
  subjectCol: "host_id",
});
