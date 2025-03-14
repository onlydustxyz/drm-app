import { getCommitsByDevType } from "@/lib/services/dashboard-service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const commitsByDevType = await getCommitsByDevType();
        return NextResponse.json(commitsByDevType);
    } catch (error) {
        console.error("Error fetching commits by dev type:", error);
        return NextResponse.json({ error: "Failed to fetch commits by dev type" }, { status: 500 });
    }
} 