import { db } from "@/lib/drizzle";
import { contributorRetention, contributorSublists } from "@/lib/drizzle/schema/contributor-sublists";
import {
	ContributorRetention,
	ContributorSublist,
	generateRetentionData,
} from "@/lib/services/contributor-sublists-service";
import { asc, desc, eq, ilike, or } from "drizzle-orm";
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
			let query = db.select().from(contributorSublists);

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
					contributorIds: contributorSublists.contributor_ids,
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

			return result.map((item) => ({
				id: item.id.toString(),
				name: item.name,
				description: item.description || "",
				contributorIds: item.contributor_ids.map((id) => String(id)),
				createdAt: new Date(item.created_at).toISOString().split("T")[0],
				updatedAt: new Date(item.updated_at).toISOString().split("T")[0],
			}));
		} catch (error) {
			console.error("Error fetching contributor sublists:", error);
			throw new Error("Failed to fetch contributor sublists");
		}
	}

	async getSublist(id: string): Promise<ContributorSublist | undefined> {
		try {
			const result = await db
				.select()
				.from(contributorSublists)
				.where(eq(contributorSublists.id, parseInt(id)))
				.limit(1);

			if (result.length === 0) {
				return undefined;
			}

			const item = result[0];
			return {
				id: item.id.toString(),
				name: item.name,
				description: item.description || "",
				contributorIds: item.contributor_ids.map((id) => String(id)),
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
			const now = new Date();
			const result = await db
				.insert(contributorSublists)
				.values({
					name: sublist.name,
					description: sublist.description,
					contributor_ids: sublist.contributorIds.map((id) => String(id)),
					created_at: now,
					updated_at: now,
				})
				.returning();

			if (result.length === 0) {
				throw new Error("Failed to create contributor sublist: No result returned");
			}

			const item = result[0];
			return {
				id: item.id.toString(),
				name: item.name,
				description: item.description || "",
				contributorIds: item.contributor_ids.map((id) => String(id)),
				createdAt: new Date(item.created_at).toISOString().split("T")[0],
				updatedAt: new Date(item.updated_at).toISOString().split("T")[0],
			};
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

			// Build update object with only the provided fields
			const updateObj: any = {
				updated_at: new Date(),
			};

			if (sublist.name !== undefined) updateObj.name = sublist.name;
			if (sublist.description !== undefined) updateObj.description = sublist.description;
			if (sublist.contributorIds !== undefined) {
				updateObj.contributor_ids = sublist.contributorIds.map((id) => String(id));
			}

			const result = await db
				.update(contributorSublists)
				.set(updateObj)
				.where(eq(contributorSublists.id, parseInt(id)))
				.returning();

			if (result.length === 0) {
				return undefined;
			}

			const item = result[0];
			return {
				id: item.id.toString(),
				name: item.name,
				description: item.description || "",
				contributorIds: item.contributor_ids.map((id) => String(id)),
				createdAt: new Date(item.created_at).toISOString().split("T")[0],
				updatedAt: new Date(item.updated_at).toISOString().split("T")[0],
			};
		} catch (error) {
			console.error("Error updating contributor sublist:", error);
			throw new Error("Failed to update contributor sublist");
		}
	}

	async deleteSublist(id: string): Promise<boolean> {
		try {
			const result = await db
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
			// Convert to array of strings if not already
			const stringContributorIds = contributorIds.map((id) => String(id));

			// Try to get data from database first
			// In Drizzle we would need a way to query JsonB arrays with overlap
			// For now, we'll check if ANY of the IDs match (simplified approach)
			// In a real implementation, you might use a more sophisticated query
			const result = await db.select().from(contributorRetention).orderBy(contributorRetention.month);

			// Filter results to only include those with at least one matching contributor ID
			const filteredResults = result.filter((item) => {
				// Check if any of the stringContributorIds is in item.contributor_ids
				return item.contributor_ids.some((id) => stringContributorIds.includes(String(id)));
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
			return generateRetentionData(stringContributorIds);
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
