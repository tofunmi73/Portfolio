import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const series = await db.collection("series").find({}).toArray()

    return NextResponse.json({ success: true, data: series })
  } catch (error) {
    console.error("Error fetching series:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch series" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const series = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("series").insertOne(series)

    return NextResponse.json({
      success: true,
      data: { ...series, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating series:", error)
    return NextResponse.json({ success: false, error: "Failed to create series" }, { status: 500 })
  }
}
