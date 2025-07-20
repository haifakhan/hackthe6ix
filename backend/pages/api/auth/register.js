// backend/pages/api/register.js
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcrypt"

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" })

  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" })

  try {
    const db = await getDb()
    const users = db.collection("users")
    if (await users.findOne({ email })) {
      return res.status(409).json({ error: "Email already in use" })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    await users.insertOne({ email, passwordHash })
    return res.status(201).json({ message: "User created" })
  } catch (e) {
    console.error("Register error:", e)
    return res.status(500).json({ error: "Internal server error" })
  }
}
