import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const videos = await db.collection("timelapse_videos").find({}).toArray()

    return NextResponse.json({ success: true, data: videos })
  } catch (error) {
    console.error("Error fetching timelapse videos:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch timelapse videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const video = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("timelapse_videos").insertOne(video)

    return NextResponse.json({
      success: true,
      data: { ...video, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating timelapse video:", error)
    return NextResponse.json({ success: false, error: "Failed to create timelapse video" }, { status: 500 })
  }
}
