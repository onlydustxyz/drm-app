import { getDashboardStorage } from "@/lib/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/monthly-commits
 * Returns monthly commits data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getMonthlyCommits();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching monthly commits:", error);
		return NextResponse.json({ error: "Failed to fetch monthly commits" }, { status: 500 });
	}
}
