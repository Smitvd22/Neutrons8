"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How accurate is the prescription scanning feature?",
      answer: "Our prescription scanning system uses advanced OCR technology and achieves high accuracy rates for most standard prescriptions. However, the accuracy may vary depending on handwriting clarity and image quality. We recommend always verifying the scanned results with your original prescription and consulting your healthcare provider if you have any doubts.",
    },
    {
      question: "Can the symptom checker replace a doctor's visit?",
      answer: "No, our symptom checker is designed to be an informational tool only and should not replace professional medical advice. It provides preliminary insights based on your symptoms, but a proper medical diagnosis can only be made by a qualified healthcare professional through in-person examination and tests.",
    },
    {
      question: "Is my medical data secure on your platform?",
      answer: "We take your privacy seriously. All medical data uploaded to our platform is encrypted and stored securely following healthcare data protection standards. We do not share your personal medical information with third parties, and you can delete your data at any time. However, we recommend not uploading sensitive personal information and consulting our privacy policy for detailed information.",
    },
  ]

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] text-center mb-12">Frequently Asked Questions</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex justify-between items-center w-full p-4 text-left"
            >
              <span className="font-medium text-[#ffffff]">{faq.question}</span>
              {openIndex === index ? (
                <Minus className="h-5 w-5 text-blue-500" />
              ) : (
                <Plus className="h-5 w-5 text-blue-500" />
              )}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 text-[#ffffff] dark:text-gray-600">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}