import { getDashboardData } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const dashboard = await getDashboardData();
        return NextResponse.json(dashboard);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
} 