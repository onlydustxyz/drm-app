import { getDashboardKPIs } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const kpis = await getDashboardKPIs();
        return NextResponse.json(kpis);
    } catch (error) {
        console.error("Error fetching dashboard KPIs:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard KPIs" }, { status: 500 });
    }
} 