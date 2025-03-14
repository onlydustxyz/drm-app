import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { Contributor, getContributor, getContributors } from "@/lib/services/contributors-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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

		// Extract search and sort parameters
		const search = url.searchParams.get("search") || undefined;
		const sortBy = url.searchParams.get("sortBy") as keyof Contributor | undefined;
		const sortOrder = url.searchParams.get("sortOrder") as "asc" | "desc" | undefined;

		// Get all contributors with the provided filters
		const contributors = await getContributors({ search, sortBy, sortOrder });
		return NextResponse.json(contributors);
	} catch (error) {
		console.error("Error fetching contributors:", error);
		return NextResponse.json({ error: "Failed to fetch contributors" }, { status: 500 });
	}
}
