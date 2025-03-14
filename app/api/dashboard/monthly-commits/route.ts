import { getMonthlyCommits } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const monthlyCommits = await getMonthlyCommits();
        return NextResponse.json(monthlyCommits);
    } catch (error) {
        console.error("Error fetching monthly commits:", error);
        return NextResponse.json({ error: "Failed to fetch monthly commits" }, { status: 500 });
    }
} 