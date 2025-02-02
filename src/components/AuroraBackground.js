"use client"
import { cn } from "@/lib/utils"
import React from "react"

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main className="min-h-screen w-full">
      <div
        className={cn(
          "relative flex flex-col min-h-screen bg-[#0a192f] text-white",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(`
              before:absolute before:inset-0
              before:bg-gradient-to-b
              before:from-transparent
              before:to-[#0a192f]/80
              before:z-[1]
              after:absolute
              after:inset-0
              after:bg-[linear-gradient(40deg,transparent_20%,#4c00ff,#1cc4d7,transparent_80%)]
              after:opacity-[0.15]
              after:blur-[100px]
              after:animate-aurora
              after:z-[2]
            `)}
          />
        </div>
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </main>
  )
}

export default AuroraBackground 