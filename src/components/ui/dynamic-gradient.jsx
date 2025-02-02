"use client"

import { useState, useEffect } from "react"

export function DynamicGradient({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const gradientStyle = {
    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 transition duration-300 ease-in-out transform" style={gradientStyle} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

