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
        const { contributorGithubLogin } = await request.json();

        if (!contributorGithubLogin) {
            return NextResponse.json({ error: "Contributor GitHub login is required" }, { status: 400 });
        }

        const success = await addContributorToSegment(segmentId, contributorGithubLogin);

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
        const { contributorGithubLogin } = await request.json();

        if (!contributorGithubLogin) {
            return NextResponse.json({ error: "Contributor GitHub login is required" }, { status: 400 });
        }

        const success = await removeContributorFromSegment(segmentId, contributorGithubLogin);

        if (!success) {
            return NextResponse.json({ error: "Failed to remove contributor from segment" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error removing contributor from segment ${params.id}:`, error);
        return NextResponse.json({ error: "Failed to remove contributor from segment" }, { status: 500 });
    }
} 