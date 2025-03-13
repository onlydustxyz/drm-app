import { createRepositorySublist, getRepositorySublists } from "@/lib/services/repository-sublists-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const sublists = await getRepositorySublists();
		return NextResponse.json(sublists);
	} catch (error) {
		console.error("Error fetching repository sublists:", error);
		return NextResponse.json({ error: "Failed to fetch repository sublists" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const sublist = await createRepositorySublist(body);
		return NextResponse.json(sublist, { status: 201 });
	} catch (error) {
		console.error("Error creating repository sublist:", error);
		return NextResponse.json({ error: "Failed to create repository sublist" }, { status: 500 });
	}
}
