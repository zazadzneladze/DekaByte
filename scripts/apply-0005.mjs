import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL missing");
const sql = neon(url);

const rows = await sql`select * from drizzle.__drizzle_migrations order by created_at`;
console.log("migrations count", rows.length);
console.log(rows.slice(-3));

const patch = fs.readFileSync("src/db/migrations/0005_sloppy_korath.sql", "utf8");
const statements = patch
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  console.log("run:", statement.slice(0, 90).replace(/\s+/g, " "));
  await sql.query(statement, []);
}

console.log("done");
