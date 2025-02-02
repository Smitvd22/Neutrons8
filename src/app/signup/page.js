"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function Signup({ onToggle }) {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [otp, setOtp] = useState("")
  const [showOtpField, setShowOtpField] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    return { minLength, hasNumber, hasUppercase }
  }

  const checkUserExists = async () => {
    const res = await fetch("/api/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    })

    const data = await res.json()
    if (data.exists) {
      setErrors(data.errors)
    }
    return !data.exists
  }

  const sendOtp = async () => {
    if (!(await checkUserExists())) return
    if (password !== confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" })
      return
    }

    setLoading(true)
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setShowOtpField(true)
    } else {
      const data = await res.json()
      setErrors({ ...errors, otp: data.message || "Failed to send OTP" })
    }
    setLoading(false)
  }

  const registerUser = async () => {
    setLoading(true)
    const payload = { username, email, password }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setLoading(false)
      setErrors({ success: "Registration successful! Please log in." })
      setTimeout(() => {
        onToggle()
      }, 1500)
    } else {
      const data = await res.json()
      setErrors({ ...errors, form: data.message })
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setLoading(true)
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    })

    if (!res.ok) {
      setErrors({ otp: "Invalid or expired OTP" })
      setLoading(false)
      return
    }
    registerUser()
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black/30 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        {errors.form && <p className="text-red-500 mb-4">{errors.form}</p>}
        {errors.success && <p className="text-green-500 mb-4">{errors.success}</p>}

        <form className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <Input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Password Strength: {validatePassword(password).minLength ? "✅" : "❌"} 8+ chars{" "}
            {validatePassword(password).hasNumber ? "✅" : "❌"} number{" "}
            {validatePassword(password).hasUppercase ? "✅" : "❌"} uppercase
          </p>

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
          {password !== confirmPassword && <p className="text-red-500 text-sm">Passwords do not match</p>}

          {!showOtpField ? (
            <Button className="w-full" onClick={sendOtp} disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

              <Button className="w-full" onClick={verifyOtp} disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify & Register"}
              </Button>
            </>
          )}
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button onClick={onToggle} className="text-blue-500 hover:underline">
            Log in
          </button>
        </p>
      </CardContent>
    </Card>
  )
}

