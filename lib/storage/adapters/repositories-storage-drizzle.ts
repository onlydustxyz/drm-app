import { dbFactory } from "@/lib/drizzle";
import { repositories } from "@/lib/drizzle/schema/repositories";
import { Repository, RepositoryFilter, RepositorySort } from "@/lib/services/repositories-service";
import { RepositoriesStorage } from "@/lib/storage/repositories-storage";
import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

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
			id: dbRepo.id?.toString() || dbRepo.repo_id?.toString(),
			name: dbRepo.name || `${dbRepo.owner_login}/${dbRepo.repo_name}`,
			description: dbRepo.description || dbRepo.repo_description || "",
			url: dbRepo.url || `https://github.com/${dbRepo.owner_login}/${dbRepo.repo_name}`,
			stars: dbRepo.stars || 0,
			forks: dbRepo.forks || 0,
			watchers: dbRepo.watchers || 0,
			languages: dbRepo.language ? [{ name: dbRepo.language }] : [],
			last_updated_at: (dbRepo.updated_at || dbRepo.last_updated_at)?.toISOString() || new Date().toISOString(),
			prMerged: dbRepo.merged_pr_count || 0,
			prOpened: dbRepo.open_pr_count || 0,
			issuesOpened: dbRepo.open_issue_count || dbRepo.open_issues || 0,
			issuesClosed: dbRepo.closed_issue_count || 0,
			commits: dbRepo.commit_count || 0,
			contributors: dbRepo.contributor_count || 0,
			indexingStatus: dbRepo.indexing_status || "PENDING",
		};
	}

	/**
	 * Transform database records from the segment query to our service model
	 */
	private transformSegmentDbToModel(dbRepo: any): Repository {
		console.log(dbRepo);
		return {
			id: dbRepo.repo_id.toString(),
			name: `${dbRepo.owner_login}/${dbRepo.repo_name}`,
			description: dbRepo.repo_description || "",
			url: `https://github.com/${dbRepo.owner_login}/${dbRepo.repo_name}`,
			stars: 0, // Not included in the segment query
			forks: 0, // Not included in the segment query
			watchers: 0, // Not included in the segment query
			languages: [], // Not included in the segment query
			last_updated_at: dbRepo.last_updated_at ? new Date(dbRepo.last_updated_at).toISOString() : new Date().toISOString(),
			prMerged: dbRepo.merged_pr_count || 0,
			prOpened: dbRepo.open_pr_count || 0,
			issuesOpened: dbRepo.open_issue_count || 0,
			issuesClosed: dbRepo.closed_issue_count || 0,
			commits: dbRepo.commit_count || 0,
			contributors: dbRepo.contributor_count || 0,
			indexingStatus: dbRepo.indexing_status || "PENDING",
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
			return dbRepos.map((repo) => this.transformDbToModel(repo));
		} catch (error) {
			console.error("Error fetching repositories:", error);
			throw new Error("Failed to fetch repositories");
		}
	}

	/**
	 * Get repositories for a specific segment
	 * @param segmentId The segment ID to fetch repositories for
	 * @param sort Optional sorting parameters
	 * @returns Array of repositories belonging to the segment
	 */
	async getRepositoriesBySegmentId(segmentId: string, sort?: RepositorySort): Promise<Repository[]> {
		try {
			// Build the SQL query parts
			let baseQuery = `
				with pr_stats as (select repo_id                                     as repo_id,
									 count(*) filter ( where status = 'MERGED' ) as merged_count,
									 count(*) filter ( where status = 'OPEN' )   as open_count
							  from indexer_exp.github_pull_requests
							  group by repo_id),
				 issue_stats as (select repo_id                                        as repo_id,
										count(*) filter ( where status = 'COMPLETED' ) as closed_count,
										count(*) filter ( where status = 'OPEN' )      as open_count
							 from indexer_exp.github_issues
							 group by repo_id),
				 commits_stats as (select repo_id                   as repo_id,
									  count(distinct sha)       as commit_count,
									  count(distinct author_id) as contributor_count
							   from indexer_exp.github_commits
										join indexer_exp.github_accounts u on u.id = author_id and u."type" = 'USER'
							   group by repo_id)
				select r.id                              as repo_id,
					   r.owner_login                     as owner_login,
					   r.name                            as repo_name,
					   r.description                     as repo_description,
					   coalesce(j.status, 'PENDING')     as indexing_status,
					   coalesce(ps.merged_count, 0)      as merged_pr_count,
					   coalesce(ps.open_count, 0)        as open_pr_count,
					   coalesce(iss.closed_count, 0)     as closed_issue_count,
					   coalesce(iss.open_count, 0)       as open_issue_count,
					   coalesce(cs.commit_count, 0)      as commit_count,
					   coalesce(cs.contributor_count, 0) as contributor_count,
					   r.updated_at                      as last_updated_at
				from segment_repositories sr
				join indexer_exp.github_repos r on r.html_url = sr.repository_url
						 left join indexer.repo_public_events_indexing_jobs j on j.repo_owner = r.owner_login and j.repo_name = r.name
						 left join pr_stats ps on ps.repo_id = r.id
						 left join issue_stats iss on iss.repo_id = r.id
						 left join commits_stats cs on cs.repo_id = r.id
				where sr.segment_id = ${parseInt(segmentId)}
			`;

			// Add sorting
			let orderByClause = " ORDER BY r.name ASC"; // Default sorting
			
			if (sort) {
				// Map the sort field to the column names in the query
				switch (sort.field) {
					case "name":
						orderByClause = ` ORDER BY r.name ${sort.direction === "asc" ? "ASC" : "DESC"}`;
						break;
					case "updated_at":
						orderByClause = ` ORDER BY r.updated_at ${sort.direction === "asc" ? "ASC" : "DESC"}`;
						break;
					// Add more cases as needed for other sortable fields
				}
			}

			// Combine the query parts
			const fullQuery = baseQuery + orderByClause;

			// Execute the query (without parameters)
			const results = await dbFactory.getClient().execute(
				sql.raw(fullQuery)
			);

			// Transform the results to our service model
			return results.map((row) => this.transformSegmentDbToModel(row));
		} catch (error) {
			console.error(`Error fetching repositories for segment ${segmentId}:`, error);
			throw new Error(`Failed to fetch repositories for segment ${segmentId}`);
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
