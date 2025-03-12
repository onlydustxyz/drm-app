import { getDashboardStorage } from "@/lib/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/dev-activity
 * Returns developer activity metrics
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDevActivity();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching dev activity:", error);
		return NextResponse.json({ error: "Failed to fetch dev activity" }, { status: 500 });
	}
}
