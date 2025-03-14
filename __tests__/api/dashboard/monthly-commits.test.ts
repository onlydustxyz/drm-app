import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { monthlyCommits } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard Monthly Commits API", () => {
    describe("GET /api/dashboard/monthly-commits", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(monthlyCommits);

            // Insert test data for monthly commits
            await dbFactory.getClient().insert(monthlyCommits).values([
                { date: "2023-01-01", count: 1500 },
                { date: "2023-02-01", count: 1800 },
                { date: "2023-03-01", count: 2100 }
            ]);
        });

        it("should return monthly commits data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/monthly-commits/route").GET))
                .get("/api/dashboard/monthly-commits");

            expect(response.status).toBe(200);
            
            // Verify monthly commits data
            expect(response.body).toHaveLength(3);
            expect(response.body[0].date).toBe("2023-01-01");
            expect(response.body[0].count).toBe(1500);
            expect(response.body[1].date).toBe("2023-02-01");
            expect(response.body[1].count).toBe(1800);
            expect(response.body[2].date).toBe("2023-03-01");
            expect(response.body[2].count).toBe(2100);
        });

        it("should return empty array when no monthly commits data exists", async () => {
            // Delete all monthly commits data
            await dbFactory.getClient().delete(monthlyCommits);

            const response = await request(createTestServer(require("@/app/api/dashboard/monthly-commits/route").GET))
                .get("/api/dashboard/monthly-commits");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
}); 