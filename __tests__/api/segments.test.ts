import request from "supertest";
import {createTestServer} from "@/__tests__/setup";
import {dbFactory} from "@/lib/drizzle";
import { NextRequest } from "next/server";

describe("Segments API", () => {
    describe("POST /api/segments", () => {
        it("should create a new segment with repository URLs and GitHub user logins", async () => {
            const newSegment = {
                name: "Test Segment",
                description: "Test Description",
                github_user_logins: ["user1", "user2", "user3"],
                repositories: ["https://github.com/onlydustxyz/drm-app", "https://github.com/onlydustxyz/marketplace-api"]
            };

            const response = await request(createTestServer(require("@/app/api/segments/route").POST))
                .post("/api/segments")
                .send(newSegment);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                name: newSegment.name,
                description: newSegment.description,
                github_user_logins: newSegment.github_user_logins,
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

    describe("DELETE /api/segments/:id", () => {
        it("should delete an existing segment and its relationships", async () => {
            // First create a segment to delete
            const newSegment = {
                name: "Segment to Delete",
                description: "This segment will be deleted",
                github_user_logins: ["testuser1", "testuser2"],
                repositories: ["https://github.com/onlydustxyz/test-repo"]
            };

            // Create the segment
            const createResponse = await request(createTestServer(require("@/app/api/segments/route").POST))
                .post("/api/segments")
                .send(newSegment);

            expect(createResponse.status).toBe(201);
            const segmentId = createResponse.body.id;
            expect(segmentId).toBeDefined();

            // Verify segment was created by getting it directly from the database
            let segmentExists = await dbFactory.getClient().execute(
                `select * from segments where id = ${segmentId}`
            );
            expect(segmentExists.length).toBe(1);

            // Create a handler that wraps the DELETE handler and provides the params
            const deleteRouteHandler = (req: NextRequest) => {
                const deleteHandler = require("@/app/api/segments/[id]/route").DELETE;
                // Extract ID from the URL path
                const pathParts = new URL(req.url).pathname.split('/');
                const id = pathParts[pathParts.length - 1];
                
                // Call the handler with the request and params
                return deleteHandler(req, { params: { id } });
            };

            // Now delete the segment
            const deleteResponse = await request(createTestServer(deleteRouteHandler))
                .delete(`/api/segments/${segmentId}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toEqual({ success: true });

            // Verify segment was deleted from the database
            segmentExists = await dbFactory.getClient().execute(
                `select * from segments where id = ${segmentId}`
            );
            expect(segmentExists.length).toBe(0);

            // Verify relationships were also deleted (github_user_logins)
            const contributorsExist = await dbFactory.getClient().execute(
                `select * from segments_contributors where segment_id = ${segmentId}`
            );
            expect(contributorsExist.length).toBe(0);

            // Verify relationships were also deleted (repositories)
            const repositoriesExist = await dbFactory.getClient().execute(
                `select * from segment_repositories where segment_id = ${segmentId}`
            );
            expect(repositoriesExist.length).toBe(0);
        });

        it("should return 404 when trying to delete a non-existent segment", async () => {
            const nonExistentId = 999999;
            
            // Create a handler that wraps the DELETE handler and provides the params
            const deleteRouteHandler = (req: NextRequest) => {
                const deleteHandler = require("@/app/api/segments/[id]/route").DELETE;
                // Extract ID from the URL path
                const pathParts = new URL(req.url).pathname.split('/');
                const id = pathParts[pathParts.length - 1];
                
                // Call the handler with the request and params
                return deleteHandler(req, { params: { id } });
            };
            
            const response = await request(createTestServer(deleteRouteHandler))
                .delete(`/api/segments/${nonExistentId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: "Segment not found" });
        });
    });
});