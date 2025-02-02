"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error } = useChat({
    api: "/api/gemini"
  });
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto p-4">
      {/* Messages Container */}
      <div className="flex-1 space-y-4 mb-4">
        {messages?.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
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
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100"
              }`}
            >
              <ReactMarkdown 
                children={message.content}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    return inline ? (
                      <code className="bg-gray-200 text-gray-800 rounded px-1" {...props}>
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-200 text-gray-800 rounded p-2 mt-2">
                        <code>{children}</code>
                      </pre>
                    );
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
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5" />
            <button 
              className="text-blue-600 hover:underline"
              onClick={() => stop()}
            >
              Stop generating
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500">
            <span>An error occurred.</span>
            <button 
              className="text-blue-600 hover:underline"
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
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          Send
        </Button>
      </form>
    </div>
  );
}