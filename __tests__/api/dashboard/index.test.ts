import request from "supertest";
import {createTestServer} from "@/__tests__/setup";
import {dbFactory} from "@/lib/drizzle";
import {
    commitsByDevType,
    dashboardKpis,
    devActivity,
    developerActivity,
    monthlyCommits,
    monthlyPRsMerged
} from "@/lib/drizzle/schema/dashboard";

describe("Dashboard API", () => {
    describe("GET /api/dashboard", () => {
        beforeEach(async () => {
            // Clear existing data
            await dbFactory.getClient().delete(dashboardKpis);
            await dbFactory.getClient().delete(developerActivity);
            await dbFactory.getClient().delete(commitsByDevType);
            await dbFactory.getClient().delete(monthlyCommits);
            await dbFactory.getClient().delete(monthlyPRsMerged);
            await dbFactory.getClient().delete(devActivity);

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

            // Insert test data for developer activity
            await dbFactory.getClient().insert(developerActivity).values([
                {name: "JavaScript", full_time: 50, part_time: 30, on_time: 20},
                {name: "TypeScript", full_time: 80, part_time: 40, on_time: 10}
            ]);

            // Insert test data for commits by dev type
            await dbFactory.getClient().insert(commitsByDevType).values([
                {name: "Frontend", full_time: 1200, part_time: 800, on_time: 500},
                {name: "Backend", full_time: 1500, part_time: 700, on_time: 400}
            ]);

            // Insert test data for monthly commits
            await dbFactory.getClient().insert(monthlyCommits).values({
                date: "2023-01-01",
                count: 1500
            });
            await dbFactory.getClient().insert(monthlyCommits).values({
                date: "2023-02-01",
                count: 1800
            });

            // Insert test data for monthly PRs merged
            await dbFactory.getClient().insert(monthlyPRsMerged).values({
                date: "2023-01-01",
                count: 800
            });
            await dbFactory.getClient().insert(monthlyPRsMerged).values({
                date: "2023-02-01",
                count: 950
            });

            // Insert test data for dev activity
            await dbFactory.getClient().insert(devActivity).values({
                date: "2023-01-01",
                active: 300,
                churned: 50,
                reactivated: 30
            });
            await dbFactory.getClient().insert(devActivity).values({
                date: "2023-02-01",
                active: 320,
                churned: 40,
                reactivated: 35
            });
        });

        it("should return complete dashboard data", async () => {
            const response = await request(createTestServer(require("@/app/api/dashboard/route").GET))
                .get("/api/dashboard");

            expect(response.status).toBe(200);

            // Verify KPIs
            expect(response.body.kpis).toMatchObject({
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

            // Verify developer activity
            expect(response.body.developerActivity).toHaveLength(2);
            expect(response.body.developerActivity).toContainEqual({
                name: "JavaScript",
                fullTime: 50,
                partTime: 30,
                onTime: 20
            });
            expect(response.body.developerActivity).toContainEqual({
                name: "TypeScript",
                fullTime: 80,
                partTime: 40,
                onTime: 10
            });

            // Verify commits by dev type
            expect(response.body.commitsByDevType).toHaveLength(2);
            expect(response.body.commitsByDevType).toContainEqual({
                name: "Frontend",
                fullTime: 1200,
                partTime: 800,
                onTime: 500
            });
            expect(response.body.commitsByDevType).toContainEqual({
                name: "Backend",
                fullTime: 1500,
                partTime: 700,
                onTime: 400
            });

            // Verify monthly commits
            expect(response.body.monthlyCommits).toHaveLength(2);
            expect(response.body.monthlyCommits[0].date).toBe("2023-01-01");
            expect(response.body.monthlyCommits[0].count).toBe(1500);
            expect(response.body.monthlyCommits[1].date).toBe("2023-02-01");
            expect(response.body.monthlyCommits[1].count).toBe(1800);

            // Verify monthly PRs merged
            expect(response.body.monthlyPRsMerged).toHaveLength(2);
            expect(response.body.monthlyPRsMerged[0].date).toBe("2023-01-01");
            expect(response.body.monthlyPRsMerged[0].count).toBe(800);
            expect(response.body.monthlyPRsMerged[1].date).toBe("2023-02-01");
            expect(response.body.monthlyPRsMerged[1].count).toBe(950);

            // Verify dev activity
            expect(response.body.devActivity).toHaveLength(2);
            expect(response.body.devActivity[0].date).toBe("2023-01");
            expect(response.body.devActivity[0].active).toBe(300);
            expect(response.body.devActivity[0].churned).toBe(50);
            expect(response.body.devActivity[0].reactivated).toBe(30);
            expect(response.body.devActivity[1].date).toBe("2023-02");
            expect(response.body.devActivity[1].active).toBe(320);
            expect(response.body.devActivity[1].churned).toBe(40);
            expect(response.body.devActivity[1].reactivated).toBe(35);
        });
    });
});