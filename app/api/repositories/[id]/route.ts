import { deleteRepository, getRepository, updateRepository } from "@/lib/services/repositories-service";
import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { NextRequest, NextResponse } from "next/server";

interface Params {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();
		
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		
		const { id } = await params;
		const repository = await getRepository(id);

		if (!repository) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json(repository);
	} catch (error) {
		const { id } = await params;
		console.error(`Error fetching repository ${id}:`, error);
		return NextResponse.json({ error: "Failed to fetch repository" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: Params) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();
		
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		
		const body = await request.json();
		const { id } = await params;
		const repository = await updateRepository(id, body);

		if (!repository) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json(repository);
	} catch (error) {
		const { id } = await params;
		console.error(`Error updating repository ${id}:`, error);
		return NextResponse.json({ error: "Failed to update repository" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();
		
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		
		const { id } = await params;
		const success = await deleteRepository(id);

		if (!success) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		const { id } = await params;
		console.error(`Error deleting repository ${id}:`, error);
		return NextResponse.json({ error: "Failed to delete repository" }, { status: 500 });
	}
}
