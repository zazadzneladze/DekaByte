import { hash } from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const password = process.env.ADMIN_INITIAL_PASSWORD;
if (!password) {
  console.error("ADMIN_INITIAL_PASSWORD missing");
  process.exit(1);
}

const hashed = await hash(password, 12);
console.log(hashed);
