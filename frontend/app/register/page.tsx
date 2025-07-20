import { AuthForm } from "@/components/auth-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-derma-blue-50 to-derma-teal-100 p-4">
      <AuthForm type="register" />
    </div>
  )
}
