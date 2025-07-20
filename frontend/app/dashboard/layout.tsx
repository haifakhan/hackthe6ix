// frontend/app/dashboard/layout.tsx
"use client"

import Link from "next/link"
import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuth } from "@/lib/auth"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Auth guard
  useEffect(() => {
    if (!checkAuth()) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Tab bar */}
      <nav className="bg-white shadow flex space-x-4 px-6 py-3">
        <Link href="/dashboard/chat" className="hover:underline">
          Chat
        </Link>
        <Link href="/dashboard/analysis" className="hover:underline">
          Skin Analysis
        </Link>
        <Link href="/dashboard/profile" className="hover:underline">
          Profile
        </Link>
      </nav>

      {/* Page content */}
      <main>{children}</main>
    </div>
  )
}
