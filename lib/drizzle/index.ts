import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

class DatabaseClientFactory {
	private static instance: DatabaseClientFactory;
	private client: PostgresJsDatabase | null = null;

	private constructor() {
		// Private constructor to enforce singleton pattern
	}

	public static getInstance(): DatabaseClientFactory {
		if (!DatabaseClientFactory.instance) {
			DatabaseClientFactory.instance = new DatabaseClientFactory();
		}
		return DatabaseClientFactory.instance;
	}

	public getClient(): PostgresJsDatabase {
		if (!this.client) {
			// Ensure database URL is available
			if (!process.env.DATABASE_URL) {
				throw new Error("DATABASE_URL is not defined in .env.local");
			}

			// Create a postgres.js client
			const postgresClient = postgres(process.env.DATABASE_URL);
			
			// Create a drizzle client
			this.client = drizzle(postgresClient);
		}
		
		return this.client;
	}

	public setClient(databaseUrl: string): PostgresJsDatabase {
		// Create a postgres.js client with the provided URL
		const postgresClient = postgres(databaseUrl);
		
		// Create and set the drizzle client
		this.client = drizzle(postgresClient);
		
		return this.client;
	}
}

// Export the factory instance
export const dbFactory = DatabaseClientFactory.getInstance();
