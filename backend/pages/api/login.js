// backend/pages/api/login.js
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

    // 1) Look up user by email
    const user = await users.findOne({ email })
    if (!user) {
      // don’t leak which part failed
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // 2) Compare submitted password to stored hash
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // 3) Success!  (Here you could sign a JWT or set a cookie)
    return res.status(200).json({
      message: "Login successful",
      user: { email: user.email, name: user.name },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}
