import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard
 * Returns complete dashboard data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDashboardData();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching dashboard data:", error);
		return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
	}
}
