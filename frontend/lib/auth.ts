// frontend/lib/auth.ts
const API_BASE = "http://localhost:3002"  // your backend dev URL

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || "Login failed")
  }
  return data.user
}

export async function register(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || "Registration failed")
  }
  return data
}

/**
 * Called in dashboard layout to guard access.
 * Right now it just returns true so you can see the page.
 * Later you can replace with real session check.
 */
export function checkAuth(): boolean {
  return true
}
