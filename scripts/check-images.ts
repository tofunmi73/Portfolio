import * as dotenv from "dotenv"
import * as path from "path"
import { MongoClient } from "mongodb"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI!)
  await client.connect()
  const db = client.db()
  
  const artworks = await db.collection("artworks").find({}).toArray()
  console.log(`Total artworks: ${artworks.length}`)
  
  if (artworks.length > 0) {
    const sample = artworks.slice(0, 3)
    for (const a of sample) {
      console.log(`  "${a.title}" → ${a.image?.slice(0, 80) ?? "(no image)"}`)
    }
    
    const imgur = artworks.filter(a => a.image?.includes("i.imgur.com"))
    const cloudinary = artworks.filter(a => a.image?.includes("res.cloudinary.com"))
    const other = artworks.filter(a => a.image && !a.image.includes("imgur") && !a.image.includes("cloudinary"))
    
    console.log(`\n  imgur:     ${imgur.length}`)
    console.log(`  cloudinary: ${cloudinary.length}`)
    console.log(`  other:      ${other.length}`)
  }
  
  await client.close()
}

main().catch(console.error)
