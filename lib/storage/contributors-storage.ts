import { Contributor } from "@/lib/services/contributors-service";
import { DrizzleContributorsStorage } from "@/lib/storage/adapters/contributors-storage-drizzle";

/**
 * Interface for accessing contributor data from storage
 */
export interface ContributorsStorage {
	getContributors(options?: {
		search?: string;
		sortBy?: keyof Contributor;
		sortOrder?: "asc" | "desc";
		repoIds?: string[];
	}): Promise<Contributor[]>;
	getContributor(id: string): Promise<Contributor | undefined>;
	createContributor(contributor: Omit<Contributor, "id">): Promise<Contributor>;
	deleteContributor(id: string): Promise<boolean>;
}

// Factory function to get the appropriate storage implementation
export function getContributorsStorage(): ContributorsStorage {
	return new DrizzleContributorsStorage();
}
