import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

// Connection construction using object to avoid URL parsing issues
const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_USER;
const password = process.env.SQL_PASSWORD;

if (!sqlHost || !sqlDbName || !user || !password) {
  console.warn("Database environment variables are missing. Database connection might fail.");
}

const client = postgres({ 
  host: sqlHost,
  port: 5432,
  database: sqlDbName,
  username: user,
  password: password,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Export everything from schema
export * from './schema.ts';

// Migrate helper (placeholder for CI/manual triggers)
export async function migrate() {
  console.log("Migration helper called. In this environment, use 'cloudsql-update-schema' tool for schema changes.");
}
