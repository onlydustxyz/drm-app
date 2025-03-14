import { getDeveloperActivity } from "@/lib/services/dashboard-service";
import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const developerActivity = await getDeveloperActivity();
        return NextResponse.json(developerActivity);
    } catch (error) {
        console.error("Error fetching developer activity:", error);
        return NextResponse.json({ error: "Failed to fetch developer activity" }, { status: 500 });
    }
} 