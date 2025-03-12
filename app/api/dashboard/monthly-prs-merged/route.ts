import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/monthly-prs-merged
 * Returns monthly PRs merged data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getMonthlyPRsMerged();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching monthly PRs merged:", error);
		return NextResponse.json({ error: "Failed to fetch monthly PRs merged" }, { status: 500 });
	}
}
