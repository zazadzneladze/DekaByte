import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { readMigrationFiles } from "drizzle-orm/migrator";

config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

const migrations = readMigrationFiles({
  migrationsFolder: "./src/db/migrations",
});

console.log(
  "files",
  migrations.map((m) => ({ hash: m.hash, folder: m.folderMillis })),
);

const existing = await sql`select hash from drizzle.__drizzle_migrations`;
const have = new Set(existing.map((r) => r.hash));

for (const m of migrations) {
  if (have.has(m.hash)) {
    console.log("skip", m.hash);
    continue;
  }
  await sql`
    insert into drizzle.__drizzle_migrations (hash, created_at)
    values (${m.hash}, ${m.folderMillis ?? Date.now()})
  `;
  console.log("inserted", m.hash);
}

console.log("done");
