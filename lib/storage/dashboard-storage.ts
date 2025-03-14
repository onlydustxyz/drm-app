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
import { DrizzleDashboardStorage } from "@/lib/storage/adapters/dashboard-storage-drizzle";

/**
 * Interface for accessing dashboard data from storage
 */
export interface DashboardStorage {
	getDashboardData(): Promise<DashboardData>;
	getDashboardKPIs(): Promise<DashboardKPI>;
	getDeveloperActivity(): Promise<DeveloperActivity[]>;
	getCommitsByDevType(): Promise<CommitsByDevType[]>;
	getMonthlyCommits(): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]>;
	getDevActivity(): Promise<DevActivity[]>;
}

// Create a singleton instance using Drizzle implementation
let dashboardStorage: DashboardStorage = new DrizzleDashboardStorage();

export function getDashboardStorage(): DashboardStorage {
	return dashboardStorage;
}

export function setDashboardStorage(storage: DashboardStorage): void {
	dashboardStorage = storage;
}
