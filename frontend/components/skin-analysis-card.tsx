import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { CircularProgress } from "./circular-progress"
import { Separator } from "@/components/ui/separator"
import { Lightbulb, FlaskConical, ShoppingBag } from "lucide-react"

interface SkinAnalysisCardProps {
  imageUrl: string
  analysisResult: string
  confidence: number
  severity: "Low" | "Medium" | "High" | "Urgent"
  aiInsights: string
  recommendations: string[]
  products: { name: string; imageUrl: string; link: string }[]
  homemadeRemedies: string[]
}

export function SkinAnalysisCard({
  imageUrl,
  analysisResult,
  confidence,
  severity,
  aiInsights,
  recommendations,
  products,
  homemadeRemedies,
}: SkinAnalysisCardProps) {
  const severityColor =
    severity === "Low"
      ? "bg-green-100 text-green-800"
      : severity === "Medium"
        ? "bg-yellow-100 text-yellow-800"
        : severity === "High"
          ? "bg-orange-100 text-orange-800"
          : "bg-red-100 text-red-800"

  return (
    <Card className="w-full animate-fade-in-up overflow-hidden">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-3xl font-bold text-derma-blue-700">Detailed Skin Analysis</CardTitle>
        <p className="text-muted-foreground">In-depth insights powered by Dermobot.</p>
      </CardHeader>
      <CardContent className="grid gap-8 p-6 md:grid-cols-2">
        {/* Image and Confidence Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative h-72 w-full overflow-hidden rounded-xl border-2 border-derma-blue-200 shadow-md">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt="Uploaded skin image"
              layout="fill"
              objectFit="contain"
              className="rounded-xl"
            />
          </div>
          <div className="flex w-full flex-col items-center space-y-4">
            <h3 className="text-2xl font-bold text-derma-blue-800">Detected: {analysisResult}</h3>
            <CircularProgress value={confidence} size={120} strokeWidth={10} />
            <Badge className={cn("text-md px-4 py-1.5 font-semibold", severityColor)}>Severity: {severity}</Badge>
          </div>
        </div>

        {/* AI Insights, Recommendations, Products/Remedies Section */}
        <div className="space-y-8">
          {/* AI Insights */}
          <div className="space-y-3 rounded-lg bg-derma-blue-50 p-4 shadow-sm">
            <h3 className="flex items-center text-xl font-semibold text-derma-blue-700">
              <Lightbulb className="mr-2 h-5 w-5 text-derma-teal-600" /> AI Insights
            </h3>
            <p className="text-derma-blue-800 leading-relaxed">{aiInsights}</p>
          </div>

          <Separator />

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="flex items-center text-xl font-semibold text-derma-blue-700">
              <FlaskConical className="mr-2 h-5 w-5 text-derma-teal-600" /> Personalized Recommendations
            </h3>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-derma-blue-800">
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Products & Homemade Remedies */}
          <div className="space-y-3">
            <h3 className="flex items-center text-xl font-semibold text-derma-blue-700">
              <ShoppingBag className="mr-2 h-5 w-5 text-derma-teal-600" /> Suggested Solutions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {products.map((product, index) => (
                <a
                  key={`product-${index}`}
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-derma-blue-100 hover:shadow-md"
                >
                  <Image
                    src={product.imageUrl || "/placeholder.svg?height=48&width=48"}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <span className="font-medium text-derma-blue-800">{product.name}</span>
                </a>
              ))}
              {homemadeRemedies.map((remedy, index) => (
                <div
                  key={`remedy-${index}`}
                  className="flex items-center space-x-3 rounded-lg border border-dashed border-derma-teal-300 bg-derma-teal-50 p-3"
                >
                  <Lightbulb className="h-6 w-6 text-derma-teal-600" />
                  <span className="font-medium text-derma-teal-800">{remedy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 text-center text-sm text-muted-foreground">
        <p>
          Disclaimer: Dermobot provides guidance for informational purposes only and is not a substitute for
          professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
        </p>
      </CardFooter>
    </Card>
  )
}
