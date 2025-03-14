import request from "supertest";
import {createTestServer} from "@/__tests__/setup";
import {dbFactory} from "@/lib/drizzle";

describe("Segments API", () => {
    describe("POST /api/segments", () => {
        it("should create a new segment with repository URLs", async () => {
            const newSegment = {
                name: "Test Segment",
                description: "Test Description",
                contributors: ["1", "2", "3"],
                repositories: ["https://github.com/onlydustxyz/drm-app", "https://github.com/onlydustxyz/marketplace-api"]
            };

            const response = await request(createTestServer(require("@/app/api/segments/route").POST))
                .post("/api/segments")
                .send(newSegment);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                name: newSegment.name,
                description: newSegment.description,
                contributors: newSegment.contributors,
                repositories: newSegment.repositories
            });
            expect(response.body.id).toBeDefined();
            expect(response.body.created_at).toBeDefined();
            expect(response.body.updated_at).toBeDefined();

            // Check if jobs were created for each repository
            for (const repoUrl of newSegment.repositories) {
                // Parse owner and name from repository URL
                const urlParts = repoUrl.split('/');
                const repoOwner = urlParts[urlParts.length - 2];
                const repoName = urlParts[urlParts.length - 1];

                // Query the jobs table to check if a job was created
                let pgRaw = await dbFactory.getClient().execute(
                    `select * from indexer.repo_public_events_indexing_jobs where repo_owner = '${repoOwner}' and repo_name = '${repoName}'`
                );

                type IndexingJob = {
                    repo_owner: string;
                    repo_name: string;
                    repo_id: number | null;
                    status: string;
                };

                let jobs: IndexingJob[] = [];
                pgRaw.map((row) => {
                    jobs.push(row as IndexingJob);
                });

                // Assert that a job exists for this repository
                expect(jobs.length).toBe(1);
                expect(jobs[0].status).toBe('PENDING');
                expect(jobs[0].repo_owner).toBe(repoOwner);
                expect(jobs[0].repo_name).toBe(repoName);
            }
        });
    });
});