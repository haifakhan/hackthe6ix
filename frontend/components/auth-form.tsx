"use client"
import React, { useState } from "react"
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

export function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const VALID_EMAIL = "you@example.com"
  const VALID_PASSWORD = "password123"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // only allow ONE hard-coded user
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // on "register", just pretend it worked
      // on "login", same
      router.push("/dashboard/profile")
    } else {
      setError("Invalid credentials. Try you@example.com / password123")
    }
  }

  return (
    <Card className="w-full max-w-md animate-fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-derma-blue-700">
          {type === "login" ? "Welcome Back!" : "Join DermaScan AI"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Sign in to your account"
            : "Create your account to get started"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder={VALID_EMAIL}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={VALID_PASSWORD}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-derma-blue-500 hover:bg-derma-blue-600"
          >
            {type === "login" ? "Login" : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        {type === "login" ? (
          <p>
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-derma-blue-500 hover:underline"
            >
              Register
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-derma-blue-500 hover:underline"
            >
              Login
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  )
  
}

export function checkAuth(): boolean {
  return true
}
