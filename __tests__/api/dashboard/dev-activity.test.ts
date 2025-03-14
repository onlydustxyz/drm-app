import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { devActivity } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard Dev Activity API", () => {
    describe("GET /api/dashboard/dev-activity", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(devActivity);

            // Insert test data for dev activity
            await dbFactory.getClient().insert(devActivity).values([
                { date: "2023-01-01", active: 300, churned: 50, reactivated: 30 },
                { date: "2023-02-01", active: 320, churned: 40, reactivated: 35 },
                { date: "2023-03-01", active: 350, churned: 30, reactivated: 45 }
            ]);
        });

        it("should return dev activity data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/dev-activity/route").GET))
                .get("/api/dashboard/dev-activity");

            expect(response.status).toBe(200);
            
            // Verify dev activity data
            expect(response.body).toHaveLength(3);
            expect(response.body[0].date).toBe("2023-01");
            expect(response.body[0].active).toBe(300);
            expect(response.body[0].churned).toBe(50);
            expect(response.body[0].reactivated).toBe(30);
            
            expect(response.body[1].date).toBe("2023-02");
            expect(response.body[1].active).toBe(320);
            expect(response.body[1].churned).toBe(40);
            expect(response.body[1].reactivated).toBe(35);
            
            expect(response.body[2].date).toBe("2023-03");
            expect(response.body[2].active).toBe(350);
            expect(response.body[2].churned).toBe(30);
            expect(response.body[2].reactivated).toBe(45);
        });

        it("should return empty array when no dev activity data exists", async () => {
            // Delete all dev activity data
            await dbFactory.getClient().delete(devActivity);

            const response = await request(createTestServer(require("@/app/api/dashboard/dev-activity/route").GET))
                .get("/api/dashboard/dev-activity");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
}); 