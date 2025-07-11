import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest) {
  // Try to get token from cookie first
  const cookieToken = request.cookies.get("auth-token")?.value
  if (cookieToken) return cookieToken

  // Fallback to Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export async function authenticateRequest(request: NextRequest) {
  const token = getTokenFromRequest(request)

  if (!token) {
    return { authenticated: false, user: null }
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return { authenticated: false, user: null }
  }

  return { authenticated: true, user: decoded }
}
