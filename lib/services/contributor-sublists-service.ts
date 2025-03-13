// Contributor sublists data types
import { ContributorActivity } from "@/components/charts/github-activity-graph";
import { ContributorSublistsStorage, getContributorSublistsStorage } from "../storage/contributor-sublists-storage";
import { Contributor, getContributors } from "./contributors-service";

export interface ContributorSublist {
	id: string;
	name: string;
	description: string;
	contributorIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface ContributorRetention {
	month: string;
	activeCount: number;
	totalCount: number;
	retentionRate: number;
}

// Service interface for contributor sublists
export interface ContributorSublistsServiceInterface {
	getContributorSublists(search?: string): Promise<ContributorSublist[]>;
	getContributorSublist(id: string): Promise<ContributorSublist | undefined>;
	createContributorSublist(
		sublist: Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">
	): Promise<ContributorSublist>;
	updateContributorSublist(
		id: string,
		sublist: Partial<Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">>
	): Promise<ContributorSublist | undefined>;
	deleteContributorSublist(id: string): Promise<boolean>;
	getContributorActivityData(contributorIds: string[]): Promise<ContributorActivity[]>;
	getContributorRetentionData(contributorIds: string[]): Promise<ContributorRetention[]>;
	generateRetentionData(contributorIds: string[]): ContributorRetention[];
}

// Mock data implementation
const mockContributorSublists: ContributorSublist[] = [
	{
		id: "1",
		name: "Core Contributors",
		description: "Key contributors to the project",
		contributorIds: ["1", "3", "5"],
		createdAt: "2023-03-10",
		updatedAt: "2023-03-15",
	},
	{
		id: "2",
		name: "New Contributors",
		description: "Recently joined contributors",
		contributorIds: ["2", "4"],
		createdAt: "2023-03-12",
		updatedAt: "2023-03-14",
	},
];

// Implementation of contributor sublists service
export class ContributorSublistsService implements ContributorSublistsServiceInterface {
	private storage: ContributorSublistsStorage;

	constructor() {
		this.storage = getContributorSublistsStorage();
	}

	// Generate mock retention data for contributor sublists
	generateRetentionData(contributorIds: string[]): ContributorRetention[] {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		return months.map((month, index) => {
			// Generate some mock retention data based on the month
			const totalCount = contributorIds.length;
			// Simulate some fluctuation in active contributors
			const activeCount = Math.max(1, Math.floor(totalCount * (0.7 + Math.sin(index / 2) * 0.3)));
			const retentionRate = (activeCount / totalCount) * 100;

			return {
				month,
				activeCount,
				totalCount,
				retentionRate,
			};
		});
	}

	// Generate GitHub-style activity data for contributors
	async getContributorActivityData(contributorIds: string[]): Promise<ContributorActivity[]> {
		// In a real implementation, this would fetch data from an API
		// For now, we'll generate mock data

		// Get contributors
		const allContributors = await getContributors();

		// Ensure we're comparing strings to strings for IDs
		const stringContributorIds = contributorIds.map((id) => String(id));
		const contributors = allContributors.filter((c: Contributor) => stringContributorIds.includes(String(c.id)));

		console.log("Activity data - contributor IDs:", stringContributorIds);
		console.log("Activity data - filtered contributors:", contributors);

		// Mock projects
		const mockProjects = ["core", "frontend", "api", "docs", "tests"];

		// Mock repositories
		const mockRepos = ["main-app", "backend-service", "ui-components", "documentation", "infrastructure"];

		// Generate weeks (last 24 weeks)
		const weeks: string[] = [];
		const now = new Date();
		for (let i = 23; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i * 7);
			const year = date.getFullYear();
			const weekNum = Math.ceil(((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
			weeks.push(`${year}-${weekNum.toString().padStart(2, "0")}`);
		}

		// Generate activity data for each contributor
		return contributors.map((contributor: Contributor) => {
			// Assign 1-3 random projects to each contributor
			const numProjects = 1 + Math.floor(Math.random() * 3);
			const projects: string[] = [];
			for (let i = 0; i < numProjects; i++) {
				const project = mockProjects[Math.floor(Math.random() * mockProjects.length)];
				if (!projects.includes(project)) {
					projects.push(project);
				}
			}

			// Assign 1-3 random repositories to each contributor
			const numRepos = 1 + Math.floor(Math.random() * 3);
			const repos: string[] = [];
			for (let i = 0; i < numRepos; i++) {
				const repo = mockRepos[Math.floor(Math.random() * mockRepos.length)];
				if (!repos.includes(repo)) {
					repos.push(repo);
				}
			}

			// Generate weekly activity
			const weeklyActivity = weeks.map((week) => {
				// Generate more activity for contributors with more PRs/commits
				const activityLevel = (contributor.prMerged + contributor.commits) / 50;
				const maxPRs = Math.max(1, Math.floor(activityLevel * 10));

				// 30% chance of no activity in a given week
				const hasActivity = Math.random() > 0.3;

				// Generate repo-specific PR counts
				const repoActivity = repos.map((repo) => {
					// Each repo has a different chance of activity
					const repoHasActivity = hasActivity && Math.random() > 0.4;
					const repoPRCount = repoHasActivity ? Math.floor(Math.random() * (maxPRs / repos.length) + 1) : 0;

					return {
						name: repo,
						prCount: repoPRCount,
					};
				});

				// Total PR count is the sum of all repo PR counts
				const totalPRCount = repoActivity.reduce((sum, repo) => sum + repo.prCount, 0);

				return {
					week,
					prCount: totalPRCount,
					repos: repoActivity,
				};
			});

			return {
				id: contributor.id,
				name: contributor.name,
				avatar: contributor.avatar,
				projects,
				weeklyActivity,
			};
		});
	}

	// Methods using the storage implementation
	async getContributorSublists(search?: string): Promise<ContributorSublist[]> {
		return this.storage.getSublists(search);
	}

	async getContributorSublist(id: string): Promise<ContributorSublist | undefined> {
		return this.storage.getSublist(id);
	}

	async createContributorSublist(
		sublist: Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">
	): Promise<ContributorSublist> {
		return this.storage.createSublist(sublist);
	}

	async updateContributorSublist(
		id: string,
		sublist: Partial<Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">>
	): Promise<ContributorSublist | undefined> {
		return this.storage.updateSublist(id, sublist);
	}

	async deleteContributorSublist(id: string): Promise<boolean> {
		return this.storage.deleteSublist(id);
	}

	async getContributorRetentionData(contributorIds: string[]): Promise<ContributorRetention[]> {
		// Ensure we're using string IDs consistently
		const stringContributorIds = contributorIds.map((id) => String(id));
		return this.storage.getRetentionData(stringContributorIds);
	}
}

// Create a singleton instance of the service
const contributorSublistsService = new ContributorSublistsService();

// Export functions that use the service for backward compatibility
export async function getContributorSublists(search?: string): Promise<ContributorSublist[]> {
	return contributorSublistsService.getContributorSublists(search);
}

export async function getContributorSublist(id: string): Promise<ContributorSublist | undefined> {
	return contributorSublistsService.getContributorSublist(id);
}

export async function createContributorSublist(
	sublist: Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">
): Promise<ContributorSublist> {
	return contributorSublistsService.createContributorSublist(sublist);
}

export async function updateContributorSublist(
	id: string,
	sublist: Partial<Omit<ContributorSublist, "id" | "createdAt" | "updatedAt">>
): Promise<ContributorSublist | undefined> {
	return contributorSublistsService.updateContributorSublist(id, sublist);
}

export async function deleteContributorSublist(id: string): Promise<boolean> {
	return contributorSublistsService.deleteContributorSublist(id);
}

export async function getContributorRetentionData(contributorIds: string[]): Promise<ContributorRetention[]> {
	return contributorSublistsService.getContributorRetentionData(contributorIds);
}

export async function getContributorActivityData(contributorIds: string[]): Promise<ContributorActivity[]> {
	return contributorSublistsService.getContributorActivityData(contributorIds);
}

export function generateRetentionData(contributorIds: string[]): ContributorRetention[] {
	return contributorSublistsService.generateRetentionData(contributorIds);
}

// Export the service instance for direct access
export { contributorSublistsService };
