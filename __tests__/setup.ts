import {dbFactory} from "@/lib/drizzle";
import {PostgreSqlContainer, StartedPostgreSqlContainer} from "@testcontainers/postgresql";
import path from "path";
import {createServer} from "http";
import {NextRequest, NextResponse} from "next/server";
import { migrate } from "drizzle-orm/postgres-js/migrator";
// Increase timeout for tests since we're working with containers
jest.setTimeout(30000);

// Create a test server that works with App Router handlers
export const createTestServer = (handler: (req: NextRequest) => Promise<NextResponse>) => {
	const server = createServer(async (req, res) => {
		// Collect the request body data
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			// Create a NextRequest with the body
			const nextReq = new NextRequest(
				new Request(`http://localhost:3000${req.url}`, {
					method: req.method,
					headers: req.headers as HeadersInit,
					body: body.length > 0 ? body : undefined,
				})
			);

			try {
				// Call the handler with our NextRequest
				const response = await handler(nextReq);

				// Set status code
				res.statusCode = response.status;

				// Set headers
				response.headers.forEach((value, key) => {
					res.setHeader(key, value);
				});

				// Send response body
				const responseBody = await response.json();
				res.end(JSON.stringify(responseBody));
			} catch (error) {
				console.error("Error in test server:", error);
				res.statusCode = 500;
				res.end(JSON.stringify({ error: "Internal server error in test" }));
			}
		});
	});
	return server;
};

let container: PostgreSqlContainer;
let startedContainer: StartedPostgreSqlContainer;

beforeAll(async () => {
	// Start PostgreSQL container
	container = new PostgreSqlContainer("postgres:16.4")
		.withDatabase("test_db")
		.withUsername("test_user")
		.withPassword("test_password")
		.withCopyDirectoriesToContainer([
			{
				source: path.join(__dirname, "..", "postgres", "indexer"),
				target: "/docker-entrypoint-initdb.d"
			}
		])
		.withLogConsumer(consumer => {
			consumer.on("data", (line) => {
				console.log(line);
			});
		});

	startedContainer = await container.start();
	// Set timeout for container startup
	jest.setTimeout(5000);

	// Set up database client with container URL
	const databaseUrl = startedContainer.getConnectionUri();
	dbFactory.setClient(databaseUrl);

	// Run migrations using the same logic as in migrate.ts
	console.log("Running migrations for test database...");
	try {
		const db = dbFactory.getClient();
		await migrate(db, { migrationsFolder: process.cwd() + "/postgres/migrations" });
		console.log("Migrations completed successfully for test database");
	} catch (error) {
		console.error("Error during test database migration:", error);
		throw error; // This will fail the test setup
	}
	
});

afterAll(async () => {
	// Stop container after all tests
	await startedContainer.stop();
});
