import {dbFactory} from "@/lib/drizzle";
import {
	CommitsByDevType,
	DashboardKPI,
	DevActivity,
	DeveloperActivity,
	DeveloperLocation,
	MonthlyCommits,
	MonthlyPRsMerged,
} from "@/lib/services/dashboard-service";
import {DashboardStorage} from "@/lib/storage/dashboard-storage";
import {desc} from "drizzle-orm";

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
	if (typeof date === 'string' && date.includes('T')) {
		return date.slice(0, 7);
	}
	return String(date);
}

// Helper function to calculate growth percentage
function calculateGrowthPercentage(current: number, previous: number): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return ((current - previous) / previous) * 100;
}

/**
 * Interface for monthly commit counts by developer type
 */
export interface MonthlyCommitsByDevType {
	month: Date;
	total_commit_count: number;
	full_time_dev_commit_count: number;
	part_time_dev_commit_count: number;
	one_time_dev_commit_count: number;
}

/**
 * Drizzle ORM implementation of the DashboardStorage interface
 */
export class DrizzleDashboardStorage implements DashboardStorage {
	constructor() {
		// No additional setup needed for Drizzle as it uses the singleton db instance
	}

	async getDashboardKPIs(repoIds: number[] = []): Promise<DashboardKPI> {
		try {
			const query = `
				with monthly_user_types as materialized (SELECT u.id                              AS user_id,										
                                                date_trunc('month', c.created_at) AS month,
                                                case
                                                    when count(DISTINCT date_trunc('day', c.created_at)) = 1 THEN 'ONE_TIME'::user_type
                                                    when count(DISTINCT date_trunc('day', c.created_at)) < 10 THEN 'PART_TIME'::user_type
                                                    ELSE 'FULL_TIME'::user_type
                                                    end                           AS type
                                         FROM indexer_exp.github_accounts u
                                                  JOIN indexer_exp.github_commits c ON u.id = c.author_id
                                         WHERE u."type" = 'USER'
                                           and (${repoIds.length === 0 ? 'true' : `c.repo_id = ANY(ARRAY[${repoIds.join(',')}])`})
                                         GROUP BY 1, 2)
				select count(distinct mut.user_id) filter ( where mut.type = 'FULL_TIME' and mut.month = date_trunc('month', now()))                      as current_month_full_time_dev_count,
       				count(distinct mut.user_id) filter ( where mut.type = 'FULL_TIME' and mut.month = date_trunc('month', now() - interval '1 month')) as last_month_full_time_dev_count,
       				count(distinct mut.user_id) filter ( where mut.month = date_trunc('month', now()))                                                 as current_month_active_dev_count,
       				count(distinct mut.user_id) filter ( where mut.month = date_trunc('month', now() - interval '1 month'))                            as last_month_active_dev_count
				from monthly_user_types mut;
			`;

			const result = await dbFactory.getClient().execute(query);
			const data = result[0];

			if (!data) {
				return {
					fullTimeDevs: 0,
					fullTimeDevsGrowth: 0,
					monthlyActiveDevs: 0,
					monthlyActiveDevsGrowth: 0,
					totalRepos: 0,
					totalReposGrowth: 0,
					totalCommits: 0,
					totalCommitsGrowth: 0,
				};
			}

			// Calculate growth percentages
			const fullTimeDevsGrowth = calculateGrowthPercentage(
				Number(data.current_month_full_time_dev_count || 0),
				Number(data.last_month_full_time_dev_count || 0)
			);

			const monthlyActiveDevsGrowth = calculateGrowthPercentage(
				Number(data.current_month_active_dev_count || 0),
				Number(data.last_month_active_dev_count || 0)
			);

			// Get total commits data
			const commitsQuery = `
				select count(gc.sha) filter ( where date_trunc('month', gc.created_at) = date_trunc('month', now())) as total_commits,
					   count(gc.sha) filter ( where date_trunc('month', gc.created_at) = date_trunc('month', now() - interval '1 month')) as total_commits_last_month
				from indexer_exp.github_commits gc
				where gc.repo_id = any(array[${repoIds.join(',')}])
			`;
			
			const commitsResult = await dbFactory.getClient().execute(commitsQuery);
			const commitsData = commitsResult[0];

			const totalCommitsGrowth = calculateGrowthPercentage(
				Number(commitsData.total_commits || 0),
				Number(commitsData.total_commits_last_month || 0)
			);

			return {
				fullTimeDevs: Number(data.current_month_full_time_dev_count || 0),
				fullTimeDevsGrowth: fullTimeDevsGrowth,
				monthlyActiveDevs: Number(data.current_month_active_dev_count || 0),
				monthlyActiveDevsGrowth: monthlyActiveDevsGrowth,
				totalRepos: repoIds.length,
				totalReposGrowth: Number(data.total_repos_growth || 0),
				totalCommits: Number(commitsData.total_commits || 0),
				totalCommitsGrowth: totalCommitsGrowth,
			};
		} catch (error) {
			console.error("Error fetching dashboard KPIs:", error);
			throw new Error("Failed to fetch dashboard KPIs");
		}
	}

	async getDeveloperActivity(repoIds: number[] = []): Promise<DeveloperActivity[]> {
		try {

			// Use the new SQL query with repository filters
			let query = `
				with monthly_user_types as materialized (
					SELECT 
						u.id AS user_id,
						date_trunc('month', c.created_at) AS month,
						case
							when count(DISTINCT date_trunc('day', c.created_at)) = 1 THEN 'ONE_TIME'::user_type
							when count(DISTINCT date_trunc('day', c.created_at)) < 10 THEN 'PART_TIME'::user_type
							ELSE 'FULL_TIME'::user_type
						end AS type
					FROM indexer_exp.github_accounts u
						JOIN indexer_exp.github_commits c ON u.id = c.author_id
					WHERE u."type" = 'USER'
						and (c.repo_id = ANY(ARRAY[${repoIds.join(',')}]))
					GROUP BY 1, 2
				)
				select 
					mut.month as name,
					count(distinct mut.user_id) filter ( where mut.type = 'FULL_TIME') as full_time,
					count(distinct mut.user_id) filter ( where mut.type = 'PART_TIME') as part_time,
					count(distinct mut.user_id) filter ( where mut.type = 'ONE_TIME') as on_time
				from monthly_user_types mut
				where mut.month > now() - interval '1 year'
				group by mut.month
				order by mut.month
			`;

			const result = await dbFactory.getClient().execute(query);

			return result.map((item: any) => ({
				name: formatDateToYYYYMM(item.name),
				fullTime: Number(item.full_time || 0),
				partTime: Number(item.part_time || 0),
				onTime: Number(item.on_time || 0),
			}));
		} catch (error) {
			console.error("Error fetching developer activity:", error);
			throw new Error("Failed to fetch developer activity");
		}
	}

	async getCommitsByDevType(repoIds: number[] = []): Promise<CommitsByDevType[]> {
		try {
			// Use raw SQL query with repository filters
			const query = `
				with monthly_user_types as materialized (
					SELECT 
						u.id AS user_id,
						date_trunc('month', c.created_at) AS month,
						case
							when count(DISTINCT date_trunc('day', c.created_at)) = 1 THEN 'ONE_TIME'::user_type
							when count(DISTINCT date_trunc('day', c.created_at)) < 10 THEN 'PART_TIME'::user_type
							ELSE 'FULL_TIME'::user_type
						end AS type,
						array_agg(distinct c.repo_id) as repo_ids
					FROM indexer_exp.github_accounts u
						JOIN indexer_exp.github_commits c ON u.id = c.author_id
					WHERE u."type" = 'USER'
						and (${repoIds.length === 0 ? 'true' : `c.repo_id = ANY(ARRAY[${repoIds.join(',')}])`})
					GROUP BY u.id, date_trunc('month', c.created_at)
				)
				select 
					mut.month as month,
					count(distinct c.sha) as total_commit_count,
					count(distinct c.sha) filter ( where mut.type = 'FULL_TIME') as full_time_dev_commit_count,
					count(distinct c.sha) filter ( where mut.type = 'PART_TIME') as part_time_dev_commit_count,
					count(distinct c.sha) filter ( where mut.type = 'ONE_TIME') as one_time_dev_commit_count
				from monthly_user_types mut
					join indexer_exp.github_commits c on date_trunc('month', c.created_at) = mut.month and
														c.author_id = mut.user_id and
														c.repo_id = any (mut.repo_ids)
				where mut.month > now() - interval '1 year'
				group by mut.month
				order by mut.month
			`;

			const result = await dbFactory.getClient().execute(query);

			// Convert the raw result to the expected format
			return result.map((item: any) => ({
				name: formatDateToYYYYMM(item.month),
				fullTime: Number(item.full_time_dev_commit_count || 0),
				partTime: Number(item.part_time_dev_commit_count || 0),
				onTime: Number(item.one_time_dev_commit_count || 0),
			}));
		} catch (error) {
			console.error("Error fetching commits by dev type:", error);
			throw new Error("Failed to fetch commits by dev type");
		}
	}

	async getMonthlyCommits(repoIds: number[] = []): Promise<MonthlyCommits[]> {
		try {
			const query = `
				SELECT date_trunc('month', c.created_at) AS month,
				       count(distinct c.sha) as commit_count
				FROM indexer_exp.github_accounts u
				         JOIN indexer_exp.github_commits c ON u.id = c.author_id
				WHERE u."type" = 'USER'
				  and (${repoIds.length === 0 ? 'true' : `c.repo_id = ANY(ARRAY[${repoIds.join(',')}])`})
				  and c.created_at > now() - interval '1 year'
				GROUP BY 1
				order by 1;
			`;

			const result = await dbFactory.getClient().execute(query);

			return result.map((item: any) => ({
				date: formatDateToYYYYMMDD(item.month),
				count: Number(item.commit_count || 0),
			}));
		} catch (error) {
			console.error("Error fetching monthly commits:", error);
			throw new Error("Failed to fetch monthly commits");
		}
	}

	async getMonthlyPRsMerged(repoIds: number[] = []): Promise<MonthlyPRsMerged[]> {
		try {
			const query = `
				SELECT date_trunc('month', pr.merged_at) AS month,
				       count(distinct pr.id) as commit_count
				FROM indexer_exp.github_accounts u
				         JOIN indexer_exp.github_pull_requests pr ON u.id = pr.author_id
				WHERE u."type" = 'USER'
				  and (${repoIds.length === 0 ? 'true' : `pr.repo_id = ANY(ARRAY[${repoIds.join(',')}])`})
				  and pr.status = 'MERGED'
				  and pr.merged_at > now() - interval '1 year'
				GROUP BY 1
				order by 1;
			`;

			const result = await dbFactory.getClient().execute(query);

			return result.map((item: any) => ({
				date: formatDateToYYYYMMDD(item.month),
				count: Number(item.commit_count || 0),
			}));
		} catch (error) {
			console.error("Error fetching monthly PRs merged:", error);
			throw new Error("Failed to fetch monthly PRs merged");
		}
	}

	async getDevActivity(repoIds: string[] = []): Promise<DevActivity[]> {
		try {
			const query = `
				WITH all_months AS (SELECT generate_series(date_trunc('month', now() - interval '1 year'), now(), interval '1 month') as month),

				monthly_active_devs AS (
					-- Get all months when developers committed code
					SELECT u.id                              AS user_id,
						date_trunc('month', c.created_at) AS month
					FROM indexer_exp.github_accounts u
							JOIN indexer_exp.github_commits c ON u.id = c.author_id
					WHERE u."type" = 'USER'
						AND (${repoIds?.length ? `c.repo_id = ANY(ARRAY[${repoIds.join(',')}])` : 'true'})
					GROUP BY u.id, date_trunc('month', c.created_at)),

				monthly_status AS (
					-- For each developer, get their history with current, previous, and first month of activity
					SELECT month,
						user_id,
						LAG(month, 1) OVER (PARTITION BY user_id ORDER BY month)      AS prev_month,
						FIRST_VALUE(month) OVER (PARTITION BY user_id ORDER BY month) AS first_month
					FROM monthly_active_devs),
				dev_activity AS (
					-- For each month, determine the status of each developer who ever committed
					SELECT am.month,
						ms.user_id,
						CASE
							WHEN ms.month = am.month AND ms.first_month = am.month THEN 'NEW'::activity_status
							WHEN ms.month = am.month AND date_trunc('month', ms.prev_month + INTERVAL '1 month') = am.month THEN 'ACTIVE'::activity_status
							WHEN ms.month = am.month THEN 'REACTIVATED'::activity_status
							WHEN date_trunc('month', ms.month + INTERVAL '1 month') = am.month
								AND ms.user_id NOT IN (SELECT user_id
													FROM monthly_status
													WHERE month = am.month) THEN 'CHURNED'::activity_status
							END AS status
					FROM all_months am
							LEFT JOIN monthly_status ms ON ms.month = am.month OR
														date_trunc('month', ms.month + INTERVAL '1 month') = am.month
					WHERE ms.user_id IS NOT NULL)
				-- Final aggregation by month with all metrics
				SELECT month,
					COUNT(DISTINCT CASE status WHEN 'NEW' THEN user_id END)                               AS new_dev_count,
					COUNT(DISTINCT CASE status WHEN 'CHURNED' THEN user_id END)                           AS churned_dev_count,
					COUNT(DISTINCT CASE status WHEN 'REACTIVATED' THEN user_id END)                       AS reactivated_dev_count,
					COUNT(DISTINCT CASE status WHEN 'ACTIVE' THEN user_id END)                            AS active_dev_count,
					COUNT(DISTINCT CASE WHEN status IN ('NEW', 'ACTIVE', 'REACTIVATED') THEN user_id END) AS total_active_devs
				FROM dev_activity
				GROUP BY month
				ORDER BY month;
			`;

			const data = await dbFactory.getClient().execute(query);
			
			return data.map((item: any) => ({
				date: formatDateToYYYYMM(item.month),
				active: item.active_dev_count,
				churned: item.churned_dev_count,
				reactivated: item.reactivated_dev_count
			}));
		} catch (error) {
			console.error("Error fetching dev activity:", error);
			throw new Error("Failed to fetch dev activity");
		}
	}

	async getDevelopersByCountry(repoIds: number[] = []): Promise<DeveloperLocation[]> {
		try {
			const query = `
				SELECT ug.country_code      AS country_code,
				       count(distinct u.id) as dev_count
				FROM indexer_exp.github_accounts u
				         JOIN indexer_exp.github_commits c ON u.id = c.author_id
				         LEFT JOIN indexer_exp.user_geolocations ug on u.id = ug.user_id
				WHERE u."type" = 'USER'
				  AND (${repoIds?.length ? `c.repo_id = ANY(ARRAY[${repoIds.join(',')}])` : 'true'})
				  and c.created_at > now() - interval '1 year'
				GROUP BY 1
				order by 1;
			`;

			const result = await dbFactory.getClient().execute(query);
			
			return result.map((item: any) => ({
				country: String(item.country || ''),
				count: Number(item.contributor_count || 0),
				latitude: Number(item.latitude || 0),
				longitude: Number(item.longitude || 0),
			}));
		} catch (error) {
			console.error("Error fetching developers by country:", error);
			throw new Error("Failed to fetch developers by country");
		}
	}
}
