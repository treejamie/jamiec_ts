import { Glob } from "bun";
import sql from "./index";

// Ensures the schema_migrations tracking table exists.
async function ensureMigrationsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

// Returns set of already-applied migration filenames.
async function getAppliedMigrations(): Promise<Set<string>> {
  const rows = await sql`SELECT version FROM schema_migrations`;
  return new Set(rows.map((r) => r.version as string));
}

// Reads migration files from src/db/migrations/ in sorted order,
// applies any that haven't been run yet inside transactions,
// and records them in schema_migrations.
async function migrate() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  // Collect and sort migration files
  const glob = new Glob("*.sql");
  const migrationsDir = import.meta.dir + "/migrations";
  const files: string[] = [];
  for await (const file of glob.scan(migrationsDir)) {
    files.push(file);
  }
  files.sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const path = `${migrationsDir}/${file}`;
    const content = await Bun.file(path).text();

    // Run each migration in a transaction
    await sql.begin(async (tx) => {
      // Use unsafe() since migrations contain DDL statements
      await tx.unsafe(content);
      await tx`INSERT INTO schema_migrations (version) VALUES (${file})`;
    });

    console.log(`Applied: ${file}`);
    count++;
  }

  if (count === 0) {
    console.log("No new migrations to apply.");
  } else {
    console.log(`Done. Applied ${count} migration(s).`);
  }

  // Close the connection pool
  await sql.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
