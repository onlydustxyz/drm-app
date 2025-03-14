import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { commitsByDevType } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard Commits By Dev Type API", () => {
    describe("GET /api/dashboard/commits-by-dev-type", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(commitsByDevType);

            // Insert test data for commits by dev type
            await dbFactory.getClient().insert(commitsByDevType).values([
                { name: "Frontend", full_time: 1200, part_time: 800, on_time: 500 },
                { name: "Backend", full_time: 1500, part_time: 700, on_time: 400 },
                { name: "DevOps", full_time: 800, part_time: 300, on_time: 200 }
            ]);
        });

        it("should return commits by dev type data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/commits-by-dev-type/route").GET))
                .get("/api/dashboard/commits-by-dev-type");

            expect(response.status).toBe(200);
            
            // Verify commits by dev type data
            expect(response.body).toHaveLength(3);
            expect(response.body).toContainEqual({
                name: "Frontend",
                fullTime: 1200,
                partTime: 800,
                onTime: 500
            });
            expect(response.body).toContainEqual({
                name: "Backend",
                fullTime: 1500,
                partTime: 700,
                onTime: 400
            });
            expect(response.body).toContainEqual({
                name: "DevOps",
                fullTime: 800,
                partTime: 300,
                onTime: 200
            });
        });

        it("should return empty array when no commits by dev type data exists", async () => {
            // Delete all commits by dev type data
            await dbFactory.getClient().delete(commitsByDevType);

            const response = await request(createTestServer(require("@/app/api/dashboard/commits-by-dev-type/route").GET))
                .get("/api/dashboard/commits-by-dev-type");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
}); 