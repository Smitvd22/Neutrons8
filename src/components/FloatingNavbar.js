"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  // Simulate login after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsLoggedIn(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <nav
  className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md transition-transform duration-300 ease-in-out inline-block ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
>
  <div className="px-4 py-2">
    <div className="flex items-center space-x-6">
      <Link href="/a" className="text-gray-800 hover:text-blue-600">
        Page A
      </Link>
      <Link href="/b" className="text-gray-800 hover:text-blue-600">
        Page B
      </Link>
      <Link href="/c" className="text-gray-800 hover:text-blue-600">
        Page C
      </Link>
      <Link href="/d" className="text-gray-800 hover:text-blue-600">
        Page D
      </Link>
    </div>
  </div>
</nav>
  )
}

