import {NextRequest, NextResponse} from "next/server";
import {getDevelopersByCountry} from "@/lib/services/dashboard-service";
import { getAuthenticatedUserRepositoryIds } from "@/lib/services/developer-activity-service";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        
        // Parse repoIds if provided
        const repoIds = await getAuthenticatedUserRepositoryIds();
        
        // Fetch the data
        const data = await getDevelopersByCountry(repoIds);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching developers by country:", error);
        return NextResponse.json(
            { error: "Failed to fetch developers by country data" },
            { status: 500 }
        );
    }
}