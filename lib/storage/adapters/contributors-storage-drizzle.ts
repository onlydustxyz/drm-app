import { dbFactory } from "@/lib/drizzle";
import { contributors } from "@/lib/drizzle/schema/contributors";
import { Contributor } from "@/lib/services/contributors-service";
import { ContributorsStorage } from "@/lib/storage/contributors-storage";
import { asc, desc, eq, ilike, or, sql } from "drizzle-orm";

/**
 * Drizzle ORM implementation of the ContributorsStorage interface
 */
export class DrizzleContributorsStorage implements ContributorsStorage {
	constructor() {
		// No additional setup needed for Drizzle as it uses the singleton db instance
	}

	/**
	 * Transform a database record to our service model
	 */
	private transformDbToModel(dbContributor: any): Contributor {
		return {
			id: dbContributor.id.toString(),
			name: dbContributor.name,
			avatar: dbContributor.avatar,
			handle: dbContributor.handle,
			type: dbContributor.type,
			tenure: dbContributor.tenure,
			description: dbContributor.description,
			location: dbContributor.location,
			organizations: dbContributor.organizations,
			prMerged: dbContributor.pr_merged,
			prOpened: dbContributor.pr_opened,
			issuesOpened: dbContributor.issues_opened,
			issuesClosed: dbContributor.issues_closed,
			commits: dbContributor.commits,
			lastActive: dbContributor.last_active.toISOString().split("T")[0],
			latestCommit: dbContributor.latest_commit,
			socialLinks: dbContributor.social_links,
			activityScore: dbContributor.activity_score,
			languages: dbContributor.languages,
			reputationScore: dbContributor.reputation_score,
			stars: dbContributor.stars,
			followers: dbContributor.followers,
			repositories: dbContributor.repositories,
		};
	}

	/**
	 * Get all contributors with optional search and sort
	 */
	async getContributors(options?: {
		search?: string;
		sortBy?: keyof Contributor;
		sortOrder?: "asc" | "desc";
		repoIds?: string[];
	}): Promise<Contributor[]> {
		try {
			const db = dbFactory.getClient();

			// Build the where condition if search is provided
			const whereCondition = options?.search
				? or(
						ilike(contributors.name, `%${options.search}%`),
						ilike(contributors.handle, `%${options.search}%`),
						ilike(contributors.description, `%${options.search}%`)
				  )
				: undefined;

			// Determine column to sort by
			let orderByColumn;
			if (options?.sortBy) {
				const sortDirection = options.sortOrder === "asc" ? asc : desc;

				// Map service model keys to database columns
				const columnMapping: Record<string, any> = {
					name: contributors.name,
					handle: contributors.handle,
					type: contributors.type,
					tenure: contributors.tenure,
					prMerged: contributors.pr_merged,
					commits: contributors.commits,
					lastActive: contributors.last_active,
					stars: contributors.stars,
				};

				const column = columnMapping[options.sortBy as string];
				if (column) {
					orderByColumn = sortDirection(column);
				} else {
					orderByColumn = desc(contributors.stars);
				}
			} else {
				orderByColumn = desc(contributors.stars);
			}

			// Execute query with all the built conditions
			let result;
			if (whereCondition) {
				result = await db.select().from(contributors).where(whereCondition).orderBy(orderByColumn);
			} else {
				result = await db.select().from(contributors).orderBy(orderByColumn);
			}

			// Filter by repository IDs if provided
			// Note: Since the database doesn't have a direct mapping between contributors and repositories,
			// we're filtering in memory based on the repositories data in each contributor
			if (options?.repoIds && options.repoIds.length > 0) {
				result = result.filter((contributor: any) => {
					// Check if the contributor has repositories
					if (!contributor.repositories) return false;
					// Check if any of the contributor's repositories match the requested repo IDs
					return contributor.repositories.some((repo: any) => options.repoIds!.includes(repo.id));
				});
			}

			return result.map((item: any) => this.transformDbToModel(item));
		} catch (error) {
			console.error("Error fetching contributors:", error);
			throw new Error("Failed to fetch contributors");
		}
	}

	/**
	 * Get a single contributor by ID
	 */
	async getContributor(id: string): Promise<Contributor | undefined> {
		try {
			const result = await dbFactory
				.getClient()
				.select()
				.from(contributors)
				.where(eq(contributors.id, parseInt(id)))
				.limit(1);

			return result.length > 0 ? this.transformDbToModel(result[0]) : undefined;
		} catch (error) {
			console.error(`Error fetching contributor with ID ${id}:`, error);
			throw new Error(`Failed to fetch contributor with ID ${id}`);
		}
	}

	/**
	 * Create a new contributor
	 */
	async createContributor(contributor: Omit<Contributor, "id">): Promise<Contributor> {
		try {
			const now = new Date();

			const result = await dbFactory
				.getClient()
				.insert(contributors)
				.values({
					name: contributor.name,
					avatar: contributor.avatar,
					handle: contributor.handle,
					type: contributor.type,
					tenure: contributor.tenure,
					description: contributor.description,
					location: contributor.location,
					organizations: contributor.organizations,
					pr_merged: contributor.prMerged,
					pr_opened: contributor.prOpened,
					issues_opened: contributor.issuesOpened,
					issues_closed: contributor.issuesClosed,
					commits: contributor.commits,
					last_active: sql`${new Date(contributor.lastActive)}::timestamp`,
					latest_commit: contributor.latestCommit,
					social_links: contributor.socialLinks,
					activity_score: contributor.activityScore,
					languages: contributor.languages,
					reputation_score: contributor.reputationScore,
					stars: contributor.stars,
					followers: contributor.followers,
					created_at: sql`${now}::timestamp`,
					updated_at: sql`${now}::timestamp`,
				})
				.returning();

			if (!result[0]) {
				throw new Error("Failed to create contributor");
			}

			return this.transformDbToModel(result[0]);
		} catch (error) {
			console.error("Error creating contributor:", error);
			throw new Error("Failed to create contributor");
		}
	}

	/**
	 * Delete a contributor
	 */
	async deleteContributor(id: string): Promise<boolean> {
		try {
			const result = await dbFactory
				.getClient()
				.delete(contributors)
				.where(eq(contributors.id, parseInt(id)))
				.returning();

			return result.length > 0;
		} catch (error) {
			console.error(`Error deleting contributor with ID ${id}:`, error);
			throw new Error(`Failed to delete contributor with ID ${id}`);
		}
	}
}
