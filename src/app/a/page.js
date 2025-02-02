"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, User, MessageSquare, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { DynamicGradient } from "@/components/ui/dynamic-gradient"
import { motion } from "framer-motion"

export default function Dashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("none")
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
  })
  const [output, setOutput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cardRef = useRef(null)
  const [chatMessages, setChatMessages] = useState([{ text: "Hello! How can I help you today?", isBot: true }])
  const [messageInput, setMessageInput] = useState("")
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setActiveSection("none")
      }
    }

    if (activeSection !== "none") {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [activeSection])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOutput("Your information has been successfully recorded.")
      setFormData({
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
      })
    } catch (error) {
      setOutput("There was an error saving your information. Please try again.")
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    setChatMessages([...chatMessages, { text: messageInput, isBot: false }])
    setMessageInput("")

    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { text: "I understand your concern. How can I assist you further?", isBot: true },
      ])
    }, 1000)
  }

  const handleLogout = () => {
    router.push("/")
  }

  const renderCard = (title, section, icon, content) => (
    <Card
      ref={activeSection === section ? cardRef : null}
      className={`transition-all duration-300 ${
        activeSection === section
          ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] z-[100] overflow-auto bg-white dark:bg-gray-800 shadow-2xl"
          : "p-6 cursor-pointer hover:shadow-lg relative bg-white/10 backdrop-blur-lg"
      }`}
      onClick={() => setActiveSection(activeSection === section ? "none" : section)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          {icon}
          {title}
        </h2>
        {activeSection === section && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              setActiveSection("none")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {activeSection === section && <div onClick={(e) => e.stopPropagation()}>{content}</div>}
    </Card>
  )

  return (
    <DynamicGradient>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="min-h-screen w-full"
      >
        <div className="flex justify-between items-center p-4">
          <Link href="/" className="p-0">
            <Image
              src="/healthscribe_coloured.svg"
              alt="HealthScribe Logo"
              width={140}
              height={100}
              className="object-contain"
            />
          </Link>
          <div className="relative">
            <Button
              variant="ghost"
              className="rounded-full p-2 gap-3"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User className="w-6 h-6 text-white" />
            </Button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-6">
            {renderCard(
              "Symptoms",
              "symptoms",
              <User className="h-6 w-6" />,
              <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <Input
                  placeholder="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />

                <Input
                  placeholder="Gender (e.g., Male, Female, Other)"
                  type="text"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                />

                <Input
                  placeholder="Purpose of Visit"
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />

                <Input
                  placeholder="Preferred Language"
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                />

                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <Input
                  placeholder="Severity (Mild, Moderate, Severe)"
                  type="text"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                />

                <Textarea
                  placeholder="Symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                />
                <Textarea
                  placeholder="Allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
                <Textarea
                  placeholder="Medical History"
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                />
                <Input
                  placeholder="Emergency Contact"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>

                {output && <div className="mt-4 p-4 bg-secondary rounded-lg">{output}</div>}
              </form>,
            )}

            {renderCard(
              "Camera",
              "camera",
              <Camera className="h-6 w-6" />,
              <div className="text-center">
                <p className="mb-4">Click to analyze medical documents</p>
                <Button onClick={() => router.push("/parse")}>Open Scanner</Button>
              </div>,
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-6">
            {renderCard(
              "General",
              "general",
              <MessageSquare className="h-6 w-6" />,
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.isBot ? "bg-blue-100 dark:bg-blue-900" : "bg-green-100 dark:bg-green-900 ml-auto"
                        }`}
                        style={{ maxWidth: "80%" }}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>,
            )}
          </div>
        </div>

        {activeSection !== "none" && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            onClick={() => setActiveSection("none")}
          />
        )}
      </motion.div>
    </DynamicGradient>
  )
}

