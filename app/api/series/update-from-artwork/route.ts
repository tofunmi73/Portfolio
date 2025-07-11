import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { seriesTitle, artworkData } = await request.json()

    // Check if series already exists
    const existingSeries = await db.collection("series").findOne({ title: seriesTitle })

    if (existingSeries) {
      // Update existing series - increment artwork count
      await db.collection("series").updateOne(
        { title: seriesTitle },
        { 
          $inc: { artworkCount: 1 },
          $set: { updatedAt: new Date() }
        }
      )
    } else {
      // Create new series
      const newSeries = {
        title: seriesTitle,
        description: `A collection of artworks from the ${seriesTitle} series`,
        statement: `This series represents a unique exploration in my artistic journey.`,
        year: artworkData.year.toString(),
        artworkCount: 1,
        coverImage: artworkData.image, // Use the artwork's image as cover
        images: [artworkData.image],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await db.collection("series").insertOne(newSeries)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating series from artwork:", error)
    return NextResponse.json({ success: false, error: "Failed to update series" }, { status: 500 })
  }
}