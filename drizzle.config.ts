import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Ensure database URL is available
if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined in .env.local");
}

export default defineConfig({
	schema: "./lib/drizzle/schema/*",
	out: "./lib/drizzle/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
		ssl: false,
	},
});
