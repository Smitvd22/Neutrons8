"use client"

import { useState } from "react"

export default function SymptomsAnalyser() {
  const [input, setInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle symptom analysis here
    console.log("Analysing symptoms:", input)
    setInput("")
  }

  return (
    <div className="p-6 mt-16">
      <h1 className="text-4xl font-bold text-white mb-6">Symptoms Analyser</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 text-white bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg"
          rows="4"
          placeholder="Describe your symptoms here..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        >
          Analyse Symptoms
        </button>
      </form>
    </div>
  )
}

