import * as dotenv from "dotenv"
import * as path from "path"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI not set in .env.local")

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  const existing = await db.collection("users").findOne({ email: "tofunmi73@gmail.com" })
  if (existing) {
    console.log("Admin user already exists.")
    await client.close()
    return
  }

  const hashedPassword = await bcrypt.hash("admin123", 12)
  await db.collection("users").insertOne({
    name: "Jesutofunmi",
    email: "tofunmi73@gmail.com",
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
  })

  console.log("Admin user created.")
  console.log("  Email:    tofunmi73@gmail.com")
  console.log("  Password: admin123")
  console.log("\nChange your password after first login!")
  await client.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
