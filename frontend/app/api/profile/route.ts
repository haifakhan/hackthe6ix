import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const {
    userId,
    name,
    age,
    gender,
    ethnicity,
    weight,
    height,
    medicalHistory,
  } = body

  // Example: save to DB here
  console.log("Received profile data for user:", userId)

  return NextResponse.json({ success: true })
}
