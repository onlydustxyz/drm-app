import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { getDeveloperActivity } from "@/lib/services/dashboard-service";
import { getAuthenticatedUserRepositoryIds } from "@/lib/services/developer-activity-service";
import { NextResponse } from "next/server";

/**
 * GET /api/dashboard/developer-activity
 * Returns developer activity for repositories linked to the authenticated user's segments
 */
export async function GET() {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        // Get repository IDs for the authenticated user's segments
        const repoIds = await getAuthenticatedUserRepositoryIds();
        
        // Get developer activity data
        console.log("repoIds", repoIds);
        const developerActivity = await getDeveloperActivity(repoIds);
        
        return NextResponse.json(developerActivity);
    } catch (error) {
        console.error("Error fetching developer activity:", error);
        return NextResponse.json({ error: "Failed to fetch developer activity" }, { status: 500 });
    }
} 