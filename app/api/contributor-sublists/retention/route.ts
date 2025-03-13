import { NextResponse } from "next/server";
import { getContributorRetentionData } from "@/lib/services/contributor-sublists-service";

export async function GET(request: Request) {
	try {
		// Get the URL object from the request
		const url = new URL(request.url);

		// Get the contributor IDs from the query params
		const contributorIds = url.searchParams.get("ids");

		if (!contributorIds) {
			return NextResponse.json({ error: "Contributor IDs are required" }, { status: 400 });
		}

		// Parse the comma-separated contributor IDs
		const idsArray = contributorIds.split(",");

		// Get the retention data
		const retentionData = await getContributorRetentionData(idsArray);

		return NextResponse.json(retentionData);
	} catch (error) {
		console.error("Error fetching contributor retention data:", error);
		return NextResponse.json({ error: "Failed to fetch contributor retention data" }, { status: 500 });
	}
}
