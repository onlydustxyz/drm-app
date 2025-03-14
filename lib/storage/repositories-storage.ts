import { Repository } from "@/lib/services/repositories-service";
import { DrizzleRepositoriesStorage } from "@/lib/storage/adapters/repositories-storage-drizzle";

/**
 * Interface for accessing repository data from storage
 */
export interface RepositoriesStorage {
	getRepositories(filter?: { names?: string[] }): Promise<Repository[]>;
	getRepository(id: string): Promise<Repository | undefined>;
	createRepository(repository: Omit<Repository, "id">): Promise<Repository>;
	updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined>;
	deleteRepository(id: string): Promise<boolean>;
}

// Create a singleton instance that will be used throughout the application
let repositoriesStorage: RepositoriesStorage;

// Initialize with the drizzle implementation if we're in a server context
if (typeof window === "undefined") {
	repositoriesStorage = new DrizzleRepositoriesStorage();
} else {
	// This would be initialized during SSR and hydration would make it available on the client
	// For now we'll throw an error in case someone tries to access it on the client directly
	repositoriesStorage = new Proxy({} as RepositoriesStorage, {
		get: () => {
			throw new Error("RepositoriesStorage is only available on the server");
		},
	});
}

export function getRepositoriesStorage(): RepositoriesStorage {
	return repositoriesStorage;
}

export function setRepositoriesStorage(storage: RepositoriesStorage): void {
	repositoriesStorage = storage;
}
