import { desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

// Example query to get all repositories
export async function getAllRepositories() {
	return await db.select().from(schema.repositories);
}

// Example query to get repository by id
export async function getRepositoryById(id: number) {
	return await db.select().from(schema.repositories).where(eq(schema.repositories.id, id)).limit(1);
}

// Example query to get repositories by owner
export async function getRepositoriesByOwner(owner: string) {
	return await db.select().from(schema.repositories).where(eq(schema.repositories.owner, owner));
}

// Example query to get most starred repositories
export async function getMostStarredRepositories(limit: number = 10) {
	return await db.select().from(schema.repositories).orderBy(desc(schema.repositories.stars)).limit(limit);
}

// Example query to get repositories count by language
export async function getRepositoriesCountByLanguage() {
	return await db
		.select({
			language: schema.repositories.language,
			count: sql<number>`count(*)`,
		})
		.from(schema.repositories)
		.groupBy(schema.repositories.language)
		.orderBy(desc(sql<number>`count(*)`));
}

// Example query to get the latest dashboard KPIs
export async function getLatestDashboardKPIs() {
	return await db.select().from(schema.dashboardKpis).orderBy(desc(schema.dashboardKpis.created_at)).limit(1);
}

// Example query to get developer activity
export async function getDeveloperActivity() {
	return await db.select().from(schema.developerActivity);
}

// Example query to get developer locations
export async function getDeveloperLocations() {
	return await db.select().from(schema.developerLocations);
}
