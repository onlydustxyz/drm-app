import { dbFactory } from "@/lib/drizzle";
import { repositories } from "@/lib/drizzle/schema/repositories";
import { sql } from "drizzle-orm";

// Service to fetch repository activity data
export async function getRepositoryActivityData() {
  try {
    const activityData = await dbFactory.getClient().execute(sql`
      SELECT 
        r.name AS repository_name,
        DATE_TRUNC('month', c.committed_at) AS month,
        COUNT(c.id) AS commit_count
      FROM 
        indexer_exp.github_commits c
      JOIN 
        indexer_exp.github_repos r ON c.repo_id = r.id
      GROUP BY 
        r.name, DATE_TRUNC('month', c.committed_at)
      ORDER BY 
        r.name, DATE_TRUNC('month', c.committed_at)
    `);

    return activityData.map(row => ({
      repositoryName: row.repository_name,
      month: row.month,
      commitCount: row.commit_count
    }));
  } catch (error) {
    console.error("Error fetching repository activity data:", error);
    return [];
  }
}
