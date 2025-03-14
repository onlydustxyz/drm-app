import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { getContributor } from "@/lib/services/contributors-service";
import { NextRequest, NextResponse } from "next/server";

// GET /api/contributors/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	const id = params.id;

	try {
		// Get the authenticated user
		const user = await getAuthenticatedUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const contributor = await getContributor(id);

		if (!contributor) {
			return NextResponse.json({ error: "Contributor not found" }, { status: 404 });
		}

		return NextResponse.json(contributor);
	} catch (error) {
		console.error("Error fetching contributor:", error);
		return NextResponse.json({ error: "Failed to fetch contributor" }, { status: 500 });
	}
}
