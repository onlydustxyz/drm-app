import { createClient } from "@supabase/supabase-js";
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
} from "../../services/dashboard-service";
import { Database } from "../../supabase/database.types";
import { DashboardStorage } from "../dashboard-storage";

/**
 * Supabase implementation of the DashboardStorage interface
 */
export class SupabaseDashboardStorage implements DashboardStorage {
	private supabase;

	constructor(supabaseUrl: string, supabaseKey: string) {
		this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
	}

	async getDashboardData(): Promise<DashboardData> {
		// We'll fetch all the different parts of the dashboard data and combine them
		const [
			kpis,
			developerActivity,
			developersByChain,
			developerLocations,
			commitsByDevType,
			monthlyCommits,
			monthlyPRsMerged,
			devActivity,
		] = await Promise.all([
			this.getDashboardKPIs(),
			this.getDeveloperActivity(),
			this.getDevelopersByChain(),
			this.getDeveloperLocations(),
			this.getCommitsByDevType(),
			this.getMonthlyCommits(),
			this.getMonthlyPRsMerged(),
			this.getDevActivity(),
		]);

		return {
			kpis,
			developerActivity,
			developersByChain,
			developerLocations,
			commitsByDevType,
			monthlyCommits,
			monthlyPRsMerged,
			devActivity,
		};
	}

	async getDashboardKPIs(): Promise<DashboardKPI> {
		const { data, error } = await this.supabase
			.from("dashboard_kpis")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			console.error("Error fetching dashboard KPIs:", error);
			throw new Error("Failed to fetch dashboard KPIs");
		}

		return {
			fullTimeDevs: data.full_time_devs,
			fullTimeDevsGrowth: data.full_time_devs_growth,
			monthlyActiveDevs: data.monthly_active_devs,
			monthlyActiveDevsGrowth: data.monthly_active_devs_growth,
			totalRepos: data.total_repos,
			totalReposGrowth: data.total_repos_growth,
			totalCommits: data.total_commits,
			totalCommitsGrowth: data.total_commits_growth,
			totalProjects: data.total_projects,
			totalProjectsGrowth: data.total_projects_growth,
		};
	}

	async getDeveloperActivity(): Promise<DeveloperActivity[]> {
		const { data, error } = await this.supabase
			.from("developer_activity")
			.select("*")
			.order("name", { ascending: true });

		if (error) {
			console.error("Error fetching developer activity:", error);
			throw new Error("Failed to fetch developer activity");
		}

		return data.map((item) => ({
			name: item.name,
			fullTime: item.full_time,
			partTime: item.part_time,
			onTime: item.on_time,
		}));
	}

	async getDevelopersByChain(): Promise<DevelopersByChain[]> {
		const { data, error } = await this.supabase
			.from("developers_by_chain")
			.select("*")
			.order("date", { ascending: true });

		if (error) {
			console.error("Error fetching developers by chain:", error);
			throw new Error("Failed to fetch developers by chain");
		}

		return data.map((item) => ({
			date: item.date,
			singleChain: item.single_chain,
			multiChain: item.multi_chain,
		}));
	}

	async getDeveloperLocations(): Promise<DeveloperLocation[]> {
		const { data, error } = await this.supabase
			.from("developer_locations")
			.select("*")
			.order("count", { ascending: false });

		if (error) {
			console.error("Error fetching developer locations:", error);
			throw new Error("Failed to fetch developer locations");
		}

		return data.map((item) => ({
			country: item.country,
			count: item.count,
			latitude: item.latitude,
			longitude: item.longitude,
		}));
	}

	async getCommitsByDevType(): Promise<CommitsByDevType[]> {
		const { data, error } = await this.supabase
			.from("commits_by_dev_type")
			.select("*")
			.order("name", { ascending: true });

		if (error) {
			console.error("Error fetching commits by dev type:", error);
			throw new Error("Failed to fetch commits by dev type");
		}

		return data.map((item) => ({
			name: item.name,
			fullTime: item.full_time,
			partTime: item.part_time,
			onTime: item.on_time,
		}));
	}

	async getMonthlyCommits(): Promise<MonthlyCommits[]> {
		const { data, error } = await this.supabase
			.from("monthly_commits")
			.select("*")
			.order("date", { ascending: true });

		if (error) {
			console.error("Error fetching monthly commits:", error);
			throw new Error("Failed to fetch monthly commits");
		}

		return data.map((item) => ({
			date: item.date,
			count: item.count,
		}));
	}

	async getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
		const { data, error } = await this.supabase
			.from("monthly_prs_merged")
			.select("*")
			.order("date", { ascending: true });

		if (error) {
			console.error("Error fetching monthly PRs merged:", error);
			throw new Error("Failed to fetch monthly PRs merged");
		}

		return data.map((item) => ({
			date: item.date,
			count: item.count,
		}));
	}

	async getDevActivity(): Promise<DevActivity[]> {
		const { data, error } = await this.supabase.from("dev_activity").select("*").order("date", { ascending: true });

		if (error) {
			console.error("Error fetching dev activity:", error);
			throw new Error("Failed to fetch dev activity");
		}

		return data.map((item) => ({
			date: item.date,
			active: item.active,
			churned: item.churned,
			reactivated: item.reactivated,
		}));
	}
}

// Export a factory function to create the SupabaseDashboardStorage
export function createSupabaseDashboardStorage(supabaseUrl: string, supabaseKey: string): DashboardStorage {
	return new SupabaseDashboardStorage(supabaseUrl, supabaseKey);
}
