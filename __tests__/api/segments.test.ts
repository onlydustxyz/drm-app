import request from "supertest";
import { createTestServer } from "@/__tests__/setup";

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
            
        });
    });
});