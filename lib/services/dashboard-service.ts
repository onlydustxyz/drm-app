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

// Dashboard service interface
export interface DashboardService {
	getDashboardKPIs(repoIds?: number[]): Promise<DashboardKPI>;
	getDeveloperActivity(repoIds: number[]): Promise<DeveloperActivity[]>;
	getCommitsByDevType(repoIds?: number[]): Promise<CommitsByDevType[]>;
	getMonthlyCommits(repoIds?: number[]): Promise<MonthlyCommits[]>;
	getMonthlyPRsMerged(repoIds?: number[]): Promise<MonthlyPRsMerged[]>;
	getDevActivity(repoIds?: string[]): Promise<DevActivity[]>;
}

export async function getDashboardKPIs(repoIds: number[] = []): Promise<DashboardKPI> {
	return getDashboardStorage().getDashboardKPIs(repoIds);
}

export async function getDeveloperActivity(repoIds: number[]): Promise<DeveloperActivity[]> {
	return getDashboardStorage().getDeveloperActivity(repoIds);
}

export async function getCommitsByDevType(repoIds: number[] = []): Promise<CommitsByDevType[]> {
	return getDashboardStorage().getCommitsByDevType(repoIds);
}

export async function getMonthlyCommits(repoIds: number[] = []): Promise<MonthlyCommits[]> {
	return getDashboardStorage().getMonthlyCommits(repoIds);
}

export async function getMonthlyPRsMerged(repoIds: number[] = []): Promise<MonthlyPRsMerged[]> {
	return getDashboardStorage().getMonthlyPRsMerged(repoIds);
}

export async function getDevActivity(repoIds?: string[]): Promise<DevActivity[]> {
	return getDashboardStorage().getDevActivity(repoIds);
}
