import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { monthlyPRsMerged } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard Monthly PRs Merged API", () => {
    describe("GET /api/dashboard/monthly-prs-merged", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(monthlyPRsMerged);

            // Insert test data for monthly PRs merged
            await dbFactory.getClient().insert(monthlyPRsMerged).values([
                { date: "2023-01-01", count: 800 },
                { date: "2023-02-01", count: 950 },
                { date: "2023-03-01", count: 1100 }
            ]);
        });

        it("should return monthly PRs merged data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/monthly-prs-merged/route").GET))
                .get("/api/dashboard/monthly-prs-merged");

            expect(response.status).toBe(200);
            
            // Verify monthly PRs merged data
            expect(response.body).toHaveLength(3);
            expect(response.body[0].date).toBe("2023-01-01");
            expect(response.body[0].count).toBe(800);
            expect(response.body[1].date).toBe("2023-02-01");
            expect(response.body[1].count).toBe(950);
            expect(response.body[2].date).toBe("2023-03-01");
            expect(response.body[2].count).toBe(1100);
        });

        it("should return empty array when no monthly PRs merged data exists", async () => {
            // Delete all monthly PRs merged data
            await dbFactory.getClient().delete(monthlyPRsMerged);

            const response = await request(createTestServer(require("@/app/api/dashboard/monthly-prs-merged/route").GET))
                .get("/api/dashboard/monthly-prs-merged");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
}); 