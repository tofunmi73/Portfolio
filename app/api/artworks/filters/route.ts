import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const col = db.collection("artworks")

    const [years, mediums, series] = await Promise.all([
      col.distinct("year"),
      col.distinct("medium"),
      col.distinct("series"),
    ])

    return NextResponse.json({
      success: true,
      data: {
        years: (years as number[]).filter(Boolean).sort((a, b) => b - a),
        mediums: (mediums as string[]).filter(Boolean).sort(),
        series: (series as string[]).filter(Boolean).sort(),
      },
    })
  } catch (error) {
    console.error("Error fetching filters:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch filters" }, { status: 500 })
  }
}
