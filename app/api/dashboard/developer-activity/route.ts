import { getDeveloperActivity } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const developerActivity = await getDeveloperActivity();
        return NextResponse.json(developerActivity);
    } catch (error) {
        console.error("Error fetching developer activity:", error);
        return NextResponse.json({ error: "Failed to fetch developer activity" }, { status: 500 });
    }
} 