import { createRepository, getRepositories } from "@/lib/services/repositories-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		// Get the search parameters from the request URL
		const searchParams = request.nextUrl.searchParams;
		const namesParam = searchParams.get("names");

		// Parse names if provided (comma-separated list)
		const names = namesParam ? namesParam.split(",") : undefined;

		// Pass the filter parameters to getRepositories
		const repositories = await getRepositories(names && names.length > 0 ? { names } : undefined);

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
