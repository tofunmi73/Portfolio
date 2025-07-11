import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET /api/exhibitions - Fetch all exhibitions
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const query = status && status !== "all" ? { status } : {}
    const exhibitions = await db.collection("exhibitions").find(query).sort({ startDate: -1 }).toArray()

    return NextResponse.json({ success: true, data: exhibitions })
  } catch (error) {
    console.error("Error fetching exhibitions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch exhibitions" }, { status: 500 })
  }
}

// POST /api/exhibitions - Create new exhibition
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const exhibition = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("exhibitions").insertOne(exhibition)

    return NextResponse.json({
      success: true,
      data: { ...exhibition, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating exhibition:", error)
    return NextResponse.json({ success: false, error: "Failed to create exhibition" }, { status: 500 })
  }
}

