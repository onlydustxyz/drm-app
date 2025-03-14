import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { developerActivity } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard Developer Activity API", () => {
    describe("GET /api/dashboard/developer-activity", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(developerActivity);

            // Insert test data for developer activity
            await dbFactory.getClient().insert(developerActivity).values([
                { name: "JavaScript", full_time: 50, part_time: 30, on_time: 20 },
                { name: "TypeScript", full_time: 80, part_time: 40, on_time: 10 },
                { name: "Rust", full_time: 30, part_time: 15, on_time: 5 }
            ]);
        });

        it("should return developer activity data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/developer-activity/route").GET))
                .get("/api/dashboard/developer-activity");

            expect(response.status).toBe(200);
            
            // Verify developer activity data
            expect(response.body).toHaveLength(3);
            expect(response.body).toContainEqual({
                name: "JavaScript",
                fullTime: 50,
                partTime: 30,
                onTime: 20
            });
            expect(response.body).toContainEqual({
                name: "TypeScript",
                fullTime: 80,
                partTime: 40,
                onTime: 10
            });
            expect(response.body).toContainEqual({
                name: "Rust",
                fullTime: 30,
                partTime: 15,
                onTime: 5
            });
        });

        it("should return empty array when no developer activity data exists", async () => {
            // Delete all developer activity data
            await dbFactory.getClient().delete(developerActivity);

            const response = await request(createTestServer(require("@/app/api/dashboard/developer-activity/route").GET))
                .get("/api/dashboard/developer-activity");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
}); 