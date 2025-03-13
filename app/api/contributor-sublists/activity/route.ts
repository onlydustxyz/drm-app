import { NextResponse } from "next/server";
import { getContributorActivityData } from "@/lib/services/contributor-sublists-service";

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

		// Get the activity data
		const activityData = await getContributorActivityData(idsArray);

		return NextResponse.json(activityData);
	} catch (error) {
		console.error("Error fetching contributor activity data:", error);
		return NextResponse.json({ error: "Failed to fetch contributor activity data" }, { status: 500 });
	}
}
