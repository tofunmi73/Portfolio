import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const DEFAULTS = {
  profileImage: "https://i.imgur.com/jMvaK9e.jpeg",
  name: "Jesutofunmi Ogidan",
  bio: "A Lagos-based artist who explores what people hold onto for strength and meaning in life — how these guiding forces have changed over time and across different cultures. Using abstract art and stylized portraits, he creates work that sparks conversations about the different ways people find stability and purpose.",
  location: "Lagos, Nigeria",
  activeSince: "2016",
  email: "jesutofunmiogidan@gmail.com",
  singulartUrl: "https://www.singulart.com/en/artist/xxx-70898",
  photoCaption: "Studio Portrait",
  photoSubcaption: "Lagos, 2023",
  statementParagraphs: [
    "My art explores how people find things to hold onto in life, looking at how these guiding forces have changed over time and across different cultures. The unspoken questions we face about what truly grounds us amidst life's constant flux directly fuel the conceptual core of my work.",
    "I translate these themes onto canvas using abstraction and abstracted portraiture, often incorporating intricate patterns with intentional exaggeration to draw the viewer deeply into the conversation. Through this visual language, I aim to open a dialogue about the diverse forms and historical shifts of these vital anchors.",
    "My artistic research explores these ideas within West African cultures, particularly those connected to the Niger River — looking at how our traditions help us find what to hold onto, not just to keep our rich history alive, but to start new conversations about strength and identity today.",
  ],
  education: [
    { title: "BTech Marine Science and Technology", institution: "Federal University of Technology Akure", year: "2019" },
    { title: "Artists' Connect Workshop", institution: "Lagos", year: "2020" },
    { title: "Mentorship under Seyi Alabi", institution: "", year: "2016" },
  ],
  selectedExhibitions: [
    { title: "Cross Currents", venue: "Society of Nigerian Artists — 17th Annual Juried Exhibition", year: "2023", type: "Group Show" },
    { title: "Ascension", venue: "Society of Nigerian Artists — 16th Annual Juried Exhibition", year: "2022", type: "Group Show" },
    { title: "Athens Open Art", venue: "Art Number 23, Athens", year: "2021", type: "Group Show" },
  ],
}

function mergeWithDefaults(doc: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...DEFAULTS }
  for (const key of Object.keys(DEFAULTS) as (keyof typeof DEFAULTS)[]) {
    const val = doc[key]
    if (val === undefined || val === null || val === "") continue
    if (Array.isArray(val) && val.length === 0) continue
    result[key] = val
  }
  return result
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const doc = await db.collection("about").findOne({ _type: "about" })
    const data = doc ? mergeWithDefaults(doc as Record<string, unknown>) : DEFAULTS
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error fetching about:", error)
    return NextResponse.json({ success: true, data: DEFAULTS })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    await db.collection("about").updateOne(
      { _type: "about" },
      { $set: { ...body, _type: "about", updatedAt: new Date() } },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating about:", error)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}
