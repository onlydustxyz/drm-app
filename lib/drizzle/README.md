# Drizzle ORM Setup

This directory contains the Drizzle ORM setup for the DRM-App project. Drizzle is a TypeScript ORM for SQL databases with a focus on type safety and developer experience.

## Structure

-   `index.ts`: Contains the database connection setup
-   `schema/`: Contains the database schema definitions
    -   `repositories.ts`: Schema for the repositories table
    -   `dashboard.ts`: Schemas for dashboard-related tables
    -   `segments.ts`: Schema for segments-related tables
    -   `contributor-sublists.ts`: Schema for contributor sublist tables
    -   `index.ts`: Exports all schemas
-   `migrations/`: Contains generated SQL migration files
-   `migrate.ts`: Script to run migrations programmatically

## Usage

### Basic Query Examples

```typescript
// Import the dbFactory client and schemas
import { dbFactory } from "lib/drizzle";
import * as schema from "lib/drizzle/schema";

// Or import specific queries
import { getAllRepositories, getRepositoryById } from "lib/drizzle/queries";

// Usage in an API route
export async function GET() {
	try {
		const repositories = await getAllRepositories();
		return Response.json({ repositories });
	} catch (error) {
		console.error("Error fetching repositories:", error);
		return Response.json({ error: "Failed to fetch repositories" }, { status: 500 });
	}
}
```

### Building Custom Queries

```typescript
import { dbFactory } from "lib/drizzle";
import { repositories } from "lib/drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

// Example: Search repositories by name
async function searchRepositories(searchTerm: string) {
	return await dbFactory.getClient()
		.select()
		.from(repositories)
		.where(like(repositories.name, `%${searchTerm}%`))
		.orderBy(desc(repositories.stars))
		.limit(20);
}
```

## Migration System

Drizzle uses a file-based migration system for database schema changes:

1. **Generating Migrations**: When your schema changes, generate migration files:
   ```bash
   npm run db:generate
   ```
   This will create SQL migration files in the `migrations` directory.

2. **Applying Migrations**: To apply migrations to your database:
   ```bash
   npm run db:migrate
   ```
   This runs the `migrate.ts` script which applies all pending migrations.

3. **Direct Schema Push** (for development):
   ```bash
   npm run db:push
   ```
   This pushes schema changes directly to the database without creating migration files.

4. **Drizzle Studio**: For a visual interface to manage your database:
   ```bash
   npm run db:studio
   ```

## Environment Setup

Ensure the following environment variables are set in your `.env.local` file:

```
DATABASE_URL=postgresql://username:password@host:port/database
```