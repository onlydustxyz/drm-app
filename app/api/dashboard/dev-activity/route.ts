import { getDevActivity } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const devActivity = await getDevActivity();
        return NextResponse.json(devActivity);
    } catch (error) {
        console.error("Error fetching dev activity:", error);
        return NextResponse.json({ error: "Failed to fetch dev activity" }, { status: 500 });
    }
} 