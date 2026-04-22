/**
 * One-time migration script: re-uploads all non-Cloudinary images in MongoDB to Cloudinary
 * and updates the documents in place.
 *
 * Run with:  npm run migrate-images
 *
 * Safe to run multiple times — already-migrated URLs are skipped.
 */

import * as dotenv from "dotenv"
import * as path from "path"
import { MongoClient } from "mongodb"
import { v2 as cloudinary } from "cloudinary"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const CLOUDINARY_HOST = "res.cloudinary.com"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

function isCloudinaryUrl(url: string): boolean {
  return typeof url === "string" && url.includes(CLOUDINARY_HOST)
}

async function uploadUrlToCloudinary(url: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(url, {
    folder,
    resource_type: "auto",
  })
  return result.secure_url
}

async function migrateField(
  url: string,
  folder: string,
  label: string,
): Promise<string> {
  if (!url || isCloudinaryUrl(url)) return url
  console.log(`  Uploading: ${url.slice(0, 80)}...`)
  const newUrl = await uploadUrlToCloudinary(url, folder)
  console.log(`  Done (${label}): ${newUrl}`)
  return newUrl
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI not set in .env.local")

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()
  console.log("Connected to MongoDB\n")

  let totalMigrated = 0

  // ── Artworks ──────────────────────────────────────────────────────────────
  console.log("=== Artworks ===")
  const artworks = await db.collection("artworks").find({}).toArray()
  for (const doc of artworks) {
    const updates: Record<string, unknown> = {}

    if (doc.image && !isCloudinaryUrl(doc.image)) {
      updates.image = await migrateField(doc.image, "artist-portfolio/artworks", "image")
    }

    if (Array.isArray(doc.processImages)) {
      const migrated = await Promise.all(
        doc.processImages.map((u: string) =>
          migrateField(u, "artist-portfolio/process", "processImage"),
        ),
      )
      if (migrated.some((u, i) => u !== doc.processImages[i])) {
        updates.processImages = migrated
      }
    }

    if (Object.keys(updates).length > 0) {
      await db.collection("artworks").updateOne({ _id: doc._id }, { $set: updates })
      console.log(`  Updated artwork: "${doc.title}"`)
      totalMigrated++
    }
  }

  // ── Blog Posts ────────────────────────────────────────────────────────────
  console.log("\n=== Blog Posts ===")
  const posts = await db.collection("blog_posts").find({}).toArray()
  for (const doc of posts) {
    if (doc.image && !isCloudinaryUrl(doc.image)) {
      const newUrl = await migrateField(doc.image, "artist-portfolio/journal", "image")
      await db.collection("blog_posts").updateOne({ _id: doc._id }, { $set: { image: newUrl } })
      console.log(`  Updated post: "${doc.title}"`)
      totalMigrated++
    }
  }

  // ── Exhibitions ───────────────────────────────────────────────────────────
  console.log("\n=== Exhibitions ===")
  const exhibitions = await db.collection("exhibitions").find({}).toArray()
  for (const doc of exhibitions) {
    if (Array.isArray(doc.images) && doc.images.length > 0) {
      const migrated = await Promise.all(
        doc.images.map((u: string) =>
          migrateField(u, "artist-portfolio/exhibitions", "image"),
        ),
      )
      if (migrated.some((u, i) => u !== doc.images[i])) {
        await db.collection("exhibitions").updateOne({ _id: doc._id }, { $set: { images: migrated } })
        console.log(`  Updated exhibition: "${doc.title}"`)
        totalMigrated++
      }
    }
  }

  // ── Process Steps ─────────────────────────────────────────────────────────
  console.log("\n=== Process Steps ===")
  const steps = await db.collection("process_steps").find({}).toArray()
  for (const doc of steps) {
    if (doc.image && !isCloudinaryUrl(doc.image)) {
      const newUrl = await migrateField(doc.image, "artist-portfolio/process", "image")
      await db.collection("process_steps").updateOne({ _id: doc._id }, { $set: { image: newUrl } })
      console.log(`  Updated step: "${doc.title}"`)
      totalMigrated++
    }
  }

  // ── Studio Images ─────────────────────────────────────────────────────────
  console.log("\n=== Studio Images ===")
  const studioImages = await db.collection("studio_images").find({}).toArray()
  for (const doc of studioImages) {
    if (doc.image && !isCloudinaryUrl(doc.image)) {
      const newUrl = await migrateField(doc.image, "artist-portfolio/studio", "image")
      await db.collection("studio_images").updateOne({ _id: doc._id }, { $set: { image: newUrl } })
      console.log(`  Updated studio image: "${doc.title}"`)
      totalMigrated++
    }
  }

  // ── Timelapse Videos (thumbnails) ──────────────────────────────────────────
  console.log("\n=== Timelapse Video Thumbnails ===")
  const videos = await db.collection("timelapse_videos").find({}).toArray()
  for (const doc of videos) {
    if (doc.thumbnail && !isCloudinaryUrl(doc.thumbnail)) {
      const newUrl = await migrateField(doc.thumbnail, "artist-portfolio/thumbnails", "thumbnail")
      await db.collection("timelapse_videos").updateOne({ _id: doc._id }, { $set: { thumbnail: newUrl } })
      console.log(`  Updated video: "${doc.title}"`)
      totalMigrated++
    }
  }

  console.log(`\nMigration complete. ${totalMigrated} document(s) updated.`)
  await client.close()
}

main().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})
