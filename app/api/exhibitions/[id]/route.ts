import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"


// PUT /api/exhibitions - Update existing exhibition
export async function PUT(request: NextRequest) {
    try {
      const { db } = await connectToDatabase()
      const body = await request.json()
      const { _id, ...updateData } = body
  
      if (!_id) {
        return NextResponse.json(
          { success: false, error: "Exhibition ID is required" },
          { status: 400 }
        )
      }
  
      const exhibition = {
        ...updateData,
        updatedAt: new Date(),
      }
  
      const result = await db.collection("exhibitions").updateOne(
        { _id: new ObjectId(_id) },
        { $set: exhibition }
      )
  
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: "Exhibition not found" },
          { status: 404 }
        )
      }
  
      return NextResponse.json({
        success: true,
        data: { _id, ...exhibition },
      })
    } catch (error) {
      console.error("Error updating exhibition:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update exhibition" },
        { status: 500 }
      )
    }
  }