import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { authenticated, user } = await authenticateRequest(request)

    if (!authenticated || !user) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (user as any).userId,
        name: (user as any).name || "Admin",
        email: (user as any).email,
        role: (user as any).role || "admin",
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, error: "Authentication check failed" }, { status: 500 })
  }
}
