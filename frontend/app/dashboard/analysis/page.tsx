"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Lightbulb, FlaskConical, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

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

// Custom circular progress component using pure CSS
const CircularProgress = ({ value, size = 80 }: { value: number; size?: number }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="text-derma-teal-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-lg">{value}%</span>
      </div>
    </div>
  );
};

export default function AnalysisResultsPage() {
  const searchParams = useSearchParams()
  const caseType = searchParams.get("case") // 'c' or 'h'

  const analysisPresets: Record<"c" | "h", AnalysisData> = {
    c: {
      imageUrl: "/skin.jpg",
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
      imageUrl: "/skin.jpg",
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

  if (!caseType || !["c", "h"].includes(caseType)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-6 bg-derma-blue-50">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-2xl w-full shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-red-700">Missing or Invalid Case</h1>
          <p className="mb-6 text-red-600 text-lg">Please return to the upload page and try again.</p>
          <Link href="/dashboard/chat">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg h-12 rounded-xl shadow-md transition-transform hover:scale-105">
              Back to Chat
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const analysisData = analysisPresets[caseType as "c" | "h"]
  const severityColor =
    analysisData.severity === "Low"
      ? "bg-green-100 text-green-800 border-green-300"
      : analysisData.severity === "Medium"
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : analysisData.severity === "High"
          ? "bg-orange-100 text-orange-800 border-orange-300"
          : "bg-red-100 text-red-800 border-red-300"
          
  const severityProgressColor = 
    analysisData.severity === "Low"
      ? "text-green-500"
      : analysisData.severity === "Medium"
        ? "text-yellow-500"
        : analysisData.severity === "High"
          ? "text-orange-500"
          : "text-red-500"

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-derma-blue-50 to-derma-teal-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-derma-blue-700 bg-clip-text bg-gradient-to-r from-derma-blue-700 to-derma-teal-600 inline-block">
              Skin Analysis Dashboard
            </h1>
            <p className="text-derma-blue-500 mt-2">AI-powered dermatological assessment</p>
          </div>
          <Link href="/dashboard/chat" passHref>
            <Button variant="outline" className="bg-white hover:bg-derma-blue-50 text-derma-blue-700 px-5 py-3 rounded-xl border-derma-blue-300 shadow-sm transition-all hover:shadow-md">
              <ArrowLeft className="mr-2 h-5 w-5 text-derma-blue-600" /> 
              Back to Chat
            </Button>
          </Link>
        </div>

        <Card className="w-full overflow-hidden rounded-2xl border-0 shadow-2xl bg-white/90">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-derma-blue-700">Detailed Skin Analysis</CardTitle>
                <p className="text-derma-blue-500">In-depth insights powered by Dermobot</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="grid gap-8 p-6 md:grid-cols-[1fr_1.5fr]">
            {/* Image Section */}
            <div className="flex flex-col gap-6">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl border-4 border-white shadow-xl">
                <Image
                  src={analysisData.imageUrl || "/placeholder.svg"}
                  alt="Uploaded skin image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                  <h3 className="text-xl font-bold text-white">Detected: {analysisData.result}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-derma-blue-50 rounded-xl p-4 border border-derma-blue-200">
                  <p className="text-derma-blue-500 font-medium">Diagnosis</p>
                  <p className="text-lg font-semibold text-derma-blue-800">{analysisData.result}</p>
                </div>
                <div className={cn("rounded-xl p-4 border", severityColor)}>
                  <p className="font-medium">Severity Level</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">{analysisData.severity}</p>
                    <div className="flex space-x-1">
                      {[...Array(analysisData.severity === "Urgent" ? 4 : analysisData.severity === "High" ? 3 : analysisData.severity === "Medium" ? 2 : 1)].map((_, i) => (
                        <span key={i} className="w-2 h-6 bg-current rounded-full"></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Confidence Score - Moved below diagnosis and severity */}
              <div className="bg-white rounded-xl p-5 border border-derma-blue-200 shadow-sm flex flex-col items-center">
                <h2 className="font-semibold text-derma-blue-800 mb-3">Confidence Score</h2>
                <div className={cn(severityProgressColor)}>
                  <CircularProgress value={analysisData.confidence} size={350} />
                </div>
              </div>
            </div>

            {/* Insights & Recommendations Section */}
            <div className="space-y-8">
              {/* AI Insights */}
              <div className="rounded-2xl bg-gradient-to-br from-derma-blue-50 to-derma-teal-50 border border-derma-blue-200 p-5 shadow-sm">
                <h3 className="flex items-center text-xl font-semibold text-derma-blue-700 mb-3">
                  <Lightbulb className="mr-2 h-6 w-6 text-derma-teal-600 bg-derma-teal-100 p-1 rounded-full" /> 
                  AI Insights
                </h3>
                <p className="text-derma-blue-800 leading-relaxed bg-white/80 rounded-lg p-4 border border-derma-blue-100">
                  {analysisData.aiInsights}
                </p>
              </div>

              <Separator />

              {/* Recommendations */}
              <div className="rounded-2xl bg-gradient-to-br from-derma-blue-50 to-derma-teal-50 border border-derma-blue-200 p-5 shadow-sm">
                <h3 className="flex items-center text-xl font-semibold text-derma-blue-700 mb-3">
                  <FlaskConical className="mr-2 h-6 w-6 text-derma-teal-600 bg-derma-teal-100 p-1 rounded-full" /> 
                  Personalized Recommendations
                </h3>
                <ul className="space-y-3">
                  {analysisData.recommendations.map((rec, index) => (
                    <li 
                      key={index}
                      className="flex items-start p-3 bg-white rounded-lg border border-derma-blue-100 shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1 mr-3 bg-derma-blue-100 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-derma-blue-700 font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-derma-blue-800">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Products & Homemade Remedies */}
              <div className="rounded-2xl bg-gradient-to-br from-derma-blue-50 to-derma-teal-50 border border-derma-blue-200 p-5 shadow-sm">
                <h3 className="flex items-center text-xl font-semibold text-derma-blue-700 mb-3">
                  <ShoppingBag className="mr-2 h-6 w-6 text-derma-teal-600 bg-derma-teal-100 p-1 rounded-full" /> 
                  Suggested Solutions
                </h3>
                
                <div className="mb-4">
                  <h4 className="font-medium text-derma-blue-700 mb-2 flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Recommended Products
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisData.products.map((product, index) => (
                      <a
                        key={`product-${index}`}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 rounded-xl bg-white p-3 border border-derma-blue-200 transition-all hover:shadow-md hover:border-derma-teal-300"
                      >
                        <div className="border border-derma-blue-200 rounded-lg p-1">
                          <Image
                            src={product.imageUrl || "/placeholder.svg?height=48&width=48"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <span className="font-medium text-derma-blue-800">{product.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-derma-blue-700 mb-2 flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" /> Homemade Remedies
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisData.homemadeRemedies.map((remedy, index) => (
                      <div
                        key={`remedy-${index}`}
                        className="flex items-start p-3 rounded-xl bg-gradient-to-br from-derma-teal-50 to-green-50 border border-derma-teal-200"
                      >
                        <Lightbulb className="flex-shrink-0 mt-1 mr-3 h-5 w-5 text-derma-teal-600" />
                        <span className="font-medium text-derma-teal-800">{remedy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t border-derma-blue-200 pt-4 pb-6 px-6 text-center text-sm text-derma-blue-500">
            <p>
              Disclaimer: Dermobot provides guidance for informational purposes only and is not a substitute for
              professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}