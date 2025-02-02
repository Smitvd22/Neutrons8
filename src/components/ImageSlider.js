"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from "next/image"

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const images = [
    "/Feature1bg.jpg",
    "/Feature1bg.jpg",
    "/Feature1bg.jpg",
  ]

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={images[0] || "/placeholder.svg"}
          alt="Loading..."
          width={600}
          height={400}
          className="w-full h-[400px] object-cover"
        />
      </div>
    )
  }

  const navigate = (direction) => {
    setCurrentIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % images.length
      }
      return prev === 0 ? images.length - 1 : prev - 1
    })
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Slide ${currentIndex + 1}`}
            width={600}
            height={400}
            className="w-full h-[400px] object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => navigate("prev")}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => navigate("next")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white"
        aria-label="Next slide"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}