
"use client"

import { useState, useRef } from "react"
import Navbar from "@/components/Navbar"
import ImageSlider from "@/components/ImageSlider"
import Features from "@/components/Features"
import FAQ from "@/components/FAQ"
import AboutUs from "@/components/AboutUs"
import AuthForms from "@/components/AuthForms"
import { DynamicGradient } from "@/components/ui/dynamic-gradient"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const featuresRef = useRef(null)
  const faqRef = useRef(null)
  const aboutRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <DynamicGradient>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-cyan-800 text-white">
        <Navbar
          onFeaturesClick={() => scrollToSection(featuresRef)}
          onFAQClick={() => scrollToSection(faqRef)}
          onAboutClick={() => scrollToSection(aboutRef)}
          onGetStartedClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
        <main>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 py-20">
              <AuthForms showLogin={showLogin} setShowLogin={setShowLogin} />
              <ImageSlider />
            </div>
            <div ref={featuresRef}>
              <Features />
            </div>
            <div ref={faqRef}>
              <FAQ />
            </div>
          </div>
          <div ref={aboutRef}>
            <AboutUs />
          </div>
        </main>
      </div>
    </DynamicGradient>
  )
}

