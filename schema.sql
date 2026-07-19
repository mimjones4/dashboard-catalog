-- D1 schema for MockMentor (Phase 1).
-- Tracks only what the paywall needs per anonymous user UUID.
-- Phase 2 will add a `sessions` table for cross-session pattern tracking.

CREATE TABLE IF NOT EXISTS users (
  uuid              TEXT PRIMARY KEY,
  sessions_started  INTEGER NOT NULL DEFAULT 0,
  unlocked          INTEGER NOT NULL DEFAULT 0,   -- 0 = free tier, 1 = one-time unlock paid
  unlocked_at       TEXT,
  stripe_session_id TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
