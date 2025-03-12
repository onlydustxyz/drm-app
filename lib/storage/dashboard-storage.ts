import {
	CommitsByDevType,
	DashboardData,
	DashboardKPI,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	DevelopersByChain,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import { SupabaseDashboardStorage } from "@/lib/storage/adapters/dashboard-storage-supabase";

/**
 * Interface for accessing dashboard data from storage
 * This will be implemented later
 */
export interface DashboardStorage {
	getDashboardData(): Promise<DashboardData>;
	getDashboardKPIs(): Promise<DashboardKPI>;
	getDeveloperActivity(): Promise<DeveloperActivity[]>;
	getDevelopersByChain(): Promise<DevelopersByChain[]>;
	getDeveloperLocations(): Promise<DeveloperLocation[]>;
	getCommitsByDevType(): Promise<CommitsByDevType[]>;
	getMonthlyCommits(): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]>;
	getDevActivity(): Promise<DevActivity[]>;
}

// Create a singleton instance that will be replaced with the real implementation later
let dashboardStorage: DashboardStorage = new SupabaseDashboardStorage(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function getDashboardStorage(): DashboardStorage {
	return dashboardStorage;
}

export function setDashboardStorage(storage: DashboardStorage): void {
	dashboardStorage = storage;
}
