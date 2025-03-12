import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/developers-by-chain
 * Returns developers by chain data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getDevelopersByChain();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching developers by chain:", error);
		return NextResponse.json({ error: "Failed to fetch developers by chain" }, { status: 500 });
	}
}
