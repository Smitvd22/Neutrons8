"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Prescription() {
  const [image, setImage] = useState(null)
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysisType, setAnalysisType] = useState("prescription")

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setAnalysis("")
    }
  }

  const handleImageAnalysis = async (e) => {
    e.preventDefault()
    if (!image) return

    setLoading(true)
    const formData = new FormData()
    formData.append("image", image)

    try {
      const endpoint = analysisType === "prescription" ? "/api/parse-prescription" : "/api/parse-test"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      let formattedAnalysis = data.analysis
      
      // Try to parse if it's JSON string
      try {
        const parsedData = JSON.parse(data.analysis)
        formattedAnalysis = JSON.stringify(parsedData, null, 2)
      } catch (e) {
        // If not JSON, keep as is
        console.log("Analysis is not in JSON format")
      }
      
      setAnalysis(formattedAnalysis)
    } catch (error) {
      console.error("Error:", error)
      setAnalysis("Error processing image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 bg-[#0a192f]">
      <div className="flex justify-between items-center  mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Camera className="h-6 w-6" />
          Prescription Analyzer
        </h2>
      </div>
      <form onSubmit={handleImageAnalysis} className="space-y-4">
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
        <Select value={analysisType} onValueChange={setAnalysisType} classname="bg-black/30">
          <SelectTrigger>
            <SelectValue placeholder="Select analysis type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="test">Medical Test</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full" disabled={!image || loading} >
          {loading ? "Analyzing..." : "Analyze Image"}
        </Button>
      </form>
      {analysis && (
        <pre className="mt-4 p-4 bg-secondary rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-sm">
          {analysis}
        </pre>
      )}
    </Card>
  )
}