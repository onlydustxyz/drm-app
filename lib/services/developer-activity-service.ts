import { dbFactory } from "@/lib/drizzle";
import { segments, segmentRepositories } from "@/lib/drizzle/schema/segments";
import { repositories } from "@/lib/drizzle/schema/repositories";
import { and, eq, inArray, sql } from "drizzle-orm";
import { getAuthenticatedUser } from "./authentication-service";

/**
 * Gets all repository IDs linked to segments belonging to the authenticated user
 * @returns Array of repository IDs
 */
export async function getAuthenticatedUserRepositoryIds(): Promise<number[]> {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return [];
    }

    // Get all segments belonging to the user
    const userSegments = await dbFactory.getClient()
      .select({ id: segments.id })
      .from(segments)
      .where(eq(segments.user_id, parseInt(user.id)));
    
    if (userSegments.length === 0) {
      return [];
    }

    console.log("userSegments", userSegments);
    // Get all repository URLs from those segments
    const segmentIds = userSegments.map(segment => segment.id);
    const segmentRepos = await dbFactory.getClient()
      .select({ repository_url: segmentRepositories.repository_url })
      .from(segmentRepositories)
      .where(inArray(segmentRepositories.segment_id, segmentIds));
    
    if (segmentRepos.length === 0) {
      return [];
    }

    // Extract repo owner and name from URLs
    const repoData = segmentRepos
      .map(repo => parseRepositoryUrl(repo.repository_url))
      .filter(repo => repo !== null) as { owner: string; name: string }[];
    
    if (repoData.length === 0) {
      return [];
    }

    // Query the indexer_exp.github_repos table to get repo_ids
    const repoIds = await dbFactory.getClient().execute(sql`
      SELECT id 
      FROM indexer_exp.github_repos 
      WHERE (owner_login, name) IN (${sql.join(
        repoData.map(repo => sql`(${repo.owner}, ${repo.name})`),
        sql`, `
      )})
    `);

    return repoIds.map(repo => Number(repo.id));
  } catch (error) {
    console.error("Error fetching repository IDs for authenticated user:", error);
    return [];
  }
}

/**
 * Parses a repository URL to extract owner and repository name
 * @param repositoryUrl Repository URL string
 * @returns Object with owner and name, or null if parsing fails
 */
function parseRepositoryUrl(repositoryUrl: string): { owner: string; name: string } | null {
  // If it's a GitHub URL format
  const urlMatch = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      name: urlMatch[2].replace(/\.git$/, ''),
    };
  }
  
  // If it's in the format "owner/name"
  const simpleMatch = repositoryUrl.match(/^([^\/]+)\/([^\/]+)$/);
  if (simpleMatch) {
    return {
      owner: simpleMatch[1],
      name: simpleMatch[2].replace(/\.git$/, ''),
    };
  }
  
  return null;
} 