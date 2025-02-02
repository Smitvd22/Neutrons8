"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-center"
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to DotSlash8</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">Experience the future of web development with our cutting-edge platform.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md w-fit"
      >
        Get Started
      </motion.button>
    </motion.div>
  )
}