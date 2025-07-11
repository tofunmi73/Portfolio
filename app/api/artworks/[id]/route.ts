import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const artwork = await db.collection("artworks").findOne({
      _id: new ObjectId(params.id),
    })

    if (!artwork) {
      return NextResponse.json({ success: false, error: "Artwork not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: artwork })
  } catch (error) {
    console.error("Error fetching artwork:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch artwork" }, { status: 500 })
  }
}

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { db } = await connectToDatabase()
//     const body = await request.json()

//     const { _id, ...updateFields } = body;

//     const result = await db.collection("artworks").updateOne(
//       { _id: new ObjectId(params.id) },
//       {
//         $set: {
//           ...updateFields,
//           updatedAt: new Date(),
//         },
//       },
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json({ success: false, error: "Artwork not found" }, { status: 404 })
//     }

//     return NextResponse.json({ success: true, message: "Artwork updated" })
//   } catch (error) {
//     console.error("Error updating artwork:", error)
//     return NextResponse.json({ success: false, error: "Failed to update artwork" }, { status: 500 })
//   }
// }

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
        { success: false, error: "Invalid artwork ID format" },
        { status: 400 }
      )
    }

    // First, get the current artwork to know which series it belongs to
    const currentArtwork = await db.collection("artworks").findOne({ _id: new ObjectId(id) })
    
    if (!currentArtwork) {
      return NextResponse.json(
        { success: false, error: "Artwork not found" },
        { status: 404 }
      )
    }

    // Update the artwork
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await db.collection("artworks").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Artwork not found" },
        { status: 404 }
      )
    }

    // If the artwork belongs to a series, update the series images array
    if (currentArtwork.series) {
      try {
        // Get all artworks for this series (including the updated one)
        const seriesArtworks = await db.collection("artworks")
          .find({ series: currentArtwork.series })
          .toArray()

        // Create updated images array
        const updatedImages = seriesArtworks.map(artwork => 
          artwork._id.toString() === id ? (body.image || artwork.image) : artwork.image
        ).filter(Boolean) // Remove any null/undefined images

        // Update the series document
        await db.collection("series").updateOne(
          { title: currentArtwork.series },
          { 
            $set: { 
              images: updatedImages,
              updatedAt: new Date()
            }
          }
        )

        // Also update coverImage if it was the first artwork
        const firstArtwork = seriesArtworks.find(artwork => artwork._id.toString() === id)
        if (firstArtwork && updatedImages[0]) {
          await db.collection("series").updateOne(
            { title: currentArtwork.series },
            { 
              $set: { 
                coverImage: updatedImages[0],
                updatedAt: new Date()
              }
            }
          )
        }

        console.log(`Updated series "${currentArtwork.series}" with new images`)
      } catch (seriesError) {
        console.error("Error updating series images:", seriesError)
        // Don't fail the artwork update if series update fails
      }
    }

    return NextResponse.json({ success: true, data: updateData })
  } catch (error) {
    console.error("Error updating artwork:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update artwork" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const result = await db.collection("artworks").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Artwork not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Artwork deleted" })
  } catch (error) {
    console.error("Error deleting artwork:", error)
    return NextResponse.json({ success: false, error: "Failed to delete artwork" }, { status: 500 })
  }
}
