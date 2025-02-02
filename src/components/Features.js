"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Features() {
  const features = [
    {
      title: "Prescription Scanner (OCR Medical Reader)",
      description: "A powerful tool that converts handwritten or printed medical prescriptions into clear, readable text. This feature helps patients and healthcare providers by Digitizing handwritten prescriptions for better record keeping Reducing errors in prescription interpretation Making medical instructions more accessible and understandable",
      image: "/Feature1bg.jpg",
    },
    {
      title: "Symptom-Based Disease Predictor",
      description: "An intelligent system that analyzes user-input symptoms to suggest possible medical conditions. This feature Helps users understand potential health issues based on their symptoms. Provides preliminary health insights before consulting a doctor. Serves as a first-step medical guidance tool",
      image: "/Feature2bg.png",
    }
  ]

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">Features</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <Image
              src={feature.image || "/placeholder.svg"}
              alt={feature.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-4 filter blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            <div className="absolute bottom-0 p-4 text-black">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}