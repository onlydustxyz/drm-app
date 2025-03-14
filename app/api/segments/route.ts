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
        const segment = await createSegment(body);
        return NextResponse.json(segment, { status: 201 });
    } catch (error) {
        console.error("Error creating segment:", error);
        return NextResponse.json({ error: "Failed to create segment" }, { status: 500 });
    }
} 