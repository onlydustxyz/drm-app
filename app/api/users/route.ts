import { 
  createUser, 
  getAuthenticatedUser, 
  getUserByEmail 
} from "@/lib/services/authentication-service";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/users
 * Creates a new user
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user to verify permissions
    const authenticatedUser = await getAuthenticatedUser();
    
    // Only admins can create users
    if (!authenticatedUser || authenticatedUser.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse request body
    const body = await request.json();
    
    // Check if email already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }
    
    // Create user
    const user = await createUser(body);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 