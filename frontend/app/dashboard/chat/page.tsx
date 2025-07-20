import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-4xl font-bold text-derma-blue-700 animate-fade-in-up">Your project Chatbot</h1>
      <ChatInterface />
    </div>
  )
}
