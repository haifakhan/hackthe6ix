import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black p-4 text-center">
      {/* 🔁 Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
      >
        <source src="/background2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔲 Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 🔳 Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        <div className="flex items-center justify-center space-x-4 animate-fade-in-up">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
            Dermobot
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-white md:text-xl animate-fade-in-up delay-200">
          Dermobot is an AI-driven web app that delivers preventative skin care support in minutes
        </p>

        {/* 👇 Login Button */}
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up delay-400">
          <Link href="/login" passHref>
            <Button className="w-full rounded-full bg-white px-8 py-3 text-lg font-semibold text-derma-blue-600 shadow-lg transition-all hover:scale-105 hover:bg-gray-100 md:w-auto">
              Login
            </Button>
          </Link>

          {/* 👉 Sign Up Link */}
          <p className="text-white text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="underline font-semibold hover:text-gray-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
