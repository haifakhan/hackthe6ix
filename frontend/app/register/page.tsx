// frontend/app/register/page.tsx
import React from "react"
import { AuthForm } from "../../components/auth-form"

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <AuthForm type="register" />
    </div>
  )
}
