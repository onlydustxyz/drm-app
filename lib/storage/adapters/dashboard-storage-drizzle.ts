import { dbFactory } from "@/lib/drizzle";
import {
	commitsByDevType,
	dashboardKpis,
	devActivity,
	developerActivity,
	developerLocations,
	monthlyCommits,
	monthlyPRsMerged,
} from "@/lib/drizzle/schema/dashboard";
import {
	CommitsByDevType,
	DashboardData,
	DashboardKPI,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import { DashboardStorage } from "@/lib/storage/dashboard-storage";
import { desc } from "drizzle-orm";

// Helper function to format dates to YYYY-MM-DD
function formatDateToYYYYMMDD(date: any): string {
	if (date instanceof Date) {
		return date.toISOString().slice(0, 10);
	}
	return String(date);
}

// Helper function to format dates to YYYY-MM
function formatDateToYYYYMM(date: any): string {
	if (date instanceof Date) {
		return date.toISOString().slice(0, 7);
	}
	if (typeof date === "string") {
		return date.slice(0, 7);
	}
	return String(date);
}

/**
 * Drizzle ORM implementation of the DashboardStorage interface
 */
export class DrizzleDashboardStorage implements DashboardStorage {
	constructor() {
		// No additional setup needed for Drizzle as it uses the singleton db instance
	}

	async getDashboardData(): Promise<DashboardData> {
		// We'll fetch all the different parts of the dashboard data and combine them
		const [
			kpis,
			developerActivityData,
			developerLocationsData,
			commitsByDevTypeData,
			monthlyCommitsData,
			monthlyPRsMergedData,
			devActivityData,
		] = await Promise.all([
			this.getDashboardKPIs(),
			this.getDeveloperActivity(),
			this.getDeveloperLocations(),
			this.getCommitsByDevType(),
			this.getMonthlyCommits(),
			this.getMonthlyPRsMerged(),
			this.getDevActivity(),
		]);

		return {
			kpis,
			developerActivity: developerActivityData,
			developerLocations: developerLocationsData,
			commitsByDevType: commitsByDevTypeData,
			monthlyCommits: monthlyCommitsData,
			monthlyPRsMerged: monthlyPRsMergedData,
			devActivity: devActivityData,
		};
	}

	async getDashboardKPIs(): Promise<DashboardKPI> {
		try {
			const result = await dbFactory.getClient().select().from(dashboardKpis).orderBy(desc(dashboardKpis.created_at)).limit(1);

			const data = result[0];

			if (!data) {
				throw new Error("No dashboard KPIs found");
			}

			return {
				fullTimeDevs: data.full_time_devs,
				fullTimeDevsGrowth: Number(data.full_time_devs_growth),
				monthlyActiveDevs: data.monthly_active_devs,
				monthlyActiveDevsGrowth: Number(data.monthly_active_devs_growth),
				totalRepos: data.total_repos,
				totalReposGrowth: Number(data.total_repos_growth),
				totalCommits: data.total_commits,
				totalCommitsGrowth: Number(data.total_commits_growth),
				totalProjects: data.total_projects,
				totalProjectsGrowth: Number(data.total_projects_growth),
			};
		} catch (error) {
			console.error("Error fetching dashboard KPIs:", error);
			throw new Error("Failed to fetch dashboard KPIs");
		}
	}

	async getDeveloperActivity(): Promise<DeveloperActivity[]> {
		try {
			const data = await dbFactory.getClient().select().from(developerActivity).orderBy(developerActivity.name);

			return data.map((item: typeof developerActivity.$inferSelect) => ({
				name: item.name,
				fullTime: item.full_time,
				partTime: item.part_time,
				onTime: item.on_time,
			}));
		} catch (error) {
			console.error("Error fetching developer activity:", error);
			throw new Error("Failed to fetch developer activity");
		}
	}

	async getDeveloperLocations(): Promise<DeveloperLocation[]> {
		try {
			const data = await dbFactory.getClient().select().from(developerLocations).orderBy(desc(developerLocations.count));

			return data.map((item: typeof developerLocations.$inferSelect) => ({
				country: item.country,
				count: item.count,
				latitude: Number(item.latitude),
				longitude: Number(item.longitude),
			}));
		} catch (error) {
			console.error("Error fetching developer locations:", error);
			throw new Error("Failed to fetch developer locations");
		}
	}

	async getCommitsByDevType(): Promise<CommitsByDevType[]> {
		try {
			const data = await dbFactory.getClient().select().from(commitsByDevType).orderBy(commitsByDevType.name);

			return data.map((item: typeof commitsByDevType.$inferSelect) => ({
				name: item.name,
				fullTime: item.full_time,
				partTime: item.part_time,
				onTime: item.on_time,
			}));
		} catch (error) {
			console.error("Error fetching commits by dev type:", error);
			throw new Error("Failed to fetch commits by dev type");
		}
	}

	async getMonthlyCommits(): Promise<MonthlyCommits[]> {
		try {
			const data = await dbFactory.getClient().select().from(monthlyCommits).orderBy(monthlyCommits.date);

			return data.map((item: any) => ({
				date: formatDateToYYYYMMDD(item.date),
				count: item.count,
			}));
		} catch (error) {
			console.error("Error fetching monthly commits:", error);
			throw new Error("Failed to fetch monthly commits");
		}
	}

	async getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
		try {
			const data = await dbFactory.getClient().select().from(monthlyPRsMerged).orderBy(monthlyPRsMerged.date);

			return data.map((item: any) => ({
				date: formatDateToYYYYMMDD(item.date),
				count: item.count,
			}));
		} catch (error) {
			console.error("Error fetching monthly PRs merged:", error);
			throw new Error("Failed to fetch monthly PRs merged");
		}
	}

	async getDevActivity(): Promise<DevActivity[]> {
		try {
			const data = await dbFactory.getClient().select().from(devActivity).orderBy(devActivity.date);

			return data.map((item: any) => ({
				date: formatDateToYYYYMM(item.date),
				active: item.active,
				churned: item.churned,
				reactivated: item.reactivated,
			}));
		} catch (error) {
			console.error("Error fetching dev activity:", error);
			throw new Error("Failed to fetch dev activity");
		}
	}
}
