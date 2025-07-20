"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { checkAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/login") // Redirect to login if not authenticated
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-derma-blue-50 to-derma-teal-100">
        <Loader2 className="h-10 w-10 animate-spin text-derma-blue-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <h2 className="text-2xl font-bold text-derma-blue-700">Dermobot</h2>
          <UserNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
