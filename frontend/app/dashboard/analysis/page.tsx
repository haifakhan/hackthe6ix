"use client"

import { useSearchParams } from "next/navigation"
import { SkinAnalysisCard } from "@/components/skin-analysis-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

type SeverityLevel = "Low" | "Medium" | "High" | "Urgent"

interface AnalysisData {
  imageUrl: string
  result: string
  confidence: number
  severity: SeverityLevel
  aiInsights: string
  recommendations: string[]
  products: {
    name: string
    imageUrl: string
    link: string
  }[]
  homemadeRemedies: string[]
}

export default function AnalysisResultsPage() {
  const searchParams = useSearchParams()
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const caseType = searchParams.get("case") // 'c' or 'h'
    const analysisId = searchParams.get("analysisId")

    if (!caseType || !["c", "h"].includes(caseType)) {
      setError("Missing or invalid case parameter.")
      setLoading(false)
      return
    }

    if (!analysisId) {
      setError("Missing analysis ID.")
      setLoading(false)
      return
    }

    const storedData = sessionStorage.getItem(analysisId)
    if (!storedData) {
      setError("No analysis data found.")
      setLoading(false)
      return
    }

    try {
      const parsedData = JSON.parse(storedData)

      const analysisPresets: Record<"c" | "h", AnalysisData> = {
        c: {
          imageUrl: parsedData.imageUrl,
          result: "Possible Skin Cancer (Melanoma)",
          confidence: 87,
          severity: "Urgent",
          aiInsights: "The analysis suggests this lesion may indicate melanoma. Immediate follow-up with a certified dermatologist is critical.",
          recommendations: [
            "Do not ignore this result — book an urgent dermatology consult.",
            "Avoid sun exposure until further diagnosis is complete.",
            "Track any changes in size, asymmetry, or color.",
          ],
          products: [
            {
              name: "Neutrogena Sensitive Skin Sunscreen SPF 60+",
              imageUrl: "/placeholder.svg?height=48&width=48",
              link: "#",
            },
          ],
          homemadeRemedies: [
            "None — please seek professional medical attention immediately.",
          ],
        },
        h: {
          imageUrl: parsedData.imageUrl, // Show uploaded image for both cases
          result: "Healthy Skin – No Conditions Detected",
          confidence: 98,
          severity: "Low",
          aiInsights: "Your skin appears healthy with no visible signs of dermatological concern. Maintain your current skincare habits.",
          recommendations: [
            "Use a gentle cleanser daily.",
            "Apply a broad-spectrum SPF 30+ sunscreen.",
            "Stay hydrated and follow a balanced diet.",
          ],
          products: [
            {
              name: "CeraVe Hydrating Cleanser",
              imageUrl: "/placeholder.svg?height=48&width=48",
              link: "#",
            },
            {
              name: "EltaMD UV Daily SPF 40",
              imageUrl: "/placeholder.svg?height=48&width=48",
              link: "#",
            },
          ],
          homemadeRemedies: [
            "Honey & Yogurt Mask: Hydrates and soothes skin.",
            "Cucumber slices for refreshing puffiness reduction.",
          ],
        },
      }

      setAnalysisData(analysisPresets[caseType as "c" | "h"])
    } catch (err) {
      setError("Failed to parse analysis data.")
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error || !analysisData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-red-700">Error</h1>
          <p className="mb-6 text-red-600">{error || "Unknown error occurred."}</p>
          <Link href="/dashboard/chat">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
              Back to Chat
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-4xl font-bold text-derma-blue-700 animate-fade-in-up">Skin Analysis Dashboard</h1>
        <Link href="/dashboard/chat" passHref>
          <Button variant="outline" className="bg-derma-blue-50 hover:bg-derma-blue-100 text-derma-blue-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chat
          </Button>
        </Link>
      </div>

      <SkinAnalysisCard
        imageUrl={analysisData.imageUrl}
        analysisResult={analysisData.result}
        confidence={analysisData.confidence}
        severity={analysisData.severity}
        aiInsights={analysisData.aiInsights}
        recommendations={analysisData.recommendations}
        products={analysisData.products}
        homemadeRemedies={analysisData.homemadeRemedies}
      />
    </div>
  )
}
