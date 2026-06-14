import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER;
const password = process.env.SQL_ADMIN_PASSWORD;

if (!sqlHost || !sqlDbName || !user || !password) {
  // During build time or if env vars are missing, we might not have these.
  // We'll throw only if we are actually trying to run drizzle-kit from within the app context.
  // For standard compilation, we just provide defaults or skip.
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: sqlHost || "localhost",
    user: user || "postgres",
    password: password || "",
    database: sqlDbName || "postgres",
    ssl: false,
  },
  verbose: true,
  strict: true,
});
