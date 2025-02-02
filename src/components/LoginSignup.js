"use client"

import { motion } from "framer-motion"
import { playSound } from "@/lib/sound"

export default function LoginSignup() {
  return (
    <motion.button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => playSound("click")}
    >
      Login / Sign Up
    </motion.button>
  )
}

