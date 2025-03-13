import { NextResponse } from "next/server";
import { getContributor, getContributors } from "@/lib/services/contributors-service";

export async function GET(request: Request) {
	try {
		// Get the URL object from the request
		const url = new URL(request.url);
		// Check if an ID was provided in the query params
		const id = url.searchParams.get("id");

		if (id) {
			// If ID is provided, get a specific contributor
			const contributor = await getContributor(id);

			if (!contributor) {
				return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
			}

			return NextResponse.json(contributor);
		}

		// Otherwise, get all contributors
		const contributors = await getContributors();
		return NextResponse.json(contributors);
	} catch (error) {
		console.error("Error fetching contributors:", error);
		return NextResponse.json({ error: "Failed to fetch contributors" }, { status: 500 });
	}
}
