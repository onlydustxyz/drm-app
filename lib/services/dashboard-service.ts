import {getDashboardStorage} from "../storage/dashboard-storage";

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
	commitsByDevType: CommitsByDevType[];
	monthlyCommits: MonthlyCommits[];
	monthlyPRsMerged: MonthlyPRsMerged[];
	devActivity: DevActivity[];
}

// Dashboard service interface
export interface DashboardService {
	getDashboardData(): Promise<DashboardData>;
	getDashboardKPIs(): Promise<DashboardKPI>;
	getDeveloperActivity(repoIds: number[]): Promise<DeveloperActivity[]>;
	getCommitsByDevType(): Promise<CommitsByDevType[]>;
	getMonthlyCommits(): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]>;
	getDevActivity(): Promise<DevActivity[]>;
}


// Export functions that use the storage directly
export async function getDashboardData(): Promise<DashboardData> {
	return getDashboardStorage().getDashboardData();
}

export async function getDashboardKPIs(): Promise<DashboardKPI> {
	return getDashboardStorage().getDashboardKPIs();
}

export async function getDeveloperActivity(repoIds: number[]): Promise<DeveloperActivity[]> {
	return getDashboardStorage().getDeveloperActivity(repoIds);
}

export async function getCommitsByDevType(): Promise<CommitsByDevType[]> {
	return getDashboardStorage().getCommitsByDevType();
}

export async function getMonthlyCommits(): Promise<MonthlyCommits[]> {
	return getDashboardStorage().getMonthlyCommits();
}

export async function getMonthlyPRsMerged(): Promise<MonthlyPRsMerged[]> {
	return getDashboardStorage().getMonthlyPRsMerged();
}

export async function getDevActivity(): Promise<DevActivity[]> {
	return getDashboardStorage().getDevActivity();
}
