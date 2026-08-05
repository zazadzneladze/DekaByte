import { config } from "dotenv";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { getDb } from "./index";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const db = getDb();
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migrations applied.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
