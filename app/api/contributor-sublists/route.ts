import { NextResponse } from "next/server";
import { getContributorSublists, createContributorSublist } from "@/lib/services/contributor-sublists-service";

export async function GET(request: Request) {
	try {
		const sublists = await getContributorSublists();
		return NextResponse.json(sublists);
	} catch (error) {
		console.error("Error fetching contributor sublists:", error);
		return NextResponse.json({ error: "Failed to fetch contributor sublists" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		// Parse the request body
		const data = await request.json();

		// Validate required fields
		if (!data.name) {
			return NextResponse.json({ error: "Sublist name is required" }, { status: 400 });
		}

		// Create a new sublist with the provided data
		const newSublist = await createContributorSublist({
			name: data.name,
			description: data.description || "",
			contributorIds: data.contributorIds || [],
		});

		return NextResponse.json(newSublist, { status: 201 });
	} catch (error) {
		console.error("Error creating contributor sublist:", error);
		return NextResponse.json({ error: "Failed to create contributor sublist" }, { status: 500 });
	}
}
