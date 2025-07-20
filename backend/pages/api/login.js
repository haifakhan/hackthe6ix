// backend/pages/api/login.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" })
  }

  // Simulate login for now (or add MongoDB lookup here later)
  console.log("🟢 Received login request:", { email, password })

  return res.status(200).json({ message: "Login received", user: { email } })
}
