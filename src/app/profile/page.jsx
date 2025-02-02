"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Simulated user data
const mockUserInfo = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  gender: "Male",
  location: "New York",
  medical_history: "No significant medical history",
}

export default function Profile() {
  const [userInfo] = useState(mockUserInfo)

  const handleLogout = () => {
    // Simulate logout
    console.log("Logging out...")
  }

  return (
    <div className="min-h-screen bg-[#0a192f] p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Name</h2>
            <p>{userInfo.name}</p>
          </div>
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>{userInfo.email}</p>
          </div>
          <div>
            <h2 className="font-semibold">Age</h2>
            <p>{userInfo.age}</p>
          </div>
          <div>
            <h2 className="font-semibold">Gender</h2>
            <p>{userInfo.gender}</p>
          </div>
          <div>
            <h2 className="font-semibold">Location</h2>
            <p>{userInfo.location}</p>
          </div>
          <div>
            <h2 className="font-semibold">Medical History</h2>
            <p>{userInfo.medical_history}</p>
          </div>
        </div>
        <Button onClick={handleLogout} className="mt-6" variant="destructive">
          Logout
        </Button>
      </Card>
    </div>
  )
}

