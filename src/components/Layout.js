"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import SearchBar from "./SearchBar"
import LoginSignup from "./LoginSignup"
import ProfileDisplay from "./ProfileDisplay"
import FloatingNavbar from "./FloatingNavbar"
import ScrollToTop from "./ScrollToTop"
import AIAssistButton from "./AIAssistButton"
import LoadingScreen from "./LoadingScreen"
import PageTransition from "./PageTransition"

export default function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoggedIn(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {isLoading && <LoadingScreen />}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            DotSlash8
          </Link>
          <div className="flex-grow flex justify-center">
            <SearchBar />
          </div>
          {isLoggedIn ? <ProfileDisplay /> : <LoginSignup />}
        </div>
      </header>
      <FloatingNavbar />
      <main className="container mx-auto px-4 py-8">
        <PageTransition>{children}</PageTransition>
      </main>
      <ScrollToTop />
      <AIAssistButton />
    </div>
  )
}