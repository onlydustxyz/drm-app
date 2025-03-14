import {
	CommitsByDevType,
	DashboardKPI,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import {DrizzleDashboardStorage} from "@/lib/storage/adapters/dashboard-storage-drizzle";

/**
 * Interface for accessing dashboard data from storage
 */
export interface DashboardStorage {
	getDashboardKPIs(repoIds?: number[]): Promise<DashboardKPI>;
	getDeveloperActivity(repoIds?: number[]): Promise<DeveloperActivity[]>;
	getCommitsByDevType(repoIds?: number[]): Promise<CommitsByDevType[]>;
	getMonthlyCommits(repoIds?: number[]): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(repoIds?: number[]): Promise<MonthlyPRsMerged[]>;
	getDevActivity(repoIds?: string[]): Promise<DevActivity[]>;
	getDevelopersByCountry(repoIds?: number[]): Promise<DeveloperLocation[]>;
}

// Create a singleton instance using Drizzle implementation
let dashboardStorage: DashboardStorage = new DrizzleDashboardStorage();

export function getDashboardStorage(): DashboardStorage {
	return dashboardStorage;
}

export function setDashboardStorage(storage: DashboardStorage): void {
	dashboardStorage = storage;
}
