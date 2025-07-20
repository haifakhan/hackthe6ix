import { ChatInterface } from "@/components/chat-interface"
import { UploadPanel } from "@/components/upload-panel"

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-4xl font-bold text-derma-blue-700 animate-fade-in-up">DermaAI Assistant</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-7/12">
          <ChatInterface />
        </div>
        <div className="lg:w-5/12">
          <UploadPanel />
        </div>
      </div>
    </div>
  )
}