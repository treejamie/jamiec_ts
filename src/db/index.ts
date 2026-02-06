import { SQL } from "bun";

// Thin wrapper around Bun.sql for Postgres.
// Reads DATABASE_URL from env (Bun loads .env automatically).
// Falls back to local dev defaults if not set.
const sql = new SQL(
  process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/jamiec_ts_dev",
);

export default sql;
