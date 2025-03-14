import { getRepositoriesStorage } from "@/lib/storage/repositories-storage";

// Repository data types
export interface Repository {
	id: string;
	name: string;
	description: string;
	url: string;
	stars: number;
	forks: number;
	watchers: number;
	languages: { name: string }[];
	last_updated_at: string;
	prMerged: number;
	prOpened: number;
	issuesOpened: number;
	issuesClosed: number;
	commits: number;
	contributors: number;
	indexingStatus?: string;
}

// Filter and sort parameters interface
export interface RepositoryFilter {
	names?: string[];
	search?: string; // Text search across name and description
}

export interface RepositorySort {
	field: "name" | "stars" | "forks" | "updated_at" | "created_at";
	direction: "asc" | "desc";
}


// Repositories service interface
export interface RepositoriesService {
	getRepositories(filter?: RepositoryFilter, sort?: RepositorySort): Promise<Repository[]>;
	getRepository(id: string): Promise<Repository | undefined>;
	createRepository(repository: Omit<Repository, "id">): Promise<Repository>;
	updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined>;
	deleteRepository(id: string): Promise<boolean>;
}


export class RepositoriesService implements RepositoriesService {
	async getRepositories(filter?: RepositoryFilter, sort?: RepositorySort): Promise<Repository[]> {
		const storage = getRepositoriesStorage();
		return storage.getRepositories(filter, sort);
	}

	async getRepository(id: string): Promise<Repository | undefined> {
		const storage = getRepositoriesStorage();
		return storage.getRepository(id);
	}

	async createRepository(repository: Omit<Repository, "id">): Promise<Repository> {
		const storage = getRepositoriesStorage();
		return storage.createRepository(repository);
	}

	async updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined> {
		const storage = getRepositoriesStorage();
		return storage.updateRepository(id, repository);
	}

	async deleteRepository(id: string): Promise<boolean> {
		const storage = getRepositoriesStorage();
		return storage.deleteRepository(id);
	}
}

// Create a singleton instance of the service
const repositoriesService: RepositoriesService =
	process.env.NODE_ENV === "production" ? new RepositoriesService() : new RepositoriesService();

// Export functions that use the service
export async function getRepositories(filter?: RepositoryFilter, sort?: RepositorySort): Promise<Repository[]> {
	return repositoriesService.getRepositories(filter, sort);
}

export async function getRepository(id: string): Promise<Repository | undefined> {
	return repositoriesService.getRepository(id);
}

export async function createRepository(repository: Omit<Repository, "id">): Promise<Repository> {
	return repositoriesService.createRepository(repository);
}

export async function updateRepository(
	id: string,
	repository: Partial<Omit<Repository, "id">>
): Promise<Repository | undefined> {
	return repositoriesService.updateRepository(id, repository);
}

export async function deleteRepository(id: string): Promise<boolean> {
	return repositoriesService.deleteRepository(id);
}
