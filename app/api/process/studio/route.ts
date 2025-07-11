import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const studioImages = await db.collection("studio_images").find({}).toArray()

    return NextResponse.json({ success: true, data: studioImages })
  } catch (error) {
    console.error("Error fetching studio images:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch studio images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const studioImage = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("studio_images").insertOne(studioImage)

    return NextResponse.json({
      success: true,
      data: { ...studioImage, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating studio image:", error)
    return NextResponse.json({ success: false, error: "Failed to create studio image" }, { status: 500 })
  }
}
