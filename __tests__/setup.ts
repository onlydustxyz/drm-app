// import { db } from "@/lib/drizzle";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
// import { sql } from "drizzle-orm";
import path from "path";

// Increase timeout for tests since we're working with containers
jest.setTimeout(30000);

let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
	// Start PostgreSQL container
	let source = path.resolve(process.cwd(), "supabase/migrations");
	container = new PostgreSqlContainer("postgres:16.4")
		.withDatabase("test_db")
		.withUsername("test_user")
		.withPassword("test_password")
		.withCopyDirectoriesToContainer([
			{
				source: source,
				target: "/docker-entrypoint-initdb.d",
			},
		]);

	startedContainer = await container.start();

	// Set container startup timeout to 1 minute
	container.withStartupTimeout(60000);

	// Set environment variables for database connection
	process.env.DATABASE_URL = startedContainer.getConnectionUri();
});

afterAll(async () => {
	// Stop container after all tests
	await startedContainer.stop();
});
