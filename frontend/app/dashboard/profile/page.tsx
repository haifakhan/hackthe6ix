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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { toast } = useToast()
  const router = useRouter()

  const [name, setName] = useState("John Doe")
  const [age, setAge] = useState("30")
  const [ethnicity, setEthnicity] = useState("Caucasian")
  const [gender, setGender] = useState("Male")
  const [weight, setWeight] = useState("70") // in kg
  const [height, setHeight] = useState("175") // in cm
  const [medicalHistory, setMedicalHistory] = useState("No significant medical history.")

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()

  const userId = localStorage.getItem("userId")
  // if (!userId) {
  //   alert("User not logged in.")
  //   return
  // }

  const profileData = {
    userId,
    name,
    age,
    gender,
    ethnicity,
    weight,
    height,
    medicalHistory,
  }

  try {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })

    if (!res.ok) {
      throw new Error("Failed to save profile")
    }

    toast({
      title: "Profile Updated!",
      description: "Your profile information has been saved.",
      className: "bg-derma-teal-100 text-derma-teal-800",
    })

    router.push("/dashboard/chat")
  } catch (error) {
    console.error("Error saving profile:", error)
    alert("Something went wrong saving your profile.")
  }
}

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-derma-blue-700">Complete Your Profile</CardTitle>
          <CardDescription>
            Provide some basic information to personalize your Dermobot experience.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ethnicity">Ethnicity</Label>
              <Select value={ethnicity} onValueChange={setEthnicity}>
                <SelectTrigger id="ethnicity">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Caucasian">Caucasian</SelectItem>
                  <SelectItem value="African American">African American</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-history">Medical History / Relevant Conditions</Label>
              <Textarea
                id="medical-history"
                placeholder="e.g., allergies, existing skin conditions, medications..."
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full bg-derma-blue-500 hover:bg-derma-blue-600">
              Save Profile
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          <p>Your information helps us provide more accurate and personalized guidance.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
