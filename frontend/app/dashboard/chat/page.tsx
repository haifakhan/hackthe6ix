// app/dashboard/chat/page.tsx
import { ChatInterface } from "@/components/chat-interface"
import { UploadPanel } from "@/components/upload-panel"

export default function ChatPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-derma-blue-50 to-derma-teal-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-red-700 bg-clip-text bg-gradient-to-r from-derma-blue-700 to-derma-teal-600 inline-block">
              Dermobot Assistant
            </h1>
            <p className="text-black-500 mt-2">AI-powered dermatology consultation</p>
          </div>
          <div className="bg-gradient-to-r from-derma-blue-500 to-derma-teal-500 text-white px-4 py-2 rounded-xl flex items-center">
            <span className="ml-2">24/7 Skin Support</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-8">
          <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-1 overflow-hidden">
            <ChatInterface />
          </div>
          <div className="bg-white rounded-2xl border border-red-200 shadow-xl p-1 overflow-hidden">
            <UploadPanel />
          </div>
        </div>
      </div>
    </div>
  )
}