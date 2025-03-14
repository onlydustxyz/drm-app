import { dbFactory } from "@/lib/drizzle";
import { contributorRetention, contributorSublists } from "@/lib/drizzle/schema/contributor-sublists";
import { contributorSublistsContributors } from "@/lib/drizzle/schema/contributor-sublists";
import {
	ContributorRetention,
	ContributorSublist,
	generateRetentionData,
} from "@/lib/services/contributor-sublists-service";
import { asc, desc, eq, ilike, or, inArray } from "drizzle-orm";
import { ContributorSublistsStorage } from "../contributor-sublists-storage";

/**
 * Drizzle ORM implementation of the ContributorSublistsStorage interface
 */
export class DrizzleContributorSublistsStorage implements ContributorSublistsStorage {
	constructor() {
		// No additional setup needed for Drizzle as it uses the singleton db instance
	}

	async getSublists(options?: {
		search?: string;
		sort?: {
			key?: keyof ContributorSublist;
			direction?: "ascending" | "descending";
		};
	}): Promise<ContributorSublist[]> {
		try {
			let query = dbFactory.getClient().select().from(contributorSublists);

			// Apply search filter if provided
			if (options?.search && options.search.trim() !== "") {
				const searchTerm = `%${options.search.trim()}%`;
				query = query.where(
					or(ilike(contributorSublists.name, searchTerm), ilike(contributorSublists.description, searchTerm))
				) as any;
			}

			// Apply sorting based on provided parameters
			if (options?.sort?.key) {
				// Map ContributorSublist keys to Drizzle schema fields
				const sortFieldMap: Record<keyof ContributorSublist, any> = {
					id: contributorSublists.id,
					name: contributorSublists.name,
					description: contributorSublists.description,
					contributorIds: [], // Keep this for backwards compatibility
					createdAt: contributorSublists.created_at,
					updatedAt: contributorSublists.updated_at,
				};

				const sortField = sortFieldMap[options.sort.key];
				if (sortField) {
					if (options.sort.direction === "descending") {
						query = query.orderBy(desc(sortField)) as any;
					} else {
						query = query.orderBy(asc(sortField)) as any;
					}
				}
			} else {
				// Default sorting
				query = query.orderBy(contributorSublists.created_at) as any;
			}

			const result = await query;

			// Create a map of sublist ID to ContributorSublist object
			const sublistMap = new Map<number, ContributorSublist>();

			// Initialize sublists with empty contributor arrays
			result.forEach(item => {
				sublistMap.set(item.id, {
					id: item.id.toString(),
					name: item.name,
					description: item.description || "",
					contributorIds: [],
					createdAt: new Date(item.created_at).toISOString().split("T")[0],
					updatedAt: new Date(item.updated_at).toISOString().split("T")[0],
				});
			});

			// If we have results, get all contributors for these sublists in a single query
			if (result.length > 0) {
				const sublistIds = result.map(item => item.id);

				const contributors = await dbFactory.getClient()
					.select({
						sublistId: contributorSublistsContributors.sublistId,
						contributorId: contributorSublistsContributors.contributorId,
					})
					.from(contributorSublistsContributors)
					.where(inArray(contributorSublistsContributors.sublistId, sublistIds));

				// Populate contributor IDs for each sublist
				contributors.forEach(({ sublistId, contributorId }) => {
					const sublist = sublistMap.get(sublistId);
					if (sublist) {
						sublist.contributorIds.push(contributorId.toString());
					}
				});
			}

			// Return all sublists as an array
			return Array.from(sublistMap.values());
		} catch (error) {
			console.error("Error fetching contributor sublists:", error);
			throw new Error("Failed to fetch contributor sublists");
		}
	}

	async getSublist(id: string): Promise<ContributorSublist | undefined> {
		try {
			// Get the sublist record
			const result = await dbFactory.getClient()
				.select()
				.from(contributorSublists)
				.where(eq(contributorSublists.id, parseInt(id)))
				.limit(1);

			if (result.length === 0) {
				return undefined;
			}

			const item = result[0];

			// Get the contributors from the join table
			const contributors = await dbFactory.getClient()
				.select({ contributorId: contributorSublistsContributors.contributorId })
				.from(contributorSublistsContributors)
				.where(eq(contributorSublistsContributors.sublistId, item.id));

			// Extract contributor IDs
			const contributorIds = contributors.map(c => c.contributorId.toString());

			return {
				id: item.id.toString(),
				name: item.name,
				description: item.description || "",
				contributorIds: contributorIds,
				createdAt: new Date(item.created_at).toISOString().split("T")[0],
				updatedAt: new Date(item.updated_at).toISOString().split("T")[0],
			};
		} catch (error) {
			console.error("Error fetching contributor sublist:", error);
			throw new Error("Failed to fetch contributor sublist");
		}
	}

	async createSublist(
		sublist: Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">
	): Promise<ContributorSublist> {
		try {
			// Start a transaction to ensure atomicity
			return await dbFactory.getClient().transaction(async (tx) => {
				const now = new Date();
				// Create the sublist record without storing contributor IDs
				const [createdSublist] = await tx
					.insert(contributorSublists)
					.values({
						name: sublist.name,
						description: sublist.description,
						created_at: now,
						updated_at: now,
					})
					.returning();

				// Insert entries into the join table for each contributor
				if (sublist.contributorIds.length > 0) {
					await tx
						.insert(contributorSublistsContributors)
						.values(
							sublist.contributorIds.map(contributorId => ({
								sublistId: createdSublist.id,
								contributorId: parseInt(contributorId),
							}))
						);
				}

				// Return the created sublist with the contributorIds for API consistency
				return {
					id: createdSublist.id.toString(),
					name: createdSublist.name,
					description: createdSublist.description || "",
					contributorIds: sublist.contributorIds,
					createdAt: new Date(createdSublist.created_at).toISOString().split("T")[0],
					updatedAt: new Date(createdSublist.updated_at).toISOString().split("T")[0],
				};
			});
		} catch (error) {
			console.error("Error creating contributor sublist:", error);
			throw new Error("Failed to create contributor sublist");
		}
	}

	async updateSublist(
		id: string,
		sublist: Partial<Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">>
	): Promise<ContributorSublist | undefined> {
		try {
			// First check if the sublist exists
			const existingSublist = await this.getSublist(id);
			if (!existingSublist) {
				return undefined;
			}

			return await dbFactory.getClient().transaction(async (tx) => {
				// Build update object with only the provided fields
				const updateObj: any = {
					updated_at: new Date(),
				};

				if (sublist.name !== undefined) updateObj.name = sublist.name;
				if (sublist.description !== undefined) updateObj.description = sublist.description;

				// Update the main sublist record
				const [updatedSublist] = await tx
					.update(contributorSublists)
					.set(updateObj)
					.where(eq(contributorSublists.id, parseInt(id)))
					.returning();

				// If contributorIds are provided, update the join table
				if (sublist.contributorIds !== undefined) {
					// First delete all existing relationships
					await tx
						.delete(contributorSublistsContributors)
						.where(eq(contributorSublistsContributors.sublistId, parseInt(id)));

					// Then insert the new relationships
					if (sublist.contributorIds.length > 0) {
						await tx
							.insert(contributorSublistsContributors)
							.values(
								sublist.contributorIds.map(contributorId => ({
									sublistId: parseInt(id),
									contributorId: parseInt(contributorId),
								}))
							);
					}
				}

				// Get all contributor IDs for this sublist
				const contributors = await tx
					.select({ contributorId: contributorSublistsContributors.contributorId })
					.from(contributorSublistsContributors)
					.where(eq(contributorSublistsContributors.sublistId, parseInt(id)));

				const contributorIds = contributors.map(c => c.contributorId.toString());

				// Return the updated sublist
				return {
					id: updatedSublist.id.toString(),
					name: updatedSublist.name,
					description: updatedSublist.description || "",
					contributorIds: contributorIds,
					createdAt: new Date(updatedSublist.created_at).toISOString().split("T")[0],
					updatedAt: new Date(updatedSublist.updated_at).toISOString().split("T")[0],
				};
			});
		} catch (error) {
			console.error("Error updating contributor sublist:", error);
			throw new Error("Failed to update contributor sublist");
		}
	}

	async deleteSublist(id: string): Promise<boolean> {
		try {
			// Delete the sublist record - this will cascade delete all entries in the join table
			// due to the foreign key constraint with onDelete: "cascade"
			const result = await dbFactory.getClient()
				.delete(contributorSublists)
				.where(eq(contributorSublists.id, parseInt(id)))
				.returning({ id: contributorSublists.id });

			return result.length > 0;
		} catch (error) {
			console.error("Error deleting contributor sublist:", error);
			throw new Error("Failed to delete contributor sublist");
		}
	}

	async getRetentionData(contributorIds: string[]): Promise<ContributorRetention[]> {
		try {
			// Convert to array of numbers for database queries
			const numericContributorIds = contributorIds.map(id => parseInt(id));

			// Try to get data from database first
			const result = await dbFactory.getClient().select().from(contributorRetention).orderBy(contributorRetention.month);

			// Filter results to only include those with at least one matching contributor ID
			// Note: This is a simplification - ideally we would query directly with a DB-specific JSON array overlap operator
			const filteredResults = result.filter((item) => {
				// Check if any of the stringContributorIds is in item.contributor_ids
				return item.contributor_ids.some((id) => contributorIds.includes(String(id)));
			});

			if (filteredResults.length > 0) {
				return filteredResults.map((item) => ({
					month: item.month,
					activeCount: item.active_count,
					totalCount: item.total_count,
					retentionRate: item.retention_rate,
				}));
			}

			// Fall back to generated data if no data found in database
			return generateRetentionData(contributorIds);
		} catch (error) {
			console.error("Error fetching contributor retention data:", error);
			// Fall back to generated data if there's an error
			return generateRetentionData(contributorIds);
		}
	}
}

// Factory function to create a Drizzle implementation
export function createDrizzleContributorSublistsStorage(): ContributorSublistsStorage {
	return new DrizzleContributorSublistsStorage();
}
