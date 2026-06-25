-- 0001 init: full schema (see corpus/wiki/data-model.md)

CREATE TABLE departments (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  created_at  TEXT NOT NULL
);

CREATE TABLE users (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  department_id  TEXT REFERENCES departments(id) ON DELETE SET NULL,
  job_title      TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE events (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  host_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  starts_at       TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'Other',
  location_label  TEXT NOT NULL,
  location_lat    REAL,
  location_lng    REAL,
  created_at      TEXT NOT NULL
);

CREATE TABLE event_attendees (
  event_id  TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status    TEXT NOT NULL DEFAULT 'invited'
              CHECK (status IN ('invited','accepted','declined')),
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE event_ratings (
  event_id    TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE host_ratings (
  host_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (host_id, user_id)
);

CREATE TABLE notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  read        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL
);

CREATE INDEX idx_events_starts_at      ON events(starts_at);
CREATE INDEX idx_events_host_id        ON events(host_id);
CREATE INDEX idx_attendees_user_id     ON event_attendees(user_id);
CREATE INDEX idx_event_ratings_event   ON event_ratings(event_id);
CREATE INDEX idx_host_ratings_host     ON host_ratings(host_id);
CREATE INDEX idx_notifications_user    ON notifications(user_id);
