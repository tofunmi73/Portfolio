import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid series ID format" },
        { status: 400 }
      )
    }

    const series = await db.collection("series").findOne({ _id: new ObjectId(id) })

    if (!series) {
      return NextResponse.json(
        { success: false, error: "Series not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: series })
  } catch (error) {
    console.error("Error fetching series:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch series" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params
    const body = await request.json()

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid series ID format" },
        { status: 400 }
      )
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await db.collection("series").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Series not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updateData })
  } catch (error) {
    console.error("Error updating series:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update series" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid series ID format" },
        { status: 400 }
      )
    }

    const result = await db.collection("series").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Series not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Series deleted successfully" })
  } catch (error) {
    console.error("Error deleting series:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete series" },
      { status: 500 }
    )
  }
}