import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    // Get all series
    const allSeries = await db.collection("series").find({}).toArray()
    
    const updatePromises = allSeries.map(async (series) => {
      try {
        // Get all artworks for this series
        const artworks = await db.collection("artworks")
          .find({ series: series.title })
          .toArray()
        
        if (artworks.length === 0) {
          console.log(`No artworks found for series: ${series.title}`)
          return
        }
        
        // Extract image URLs from artworks
        const imageUrls = artworks
          .map(artwork => artwork.image)
          .filter(Boolean) // Remove null/undefined
        
        // Update series with current artwork images
        await db.collection("series").updateOne(
          { _id: series._id },
          {
            $set: {
              images: imageUrls,
              coverImage: imageUrls[0] || series.coverImage,
              artworkCount: artworks.length,
              updatedAt: new Date()
            }
          }
        )
        
        console.log(`Updated series "${series.title}" with ${imageUrls.length} images`)
        
        return {
          seriesTitle: series.title,
          imageCount: imageUrls.length,
          updated: true
        }
      } catch (error) {
        console.error(`Error updating series "${series.title}":`, error)
        return {
          seriesTitle: series.title,
          error: error.message,
          updated: false
        }
      }
    })
    
    const results = await Promise.all(updatePromises)
    
    return NextResponse.json({
      success: true,
      message: "Series images synchronized successfully",
      results: results.filter(Boolean)
    })
    
  } catch (error) {
    console.error("Error syncing series images:", error)
    return NextResponse.json(
      { success: false, error: "Failed to sync series images" },
      { status: 500 }
    )
  }
}