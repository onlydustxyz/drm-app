import { dbFactory } from "@/lib/drizzle";
import { repositories } from "@/lib/drizzle/schema/repositories";
import { Repository, RepositoryFilter, RepositorySort } from "@/lib/services/repositories-service";
import { RepositoriesStorage } from "@/lib/storage/repositories-storage";
import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";

/**
 * Drizzle ORM implementation of the RepositoriesStorage interface
 */
export class DrizzleRepositoriesStorage implements RepositoriesStorage {
	constructor() {
		// No additional setup needed for Drizzle as it uses the singleton db instance
	}

	/**
	 * Transform a database record to our service model
	 */
	private transformDbToModel(dbRepo: any): Repository {
		return {
			id: dbRepo.id.toString(),
			name: dbRepo.name,
			description: dbRepo.description || "",
			url: dbRepo.url,
			stars: dbRepo.stars || 0,
			forks: dbRepo.forks || 0,
			watchers: dbRepo.watchers || 0,
			languages: dbRepo.language ? [{ name: dbRepo.language }] : [],
			last_updated_at: dbRepo.updated_at?.toISOString() || new Date().toISOString(),
			prMerged: 0, // These fields need to be populated from other tables or GitHub API
			prOpened: 0,
			issuesOpened: dbRepo.open_issues || 0,
			issuesClosed: 0,
			commits: 0,
			contributors: 0,
		};
	}

	/**
	 * Get repositories with optional filtering by names
	 * @param filter Optional filtering parameters
	 * @param sort Optional sorting parameters
	 * @returns Array of repositories matching the filter criteria
	 */
	async getRepositories(filter?: RepositoryFilter, sort?: RepositorySort): Promise<Repository[]> {
		try {
			let query = dbFactory.getClient().select().from(repositories);
			let whereConditions = [];

			// Apply filters if provided
			if (filter) {
				// Filter by names
				if (filter.names && filter.names.length > 0) {
					whereConditions.push(inArray(repositories.name, filter.names));
				}

				// Text search in name and description
				if (filter.search) {
					whereConditions.push(
						or(
							ilike(repositories.name, `%${filter.search}%`),
							ilike(repositories.description || "", `%${filter.search}%`)
						)
					);
				}
			}

			// Apply where conditions if any exist
			if (whereConditions.length > 0) {
				query = query.where(and(...whereConditions)) as any;
			}

			// Apply sorting
			if (sort) {
				switch (sort.field) {
					case "name":
						query = query.orderBy(
							sort.direction === "asc" ? asc(repositories.name) : desc(repositories.name)
						) as any;
						break;
					case "stars":
						query = query.orderBy(
							sort.direction === "asc" ? asc(repositories.stars) : desc(repositories.stars)
						) as any;
						break;
					case "forks":
						query = query.orderBy(
							sort.direction === "asc" ? asc(repositories.forks) : desc(repositories.forks)
						) as any;
						break;
					case "updated_at":
						query = query.orderBy(
							sort.direction === "asc" ? asc(repositories.updated_at) : desc(repositories.updated_at)
						) as any;
						break;
					case "created_at":
						query = query.orderBy(
							sort.direction === "asc" ? asc(repositories.created_at) : desc(repositories.created_at)
						) as any;
						break;
					default:
						query = query.orderBy(asc(repositories.name)) as any;
				}
			} else {
				// Default sorting by name if no sort specified
				query = query.orderBy(asc(repositories.name)) as any;
			}

			const dbRepos = await query;
			return dbRepos.map(this.transformDbToModel);
		} catch (error) {
			console.error("Error fetching repositories:", error);
			throw new Error("Failed to fetch repositories");
		}
	}

	/**
	 * Get a single repository by ID
	 */
	async getRepository(id: string): Promise<Repository | undefined> {
		try {
			const dbRepo = await dbFactory
				.getClient()
				.select()
				.from(repositories)
				.where(eq(repositories.id, parseInt(id)))
				.limit(1);

			if (dbRepo.length === 0) {
				return undefined;
			}

			return this.transformDbToModel(dbRepo[0]);
		} catch (error) {
			console.error(`Error fetching repository with ID ${id}:`, error);
			throw new Error(`Failed to fetch repository with ID ${id}`);
		}
	}

	/**
	 * Create a new repository
	 */
	async createRepository(repository: Omit<Repository, "id">): Promise<Repository> {
		try {
			// Extract owner from the repository name (format: owner/repo)
			const owner = repository.name.split("/")[0];

			const created = await dbFactory
				.getClient()
				.insert(repositories)
				.values({
					name: repository.name,
					description: repository.description,
					url: repository.url,
					stars: repository.stars,
					forks: repository.forks,
					open_issues: repository.issuesOpened,
					language: repository.languages[0]?.name,
					owner: owner,
					created_at: new Date(),
					updated_at: new Date(),
				})
				.returning();

			if (!created[0]) {
				throw new Error("Failed to create repository");
			}

			return this.transformDbToModel(created[0]);
		} catch (error) {
			console.error("Error creating repository:", error);
			throw new Error("Failed to create repository");
		}
	}

	/**
	 * Update an existing repository
	 */
	async updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined> {
		try {
			const updates: any = {};

			if (repository.name !== undefined) updates.name = repository.name;
			if (repository.description !== undefined) updates.description = repository.description;
			if (repository.url !== undefined) updates.url = repository.url;
			if (repository.stars !== undefined) updates.stars = repository.stars;
			if (repository.forks !== undefined) updates.forks = repository.forks;
			if (repository.issuesOpened !== undefined) updates.open_issues = repository.issuesOpened;
			if (repository.languages?.[0]?.name !== undefined) updates.language = repository.languages[0].name;

			// Always update the updated_at timestamp
			updates.updated_at = new Date();

			// If name is being updated, extract and update the owner
			if (repository.name) {
				const owner = repository.name.split("/")[0];
				updates.owner = owner;
			}

			const updated = await dbFactory
				.getClient()
				.update(repositories)
				.set(updates)
				.where(eq(repositories.id, parseInt(id)))
				.returning();

			if (updated.length === 0) {
				return undefined;
			}

			return this.transformDbToModel(updated[0]);
		} catch (error) {
			console.error(`Error updating repository with ID ${id}:`, error);
			throw new Error(`Failed to update repository with ID ${id}`);
		}
	}

	/**
	 * Delete a repository
	 */
	async deleteRepository(id: string): Promise<boolean> {
		try {
			const deleted = await dbFactory
				.getClient()
				.delete(repositories)
				.where(eq(repositories.id, parseInt(id)))
				.returning({ id: repositories.id });

			return deleted.length > 0;
		} catch (error) {
			console.error(`Error deleting repository with ID ${id}:`, error);
			throw new Error(`Failed to delete repository with ID ${id}`);
		}
	}
}

/**
 * Factory function to create a Drizzle repositories storage instance
 */
export function createDrizzleRepositoriesStorage(): RepositoriesStorage {
	return new DrizzleRepositoriesStorage();
}
