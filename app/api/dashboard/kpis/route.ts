import { getDashboardStorage } from "@/lib/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/kpis
 * Returns dashboard KPI data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDashboardKPIs();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching dashboard KPIs:", error);
		return NextResponse.json({ error: "Failed to fetch dashboard KPIs" }, { status: 500 });
	}
}
