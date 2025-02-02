"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { SessionProvider } from 'next-auth/react';

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
})

// Create a combined provider component that handles both theme and session
function ThemeProviderComponent({ children }) {
  const [theme, setTheme] = useState("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  if (!mounted) {
    return null
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// Main Provider component that combines SessionProvider and ThemeProvider
export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProviderComponent>
        {children}
      </ThemeProviderComponent>
    </SessionProvider>
  )
}

// Export the theme hook for use in other components
export const useTheme = () => useContext(ThemeContext)