"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UploadCloud, ImageIcon, Loader2 } from "lucide-react"

export function UploadPanel() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG or JPG image file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAnalyzeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      })
      return
    }

    const x = e.nativeEvent.offsetX
    const width = e.currentTarget.clientWidth
    const caseType = x < width / 2 ? "c" : "h"

    setIsUploading(true)

    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Image Uploaded!",
        description: "Redirecting to analysis results...",
        className: "bg-green-100 text-green-800",
      })
      router.push(`/dashboard/analysis?case=${caseType}`)
    }, 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <UploadCloud className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Skin Image Analysis</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Upload a clear photo of your skin concern for AI analysis. We'll provide:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
          <li>Instant analysis of skin conditions</li>
          <li>Personalized treatment recommendations</li>
          <li>Product suggestions</li>
          <li>Home remedy options</li>
        </ul>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 cursor-pointer transition-all
          ${selectedImage ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50 hover:bg-blue-100'}`}
        onClick={triggerFileInput}
      >
        {selectedImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-48 h-48 object-contain rounded-lg border border-gray-300 mb-4"
            />
            <p className="text-green-700 font-medium">Image Selected!</p>
            <p className="text-sm text-gray-500 mt-1">Click to change image</p>
          </div>
        ) : (
          <>
            <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-blue-600" />
            </div>
            <p className="font-medium text-gray-700 mb-1">Upload Skin Image</p>
            <p className="text-sm text-gray-500">
              Drag & drop or click to browse files
            </p>
            <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
          </>
        )}

        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>

      {/* Fake analyze button with invisible click zones */}
      <div 
        onClick={handleAnalyzeClick}
        className="relative w-full"
      >
        <Button
          disabled={!selectedImage || isUploading}
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 relative z-10"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Analyzing Your Skin...
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5 mr-2" />
              Analyze Skin Image
            </>
          )}
        </Button>

        {/* Optional: debug overlay — remove this border later */}
        {/* <div className="absolute top-0 left-0 h-full w-full border border-red-500 z-20" /> */}
      </div>

      
    </div>
  )
}
