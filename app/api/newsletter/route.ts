import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const existingSubscriber = await db.collection("newsletter_subscribers").findOne({ email })

    if (existingSubscriber) {
      return NextResponse.json({ success: false, error: "Email already subscribed" }, { status: 409 })
    }

    await db.collection("newsletter_subscribers").insertOne({
      email,
      subscribedAt: new Date(),
      active: true,
    })

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 })
  }
}
