import { dbFactory } from "@/lib/drizzle";
import { and, eq, sql } from "drizzle-orm";
import { Segment } from "@/lib/services/segments-service";
import { SegmentsStorage } from "@/lib/storage/segments-storage";
import { segmentRepositories, segments, segmentsContributors } from "@/lib/drizzle/schema/segments";

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

/**
 * Creates a repository indexing job for the public events
 * @param owner Repository owner
 * @param name Repository name
 */
async function createRepositoryIndexingJob(owner: string, name: string): Promise<void> {
    try {
        // Insert into the indexer.repo_public_events_indexing_jobs table
        // Using raw SQL here since we don't have a Drizzle schema for this table
        await dbFactory.getClient().execute(sql`
            INSERT INTO indexer.repo_public_events_indexing_jobs 
            (repo_owner, repo_name, status) 
            VALUES (${owner}, ${name}, 'PENDING')
            ON CONFLICT (repo_owner, repo_name) DO NOTHING
        `);
        console.log(`Created indexing job for ${owner}/${name}`);
    } catch (error) {
        console.error(`Failed to create indexing job for ${owner}/${name}:`, error);
    }
}

/**
 * Drizzle ORM implementation of the SegmentsStorage interface
 */
export class DrizzleSegmentsStorage implements SegmentsStorage {
    constructor() {
        // No additional setup needed for Drizzle as it uses the singleton db instance
    }

    /**
     * Transform a database record to our service model
     */
    private async transformDbToModel(dbSegment: any): Promise<Segment> {
        // Fetch associated contributors
        const contributors = await dbFactory.getClient()
            .select({ contributor_github_login: segmentsContributors.contributor_github_login })
            .from(segmentsContributors)
            .where(eq(segmentsContributors.segment_id, dbSegment.id));

        // Fetch associated repositories
        const repositories = await dbFactory.getClient()
            .select({ repository_url: segmentRepositories.repository_url })
            .from(segmentRepositories)
            .where(eq(segmentRepositories.segment_id, dbSegment.id));

        return {
            id: dbSegment.id.toString(),
            name: dbSegment.name,
            description: dbSegment.description || "",
            created_at: dbSegment.created_at?.toISOString() || new Date().toISOString(),
            updated_at: dbSegment.updated_at?.toISOString() || new Date().toISOString(),
            github_user_logins: contributors.map(c => c.contributor_github_login),
            repositories: repositories.map(r => r.repository_url)
        };
    }

    /**
     * Get all segments
     */
    async getSegments(): Promise<Segment[]> {
        try {
            const dbSegments = await dbFactory.getClient().select().from(segments);
            
            // Transform each segment to our service model
            const result: Segment[] = [];
            for (const dbSegment of dbSegments) {
                const segment = await this.transformDbToModel(dbSegment);
                result.push(segment);
            }
            
            return result;
        } catch (error) {
            console.error("Error fetching segments:", error);
            throw new Error("Failed to fetch segments");
        }
    }

    /**
     * Get a single segment by ID
     */
    async getSegment(id: string): Promise<Segment | undefined> {
        try {
            const dbSegment = await dbFactory.getClient()
                .select()
                .from(segments)
                .where(eq(segments.id, parseInt(id)))
                .limit(1);

            if (dbSegment.length === 0) {
                return undefined;
            }

            return this.transformDbToModel(dbSegment[0]);
        } catch (error) {
            console.error(`Error fetching segment with ID ${id}:`, error);
            throw new Error(`Failed to fetch segment with ID ${id}`);
        }
    }

    /**
     * Create a new segment
     */
    async createSegment(segment: Omit<Segment, "id" | "created_at" | "updated_at"> & { user_id: number }): Promise<Segment> {
        try {
            const now = new Date();
            
            const created = await dbFactory.getClient()
                .insert(segments)
                .values({
                    name: segment.name,
                    description: segment.description,
                    user_id: segment.user_id,
                    created_at: now,
                    updated_at: now
                })
                .returning();

            if (!created[0]) {
                throw new Error("Failed to create segment");
            }

            const newSegment = created[0];
            
            // Add relationships for github user logins if provided
            if (segment.github_user_logins && segment.github_user_logins.length > 0) {
                for (const githubUserLogin of segment.github_user_logins) {
                    await this.addGithubUserLoginToSegment(
                        newSegment.id.toString(), 
                        githubUserLogin
                    );
                }
            }
            
            // Add relationships for repositories if provided
            if (segment.repositories && segment.repositories.length > 0) {
                for (const repositoryUrl of segment.repositories) {
                    await this.addRepositoryToSegment(
                        newSegment.id.toString(), 
                        repositoryUrl
                    );
                }
            }
            
            return this.transformDbToModel(newSegment);
        } catch (error) {
            console.error("Error creating segment:", error);
            throw new Error("Failed to create segment");
        }
    }

    /**
     * Update an existing segment
     */
    async updateSegment(id: string, segment: Partial<Omit<Segment, "id" | "created_at" | "updated_at">>): Promise<Segment | undefined> {
        try {
            const updates: any = {};

            if (segment.name !== undefined) updates.name = segment.name;
            if (segment.description !== undefined) updates.description = segment.description;

            // Always update the updated_at timestamp
            updates.updated_at = new Date();

            const updated = await dbFactory.getClient()
                .update(segments)
                .set(updates)
                .where(eq(segments.id, parseInt(id)))
                .returning();

            if (updated.length === 0) {
                return undefined;
            }

            // Update github user logins if provided
            if (segment.github_user_logins) {
                // First remove all existing contributors
                await dbFactory.getClient()
                    .delete(segmentsContributors)
                    .where(eq(segmentsContributors.segment_id, parseInt(id)));

                // Then add the new github user logins
                for (const githubUserLogin of segment.github_user_logins) {
                    await this.addGithubUserLoginToSegment(id, githubUserLogin);
                }
            }

            // Update repositories if provided
            if (segment.repositories) {
                // First remove all existing repositories
                await dbFactory.getClient()
                    .delete(segmentRepositories)
                    .where(eq(segmentRepositories.segment_id, parseInt(id)));

                // Then add the new repositories
                for (const repositoryUrl of segment.repositories) {
                    await this.addRepositoryToSegment(id, repositoryUrl);
                }
            }

            return this.transformDbToModel(updated[0]);
        } catch (error) {
            console.error(`Error updating segment with ID ${id}:`, error);
            throw new Error(`Failed to update segment with ID ${id}`);
        }
    }

    /**
     * Delete a segment
     */
    async deleteSegment(id: string): Promise<boolean> {
        try {
            // Note: Cascading delete will handle the joins automatically
            const deleted = await dbFactory.getClient()
                .delete(segments)
                .where(eq(segments.id, parseInt(id)))
                .returning({ id: segments.id });

            return deleted.length > 0;
        } catch (error) {
            console.error(`Error deleting segment with ID ${id}:`, error);
            throw new Error(`Failed to delete segment with ID ${id}`);
        }
    }

    /**
     * Add a GitHub user login to a segment
     */
    async addGithubUserLoginToSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
        try {
            // Check if the segment exists
            const segmentExists = await dbFactory.getClient()
                .select({ id: segments.id })
                .from(segments)
                .where(eq(segments.id, parseInt(segmentId)))
                .limit(1);

            if (segmentExists.length === 0) {
                return false;
            }

            // Check if the relationship already exists
            const existing = await dbFactory.getClient()
                .select({ id: segmentsContributors.id })
                .from(segmentsContributors)
                .where(
                    and(
                        eq(segmentsContributors.segment_id, parseInt(segmentId)),
                        eq(segmentsContributors.contributor_github_login, githubUserLogin)
                    )
                )
                .limit(1);

            // If relationship already exists, consider it a success
            if (existing.length > 0) {
                return true;
            }

            // Create the relationship
            await dbFactory.getClient().insert(segmentsContributors).values({
                segment_id: parseInt(segmentId),
                contributor_github_login: githubUserLogin,
                created_at: new Date()
            });

            // Update the segment's updated_at timestamp
            await dbFactory.getClient()
                .update(segments)
                .set({ updated_at: new Date() })
                .where(eq(segments.id, parseInt(segmentId)));

            return true;
        } catch (error) {
            console.error(`Error adding GitHub user login ${githubUserLogin} to segment ${segmentId}:`, error);
            throw new Error(`Failed to add GitHub user login to segment`);
        }
    }

    /**
     * Remove a GitHub user login from a segment
     */
    async removeGithubUserLoginFromSegment(segmentId: string, githubUserLogin: string): Promise<boolean> {
        try {
            // Check if the relationship exists
            const existing = await dbFactory.getClient()
                .select({ id: segmentsContributors.id })
                .from(segmentsContributors)
                .where(
                    and(
                        eq(segmentsContributors.segment_id, parseInt(segmentId)),
                        eq(segmentsContributors.contributor_github_login, githubUserLogin)
                    )
                )
                .limit(1);

            if (existing.length > 0) {
                // Delete the relationship
                await dbFactory.getClient()
                    .delete(segmentsContributors)
                    .where(
                        and(
                            eq(segmentsContributors.segment_id, parseInt(segmentId)),
                            eq(segmentsContributors.contributor_github_login, githubUserLogin)
                        )
                    );

                // Update the segment's updated_at timestamp
                await dbFactory.getClient()
                    .update(segments)
                    .set({ updated_at: new Date() })
                    .where(eq(segments.id, parseInt(segmentId)));
                
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Error removing GitHub user login ${githubUserLogin} from segment ${segmentId}:`, error);
            throw new Error(`Failed to remove GitHub user login from segment`);
        }
    }

    /**
     * Add a repository to a segment
     */
    async addRepositoryToSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
        try {
            // Check if the segment exists
            const segmentExists = await dbFactory.getClient()
                .select({ id: segments.id })
                .from(segments)
                .where(eq(segments.id, parseInt(segmentId)))
                .limit(1);

            if (segmentExists.length === 0) {
                return false;
            }

            // Check if the relationship already exists
            const existing = await dbFactory.getClient()
                .select({ id: segmentRepositories.id })
                .from(segmentRepositories)
                .where(
                    and(
                        eq(segmentRepositories.segment_id, parseInt(segmentId)),
                        eq(segmentRepositories.repository_url, repositoryUrl)
                    )
                )
                .limit(1);

            // If relationship already exists, consider it a success
            if (existing.length > 0) {
                return true;
            }

            // Create the relationship
            await dbFactory.getClient().insert(segmentRepositories).values({
                segment_id: parseInt(segmentId),
                repository_url: repositoryUrl,
                created_at: new Date()
            });

            // Update the segment's updated_at timestamp
            await dbFactory.getClient()
                .update(segments)
                .set({ updated_at: new Date() })
                .where(eq(segments.id, parseInt(segmentId)));

            // Parse repository URL to extract owner and name, then create indexing job
            const parsedRepo = parseRepositoryUrl(repositoryUrl);
            if (parsedRepo) {
                await createRepositoryIndexingJob(parsedRepo.owner, parsedRepo.name);
            }

            return true;
        } catch (error) {
            console.error(`Error adding repository ${repositoryUrl} to segment ${segmentId}:`, error);
            throw new Error(`Failed to add repository to segment`);
        }
    }

    /**
     * Remove a repository from a segment
     */
    async removeRepositoryFromSegment(segmentId: string, repositoryUrl: string): Promise<boolean> {
        try {
            const deleted = await dbFactory.getClient()
                .delete(segmentRepositories)
                .where(
                    and(
                        eq(segmentRepositories.segment_id, parseInt(segmentId)),
                        eq(segmentRepositories.repository_url, repositoryUrl)
                    )
                )
                .returning({ id: segmentRepositories.id });

            if (deleted.length > 0) {
                // Update the segment's updated_at timestamp
                await dbFactory.getClient()
                    .update(segments)
                    .set({ updated_at: new Date() })
                    .where(eq(segments.id, parseInt(segmentId)));
                
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Error removing repository ${repositoryUrl} from segment ${segmentId}:`, error);
            throw new Error(`Failed to remove repository from segment`);
        }
    }
}

/**
 * Factory function to create a Drizzle segments storage instance
 */
export function createDrizzleSegmentsStorage(): SegmentsStorage {
    return new DrizzleSegmentsStorage();
} 