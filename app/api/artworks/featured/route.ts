import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Get 3 random featured artworks
    const featuredArtworks = await db
      .collection("artworks")
      .aggregate([{ $match: { featured: true } }, { $sample: { size: 3 } }])
      .toArray()

    // If no featured artworks, get 3 random artworks
    if (featuredArtworks.length === 0) {
      const randomArtworks = await db
        .collection("artworks")
        .aggregate([{ $sample: { size: 3 } }])
        .toArray()

      return NextResponse.json({ success: true, data: randomArtworks })
    }

    return NextResponse.json({ success: true, data: featuredArtworks })
  } catch (error) {
    console.error("Error fetching featured artworks:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch featured artworks" }, { status: 500 })
  }
}
