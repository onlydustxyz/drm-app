import { getMonthlyCommits } from "@/lib/services/dashboard-service";
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
        const monthlyCommits = await getMonthlyCommits(repoIds);
        return NextResponse.json(monthlyCommits);
    } catch (error) {
        console.error("Error fetching monthly commits:", error);
        return NextResponse.json({ error: "Failed to fetch monthly commits" }, { status: 500 });
    }
} 