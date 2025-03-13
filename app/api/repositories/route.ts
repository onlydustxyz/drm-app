import { createRepository, getRepositories } from "@/lib/services/repositories-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const repositories = await getRepositories();
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
