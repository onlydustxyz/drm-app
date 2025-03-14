import { createSegment, getSegments } from "@/lib/services/segments-service";
import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const segments = await getSegments();
        return NextResponse.json(segments);
    } catch (error) {
        console.error("Error fetching segments:", error);
        return NextResponse.json({ error: "Failed to fetch segments" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const body = await request.json();
        
        // Add the authenticated user's ID to the segment data
        const segmentData = {
            ...body,
            user_id: Number(user.id)
        };
        
        const segment = await createSegment(segmentData);
        return NextResponse.json(segment, { status: 201 });
    } catch (error) {
        console.error("Error creating segment:", error);
        return NextResponse.json({ error: "Failed to create segment" }, { status: 500 });
    }
} 