"use client"

import React, { useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Sidebar } from "@/components/sidebar"
import { Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useChat } from "@ai-sdk/react"

const inter = Inter({ subsets: ["latin"] })

export default function GeneralChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({
    api: "/api/gemini"
  })
  
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className={`${inter.className} bg-gradient-main min-h-screen`}>
      <Sidebar />
      <main className="ml-64 p-6">
        <div className="p-6 mt-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">General Chat</h1>
          
          {/* Messages Container */}
          <div className="flex-1 space-y-4 mb-4">
            {messages?.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                Start a conversation...
              </div>
            )}
            
            {messages?.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user" 
                      ? "bg-primary text-white" 
                      : "bg-black/30 backdrop-blur-sm text-white"
                  }`}
                >
                  <ReactMarkdown 
                    children={message.content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return inline ? (
                          <code className="bg-black/40 text-gray-200 rounded px-1" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-black/40 text-gray-200 rounded p-2 mt-2">
                            <code>{children}</code>
                          </pre>
                        )
                      },
                      ul: ({ children }) => (
                        <ul className="list-disc ml-4">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-4">{children}</ol>
                      ),
                    }}
                  />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-white">
                <Loader2 className="animate-spin h-5 w-5" />
                <button 
                  className="text-primary hover:underline"
                  onClick={() => stop()}
                >
                  Stop generating
                </button>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-400">
                <span>An error occurred.</span>
                <button 
                  className="text-primary hover:underline"
                  onClick={() => reload()}
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={scrollRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSubmit}
            className="flex gap-2 sticky bottom-4"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your health-related question here..."
              className="flex-1 text-white bg-black/30 backdrop-blur-sm border border-white/10"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Send
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
} 