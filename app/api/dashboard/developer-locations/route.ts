import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/developer-locations
 * Returns developer locations data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDeveloperLocations();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching developer locations:", error);
		return NextResponse.json({ error: "Failed to fetch developer locations" }, { status: 500 });
	}
}
