import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const materials = await db.collection("materials").find({}).toArray()

    return NextResponse.json({ success: true, data: materials })
  } catch (error) {
    console.error("Error fetching materials:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch materials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const material = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("materials").insertOne(material)

    return NextResponse.json({
      success: true,
      data: { ...material, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating material category:", error)
    return NextResponse.json({ success: false, error: "Failed to create material category" }, { status: 500 })
  }
}
