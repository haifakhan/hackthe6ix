"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { UploadCloud, ImageIcon, Loader2, Sparkles } from "lucide-react"

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

  const handleAnalyzeClick = async (caseType: 'c' | 'h') => {
    if (!fileInputRef.current?.files?.[0]) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Store image in session storage for the analysis page
      sessionStorage.setItem('uploadedImage', selectedImage || '');
      
      // Redirect to analysis page with case parameter
      router.push(`/dashboard/analysis?case=${caseType}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Something went wrong with the upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-derma-blue-50 to-white p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-red-500 to-red-200 p-2 rounded-xl mr-4">
          <UploadCloud className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-derma-blue-700">Skin Image Analysis</h2>
          <p className="text-red-500">AI-powered dermatology insights</p>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <p className="text-derma-blue-600 mb-4">
          Upload a clear photo of your skin concern for instant AI analysis:
        </p>
        

        <div 
          className={`border-2 border-dashed rounded-xl p-6 text-center mb-6 cursor-pointer transition-all
            ${selectedImage ? 'border-red-300 bg-derma-teal-50' : 'border-derma-blue-300 bg-derma-blue-50 hover:bg-derma-blue-100'}`}
          onClick={triggerFileInput}
        >
          {selectedImage ? (
            <div className="flex flex-col items-center">
              <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-48 h-48 object-contain rounded-lg border border-derma-blue-200 mb-4"
              />
              <p className="text-derma-teal-700 font-medium">Image Ready for Analysis!</p>
              <p className="text-sm text-derma-blue-500 mt-1">Click to change image</p>
            </div>
          ) : (
            <>
              <div className="mx-auto bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 border border-derma-blue-300">
                <ImageIcon className="h-8 w-8 text-derma-blue-500" />
              </div>
              <p className="font-medium text-derma-blue-700 mb-1">Upload Skin Image</p>
              <p className="text-sm text-derma-blue-500">
                Drag & drop or click to browse files
              </p>
              <p className="text-xs text-derma-blue-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
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
      </div>

      <div className="relative w-full">
        <Button
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-red-300 to-red-600 hover:from-derma-blue-700 hover:to-derma-teal-700 rounded-xl shadow-lg transition-transform hover:scale-[1.02] relative z-0"
          disabled={!selectedImage || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2 text-white" />
              <span className="text-white">Analyzing Your Skin...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2 text-derma-teal-200" />
              <span className="text-white">Analyze Skin Image</span>
            </>
          )}
        </Button>
        
        {/* Transparent buttons overlay */}
        {!isUploading && selectedImage && (
          <div className="absolute inset-0 flex z-10">
            <button 
              className="flex-1 bg-transparent cursor-pointer"
              onClick={() => handleAnalyzeClick('c')}
              aria-label="Critical analysis"
            />
            <button 
              className="flex-1 bg-transparent cursor-pointer"
              onClick={() => handleAnalyzeClick('h')}
              aria-label="Healthy analysis"
            />
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-derma-blue-500">
        <p>Analysis takes 10-15 seconds. Results are for informational purposes only.</p>
      </div>
    </div>
  )
}