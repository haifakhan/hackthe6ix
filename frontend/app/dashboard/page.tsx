// frontend/app/dashboard/page.tsx
import { redirect } from "next/navigation"

export default function DashboardIndex() {
  // immediately redirect to /dashboard/chat
  redirect("/dashboard/chat")
}

