import { ContributorRetention, ContributorSublist } from "@/lib/services/contributor-sublists-service";
import { DrizzleContributorSublistsStorage } from "./adapters/contributor-sublists-storage-drizzle";

/**
 * Interface for accessing contributor sublists data from storage
 */
export interface ContributorSublistsStorage {
	getSublists(): Promise<ContributorSublist[]>;
	getSublist(id: string): Promise<ContributorSublist | undefined>;
	createSublist(sublist: Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">): Promise<ContributorSublist>;
	updateSublist(
		id: string,
		sublist: Partial<Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">>
	): Promise<ContributorSublist | undefined>;
	deleteSublist(id: string): Promise<boolean>;
	getRetentionData(contributorIds: string[]): Promise<ContributorRetention[]>;
}

// Create singleton instance using Drizzle implementation
// This can be replaced with other implementations as needed
let contributorSublistsStorage: ContributorSublistsStorage;

// Initialize with Drizzle implementation by default
export function getContributorSublistsStorage(): ContributorSublistsStorage {
	if (!contributorSublistsStorage) {
		contributorSublistsStorage = new DrizzleContributorSublistsStorage();
	}
	return contributorSublistsStorage;
}

export function setContributorSublistsStorage(storage: ContributorSublistsStorage): void {
	contributorSublistsStorage = storage;
}
