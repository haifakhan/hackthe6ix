"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/lib/auth"

export function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      login()
      router.push("/dashboard/profile")
    } else {
      alert("Please enter email and password.")
    }
  }

  return (
    <Card className="w-[600px] h-[700px] p-8 bg-white/50 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl animate-fade-in-up flex flex-col justify-center">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-derma-blue-900 drop-shadow-sm">
          {type === "login" ? "Welcome Back!" : "Join Dermobot"}
        </CardTitle>
        <CardDescription className="text-xl text-derma-blue-800 mt-2">
          {type === "login"
            ? "Sign in to your account"
            : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-lg text-derma-blue-900 font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password" className="text-lg text-derma-blue-900 font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-derma-blue-600 hover:bg-derma-blue-700 text-white text-lg font-semibold py-3"
          >
            {type === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-base text-derma-blue-700">
        {type === "login" ? (
          <p>
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-derma-blue-600 hover:underline"
            >
              Register
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-derma-blue-600 hover:underline"
            >
              Login
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
