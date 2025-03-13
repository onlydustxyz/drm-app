import { NextResponse } from "next/server";
import { getContributorSublists, createContributorSublist } from "@/lib/services/contributor-sublists-service";

export async function GET(request: Request) {
	try {
		// Get URL object to parse query parameters
		const url = new URL(request.url);
		const searchQuery = url.searchParams.get("search") || undefined;
		const sortKey = url.searchParams.get("sortKey") || undefined;
		const sortDirection = url.searchParams.get("sortDirection") || undefined;

		// Pass search query and sort parameters to service
		const sublists = await getContributorSublists({
			search: searchQuery,
			sort: sortKey
				? {
						key: sortKey,
						direction: sortDirection === "descending" ? "descending" : "ascending",
				  }
				: undefined,
		});
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
