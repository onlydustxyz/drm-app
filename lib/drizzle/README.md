# Drizzle ORM Setup

This directory contains the Drizzle ORM setup for the DRM-App project. Drizzle is a TypeScript ORM for SQL databases with a focus on type safety and developer experience.

## Structure

-   `index.ts`: Contains the database connection setup
-   `schema/`: Contains the database schema definitions
    -   `repositories.ts`: Schema for the repositories table
    -   `dashboard.ts`: Schemas for dashboard-related tables
    -   `index.ts`: Exports all schemas
-   `queries.ts`: Example query functions

## Usage

### Basic Query Examples

```typescript
// Import the db client and schemas
import { db } from "lib/drizzle";
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
import { db } from "lib/drizzle";
import { repositories } from "lib/drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

// Example: Search repositories by name
async function searchRepositories(searchTerm: string) {
	return await db
		.select()
		.from(repositories)
		.where(like(repositories.name, `%${searchTerm}%`))
		.orderBy(desc(repositories.stars))
		.limit(20);
}
```

## Migration Commands

The following npm scripts are available for database migrations:

-   `npm run db:generate`: Generate migration files based on schema changes
-   `npm run db:migrate`: Apply migrations to the database
-   `npm run db:studio`: Open Drizzle Studio to view and manage database data

## Environment Setup

Ensure the following environment variables are set in your `.env.local` file:

```
DATABASE_URL=postgresql://username:password@host:port/database
```