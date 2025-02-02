// src/app/components/Navbar.js
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Stethoscope } from "lucide-react"

export default function Navbar({ onFeaturesClick, onFAQClick, onAboutClick, onGetStartedClick }) {
  return (
    <nav className="sticky top-0 z-50 dark:bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
          <Link href="/b" className="flex items-center space-x-2">
          <Stethoscope className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-white">HealthScribe</span>
        </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onFeaturesClick}
              className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Features
            </button>
            <button
              onClick={onFAQClick}
              className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400"
            >
              FAQ
            </button>
            <button
              onClick={onAboutClick}
              className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400"
            >
              About
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              onClick={onGetStartedClick}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}