import type { Notification } from "@socialevents/shared";
import { getDb } from "../db/connection.js";
import { newId, now } from "../db/util.js";

interface NotificationRow {
  id: string;
  user_id: string;
  message: string;
  read: number;
  created_at: string;
}

function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    message: row.message,
    read: row.read === 1,
    createdAt: row.created_at,
  };
}

export const notificationsRepo = {
  create(userId: string, message: string): Notification {
    const row: NotificationRow = {
      id: newId(),
      user_id: userId,
      message,
      read: 0,
      created_at: now(),
    };
    getDb()
      .prepare(
        `INSERT INTO notifications (id, user_id, message, read, created_at)
         VALUES (@id, @user_id, @message, @read, @created_at)`,
      )
      .run(row);
    return toNotification(row);
  },

  createMany(userIds: string[], message: string): void {
    const db = getDb();
    const insert = db.prepare(
      `INSERT INTO notifications (id, user_id, message, read, created_at)
       VALUES (?, ?, ?, 0, ?)`,
    );
    const ts = now();
    const tx = db.transaction(() => {
      for (const uid of userIds) insert.run(newId(), uid, message, ts);
    });
    tx();
  },

  listForUser(userId: string): Notification[] {
    const rows = getDb()
      .prepare(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(userId) as NotificationRow[];
    return rows.map(toNotification);
  },

  findById(id: string): Notification | null {
    const row = getDb()
      .prepare("SELECT * FROM notifications WHERE id = ?")
      .get(id) as NotificationRow | undefined;
    return row ? toNotification(row) : null;
  },

  setRead(id: string, read: boolean): void {
    getDb()
      .prepare("UPDATE notifications SET read = ? WHERE id = ?")
      .run(read ? 1 : 0, id);
  },

  remove(id: string): boolean {
    const res = getDb()
      .prepare("DELETE FROM notifications WHERE id = ?")
      .run(id);
    return res.changes > 0;
  },
};
