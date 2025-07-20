"use client"

import { useSearchParams } from "next/navigation"
import { SkinAnalysisCard } from "@/components/skin-analysis-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AnalysisResultsPage() {
  const searchParams = useSearchParams()

  const imageUrl = searchParams.get("imageUrl") || "/placeholder.svg?height=200&width=200"
  const analysisResult = searchParams.get("result") || "Unknown Skin Condition"
  const confidence = Number.parseFloat(searchParams.get("confidence") || "0")
  const severity = (searchParams.get("severity") as "Low" | "Medium" | "High" | "Urgent") || "Low"

  // Simulated AI Insights and Recommendations (for demonstration)
  const aiInsights =
    searchParams.get("aiInsights") ||
    `Based on the image analysis, the lesion appears to be a common ${analysisResult.toLowerCase()}. While generally benign, it's important to monitor for any changes. Our AI suggests a low-risk profile for this specific finding.`
  const recommendations =
    searchParams.getAll("recommendations").length > 0
      ? searchParams.getAll("recommendations")
      : [
          "Maintain good skin hygiene and keep the area clean.",
          "Avoid picking or scratching the lesion to prevent irritation.",
          "Apply a gentle, non-comedogenic moisturizer to keep skin hydrated.",
          "Protect the area from direct sun exposure with clothing or sunscreen.",
          "Schedule a follow-up with a dermatologist if you notice any growth, color change, or discomfort.",
        ]

  const productNames = searchParams.getAll("productNames")
  const productUrls = searchParams.getAll("productUrls")
  const productImages = searchParams.getAll("productImages")

  const products = productNames.map((name, index) => ({
    name,
    imageUrl: productImages[index] || "/placeholder.svg?height=48&width=48",
    link: productUrls[index] || "#",
  }))

  const homemadeRemedies =
    searchParams.getAll("homemadeRemedies").length > 0
      ? searchParams.getAll("homemadeRemedies")
      : [
          "Apply aloe vera gel for soothing effects.",
          "Use a cool compress to reduce inflammation.",
          "Consider a diluted apple cider vinegar solution (patch test first).",
        ]

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
        imageUrl={imageUrl}
        analysisResult={analysisResult}
        confidence={confidence}
        severity={severity}
        aiInsights={aiInsights}
        recommendations={recommendations}
        products={products}
        homemadeRemedies={homemadeRemedies}
      />
    </div>
  )
}
