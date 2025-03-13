import {
	deleteRepositorySublist,
	getRepositoryActivityData,
	getRepositoryRetentionData,
	getRepositorySublist,
	updateRepositorySublist,
} from "@/lib/services/repository-sublists-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const url = new URL(request.url);
		const dataType = url.searchParams.get("dataType");

		if (dataType === "activity") {
			const activityData = await getRepositoryActivityData(params.id);
			return NextResponse.json(activityData);
		} else if (dataType === "retention") {
			const retentionData = await getRepositoryRetentionData(params.id);
			return NextResponse.json(retentionData);
		} else {
			const sublist = await getRepositorySublist(params.id);

			if (!sublist) {
				return NextResponse.json({ error: "Repository sublist not found" }, { status: 404 });
			}

			return NextResponse.json(sublist);
		}
	} catch (error) {
		console.error(`Error fetching repository sublist ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to fetch repository sublist" }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const body = await request.json();
		const sublist = await updateRepositorySublist(params.id, body);

		if (!sublist) {
			return NextResponse.json({ error: "Repository sublist not found" }, { status: 404 });
		}

		return NextResponse.json(sublist);
	} catch (error) {
		console.error(`Error updating repository sublist ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to update repository sublist" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const success = await deleteRepositorySublist(params.id);

		if (!success) {
			return NextResponse.json({ error: "Repository sublist not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(`Error deleting repository sublist ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to delete repository sublist" }, { status: 500 });
	}
}
