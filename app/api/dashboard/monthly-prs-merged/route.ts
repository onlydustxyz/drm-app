import { getMonthlyPRsMerged } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const monthlyPRsMerged = await getMonthlyPRsMerged();
        return NextResponse.json(monthlyPRsMerged);
    } catch (error) {
        console.error("Error fetching monthly PRs merged:", error);
        return NextResponse.json({ error: "Failed to fetch monthly PRs merged" }, { status: 500 });
    }
} 