import { getAuthenticatedUser } from "@/lib/services/authentication-service";
import { NextResponse } from "next/server";

/**
 * GET /api/users/me
 * Returns the currently authenticated user
 */
export async function GET() {
  try {
    // Get the authenticated user
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: "Failed to fetch current user" }, { status: 500 });
  }
} 