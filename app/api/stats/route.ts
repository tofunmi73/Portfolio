import { type NextRequest, NextResponse } from "next/server"
import { type Db } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

async function calculateStats(db: Db) {
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
    const { client, db } = await connectToDatabase()

    const url = new URL(request.url)
    const forceRefresh = url.searchParams.get("refresh") === "true"

    if (!forceRefresh) {
      const recentStats = await db
        .collection("stats")
        .find({ updatedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } })
        .toArray()

      if (recentStats.length > 0) {
        const cleanStats = recentStats.map(({ _id, updatedAt, ...stat }) => stat)
        return NextResponse.json({ success: true, data: cleanStats })
      }
    }

    const freshStats = await calculateStats(db)
    const timestampedStats = freshStats.map((stat) => ({ ...stat, updatedAt: new Date() }))

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        await db.collection("stats").deleteMany({}, { session })
        await db.collection("stats").insertMany(timestampedStats, { session })
      })
    } finally {
      await session.endSession()
    }

    return NextResponse.json({ success: true, data: freshStats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { client, db } = await connectToDatabase()

    const freshStats = await calculateStats(db)
    const timestampedStats = freshStats.map((stat) => ({ ...stat, updatedAt: new Date() }))

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        await db.collection("stats").deleteMany({}, { session })
        await db.collection("stats").insertMany(timestampedStats, { session })
      })
    } finally {
      await session.endSession()
    }

    return NextResponse.json({ success: true, message: "Stats refreshed successfully!", data: freshStats })
  } catch (error) {
    console.error("Error refreshing stats:", error)
    return NextResponse.json({ success: false, error: "Failed to refresh stats" }, { status: 500 })
  }
}
