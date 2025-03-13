import {
    addRepositoryToSegment,
    removeRepositoryFromSegment
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
        const { repositoryUrl } = await request.json();

        if (!repositoryUrl) {
            return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
        }

        const success = await addRepositoryToSegment(segmentId, repositoryUrl);

        if (!success) {
            return NextResponse.json({ error: "Failed to add repository to segment" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error adding repository to segment ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to add repository to segment" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const segmentId = params.id;
        // Use URL search params to get the repositoryUrl
        const { searchParams } = new URL(request.url);
        const repositoryUrl = searchParams.get("repositoryUrl");

        if (!repositoryUrl) {
            return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
        }

        const success = await removeRepositoryFromSegment(segmentId, repositoryUrl);

        if (!success) {
            return NextResponse.json({ error: "Failed to remove repository from segment" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error removing repository from segment ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to remove repository from segment" }, { status: 500 });
    }
} 