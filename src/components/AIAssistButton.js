"use client"

import { motion } from "framer-motion"
import { playSound } from "../utils/sound"

export default function AIAssistButton() {
  return (
    <motion.button
      className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => playSound("popup")}
    >
      AI Assist
    </motion.button>
  )
}

