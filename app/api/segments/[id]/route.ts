import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { deleteSegment, getSegment, updateSegment } from "@/lib/services/segments-service";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
	params: Promise<{
		id: string;
	}>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const segment = await getSegment(id);

		if (!segment) {
			return NextResponse.json({ error: "Segment not found" }, { status: 404 });
		}

		return NextResponse.json(segment);
	} catch (error) {
		const { id } = await params;
		console.error(`Error fetching segment ${id}:`, error);
		return NextResponse.json({ error: "Failed to fetch segment" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const segment = await updateSegment(id, body);

		if (!segment) {
			return NextResponse.json({ error: "Segment not found" }, { status: 404 });
		}

		return NextResponse.json(segment);
	} catch (error) {
		const { id } = await params;
		console.error(`Error updating segment ${id}:`, error);
		return NextResponse.json({ error: "Failed to update segment" }, { status: 500 });
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
		const success = await deleteSegment(id);

		if (!success) {
			return NextResponse.json({ error: "Segment not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		const { id } = await params;
		console.error(`Error deleting segment ${id}:`, error);
		return NextResponse.json({ error: "Failed to delete segment" }, { status: 500 });
	}
}
