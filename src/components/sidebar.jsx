"use client"

import Link from "next/link"
import { Stethoscope, Activity, FileText, MessageSquare } from "lucide-react"

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black/30 backdrop-blur-sm border-r border-white/10">
      <div className="p-6">
        <Link href="/b" className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-white">HealthScribe</span>
        </Link>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          <Link
            href="/b/symptoms"
            className="flex items-center space-x-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Activity className="h-5 w-5" />
            <span>Symptoms Analyzer</span>
          </Link>
          
          <Link
            href="/b/prescription"
            className="flex items-center space-x-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Prescription Analyzer</span>
          </Link>
          
          <Link
            href="/b/chat"
            className="flex items-center space-x-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
            <span>General Chat</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
