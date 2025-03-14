import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { getSegment } from "@/lib/services/segments-service";
import { NextRequest, NextResponse } from "next/server";
import { getRepositoriesStorage } from "@/lib/storage/repositories-storage";
import { RepositorySort } from "@/lib/services/repositories-service";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// Valid sort fields for repositories
const validSortFields = ["name", "stars", "forks", "updated_at", "created_at"] as const;
type ValidSortField = typeof validSortFields[number];

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        
        // Get the segment to verify it exists
        const segment = await getSegment(id);

        if (!segment) {
            return NextResponse.json({ error: "Segment not found" }, { status: 404 });
        }

        // Extract query parameters for sorting
        const searchParams = request.nextUrl.searchParams;
        const sortBy = searchParams.get("sortBy");
        const sortDirection = searchParams.get("sortDirection");

        // Build sort object if sort parameters are provided
        let sort: RepositorySort | undefined;
        if (sortBy && sortDirection && ["asc", "desc"].includes(sortDirection)) {
            // Validate that sortBy is one of the allowed fields
            if (validSortFields.includes(sortBy as ValidSortField)) {
                sort = {
                    field: sortBy as ValidSortField,
                    direction: sortDirection as "asc" | "desc"
                };
            }
        }

        // Get the repositories from storage using the dedicated method for segment repositories
        const storage = getRepositoriesStorage();
        const repositories = await storage.getRepositoriesBySegmentId(id, sort);

        return NextResponse.json(repositories);
    } catch (error) {
        const { id } = await params;
        console.error(`Error fetching repositories for segment ${id}:`, error);
        return NextResponse.json({ error: "Failed to fetch repositories for segment" }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        
        // Get the segment to verify it exists
        const segment = await getSegment(id);

        if (!segment) {
            return NextResponse.json({ error: "Segment not found" }, { status: 404 });
        }

        // Get the repository URLs from the request body
        const body = await request.json();
        const { repositoryUrls } = body;

        // Validate the input
        if (!repositoryUrls || !Array.isArray(repositoryUrls)) {
            return NextResponse.json(
                { error: "Invalid request body. Expected 'repositoryUrls' as an array" }, 
                { status: 400 }
            );
        }

        // Add the repositories to the segment
        const { addRepositoryToSegment } = await import("@/lib/services/segments-service");
        const success = await addRepositoryToSegment(id, repositoryUrls);

        if (!success) {
            return NextResponse.json({ error: "Failed to add repositories to segment" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const { id } = await params;
        console.error(`Error adding repositories to segment ${id}:`, error);
        return NextResponse.json({ error: "Failed to add repositories to segment" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // Get the authenticated user
        const user = await getAuthenticatedUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        
        // Get the segment to verify it exists
        const segment = await getSegment(id);

        if (!segment) {
            return NextResponse.json({ error: "Segment not found" }, { status: 404 });
        }

        // Get the repository URL from the query parameters
        const searchParams = request.nextUrl.searchParams;
        const repositoryUrl = searchParams.get("repositoryUrl");

        if (!repositoryUrl) {
            return NextResponse.json(
                { error: "Missing required query parameter 'repositoryUrl'" }, 
                { status: 400 }
            );
        }

        // Remove the repository from the segment
        const { removeRepositoryFromSegment } = await import("@/lib/services/segments-service");
        const success = await removeRepositoryFromSegment(id, repositoryUrl);

        if (!success) {
            return NextResponse.json(
                { error: "Repository not found in segment or segment not found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const { id } = await params;
        console.error(`Error removing repository from segment ${id}:`, error);
        return NextResponse.json({ error: "Failed to remove repository from segment" }, { status: 500 });
    }
} 