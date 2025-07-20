// components/chat-interface.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  ImageIcon, 
  Loader2, 
  Smile,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Bot,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  sender: "user" | "ai"
  text?: string
  imageUrl?: string
  timestamp: Date
  reactions?: string[]
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi there! I'm DermaAI 👋 Upload a skin image or describe your concern for personalized dermatology advice.",
      timestamp: new Date(Date.now() - 300000)
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const quickQuestions = [
    "How to treat acne?",
    "Best sunscreen for sensitive skin?",
    "Is this mole dangerous?",
    "Dry skin remedies?",
    "Anti-aging tips"
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

const handleSendMessage = async () => {
  if (input.trim() === "" || isSending) return;

  setIsSending(true);
  const newMessage: Message = {
    id: Date.now().toString(),
    sender: "user",
    text: input.trim(),
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, newMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMessage.text }),
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: typeof data.response === "string" ? data.response : data.response.output,
      timestamp: new Date(),
      reactions: [],
    };

    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    // Optionally show user an error message in the chat or toast
  } finally {
    setIsTyping(false);
    setIsSending(false);
  }
};

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result as string
      if (!imageUrl) return

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        imageUrl,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      setIsTyping(true)

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Thanks for uploading! Analyzing your skin image now...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)

        setTimeout(() => {
          router.push(`/dashboard/analysis?case=${Math.random() > 0.5 ? 'c' : 'h'}`)
        }, 1500)
      }, 1000)
    }

    reader.readAsDataURL(file)
  }

  const addReaction = (messageId: string, reaction: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          return {
            ...msg,
            reactions: reactions.includes(reaction) 
              ? reactions.filter(r => r !== reaction) 
              : [...reactions, reaction]
          }
        }
        return msg
      })
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden bg-gradient-to-b from-derma-blue-50 to-white">
      <div className="bg-gradient-to-r from-red-600 to-derma-green-200 p-4 text-white flex items-center">
        <div className="flex items-center">
          <Bot className="h-8 w-8 mr-3 text-derma-teal-200" />
          
        </div>
       
      </div>

      <ScrollArea 
        className="flex-1 p-4 md:p-6" 
        ref={scrollAreaRef}
      >
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 1 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
              <div className="relative mb-8">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-derma-teal-500 to-derma-red-300 rounded-full w-16 h-16 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <Bot className="h-24 w-24 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-derma-blue-700 mb-2">Welcome to DermaAI!</h3>
              <p className="text-red-500 max-w-md">
                I'm your AI dermatology assistant. Upload a skin image for analysis or ask a question about dermatology.
              </p>
              
              <div className="mt-8 w-full max-w-lg">
                <p className="text-derma-blue-500 text-sm mb-3">Try asking:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="bg-white border border-derma-blue-200 rounded-xl p-3 text-sm text-left hover:bg-derma-blue-50 hover:border-derma-blue-300 transition-all duration-200 shadow-sm"
                      onClick={() => {
                        setInput(question)
                        setTimeout(() => document.getElementById("chat-input")?.focus(), 50)
                      }}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex group",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "ai" && (
                  <Avatar className="mr-3 h-10 w-10 border-2 border-white shadow">
                    <AvatarImage src="/derma-ai-avatar.png" alt="AI Avatar" />
                    <AvatarFallback className="bg-gradient-to-r from-derma-blue-500 to-derma-teal-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col max-w-[85%] md:max-w-[75%]">
                  <div
                    className={cn(
                      "rounded-2xl p-4 shadow-sm transition-all duration-300",
                      message.sender === "user" 
                        ? "bg-gradient-to-r from-derma-blue-500 to-derma-blue-600 text-white rounded-br-none" 
                        : "bg-white border border-derma-blue-200 rounded-bl-none shadow",
                      message.imageUrl ? "p-2" : ""
                    )}
                  >
                    {message.text && (
                      <p className={message.sender === "user" ? "text-white" : "text-derma-blue-800"}>
                        {message.text}
                      </p>
                    )}
                    
                    {message.imageUrl && (
                      <div className="relative">
                        <div className="absolute top-2 right-2 bg-derma-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Analyzing...
                        </div>
                        <img
                          src={message.imageUrl}
                          alt="Uploaded"
                          className="w-48 h-48 object-cover rounded-lg border-2 border-white shadow"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-1.5">
                    <span className="text-xs text-green-500 mr-2">
                      {formatTime(message.timestamp)}
                    </span>
                    
                    {message.sender === "ai" && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => addReaction(message.id, "👍")}
                          className={cn(
                            "p-1 rounded-full hover:bg-derma-blue-50",
                            message.reactions?.includes("👍") ? "text-derma-blue-500" : "text-derma-blue-300"
                          )}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => addReaction(message.id, "👎")}
                          className={cn(
                            "p-1 rounded-full hover:bg-derma-blue-50",
                            message.reactions?.includes("👎") ? "text-derma-red-500" : "text-derma-blue-300"
                          )}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.sender === "user" && (
                  <Avatar className="ml-3 h-10 w-10 border-2 border-white shadow">
                    <AvatarImage src="/user-avatar.png" alt="User Avatar" />
                    <AvatarFallback className="bg-gradient-to-r from-derma-blue-700 to-derma-blue-900 text-white">
                      You
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="mr-3 h-10 w-10 border-2 border-white shadow">
                <AvatarImage src="/derma-ai-avatar.png" alt="AI Avatar" />
                <AvatarFallback className="bg-gradient-to-r from-derma-blue-500 to-derma-teal-500 text-white">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-derma-blue-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-derma-blue-400 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-derma-blue-400 animate-pulse delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-derma-blue-400 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-derma-blue-200 bg-white p-4">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Input
              id="chat-input"
              placeholder="Type your message or ask about your skin..."
              className="pl-10 pr-12 py-5 rounded-2xl border border-derma-blue-300 focus:border-derma-blue-500 shadow-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
              disabled={isTyping}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-derma-blue-400">
              <Smile className="h-5 w-5" />
            </div>
          </div>
          
          <label htmlFor="image-upload" className="cursor-pointer">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-derma-blue-100 text-green-600 hover:bg-derma-blue-200 rounded-full h-11 w-11"
            >
              <ImageIcon className="h-5 w-5" />
              <span className="sr-only">Upload Image</span>
            </Button>
            <input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </label>
          
          <Button
            onClick={handleSendMessage}
            disabled={isTyping || input.trim() === ""}
            className="bg-gradient-to-r from-derma-blue-600 to-derma-teal-600 hover:from-derma-blue-700 hover:to-derma-teal-700 rounded-full h-11 w-11 shadow-md"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Send className="h-5 w-5 text-white" />
            )}
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
        
        <div className="mt-3 text-center text-xs text-derma-blue-500">
          <p>Dermobot analyzes skin images and provides general information. Not a substitute for professional medical advice.</p>
        </div>
      </div>
    </div>
  )
}