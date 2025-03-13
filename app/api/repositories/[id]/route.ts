import { deleteRepository, getRepository, updateRepository } from "@/lib/services/repositories-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const repository = await getRepository(params.id);

		if (!repository) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json(repository);
	} catch (error) {
		console.error(`Error fetching repository ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to fetch repository" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await request.json();
		const repository = await updateRepository(params.id, body);

		if (!repository) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json(repository);
	} catch (error) {
		console.error(`Error updating repository ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to update repository" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const success = await deleteRepository(params.id);

		if (!success) {
			return NextResponse.json({ error: "Repository not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(`Error deleting repository ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to delete repository" }, { status: 500 });
	}
}
