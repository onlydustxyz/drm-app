import { getDashboardStorage } from "@/lib/storage/dashboard-storage";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/commits-by-dev-type
 * Returns commits by developer type data
 */
export async function GET() {
	try {
		const dashboardStorage = getDashboardStorage();
		const data = await dashboardStorage.getCommitsByDevType();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching commits by dev type:", error);
		return NextResponse.json({ error: "Failed to fetch commits by dev type" }, { status: 500 });
	}
}
