import { DashboardStorage, getDashboardStorage } from "../storage/dashboard-storage";

// Dashboard data types
export interface DashboardKPI {
	fullTimeDevs: number;
	fullTimeDevsGrowth: number;
	monthlyActiveDevs: number;
	monthlyActiveDevsGrowth: number;
	totalRepos: number;
	totalReposGrowth: number;
	totalCommits: number;
	totalCommitsGrowth: number;
	totalProjects: number;
	totalProjectsGrowth: number;
}

export interface DeveloperActivity {
	name: string;
	fullTime: number;
	partTime: number;
	onTime: number;
}

export interface DevelopersByChain {
	date: string;
	singleChain: number;
	multiChain: number;
}

export interface DeveloperLocation {
	country: string;
	count: number;
	latitude: number;
	longitude: number;
}

export interface CommitsByDevType {
	name: string;
	fullTime: number;
	partTime: number;
	onTime: number;
}

export interface MonthlyCommits {
	date: string;
	count: number;
}

export interface MonthlyPRsMerged {
	date: string;
	count: number;
}

export interface DevActivity {
	date: string;
	active: number;
	churned: number;
	reactivated: number;
}

export interface DashboardData {
	kpis: DashboardKPI;
	developerActivity: DeveloperActivity[];
	developerLocations: DeveloperLocation[];
	commitsByDevType: CommitsByDevType[];
	monthlyCommits: MonthlyCommits[];
	monthlyPRsMerged: MonthlyPRsMerged[];
	devActivity: DevActivity[];
}

// Mock data implementation
const mockDashboardData: DashboardData = {
	kpis: {
		fullTimeDevs: 46,
		fullTimeDevsGrowth: 3.5,
		monthlyActiveDevs: 128,
		monthlyActiveDevsGrowth: 7.2,
		totalRepos: 87,
		totalReposGrowth: 4.3,
		totalCommits: 12547,
		totalCommitsGrowth: 15.8,
		totalProjects: 32,
		totalProjectsGrowth: 6.7,
	},
	developerActivity: [
		{ name: "Jan", fullTime: 35, partTime: 30, onTime: 20 },
		{ name: "Feb", fullTime: 38, partTime: 32, onTime: 22 },
		{ name: "Mar", fullTime: 40, partTime: 35, onTime: 22 },
		{ name: "Apr", fullTime: 42, partTime: 38, onTime: 25 },
		{ name: "May", fullTime: 45, partTime: 40, onTime: 25 },
		{ name: "Jun", fullTime: 42, partTime: 38, onTime: 22 },
		{ name: "Jul", fullTime: 44, partTime: 40, onTime: 24 },
		{ name: "Aug", fullTime: 48, partTime: 42, onTime: 25 },
		{ name: "Sep", fullTime: 50, partTime: 45, onTime: 25 },
		{ name: "Oct", fullTime: 52, partTime: 48, onTime: 25 },
		{ name: "Nov", fullTime: 50, partTime: 47, onTime: 25 },
		{ name: "Dec", fullTime: 53, partTime: 50, onTime: 25 },
	],
	developerLocations: [
		{ country: "United States", count: 45, latitude: 37.0902, longitude: -95.7129 },
		{ country: "Germany", count: 32, latitude: 51.1657, longitude: 10.4515 },
		{ country: "United Kingdom", count: 28, latitude: 55.3781, longitude: -3.436 },
		{ country: "India", count: 25, latitude: 20.5937, longitude: 78.9629 },
		{ country: "Canada", count: 22, latitude: 56.1304, longitude: -106.3468 },
		{ country: "France", count: 18, latitude: 46.2276, longitude: 2.2137 },
		{ country: "Australia", count: 15, latitude: -25.2744, longitude: 133.7751 },
		{ country: "Brazil", count: 12, latitude: -14.235, longitude: -51.9253 },
		{ country: "Japan", count: 10, latitude: 36.2048, longitude: 138.2529 },
		{ country: "China", count: 8, latitude: 35.8617, longitude: 104.1954 },
	],
	commitsByDevType: [
		{ name: "Jan", fullTime: 1200, partTime: 800, onTime: 300 },
		{ name: "Feb", fullTime: 1300, partTime: 850, onTime: 320 },
		{ name: "Mar", fullTime: 1400, partTime: 900, onTime: 350 },
		{ name: "Apr", fullTime: 1350, partTime: 880, onTime: 340 },
		{ name: "May", fullTime: 1500, partTime: 950, onTime: 380 },
		{ name: "Jun", fullTime: 1450, partTime: 930, onTime: 370 },
		{ name: "Jul", fullTime: 1550, partTime: 980, onTime: 400 },
		{ name: "Aug", fullTime: 1600, partTime: 1000, onTime: 420 },
		{ name: "Sep", fullTime: 1650, partTime: 1050, onTime: 450 },
		{ name: "Oct", fullTime: 1700, partTime: 1100, onTime: 480 },
		{ name: "Nov", fullTime: 1750, partTime: 1150, onTime: 500 },
		{ name: "Dec", fullTime: 1800, partTime: 1200, onTime: 520 },
	],
	monthlyCommits: [
		{ date: "2023-01", count: 2300 },
		{ date: "2023-02", count: 2470 },
		{ date: "2023-03", count: 2650 },
		{ date: "2023-04", count: 2570 },
		{ date: "2023-05", count: 2830 },
		{ date: "2023-06", count: 2750 },
		{ date: "2023-07", count: 2930 },
		{ date: "2023-08", count: 3020 },
		{ date: "2023-09", count: 3150 },
		{ date: "2023-10", count: 3280 },
		{ date: "2023-11", count: 3400 },
		{ date: "2023-12", count: 3520 },
		{ date: "2024-01", count: 3650 },
		{ date: "2024-02", count: 3780 },
		{ date: "2024-03", count: 3900 },
	],
	monthlyPRsMerged: [
		{ date: "2023-01", count: 450 },
		{ date: "2023-02", count: 480 },
		{ date: "2023-03", count: 520 },
		{ date: "2023-04", count: 500 },
		{ date: "2023-05", count: 550 },
		{ date: "2023-06", count: 530 },
		{ date: "2023-07", count: 580 },
		{ date: "2023-08", count: 600 },
		{ date: "2023-09", count: 630 },
		{ date: "2023-10", count: 650 },
		{ date: "2023-11", count: 680 },
		{ date: "2023-12", count: 700 },
		{ date: "2024-01", count: 730 },
		{ date: "2024-02", count: 760 },
		{ date: "2024-03", count: 790 },
	],
	devActivity: [
		{ date: "2023-01", active: 85, churned: 12, reactivated: 5 },
		{ date: "2023-02", active: 90, churned: 10, reactivated: 7 },
		{ date: "2023-03", active: 95, churned: 8, reactivated: 6 },
		{ date: "2023-04", active: 100, churned: 9, reactivated: 8 },
		{ date: "2023-05", active: 105, churned: 7, reactivated: 9 },
		{ date: "2023-06", active: 110, churned: 8, reactivated: 7 },
		{ date: "2023-07", active: 115, churned: 6, reactivated: 8 },
		{ date: "2023-08", active: 120, churned: 7, reactivated: 10 },
		{ date: "2023-09", active: 125, churned: 5, reactivated: 9 },
		{ date: "2023-10", active: 130, churned: 6, reactivated: 11 },
		{ date: "2023-11", active: 135, churned: 4, reactivated: 10 },
		{ date: "2023-12", active: 140, churned: 5, reactivated: 12 },
		{ date: "2024-01", active: 145, churned: 6, reactivated: 11 },
		{ date: "2024-02", active: 150, churned: 5, reactivated: 13 },
		{ date: "2024-03", active: 155, churned: 4, reactivated: 12 },
	],
};

// Dashboard service interface
export interface DashboardService {
	getDashboardData(): Promise<DashboardData>;
	getDashboardKPIs(): Promise<DashboardKPI>;
	getDeveloperActivity(): Promise<DeveloperActivity[]>;
	getDeveloperLocations(): Promise<DeveloperLocation[]>;
	getCommitsByDevType(): Promise<CommitsByDevType[]>;
	getMonthlyCommits(): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]>;
	getDevActivity(): Promise<DevActivity[]>;
}

// Mock implementation of the dashboard service
export class MockDashboardService implements DashboardService {
	async getDashboardData(): Promise<DashboardData> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Return mock data for now
		return mockDashboardData;
	}

	async getDashboardKPIs(): Promise<DashboardKPI> {
		const data = await this.getDashboardData();
		return data.kpis;
	}

	async getDeveloperActivity(): Promise<DeveloperActivity[]> {
		const data = await this.getDashboardData();
		return data.developerActivity;
	}

	async getDeveloperLocations(): Promise<DeveloperLocation[]> {
		const data = await this.getDashboardData();
		return data.developerLocations;
	}

	async getCommitsByDevType(): Promise<CommitsByDevType[]> {
		const data = await this.getDashboardData();
		return data.commitsByDevType;
	}

	async getMonthlyCommits(): Promise<MonthlyCommits[]> {
		const data = await this.getDashboardData();
		return data.monthlyCommits;
	}

	async getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
		const data = await this.getDashboardData();
		return data.monthlyPRsMerged;
	}

	async getDevActivity(): Promise<DevActivity[]> {
		const data = await this.getDashboardData();
		return data.devActivity;
	}
}

// HTTP implementation of the dashboard service
export class HttpDashboardService implements DashboardService {
	private storage: DashboardStorage;

	constructor() {
		this.storage = getDashboardStorage();
	}

	async getDashboardData(): Promise<DashboardData> {
		return this.storage.getDashboardData();
	}

	async getDashboardKPIs(): Promise<DashboardKPI> {
		return this.storage.getDashboardKPIs();
	}

	async getDeveloperActivity(): Promise<DeveloperActivity[]> {
		return this.storage.getDeveloperActivity();
	}

	async getDeveloperLocations(): Promise<DeveloperLocation[]> {
		return this.storage.getDeveloperLocations();
	}

	async getCommitsByDevType(): Promise<CommitsByDevType[]> {
		return this.storage.getCommitsByDevType();
	}

	async getMonthlyCommits(): Promise<MonthlyCommits[]> {
		return this.storage.getMonthlyCommits();
	}

	async getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
		return this.storage.getMonthlyPRsMerged();
	}

	async getDevActivity(): Promise<DevActivity[]> {
		return this.storage.getDevActivity();
	}
}

// Create a singleton instance of the service
const dashboardService: DashboardService = new HttpDashboardService();

// Export functions that use the service for backward compatibility
export async function getDashboardData(): Promise<DashboardData> {
	return dashboardService.getDashboardData();
}

export async function getDashboardKPIs(): Promise<DashboardKPI> {
	return dashboardService.getDashboardKPIs();
}

export async function getDeveloperActivity(): Promise<DeveloperActivity[]> {
	return dashboardService.getDeveloperActivity();
}

export async function getDeveloperLocations(): Promise<DeveloperLocation[]> {
	return dashboardService.getDeveloperLocations();
}

export async function getCommitsByDevType(): Promise<CommitsByDevType[]> {
	return dashboardService.getCommitsByDevType();
}

export async function getMonthlyCommits(): Promise<MonthlyCommits[]> {
	return dashboardService.getMonthlyCommits();
}

export async function getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
	return dashboardService.getMonthlyPRsMerged();
}

export async function getDevActivity(): Promise<DevActivity[]> {
	return dashboardService.getDevActivity();
}
