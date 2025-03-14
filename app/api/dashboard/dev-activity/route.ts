import { getDevActivity } from "@/lib/services/dashboard-service";
import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { getAuthenticatedUserRepositoryIds } from "@/lib/services/developer-activity-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        // Get repository IDs for the authenticated user's segments
        const repoIds = await getAuthenticatedUserRepositoryIds();
        const devActivity = await getDevActivity(repoIds.map(id => id.toString()));
        return NextResponse.json(devActivity);
    } catch (error) {
        console.error("Error fetching dev activity:", error);
        return NextResponse.json({ error: "Failed to fetch dev activity" }, { status: 500 });
    }
} 