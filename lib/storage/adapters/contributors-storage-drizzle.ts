import { dbFactory } from "@/lib/drizzle";
import { contributors } from "@/lib/drizzle/schema/contributors";
import { Contributor } from "@/lib/services/contributors-service";
import { ContributorsStorage } from "@/lib/storage/contributors-storage";
import { asc, desc, eq, ilike, or } from "drizzle-orm";

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
		};
	}

	/**
	 * Get all contributors with optional search and sort
	 */
	async getContributors(options?: {
		search?: string;
		sortBy?: keyof Contributor;
		sortOrder?: "asc" | "desc";
	}): Promise<Contributor[]> {
		try {
			let query = dbFactory.getClient().select().from(contributors);

			// Add search filter if provided
			if (options?.search) {
				const searchTerm = `%${options.search}%`;
				query = query.where(
					or(
						ilike(contributors.name, searchTerm),
						ilike(contributors.handle, searchTerm),
						ilike(contributors.description, searchTerm)
					)
				);
			}

			// Add sorting if provided
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
					query = query.orderBy(sortDirection(column));
				}
			} else {
				// Default sort by stars descending
				query = query.orderBy(desc(contributors.stars));
			}

			const result = await query;

			return result.map(this.transformDbToModel);
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
					last_active: new Date(contributor.lastActive),
					latest_commit: contributor.latestCommit,
					social_links: contributor.socialLinks,
					activity_score: contributor.activityScore,
					languages: contributor.languages,
					reputation_score: contributor.reputationScore,
					stars: contributor.stars,
					followers: contributor.followers,
					created_at: now,
					updated_at: now,
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
