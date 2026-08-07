import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);

const tables = await sql`
  select table_schema, table_name
  from information_schema.tables
  where table_name like '%drizzle%' or table_name like '%migration%'
`;
console.log("tables", tables);

const cols = await sql`
  select column_name from information_schema.columns
  where table_name = 'client_projects'
  order by ordinal_position
`;
console.log(
  "client_projects",
  cols.map((c) => c.column_name),
);

const inv = await sql`
  select column_name from information_schema.columns
  where table_name = 'client_invoices'
  order by ordinal_position
`;
console.log(
  "client_invoices",
  inv.map((c) => c.column_name),
);

const users = await sql`
  select column_name from information_schema.columns
  where table_name = 'client_users'
  order by ordinal_position
`;
console.log(
  "client_users",
  users.map((c) => c.column_name),
);
