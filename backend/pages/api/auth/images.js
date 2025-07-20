// pages/api/images.js
import clientPromise from "@/lib/mongodb"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { auth0Id, imageUrl } = req.body
  if (!auth0Id || !imageUrl) {
    return res.status(400).json({ error: "Missing auth0Id or imageUrl" })
  }

  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const collection = db.collection("images")

    const result = await collection.insertOne({
      auth0Id,
      imageUrl,
      uploadedAt: new Date(),
    })

    return res.status(201).json({ insertedId: result.insertedId })
  } catch (error) {
    console.error("🔴 Mongo write error:", error)
    return res.status(500).json({ error: "Unable to save image" })
  }
}
