import request from "supertest";
import { createTestServer } from "@/__tests__/setup";
import { dbFactory } from "@/lib/drizzle";
import { dashboardKpis } from "@/lib/drizzle/schema/dashboard";

describe("Dashboard KPIs API", () => {
    describe("GET /api/dashboard/kpis", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(dashboardKpis);

            // Insert test data for KPIs
            await dbFactory.getClient().insert(dashboardKpis).values({
                full_time_devs: 150,
                full_time_devs_growth: "10.5",
                monthly_active_devs: 500,
                monthly_active_devs_growth: "5.2",
                total_repos: 300,
                total_repos_growth: "15.8",
                total_commits: 10000,
                total_commits_growth: "20.3",
                total_projects: 50,
                total_projects_growth: "8.7"
            });
        });

        it("should return dashboard KPIs data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/kpis/route").GET))
                .get("/api/dashboard/kpis");

            expect(response.status).toBe(200);
            
            // Verify KPIs
            expect(response.body).toMatchObject({
                fullTimeDevs: 150,
                fullTimeDevsGrowth: 10.5,
                monthlyActiveDevs: 500,
                monthlyActiveDevsGrowth: 5.2,
                totalRepos: 300,
                totalReposGrowth: 15.8,
                totalCommits: 10000,
                totalCommitsGrowth: 20.3,
                totalProjects: 50,
                totalProjectsGrowth: 8.7
            });
        });

        it("should return default values when no KPIs data exists", async () => {
            // Delete all KPIs data
            await dbFactory.getClient().delete(dashboardKpis);

            const response = await request(createTestServer(require("@/app/api/dashboard/kpis/route").GET))
                .get("/api/dashboard/kpis");

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                fullTimeDevs: 0,
                fullTimeDevsGrowth: 0,
                monthlyActiveDevs: 0,
                monthlyActiveDevsGrowth: 0,
                totalRepos: 0,
                totalReposGrowth: 0,
                totalCommits: 0,
                totalCommitsGrowth: 0,
                totalProjects: 0,
                totalProjectsGrowth: 0
            });
        });
    });
}); 