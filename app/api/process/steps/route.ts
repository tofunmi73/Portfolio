import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const steps = await db.collection("process_steps").find({}).sort({ id: 1 }).toArray()

    return NextResponse.json({ success: true, data: steps })
  } catch (error) {
    console.error("Error fetching process steps:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch process steps" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const step = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("process_steps").insertOne(step)

    return NextResponse.json({
      success: true,
      data: { ...step, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Error creating process step:", error)
    return NextResponse.json({ success: false, error: "Failed to create process step" }, { status: 500 })
  }
}
