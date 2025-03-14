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
}

// Mock data implementation
const mockRepositories: Repository[] = [
	{
		id: "1",
		name: "onlydust/marketplace-frontend",
		description: "Frontend for the OnlyDust marketplace",
		url: "https://github.com/onlydust/marketplace-frontend",
		stars: 42,
		forks: 15,
		watchers: 8,
		languages: [{ name: "TypeScript" }],
		last_updated_at: "2023-03-15",
		prMerged: 128,
		prOpened: 24,
		issuesOpened: 56,
		issuesClosed: 42,
		commits: 845,
		contributors: 12,
	},
	{
		id: "2",
		name: "onlydust/marketplace-api",
		description: "API for the OnlyDust marketplace",
		url: "https://github.com/onlydust/marketplace-api",
		stars: 38,
		forks: 12,
		watchers: 7,
		languages: [{ name: "Rust" }],
		last_updated_at: "2023-03-14",
		prMerged: 95,
		prOpened: 18,
		issuesOpened: 42,
		issuesClosed: 35,
		commits: 723,
		contributors: 8,
	},
	{
		id: "3",
		name: "onlydust/documentation",
		description: "Documentation for OnlyDust projects",
		url: "https://github.com/onlydust/documentation",
		stars: 25,
		forks: 8,
		watchers: 5,
		languages: [{ name: "Markdown" }],
		last_updated_at: "2023-03-12",
		prMerged: 65,
		prOpened: 12,
		issuesOpened: 28,
		issuesClosed: 22,
		commits: 312,
		contributors: 15,
	},
	{
		id: "4",
		name: "onlydust/contracts",
		description: "Smart contracts for OnlyDust",
		url: "https://github.com/onlydust/contracts",
		stars: 56,
		forks: 22,
		watchers: 12,
		languages: [{ name: "Solidity" }],
		last_updated_at: "2023-03-16",
		prMerged: 85,
		prOpened: 15,
		issuesOpened: 38,
		issuesClosed: 30,
		commits: 456,
		contributors: 7,
	},
	{
		id: "5",
		name: "onlydust/infrastructure",
		description: "Infrastructure as code for OnlyDust",
		url: "https://github.com/onlydust/infrastructure",
		stars: 32,
		forks: 10,
		watchers: 6,
		languages: [{ name: "HCL" }],
		last_updated_at: "2023-03-13",
		prMerged: 72,
		prOpened: 14,
		issuesOpened: 32,
		issuesClosed: 28,
		commits: 389,
		contributors: 5,
	},
];

// Repositories service interface
export interface RepositoriesService {
	getRepositories(filter?: { names?: string[] }): Promise<Repository[]>;
	getRepository(id: string): Promise<Repository | undefined>;
	createRepository(repository: Omit<Repository, "id">): Promise<Repository>;
	updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined>;
	deleteRepository(id: string): Promise<boolean>;
}

// Mock implementation of the repositories service
export class MockRepositoriesService implements RepositoriesService {
	async getRepositories(filter?: { names?: string[] }): Promise<Repository[]> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Return mock data with optional filtering
		let result = [...mockRepositories];

		if (filter?.names && filter.names.length > 0) {
			result = result.filter((repo) => filter.names!.includes(repo.name));
		}

		return result;
	}

	async getRepository(id: string): Promise<Repository | undefined> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Find and return the repository with the matching ID
		return mockRepositories.find((repository) => repository.id === id);
	}

	async createRepository(repository: Omit<Repository, "id">): Promise<Repository> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Create a new repository with a generated ID
		const newRepository: Repository = {
			...repository,
			id: String(mockRepositories.length + 1),
		};

		// Add to mock data (in a real implementation, this would persist to a database)
		mockRepositories.push(newRepository);

		return newRepository;
	}

	async updateRepository(id: string, repository: Partial<Omit<Repository, "id">>): Promise<Repository | undefined> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Find the repository to update
		const index = mockRepositories.findIndex((repo) => repo.id === id);
		if (index === -1) return undefined;

		// Update the repository
		const updatedRepository: Repository = {
			...mockRepositories[index],
			...repository,
		};

		// Replace in the mock data
		mockRepositories[index] = updatedRepository;

		return updatedRepository;
	}

	async deleteRepository(id: string): Promise<boolean> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Find the repository to delete
		const index = mockRepositories.findIndex((repo) => repo.id === id);
		if (index === -1) return false;

		// Remove from the mock data
		mockRepositories.splice(index, 1);

		return true;
	}
}

export class RepositoriesService implements RepositoriesService {
	async getRepositories(filter?: { names?: string[] }): Promise<Repository[]> {
		const storage = getRepositoriesStorage();
		return storage.getRepositories(filter);
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
	process.env.NODE_ENV === "production" ? new RepositoriesService() : new MockRepositoriesService();

// Export functions that use the service
export async function getRepositories(filter?: { names?: string[] }): Promise<Repository[]> {
	return repositoriesService.getRepositories(filter);
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
