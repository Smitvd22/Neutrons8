"use client"

import { Inter } from "next/font/google"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-main min-h-screen`}>
        <Sidebar />
        <main className="ml-64 p-6">
          <div className="p-6 mt-16">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to HealthScribe</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/b/symptoms"
                className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Symptoms Analyser</h2>
                <p className="text-white/70">Describe your symptoms and get instant analysis and recommendations.</p>
              </Link>
              <Link
                href="./b/prescription"
                className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-4">Prescription Analyser</h2>
                <p className="text-white/70">
                  Upload or type your prescription to understand medication details and instructions.
                </p>
              </Link>
              <Link
                href="/b/chat"
                className="p-6 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors"
              >
                <h2 className="text-xl font-semibold text-white mb-4">General Chat</h2>
                <p className="text-white/70">Have a general health query? Chat with our AI assistant for guidance.</p>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}