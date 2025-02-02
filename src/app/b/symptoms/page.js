"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Inter } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function SymptomsAnalyser() {
  const [input, setInput] = useState("")

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    purpose: "",
    language: "",
    location: "",
    severity: "",
    symptoms: "",
    allergies: "",
    medical_history: "",
    emergency_contact: "",
  });
  const [output, setOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [miraResults, setMiraResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsLoading(true);
    setOutput("Processing your information...");

    try {
      const symptomsResponse = await fetch("/api/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const symptomsData = await symptomsResponse.json();

      if (symptomsData.success) {
        const miraResponse = await fetch("/api/process-medical-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: symptomsData.data._id }),
        });

        const miraData = await miraResponse.json();

        if (miraData.error) {
          setOutput(`Error: ${miraData.error}`);
          return;
        }

        setMiraResults(miraData);
        setOutput("Analysis complete. Results are displayed below.");
      } else {
        setOutput(`Error: ${symptomsData.error || "There was an error saving your information. Please try again."}`);
      }
    } catch (error) {
      console.error("Full Error:", error);
      setOutput(`Error: ${error.message || "There was an error processing your information. Please try again."}`);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-4">
      <div className="flex justify-between items-center mb-8">
        {/* <Button variant="ghost" className="rounded-full p-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0a192f] font-bold">LOGO</span>
          </div>
        </Button> */}
        {/* <Button variant="ghost" className="rounded-full p-2">
          <User className="w-6 h-6 text-white" />
        </Button> */}
      </div>

      <Card className="bg-black/30 backdrop-blur-sm border-white/10 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="h-6 w-6" />
            Symptoms Analyzer
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-1 block">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Enter your age"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Gender</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="e.g., Male, Female, Other"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Purpose of Visit</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Brief description of visit purpose"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Preferred Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Your preferred language"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Your current location"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-1 block">Severity</label>
              <input
                type="text"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Mild, Moderate, or Severe"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Symptoms</label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                rows="3"
                placeholder="Describe your symptoms in detail"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Allergies</label>
              <textarea
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                rows="2"
                placeholder="List any known allergies"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Medical History</label>
              <textarea
                value={formData.medical_history}
                onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                rows="2"
                placeholder="Relevant medical history"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1 block">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                className="w-full p-3 text-white bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Emergency contact information"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full p-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-3 text-white">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing your information...
            </div>
          </div>
        )}

        {output && (
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg text-white">
            {output}
          </div>
        )}

        {miraResults && (
          <div className="mt-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-medium mb-3">AI Response:</h4>
                <div className="prose prose-sm max-w-none prose-invert">
                  {miraResults.response?.result || miraResults.response?.analyze_symptoms || 'No response available'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 