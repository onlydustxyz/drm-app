import { NextResponse } from "next/server";
import {
	getContributorSublist,
	updateContributorSublist,
	deleteContributorSublist,
} from "@/lib/services/contributor-sublists-service";

interface Params {
	params: {
		id: string;
	};
}

export async function GET(request: Request, { params }: Params) {
	try {
		const { id } = params;
		const sublist = await getContributorSublist(id);

		if (!sublist) {
			return NextResponse.json({ error: "Contributor sublist not found" }, { status: 404 });
		}

		return NextResponse.json(sublist);
	} catch (error) {
		console.error(`Error fetching contributor sublist with ID ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to fetch contributor sublist" }, { status: 500 });
	}
}

export async function PUT(request: Request, { params }: Params) {
	try {
		const { id } = params;
		// Check if the sublist exists
		const existingSublist = await getContributorSublist(id);

		if (!existingSublist) {
			return NextResponse.json({ error: "Contributor sublist not found" }, { status: 404 });
		}

		// Parse the request body
		const data = await request.json();

		// Update the sublist
		const updatedSublist = await updateContributorSublist(id, {
			name: data.name,
			description: data.description,
			contributorIds: data.contributorIds,
		});

		return NextResponse.json(updatedSublist);
	} catch (error) {
		console.error(`Error updating contributor sublist with ID ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to update contributor sublist" }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: Params) {
	try {
		const { id } = params;
		const success = await deleteContributorSublist(id);

		if (!success) {
			return NextResponse.json({ error: "Contributor sublist not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(`Error deleting contributor sublist with ID ${params.id}:`, error);
		return NextResponse.json({ error: "Failed to delete contributor sublist" }, { status: 500 });
	}
}
