import { db } from "@/lib/drizzle";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { sql } from "drizzle-orm";
import path from "path";

// Increase timeout for tests since we're working with containers
jest.setTimeout(30000);

let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
	// Start PostgreSQL container
	container = new PostgreSqlContainer()
		.withDatabase("test_db")
		.withUsername("test_user")
		.withPassword("test_password")
		.withCopyFilesToContainer([
			{
				source: path.resolve(process.cwd(), "supabase/migrations"),
				target: "/docker-entrypoint-initdb.d/",
			},
		]);

	startedContainer = await container.start();

	// Set environment variables for database connection
	process.env.DATABASE_URL = startedContainer.getConnectionUri();

	// Wait for and verify database connection
	try {
		// Perform a query to ensure the database is ready and migrations have applied
		const result = await db.execute(sql`SELECT to_regclass('contributor_sublists')`);
		console.log("Database initialized and ready for testing");

		// If we need to add any additional setup for tests
		// such as clearing tables, it can be done here
		await db.execute(sql`TRUNCATE contributor_sublists CASCADE`);
	} catch (error) {
		console.error("Error verifying database connection:", error);
		throw error;
	}
});

afterAll(async () => {
	// Stop container after all tests
	await startedContainer.stop();
});
