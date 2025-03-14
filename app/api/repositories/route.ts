import {
	RepositoryFilter,
	RepositorySort,
	createRepository,
	getRepositories,
} from "@/lib/services/repositories-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Get the search parameters from the request URL
		const searchParams = request.nextUrl.searchParams;

		// Build filter parameters
		const filter: RepositoryFilter = {};

		// Parse names if provided (comma-separated list)
		const namesParam = searchParams.get("names");
		if (namesParam) {
			filter.names = namesParam.split(",");
		}

		// Parse text search parameter
		const search = searchParams.get("search");
		if (search) {
			filter.search = search;
		}

		// Build sort parameters
		let sort: RepositorySort | undefined;
		const sortField = searchParams.get("sortBy");
		const sortDirection = searchParams.get("sortDirection");

		if (sortField) {
			// Validate sort field
			const validSortFields = ["name", "stars", "forks", "updated_at", "created_at"];
			const field = validSortFields.includes(sortField as any)
				? (sortField as "name" | "stars" | "forks" | "updated_at" | "created_at")
				: "name";

			// Validate sort direction
			const direction = sortDirection === "desc" ? "desc" : "asc";

			sort = { field, direction };
		}

		// Fetch repositories with filter and sort
		const repositories = await getRepositories(Object.keys(filter).length > 0 ? filter : undefined, sort);

		return NextResponse.json(repositories);
	} catch (error) {
		console.error("Error fetching repositories:", error);
		return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const repository = await createRepository(body);
		return NextResponse.json(repository, { status: 201 });
	} catch (error) {
		console.error("Error creating repository:", error);
		return NextResponse.json({ error: "Failed to create repository" }, { status: 500 });
	}
}
