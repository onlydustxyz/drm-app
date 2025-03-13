import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Ensure database URL is available
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined in .env.local");
}

// Create a postgres.js client
const client = postgres(process.env.DATABASE_URL);

// Create and export the drizzle client
export const db = drizzle(client);
