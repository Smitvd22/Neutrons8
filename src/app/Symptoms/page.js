"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, User, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("none");
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
  const cardRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("prescription");
  const [miraResults, setMiraResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setActiveSection("none");
      }
    }

    if (activeSection !== "none") {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [activeSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setIsLoading(true);
    setOutput("Processing your information...");

    try {
      // First, save to MongoDB
      const symptomsResponse = await fetch("/api/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const symptomsData = await symptomsResponse.json();
      console.log("Symptoms Response:", symptomsData); // Debug log

      if (symptomsData.success) {
        // Then, process with Mira AI
        const miraResponse = await fetch("/api/process-medical-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: symptomsData.data._id }), // Use the correct ID from the saved data
        });

        console.log("Mira Response Status:", miraResponse.status); // Debug log
        const miraData = await miraResponse.json();
        console.log("Mira Data:", miraData); // Debug log

        if (miraData.error) {
          setOutput(`Error: ${miraData.error}`);
          return;
        }

        setMiraResults(miraData);
        setOutput("Analysis complete. Results are displayed below.");
      } else {
        setOutput(
          `Error: ${symptomsData.error || "There was an error saving your information. Please try again."}`
        );
      }
    } catch (error) {
      console.error("Full Error:", error);
      setOutput(
        `Error: ${error.message || "There was an error processing your information. Please try again."}`
      );
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const ResultsDisplay = ({ results }) => {
    if (!results) return null;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>

          <div className="space-y-4">
            {/* Main Response */}
            <div className="bg-background rounded p-3">
              <h4 className="font-medium mb-2">AI Response:</h4>
              <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                {results.response?.result || results.response?.analyze_symptoms || 'No response available'}
              </ReactMarkdown>
            </div>

            {/* Additional Information */}
            {results.response?.find_nearby_doctors && (
              <div className="bg-background rounded p-3">
                <h4 className="font-medium mb-2">Nearby Medical Facilities:</h4>
                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                  {results.response.find_nearby_doctors}
                </ReactMarkdown>
              </div>
            )}

            {results.response?.provide_health_advice && (
              <div className="bg-background rounded p-3">
                <h4 className="font-medium mb-2">Health Advice:</h4>
                <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                  {results.response.provide_health_advice}
                </ReactMarkdown>
              </div>
            )}

            {/* Metadata */}
            {results.metadata && (
              <div className="bg-background rounded p-3">
                <h4 className="font-medium mb-2">Analysis Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {results.metadata.evaluation_score !== undefined && (
                    <>
                      <div>Evaluation Score:</div>
                      <div>{results.metadata.evaluation_score}/100</div>
                    </>
                  )}
                  {results.metadata.version && (
                    <>
                      <div>Analysis Version:</div>
                      <div>{results.metadata.version}</div>
                    </>
                  )}
                  {results.metadata.timestamp && (
                    <>
                      <div>Timestamp:</div>
                      <div>
                        {new Date(results.metadata.timestamp).toLocaleString()}
                      </div>
                    </>
                  )}
                  {results.metadata.processing_time && (
                    <>
                      <div>Processing Time:</div>
                      <div>{results.metadata.processing_time}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setOutput("");
    }
  };

  const handleImageAnalysis = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const endpoint =
        analysisType === "prescription"
          ? "/api/parse-prescription"
          : "/api/parse-test";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data.analysis);
      setOutput(data.analysis);
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error processing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    setChatMessages([...chatMessages, { text: messageInput, isBot: false }]);
    setMessageInput("");

    // Simulate bot response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          text: "I understand your concern. How can I assist you further?",
          isBot: true,
        },
      ]);
    }, 1000);
  };

  const handleCameraClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/parse");
  };

  const renderCard = (title, section, icon, content) => (
    <Card
      ref={activeSection === section ? cardRef : null}
      className={`transition-all duration-300 ${
        activeSection === section
          ? "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] z-[100] overflow-auto bg-background shadow-2xl"
          : "p-6 cursor-pointer hover:shadow-lg relative"
      }`}
      onClick={() => {
        if (section === "camera") {
          router.push("/parse");
        } else if (activeSection === "none") {
          setActiveSection(section);
        }
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {activeSection === section && section !== "camera" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSection("none");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {activeSection === section && section !== "camera" && (
        <div onClick={(e) => e.stopPropagation()}>{content}</div>
      )}
      {section === "camera" && !activeSection && (
        <div className="text-center">
          <p className="mb-4">Click to analyze medical documents</p>
          <Button onClick={handleCameraClick}>Open Scanner</Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a192f] p-4">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" className="rounded-full p-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#0a192f] font-bold">LOGO</span>
          </div>
        </Button>
        <Button variant="ghost" className="rounded-full p-2">
          <User className="w-6 h-6 text-white" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {renderCard(
          "Symptoms",
          "symptoms",
          <User className="h-6 w-6" />,
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <Input
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />

            <Input
              placeholder="Gender (e.g., Male, Female, Other)"
              type="text"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            />

            <Input
              placeholder="Purpose of Visit"
              type="text"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
            />

            <Input
              placeholder="Preferred Language"
              type="text"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
            />

            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />

            <Input
              placeholder="Severity (Mild, Moderate, Severe)"
              type="text"
              value={formData.severity}
              onChange={(e) =>
                setFormData({ ...formData, severity: e.target.value })
              }
            />

            <Textarea
              placeholder="Symptoms"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData({ ...formData, symptoms: e.target.value })
              }
            />
            <Textarea
              placeholder="Allergies"
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
            />
            <Textarea
              placeholder="Medical History"
              value={formData.medical_history}
              onChange={(e) =>
                setFormData({ ...formData, medical_history: e.target.value })
              }
            />
            <Input
              placeholder="Emergency Contact"
              value={formData.emergency_contact}
              onChange={(e) =>
                setFormData({ ...formData, emergency_contact: e.target.value })
              }
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit"}
            </Button>

            {isLoading && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                Analyzing your information...
              </div>
            )}

            {output && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">{output}</div>
            )}

            {/* Add the results display here */}
            {miraResults && <ResultsDisplay results={miraResults} />}
          </form>
        )}

        {renderCard("Camera", "camera", <Camera className="h-6 w-6" />, null)}

        {renderCard(
          "General",
          "general",
          <MessageSquare className="h-6 w-6" />,
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 bg-secondary rounded-lg mb-4">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.isBot
                        ? "bg-primary-foreground"
                        : "bg-blue-500 text-white ml-auto"
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
          </div>
        )}

        {activeSection !== "none" && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99]"
            onClick={() => setActiveSection("none")}
          />
        )}
      </div>
    </div>
  );
}