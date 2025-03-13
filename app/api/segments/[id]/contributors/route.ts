import {
    addContributorToSegment,
    removeContributorFromSegment
} from "@/lib/services/segments-service";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const segmentId = params.id;
        const { contributorId } = await request.json();

        if (!contributorId) {
            return NextResponse.json({ error: "Contributor ID is required" }, { status: 400 });
        }

        const success = await addContributorToSegment(segmentId, contributorId);

        if (!success) {
            return NextResponse.json({ error: "Failed to add contributor to segment" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error adding contributor to segment ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to add contributor to segment" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const segmentId = params.id;
        // Use URL search params to get the contributorId
        const { searchParams } = new URL(request.url);
        const contributorId = searchParams.get("contributorId");

        if (!contributorId) {
            return NextResponse.json({ error: "Contributor ID is required" }, { status: 400 });
        }

        const success = await removeContributorFromSegment(segmentId, contributorId);

        if (!success) {
            return NextResponse.json({ error: "Failed to remove contributor from segment" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error removing contributor from segment ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to remove contributor from segment" }, { status: 500 });
    }
} 