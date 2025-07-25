import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const query: any = {}
    const year = searchParams.get("year")
    const medium = searchParams.get("medium")
    const series = searchParams.get("series")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "12", 10)
    const skip = (page - 1) * limit

    if (year && year !== "all") query.year = Number.parseInt(year)
    if (medium && medium !== "all") query.medium = medium
    if (series && series !== "all") query.series = series
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ]
    }

    const total = await db.collection("artworks").countDocuments(query)
    const artworks = await db
      .collection("artworks")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({ success: true, data: artworks, total })
  } catch (error) {
    console.error("Error fetching artworks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch artworks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const artwork = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("artworks").insertOne(artwork)

    return NextResponse.json({
      success: true,
      data: { ...artwork, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating artwork:", error)
    return NextResponse.json({ success: false, error: "Failed to create artwork" }, { status: 500 })
  }
}
