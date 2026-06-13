-- Schema for travel_cost_logs (migrated from Supabase/Postgres to Cloudflare D1/SQLite)
CREATE TABLE IF NOT EXISTS travel_cost_logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  postal_code     TEXT,
  city            TEXT,
  full_address    TEXT,
  latitude        REAL,
  longitude       REAL,
  display_name    TEXT,
  distance_meters REAL,
  distance_km     REAL,
  cost            REAL,
  client_country  TEXT,
  status          TEXT NOT NULL,
  error_message   TEXT,
  created_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_travel_cost_logs_created_at ON travel_cost_logs (created_at);
