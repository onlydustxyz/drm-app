import { getDashboardStorage } from "@/lib/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/kpis
 * Returns dashboard KPI data
 */
export async function GET() {
	try {
		console.log("Getting dashboard KPIs");
		const dashboardStorage = getDashboardStorage();

		console.log(dashboardStorage);

		const data = await dashboardStorage.getDashboardKPIs();

		console.log(data);
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching dashboard KPIs:", error);
		return NextResponse.json({ error: "Failed to fetch dashboard KPIs" }, { status: 500 });
	}
}
