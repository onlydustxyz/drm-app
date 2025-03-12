import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/developer-activity
 * Returns developer activity data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDeveloperActivity();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching developer activity:", error);
		return NextResponse.json({ error: "Failed to fetch developer activity" }, { status: 500 });
	}
}
