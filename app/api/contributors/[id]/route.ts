import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { getContributor } from "@/lib/services/contributors-service";
import { NextRequest, NextResponse } from "next/server";

interface Params {
	params: Promise<{ id: string }>;
}

// GET /api/contributors/[id]
export async function GET(request: NextRequest, { params }: Params) {
	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const contributor = await getContributor(id);

		if (!contributor) {
			return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
		}

		return NextResponse.json(contributor);
	} catch (error) {
		const { id } = await params;
		console.error(`Error fetching contributor ${id}:`, error);
		return NextResponse.json({ error: "Failed to fetch contributor" }, { status: 500 });
	}
}
