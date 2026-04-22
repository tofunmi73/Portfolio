import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Helper function to calculate fresh stats
async function calculateStats(db: any) {
  const [artworkCount, exhibitionCount] = await Promise.all([
    db.collection("artworks").countDocuments(),
    db.collection("exhibitions").countDocuments(),
  ])

  return [
    { label: "Artworks Created", value: artworkCount, suffix: "+" },
    { label: "Exhibitions", value: exhibitionCount, suffix: "" },
    { label: "Years Active", value: 6, suffix: "" },
    { label: "Awards Won", value: 0, suffix: "" },
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Check if we should force refresh (query parameter)
    const url = new URL(request.url)
    const forceRefresh = url.searchParams.get("refresh") === "true"

    if (!forceRefresh) {
      // Check if we have recent stats (less than 1 hour old)
      const recentStats = await db
        .collection("stats")
        .find({
          updatedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // 1 hour ago
        })
        .toArray()

      if (recentStats.length > 0) {
        // Return the stats without MongoDB _id and updatedAt fields
        const cleanStats = recentStats.map(({ _id, updatedAt, ...stat }) => stat)
        return NextResponse.json({ success: true, data: cleanStats })
      }
    }

    // Calculate fresh stats
    const freshStats = await calculateStats(db)

    // Add timestamp to each stat
    const timestampedStats = freshStats.map((stat) => ({
      ...stat,
      updatedAt: new Date(),
    }))

    // Atomic operation: clear old stats and insert new ones
    const session = db.client.startSession()

    try {
      await session.withTransaction(async () => {
        await db.collection("stats").deleteMany({}, { session })
        await db.collection("stats").insertMany(timestampedStats, { session })
      })
    } finally {
      await session.endSession()
    }

    // Return clean stats without MongoDB fields
    const cleanStats = freshStats
    return NextResponse.json({ success: true, data: cleanStats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Calculate fresh stats
    const freshStats = await calculateStats(db)

    // Add timestamp to each stat
    const timestampedStats = freshStats.map((stat) => ({
      ...stat,
      updatedAt: new Date(),
    }))

    // Use transaction to ensure atomic operation
    const session = db.client.startSession()

    try {
      await session.withTransaction(async () => {
        // Clear all existing stats
        await db.collection("stats").deleteMany({}, { session })

        // Insert fresh stats
        await db.collection("stats").insertMany(timestampedStats, { session })
      })
    } finally {
      await session.endSession()
    }

    // Return clean stats without MongoDB fields
    return NextResponse.json({
      success: true,
      message: "Stats refreshed successfully!",
      data: freshStats,
    })
  } catch (error) {
    console.error("Error refreshing stats:", error)
    return NextResponse.json({ success: false, error: "Failed to refresh stats" }, { status: 500 })
  }
}
